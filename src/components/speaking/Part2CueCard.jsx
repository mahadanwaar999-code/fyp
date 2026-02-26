import React, { useState, useEffect } from 'react';
import { Clock, Mic } from 'lucide-react';
import WaveformVisualizer from './WaveformVisualizer';

const Part2CueCard = ({ cueCard, onComplete, isDark }) => {
    const [phase, setPhase] = useState('prep'); // 'prep' or 'speaking'
    const [prepTime, setPrepTime] = useState(cueCard.timers?.preparationSeconds || 60);
    const [speakTime, setSpeakTime] = useState(cueCard.timers?.speakingSeconds || 120);

    // Prep timer
    useEffect(() => {
        if (phase === 'prep' && prepTime > 0) {
            const timer = setInterval(() => {
                setPrepTime(prev => {
                    if (prev <= 1) {
                        setPhase('speaking');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [phase, prepTime]);

    // Speaking timer
    useEffect(() => {
        if (phase === 'speaking' && speakTime > 0) {
            const timer = setInterval(() => {
                setSpeakTime(prev => {
                    if (prev <= 1) {
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [phase, speakTime]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`flex flex-col items-center justify-center min-h-[600px] p-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <span className={`text-xs px-4 py-2 rounded-full font-bold uppercase tracking-wider ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                        Part 2: Long Turn
                    </span>
                    <h2 className="text-3xl font-bold mt-4">
                        {phase === 'prep' ? '📝 Preparation Time' : '🎤 Speaking Time'}
                    </h2>
                </div>

                {/* Timer */}
                <div className="flex justify-center mb-8">
                    <div className={`flex items-center gap-4 px-8 py-5 rounded-2xl ${phase === 'prep'
                        ? (prepTime < 10 ? 'bg-red-900/30 text-red-400 animate-pulse' : 'bg-blue-900/20 text-blue-400')
                        : (speakTime < 10 ? 'bg-red-900/30 text-red-400 animate-pulse' : 'bg-green-900/20 text-green-400')
                        }`}>
                        <Clock className="w-8 h-8" />
                        <span className="text-5xl font-mono font-bold">
                            {formatTime(phase === 'prep' ? prepTime : speakTime)}
                        </span>
                    </div>
                </div>

                {/* Cue Card */}
                <div className={`p-10 rounded-3xl shadow-2xl border-2 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <h3 className="text-2xl font-bold mb-4">Topic Card</h3>
                    <p className="text-xl mb-6 leading-relaxed font-serif italic">"{cueCard.prompt}"</p>

                    <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className="font-bold mb-4">You should say:</p>
                        <ul className="space-y-3">
                            {cueCard.bulletPoints.map((point, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="text-purple-500 font-bold">•</span>
                                    <span className="text-lg">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {phase === 'prep' && (
                        <div className={`mt-6 p-4 rounded-xl ${isDark ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
                            <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                                📝 Use this time to make notes and prepare your answer.
                            </p>
                        </div>
                    )}

                    {phase === 'speaking' && (
                        <div className={`mt-6 p-4 rounded-xl ${isDark ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'}`}>
                            <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                                🎤 Speak for 1-2 minutes. The timer will stop automatically.
                            </p>
                        </div>
                    )}
                </div>

                {/* Waveform Visualizer */}
                <div className="mt-8 flex flex-col items-center">
                    <WaveformVisualizer isRecording={phase === 'speaking'} />
                    {phase === 'speaking' && (
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] mt-3 ${isDark ? 'text-blue-400/60' : 'text-blue-500/60'}`}>
                            System Recording Audio
                        </span>
                    )}
                </div>

                {/* Complete Button (only show after speaking time ends) */}
                {phase === 'speaking' && speakTime === 0 && (
                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={onComplete}
                            className="px-10 py-5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all"
                        >
                            Continue to Part 3
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Part2CueCard;
