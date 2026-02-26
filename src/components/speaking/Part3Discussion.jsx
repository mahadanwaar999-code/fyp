import React, { useState, useEffect } from 'react';
import { ChevronRight, Clock, Mic } from 'lucide-react';
import WaveformVisualizer from './WaveformVisualizer';

const Part3Discussion = ({ question, subTopic, questionNumber, totalQuestions, onNext, isDark }) => {
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
            <div className="max-w-4xl w-full">
                {/* Progress */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Question {questionNumber} of {totalQuestions}
                        </span>
                        <span className={`text-xs px-3 py-1 rounded-full ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}>
                            Part 3: Discussion
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Timer Display */}
                <div className="flex justify-center mb-6">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${timeLeft < 30 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-green-50 border-green-100 text-green-600'}`}>
                        <Clock className="w-4 h-4" />
                        <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                {/* Question Card */}
                <div className={`p-10 rounded-3xl shadow-2xl border-2 mb-8 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="mb-6 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {subTopic || 'Discussion'}
                        </span>
                    </div>

                    <h2 className="text-3xl font-bold leading-relaxed mb-8">
                        {question}
                    </h2>

                    <div className={`p-5 rounded-xl ${isDark ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'}`}>
                        <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                            💭 This is a more analytical question. Take your time to develop your answer with examples and explanations.
                        </p>
                    </div>
                </div>

                {/* Waveform Visualizer */}
                <div className="flex flex-col items-center">
                    <WaveformVisualizer isRecording={true} />
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] mt-3 ${isDark ? 'text-green-400/60' : 'text-green-500/60'}`}>
                        System Recording Audio
                    </span>
                </div>

                {/* Next Button */}
                <div className="mt-12 flex justify-end">
                    <button
                        onClick={onNext}
                        className="flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
                    >
                        Next Question
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Part3Discussion;
