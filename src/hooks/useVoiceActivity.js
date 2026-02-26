import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to detect voice activity from the microphone.
 * Returns volume level and speaking status.
 */
export const useVoiceActivity = (silenceTimeout = 2000, threshold = 10) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [volume, setVolume] = useState(0);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const streamRef = useRef(null);
    const timeoutRef = useRef(null);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        const initAudio = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream;

                const AudioContext = window.AudioContext || window.webkitAudioContext;
                const audioContext = new AudioContext();
                audioContextRef.current = audioContext;

                const source = audioContext.createMediaStreamSource(stream);
                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                source.connect(analyser);
                analyserRef.current = analyser;

                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                const updateVolume = () => {
                    analyser.getByteFrequencyData(dataArray);
                    
                    // Calculate average volume
                    let total = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        total += dataArray[i];
                    }
                    const avg = total / bufferLength;
                    setVolume(avg);

                    if (avg > threshold) {
                        setIsSpeaking(true);
                        // Reset silence timeout
                        if (timeoutRef.current) clearTimeout(timeoutRef.current);
                        timeoutRef.current = setTimeout(() => {
                            setIsSpeaking(false);
                        }, silenceTimeout);
                    }

                    animationFrameRef.current = requestAnimationFrame(updateVolume);
                };

                updateVolume();
            } catch (err) {
                console.error('Microphone access denied or error:', err);
            }
        };

        initAudio();

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (audioContextRef.current) {
                audioContextRef.current.close().catch(() => {});
            }
        };
    }, [threshold, silenceTimeout]);

    return { isSpeaking, volume };
};
