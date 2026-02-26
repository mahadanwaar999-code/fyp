import React from 'react';

const SentenceCompletion = ({ question, answer, onChange, language }) => {
    return (
        <div className="mb-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-wrap items-baseline gap-3 text-lg leading-loose text-gray-800 font-serif">
                {question.displayId && (
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 font-bold rounded-full text-sm mr-2 select-none">
                        {question.displayId}
                    </span>
                )}
                <span>{question.beforeGap}</span>
                <input
                    type="text"
                    value={answer || ''}
                    onChange={(e) => onChange(question.id, e.target.value)}
                    className="min-w-[180px] px-4 py-1 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none bg-blue-50/30 text-center font-medium text-blue-900 transition-colors"
                    placeholder={language === 'en' ? "type here..." : "在此输入..."}
                    autoComplete="off"
                />
                <span>{question.afterGap}</span>
            </div>
            {question.questionText && (
                <div className="mt-3 text-sm text-gray-400 font-medium tracking-wide uppercase pl-12">
                    {question.questionText[language] || question.questionText.en}
                </div>
            )}
        </div>
    );
};

export default SentenceCompletion;
