import React from 'react';

const TableCompletion = ({ question, answer, onChange, language }) => {
    // In a dynamic context where we render questions linearly one by one, 
    // a "Table" question is actually just a cell in that table.
    // The "Table" header context should ideally be in the Section description or grouped.
    // However, to make it self-contained:
    // We can render a "row" look-alike.
    // question structure might be: { rowLabel: "Day 1", colLabel: "Notes", preText: "Hotel dining room has view of the", ... }

    return (
        <div className="mb-2">
            {/* If it's the start of a table (metadata flag?) we could show headers, but hard to know in random stream.
               We will assume it's just the input row with context labels. 
           */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 border-b border-gray-100 bg-white">
                {question.rowLabel && (
                    <div className="w-24 font-bold text-gray-600 border-r border-gray-200 pr-2">
                        {question.rowLabel}
                    </div>
                )}

                <div className="flex-1 flex flex-wrap items-center gap-2">
                    <span className="text-gray-800">{question.beforeGap || question.questionText.en}</span>
                    <input
                        type="text"
                        value={answer || ''}
                        onChange={(e) => onChange(question.id, e.target.value)}
                        className="min-w-[140px] p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                        placeholder="..."
                    />
                    {question.afterGap && <span className="text-gray-800">{question.afterGap}</span>}
                </div>
            </div>
        </div>
    );
};

export default TableCompletion;
