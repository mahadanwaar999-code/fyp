import React, { useState, useEffect } from 'react';
import { ChevronRight, Clock, Mic } from 'lucide-react';
import WaveformVisualizer from './WaveformVisualizer';

const Part1Interview = ({ question, mainTopic, questionNumber, totalQuestions, onNext, isDark }) => {
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`flex flex-col items-center justify-center min-h-[500px] p-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <div className="max-w-3xl w-full">
                {/* Progress */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Question {questionNumber} of {totalQuestions}
                        </span>
                        <span className={`text-xs px-3 py-1 rounded-full ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                            Part 1: Interview
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Timer Display */}
                <div className="flex justify-center mb-6">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${timeLeft < 30 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                        <Clock className="w-4 h-4" />
                        <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                {/* Question Card */}
                <div className={`p-10 rounded-3xl shadow-2xl border-2 mb-8 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="mb-6">
                        <span className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {mainTopic || 'General Questions'}
                        </span>
                    </div>

                    <h2 className="text-4xl font-bold leading-relaxed mb-8">
                        {question}
                    </h2>

                    <div className={`p-4 rounded-xl ${isDark ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
                        <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                            💬 Speak your answer aloud. Click "Next" when you're ready to continue.
                        </p>
                    </div>
                </div>

                {/* Waveform Visualizer */}
                <div className="flex flex-col items-center">
                    <WaveformVisualizer isRecording={true} />
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] mt-3 ${isDark ? 'text-blue-400/60' : 'text-blue-500/60'}`}>
                        System Recording Audio
                    </span>
                </div>

                {/* Next Button */}
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={onNext}
                        className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
                    >
                        Next Question
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Part1Interview;
