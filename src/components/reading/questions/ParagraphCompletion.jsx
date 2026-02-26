import React from 'react';

const ParagraphCompletion = ({ question, answer, onChange, language }) => {
    return (
        <div className="mb-4 p-5 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
            {/* Occasionally a group title is provided for the summary section */}
            {question.groupTitle && (
                <h4 className="text-md font-bold text-gray-700 mb-3 border-b pb-2 uppercase tracking-wide">
                    {question.groupTitle}
                </h4>
            )}

            <div className="flex flex-wrap items-baseline gap-2 text-lg leading-loose text-gray-800 font-serif">
                {question.displayId && (
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700 font-bold rounded-full text-xs mr-1 select-none">
                        {question.displayId}
                    </span>
                )}
                <span>{question.beforeGap}</span>
                <input
                    type="text"
                    value={answer || ''}
                    onChange={(e) => onChange(question.id, e.target.value)}
                    className="min-w-[160px] px-3 py-1 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none bg-blue-50/30 text-center font-medium text-blue-900 transition-colors"
                    placeholder={language === 'en' ? "..." : "..."}
                />
                <span>{question.afterGap}</span>
            </div>
        </div>
    );
};

export default ParagraphCompletion;
