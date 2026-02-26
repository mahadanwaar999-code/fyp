import React from 'react';

const PieChartTask = ({ data, answer, onChange, wordCount }) => {
    const minWords = data.minWords || 150;

    return (
        <div className="flex flex-col lg:flex-row h-full gap-6">
            {/* Left: Visual & Instructions */}
            <div className="w-full lg:w-1/2 overflow-y-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                    {data.title}
                </h3>

                <p className="text-lg text-gray-700 font-medium mb-4">
                    {data.instruction}
                </p>

                {/* Pie Chart Image */}
                {data.imageUrl ? (
                    <div className="my-6 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <img
                            src={data.imageUrl}
                            alt={data.title}
                            className="w-full h-auto object-contain max-h-[400px]"
                        />
                    </div>
                ) : (
                    <div className="my-6 p-8 bg-purple-50 rounded-xl border-2 border-dashed border-purple-300 flex flex-col items-center justify-center text-center min-h-[300px]">
                        <div className="text-5xl mb-4">🥧</div>
                        <p className="font-bold text-purple-700 text-lg">Pie Chart</p>
                        <p className="text-sm text-purple-500 mt-2">[Visual will be displayed here]</p>
                    </div>
                )}

                <p className="font-bold text-gray-700 mt-4 bg-yellow-50 p-3 rounded-lg">
                    {data.prompt}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Write at least {minWords} words.
                </p>
            </div>

            {/* Right: Answer Input */}
            <div className="w-full lg:w-1/2 flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <span className="font-bold text-gray-600">Your Answer</span>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${wordCount < minWords ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {wordCount} / {minWords} words
                    </span>
                </div>
                <textarea
                    value={answer || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 w-full p-6 resize-none focus:outline-none text-lg leading-relaxed text-gray-700 font-serif"
                    placeholder="Start typing your answer here..."
                    spellCheck="false"
                />
            </div>
        </div>
    );
};

export default PieChartTask;
