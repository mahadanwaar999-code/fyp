import React from 'react';

const TableCompletion = ({ question, answer, onChange, language }) => {
    return (
        <div className="mb-2 p-4 bg-white border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors flex items-center flex-wrap gap-4">
            {question.displayId && (
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 font-bold rounded-full text-sm select-none">
                    {question.displayId}
                </span>
            )}

            {question.rowLabel && (
                <span className="font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded text-xs uppercase tracking-wide mr-2">
                    {question.rowLabel}
                </span>
            )}

            <div className="flex flex-wrap items-baseline gap-2 text-gray-800 font-serif leading-relaxed text-lg">
                <span>{question.beforeGap}</span>
                <input
                    type="text"
                    value={answer || ''}
                    onChange={(e) => onChange(question.id, e.target.value)}
                    className="min-w-[140px] px-3 py-1 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none bg-blue-50/50 text-center font-medium text-blue-900 transition-colors"
                    placeholder={language === 'en' ? "..." : "..."}
                />
                <span>{question.afterGap}</span>
            </div>
        </div>
    );
};

export default TableCompletion;
