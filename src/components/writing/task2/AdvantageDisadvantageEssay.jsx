import React from 'react';

const AdvantageDisadvantageEssay = ({ data, answer, onChange, wordCount }) => {
    const minWords = data.minWords || 250;

    return (
        <div className="flex flex-col lg:flex-row h-full gap-6">
            {/* Left: Prompt & Instructions */}
            <div className="w-full lg:w-1/2 overflow-y-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                    {data.title}
                </h3>

                <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500 mb-6">
                    <p className="text-lg text-gray-800 font-medium leading-relaxed">
                        {data.topic}
                    </p>
                </div>

                <div className="space-y-3 mb-6">
                    {data.questions.map((question, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-700 font-medium">{question}</p>
                        </div>
                    ))}
                </div>

                <p className="text-sm text-gray-600 italic bg-yellow-50 p-3 rounded-lg">
                    {data.instruction}
                </p>
                <p className="text-sm text-gray-500 mt-2 font-bold">
                    Write at least {minWords} words.
                </p>
            </div>

            {/* Right: Answer Input */}
            <div className="w-full lg:w-1/2 flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <span className="font-bold text-gray-600">Your Essay</span>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${wordCount < minWords ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {wordCount} / {minWords} words
                    </span>
                </div>
                <textarea
                    value={answer || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 w-full p-6 resize-none focus:outline-none text-lg leading-relaxed text-gray-700 font-serif"
                    placeholder="Start typing your essay here..."
                    spellCheck="false"
                />
            </div>
        </div>
    );
};

export default AdvantageDisadvantageEssay;
