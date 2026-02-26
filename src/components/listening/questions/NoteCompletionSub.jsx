import React from 'react';

const NoteCompletionSub = ({ question, answer, onChange, language }) => {
    // Similar to NoteCompletion but with indentation/bullet styling for "sub" items
    return (
        <div className="mb-4 pl-12 relative">
            {/* Bullet line connector visual could go here */}
            <div className="absolute left-8 top-3 w-2 h-2 bg-gray-400 rounded-full"></div>

            <div className="flex flex-wrap items-center gap-2 text-lg">
                <span className="text-gray-700">{question.beforeGap || question.questionText.en}</span>
                <input
                    type="text"
                    value={answer || ''}
                    onChange={(e) => onChange(question.id, e.target.value)}
                    className="min-w-[120px] p-1 border-b border-gray-400 bg-gray-50 focus:border-blue-600 focus:outline-none"
                />
                {question.afterGap && <span className="text-gray-700">{question.afterGap}</span>}
            </div>
        </div>
    );
};

export default NoteCompletionSub;
