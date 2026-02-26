import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Send, Paperclip, Download } from 'lucide-react';
import ReviewModal from './ReviewModal';

const SOCKET_SERVER_URL = 'http://localhost:5001';

const LectureRoom = ({ sessionId, user, role, onExit }) => {
    const [sessionData, setSessionData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    // Media states
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const socketRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);

    const messagesEndRef = useRef(null);

    const ICE_SERVERS = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
        ]
    };

    useEffect(() => {
        // 1. Fetch Session and Messages
        const initRoom = async () => {
            try {
                const token = localStorage.getItem('token');
                const [sessionRes, msgRes] = await Promise.all([
                    fetch(`http://localhost:5001/api/lecture-sessions/${sessionId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`http://localhost:5001/api/lecture-sessions/${sessionId}/messages`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                if (sessionRes.ok) setSessionData(await sessionRes.json());
                if (msgRes.ok) setMessages(await msgRes.json());

                // Mark session live
                await fetch(`http://localhost:5001/api/lecture-sessions/${sessionId}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ status: 'live' })
                });
            } catch (err) {
                console.error('Failed to init room', err);
            }
        };

        initRoom();

        // 2. Setup Socket
        socketRef.current = io(SOCKET_SERVER_URL, {
            auth: { token: localStorage.getItem('token') }
        });

        socketRef.current.emit('join_session', sessionId);

        socketRef.current.on('receive_message', (msg) => {
            setMessages(prev => [...prev, msg]);
            scrollToBottom();
        });

        socketRef.current.on('user_joined', async () => {
            // Initiate WebRTC offer if I am already here
            startWebRTC(true);
        });

        socketRef.current.on('webrtc_offer', async ({ offer }) => {
            await startWebRTC(false, offer);
        });

        socketRef.current.on('webrtc_answer', async ({ answer }) => {
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            }
        });

        socketRef.current.on('webrtc_ice_candidate', async ({ candidate }) => {
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        // 3. Setup Media
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                localStreamRef.current = stream;
                if (localVideoRef.current) localVideoRef.current.srcObject = stream;

                // Only start RTC here if we are initiating, else wait for 'user_joined'
                startWebRTC(true);
                startRecording(stream);
            })
            .catch(console.error);

        return () => {
            stopRecording();
            if (localStreamRef.current) localStreamRef.current.getTracks().forEach(track => track.stop());
            if (peerConnectionRef.current) peerConnectionRef.current.close();
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [sessionId]);

    const startWebRTC = async (isInitiator, offer = null) => {
        if (!localStreamRef.current) return;
        if (peerConnectionRef.current) peerConnectionRef.current.close();

        const pc = new RTCPeerConnection(ICE_SERVERS);
        peerConnectionRef.current = pc;

        localStreamRef.current.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current));

        pc.ontrack = (event) => {
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit('webrtc_ice_candidate', { sessionId, candidate: event.candidate });
            }
        };

        try {
            if (isInitiator) {
                const newOffer = await pc.createOffer();
                await pc.setLocalDescription(newOffer);
                socketRef.current.emit('webrtc_offer', { sessionId, offer: newOffer });
            } else if (offer) {
                await pc.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socketRef.current.emit('webrtc_answer', { sessionId, answer });
            }
        } catch (err) {
            console.error("WebRTC Error:", err);
        }
    };

    const startRecording = (stream) => {
        try {
            if (role !== 'teacher') return; // only one needs to upload the recording ideally
            setIsRecording(true);
            const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            mediaRecorderRef.current = recorder;
            recorder.ondataavailable = e => { if (e.data.size > 0) recordedChunksRef.current.push(e.data); };
            recorder.start();
        } catch (e) { console.error('Recording fail:', e); }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            // We will upload it on complete 
        }
    };

    const uploadRecordingPhase = async () => {
        if (role !== 'teacher') return;
        if (recordedChunksRef.current.length === 0) return;
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const formData = new FormData();
        formData.append('video', blob, `recording_${sessionId}.webm`);
        try {
            await fetch(`http://localhost:5001/api/lecture-sessions/${sessionId}/recording`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: formData
            });
        } catch (e) { console.error('Failed to upload recording', e); }
    };

    const toggleMute = () => {
        localStreamRef.current.getAudioTracks().forEach(track => track.enabled = !track.enabled);
        setIsMuted(!isMuted);
    };

    const toggleVideo = () => {
        localStreamRef.current.getVideoTracks().forEach(track => track.enabled = !track.enabled);
        setIsVideoOff(!isVideoOff);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        socketRef.current.emit('send_message', { sessionId, content: inputText, messageType: 'text' });
        setInputText('');
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch(`http://localhost:5001/api/lecture-sessions/${sessionId}/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                socketRef.current.emit('send_message', { sessionId, messageType: 'file', content: file.name, fileUrl: data.fileUrl });
            } else alert(data.message);
        } catch (error) { console.error(error); }
    };

    const handleEndCall = async () => {
        stopRecording();
        await uploadRecordingPhase();
        await fetch(`http://localhost:5001/api/lecture-sessions/${sessionId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({ status: role === 'teacher' ? 'completed' : 'review_pending' })
        });

        if (role === 'student') {
            setShowReviewModal(true);
        } else {
            onExit();
        }
    };

    return (
        <div className="flex h-screen bg-[#1a1a2e] text-white overflow-hidden font-sans">
            {/* Main Video Area */}
            <div className="flex-1 flex flex-col relative w-full h-full p-4 gap-4">
                {/* Remote Video */}
                <div className="flex-1 overflow-hidden relative rounded-2xl bg-black/50 border border-slate-700/50 shadow-2xl flex items-center justify-center">
                    <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute inset-x-4 top-4 flex items-center justify-between pointer-events-none">
                        <div className="bg-black/40 px-3 py-1.5 rounded-full text-sm backdrop-blur-md flex items-center gap-2 font-medium tracking-wide">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            {sessionData ? (role === 'teacher' ? sessionData.studentId?.profile?.fullName : sessionData.teacherId?.profile?.fullName) : 'Connecting...'}
                        </div>
                        {isRecording && (
                            <div className="bg-red-500/80 px-3 py-1 text-xs rounded border border-red-500/30 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                                REC
                            </div>
                        )}
                    </div>
                </div>

                {/* Local Video - Floating */}
                <div className="absolute top-8 right-8 w-48 aspect-video bg-black rounded-xl overflow-hidden border-2 border-slate-600/50 shadow-[0_8px_30px_rgb(0,0,0,0.5)] z-20 transition-transform hover:scale-105 duration-300">
                    <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                    <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-xs backdrop-blur-sm">You</div>
                </div>

                {/* Controls */}
                <div className="h-20 bg-[#252540]/80 backdrop-blur-xl border border-white/5 rounded-3xl flex items-center justify-center gap-6 px-8 shadow-2xl mx-auto mt-auto">
                    <button onClick={toggleMute} className={`p-4 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#252540] ${isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 focus:ring-red-500' : 'bg-[#333399]/30 hover:bg-[#333399]/50 text-blue-200 focus:ring-blue-500'}`}>
                        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>

                    <button onClick={toggleVideo} className={`p-4 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#252540] ${isVideoOff ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 focus:ring-red-500' : 'bg-[#333399]/30 hover:bg-[#333399]/50 text-blue-200 focus:ring-blue-500'}`}>
                        {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                    </button>

                    <button onClick={handleEndCall} className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all duration-300 shadow-lg shadow-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#252540] hover:scale-110">
                        <PhoneOff size={24} />
                    </button>
                </div>
            </div>

            {/* Chat Sidebar */}
            <div className="w-96 bg-[#252540] border-l border-white/5 flex flex-col shadow-2xl relative z-10">
                <div className="p-6 border-b border-white/5 bg-[#252540]/50 sticky top-0 backdrop-blur-md">
                    <h2 className="text-lg font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Class Chat</h2>
                    <p className="text-xs text-blue-200/50 font-medium">Messages are securely encrypted</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {messages.map((msg, idx) => {
                        const isMine = msg.senderId === (user._id || user.id);
                        return (
                            <div key={idx} className={`flex flex-col max-w-[85%] ${isMine ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                                <div className={`px-4 py-2.5 rounded-2xl ${isMine ? 'bg-[#333399] text-white rounded-br-sm' : 'bg-[#1a1a2e] border border-white/5 text-slate-200 rounded-bl-sm'}`}>
                                    {msg.messageType === 'file' ? (
                                        <a href={`http://localhost:5001${msg.fileUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm hover:underline hover:text-blue-300 transition-colors">
                                            <Download size={16} /> {msg.content}
                                        </a>
                                    ) : (
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                    )}
                                </div>
                                <span className="text-[10px] text-slate-500 mt-1 font-medium px-1">
                                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-[#252540] border-t border-white/5 pb-6">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-[#1a1a2e] rounded-xl border border-white/10 p-1.5 focus-within:border-[#333399] focus-within:ring-1 focus-within:ring-[#333399] transition-all">
                        <label className="cursor-pointer p-2 text-slate-400 hover:text-blue-400 hover:bg-white/5 rounded-lg transition-colors">
                            <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.docx,.jpg,.jpeg,.png" />
                            <Paperclip size={20} />
                        </label>
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent border-none focus:outline-none text-sm px-2 text-slate-200 placeholder-slate-500"
                        />
                        <button type="submit" disabled={!inputText.trim()} className="p-2 bg-[#333399] text-white rounded-lg hover:bg-[#4444aa] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#333399]">
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>

            <ReviewModal
                isOpen={showReviewModal}
                sessionId={sessionId}
                onClose={() => setShowReviewModal(false)}
                onReviewSubmitted={() => onExit()}
            />
        </div>
    );
};

export default LectureRoom;
