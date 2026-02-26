import React from 'react';

const MatchingInformation = ({ question, answer, onChange }) => {
    // Matching Information
    // e.g. Match Scientist to Statement.

    return (
        <div className="mb-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start md:items-center gap-4 flex-col md:flex-row">
                <div className="flex-1">
                    <div className="flex items-baseline gap-3">
                        {question.displayId && (
                            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 font-bold rounded-full text-sm select-none">
                                {question.displayId}
                            </span>
                        )}
                        <p className="text-lg text-gray-800 font-serif leading-relaxed">
                            {question.questionText.en}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-2">Match:</span>
                    <select
                        value={answer || ''}
                        onChange={(e) => onChange(question.id, e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md font-bold text-blue-700 focus:outline-none focus:border-blue-500 shadow-sm min-w-[3rem] text-center cursor-pointer hover:border-gray-400 transition-colors"
                    >
                        <option value="">-</option>
                        {question.matchingOptions && question.matchingOptions.map((opt) => (
                            <option key={opt.label} value={opt.label}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {question.beforeGap && (
                <div className="mt-3 ml-11 p-3 bg-blue-50/50 rounded-lg text-gray-700 italic border-l-4 border-blue-200">
                    "{question.beforeGap}"
                </div>
            )}
        </div>
    );
};

export default MatchingInformation;
