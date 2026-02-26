import React, { useState, useEffect, useRef } from 'react';
import './WaveformVisualizer.css'; // For styles (see below)

const WaveformVisualizer = ({ isRecording, questionText }) => {
    const [bars, setBars] = useState(new Array(32).fill(0)); // 32 bars for the waveform
    const analyserRef = useRef(null);
    const animationRef = useRef(null);
    const silenceTimerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isRecording) {
            startRecording();
            setIsVisible(true);
        } else {
            stopRecording();
            setIsVisible(false);
        }
        return () => stopRecording(); // Cleanup on unmount
    }, [isRecording]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256; // Determines frequency resolution
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyserRef.current = analyser;
            animate();
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopRecording = () => {
        if (analyserRef.current) {
            if (analyserRef.current.context.state !== 'closed') {
                analyserRef.current.context.close().catch(() => { });
            }
            analyserRef.current = null;
        }
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
        }
    };

    const animate = () => {
        const analyser = analyserRef.current;
        if (!analyser) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            if (!analyserRef.current) return;
            analyser.getByteFrequencyData(dataArray);
            const newBars = [];
            let maxVolume = 0;
            for (let i = 0; i < 32; i++) { // Sample 32 points for bars
                const value = dataArray[Math.floor(i * bufferLength / 32)];
                newBars.push(value);
                maxVolume = Math.max(maxVolume, value);
            }
            setBars(newBars);

            // Check for silence (threshold: 10 out of 255)
            if (maxVolume < 10) {
                if (!silenceTimerRef.current) {
                    silenceTimerRef.current = setTimeout(() => {
                        setIsVisible(false);
                    }, 2000);
                }
            } else {
                setIsVisible(true); // Show if sound is detected
                if (silenceTimerRef.current) {
                    clearTimeout(silenceTimerRef.current);
                    silenceTimerRef.current = null;
                }
            }

            animationRef.current = requestAnimationFrame(draw);
        };
        draw();
    };

    return (
        <div className="waveform-container">
            {isVisible && (
                <div className="waveform-visualizer">
                    {bars.map((bar, index) => (
                        <div
                            key={index}
                            className="waveform-bar"
                            style={{ transform: `scaleY(${bar / 255})` }} // Scale based on volume (0-1)
                        />
                    ))}
                </div>
            )}
            <p className="question-text">{questionText}</p>
        </div>
    );
};

export default WaveformVisualizer;
