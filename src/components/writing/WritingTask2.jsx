import React from 'react';

const WritingTask2 = ({ data, answer, onChange, wordCount, minWords = 250, language }) => {
    return (
        <div className="flex flex-row h-full">
            {/* Left Side: Prompt */}
            <div className="w-1/2 overflow-y-auto p-8 bg-white border-r border-slate-100">
                <h3 className="text-2xl font-black text-slate-800 mb-8 border-b pb-4">
                    Writing Task 2
                </h3>

                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl border-2 border-blue-100 shadow-sm">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4 block">
                            Topic: {data.title}
                        </span>
                        <h4 className="text-2xl font-bold text-slate-800 mb-6 leading-tight font-serif">
                            {data.prompt}
                        </h4>

                        <div className="bg-white/60 p-5 rounded-2xl text-sm text-slate-500 italic border border-white/50">
                            Give reasons for your answer and include any relevant examples from your own knowledge or experience.
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border-l-4 bg-slate-50 border-slate-300 text-slate-500 italic text-sm">
                        Write at least {minWords} words for this task.
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
                            placeholder="Start typing your essay here..."
                            spellCheck="false"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WritingTask2;
