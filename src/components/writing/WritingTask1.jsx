import React, { useState, useEffect } from 'react';

const WritingTask1 = ({ data, answer, onChange, wordCount, minWords = 150, language }) => {
    return (
        <div className="flex flex-row h-full">
            {/* Left Side: Prompt/Visuals */}
            <div className="w-1/2 overflow-y-auto p-8 bg-white border-r border-slate-100">
                <h3 className="text-2xl font-black text-slate-800 mb-6 border-b pb-4">
                    Writing Task 1
                </h3>

                <div className="space-y-8">
                    <div className={`p-6 rounded-2xl border-l-4 bg-blue-50 border-blue-600 text-slate-600 shadow-sm`}>
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-blue-500 mb-2">Instructions</h4>
                        <p className="text-lg leading-relaxed font-medium">{data.instruction}</p>
                    </div>

                    {/* Visuals for Academic, Bullet points for General */}
                    {data.imageUrl ? (
                        <div className="rounded-3xl border-2 border-slate-100 overflow-hidden shadow-lg bg-white">
                            <img
                                src={data.imageUrl}
                                alt={data.title}
                                className="w-full h-auto object-contain"
                            />
                        </div>
                    ) : data.bulletPoints ? (
                        <div className="bg-slate-50 p-8 rounded-2xl border-2 border-slate-100">
                            <ul className="space-y-4">
                                {data.bulletPoints.map((point, index) => (
                                    <li key={index} className="flex items-start text-slate-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 mr-4 flex-shrink-0"></div>
                                        <span className="text-lg font-bold leading-relaxed">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    <div className="space-y-3">
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Question Prompt</h4>
                        <p className="text-xl font-bold text-slate-800 leading-snug">
                            {data.prompt}
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side: Input Area */}
            <div className="w-1/2 flex flex-col h-full bg-slate-50 relative">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-slate-50/90 backdrop-blur-sm z-10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Answer</span>
                    <span className={`text-xs font-black px-4 py-1.5 rounded-full ${wordCount < minWords ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {wordCount} / {minWords} words
                    </span>
                </div>
                <div className="flex-1 flex flex-col p-8">
                    <div className="flex-1 flex flex-col p-6 rounded-3xl border-2 border-slate-200 bg-white focus-within:border-blue-600 focus-within:shadow-2xl transition-all duration-300">
                        <textarea
                            value={answer || ''}
                            onChange={(e) => onChange(e.target.value)}
                            className="flex-1 w-full resize-none focus:outline-none text-xl leading-relaxed text-slate-800 font-serif"
                            placeholder="Start typing your answer here..."
                            spellCheck="false"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WritingTask1;
