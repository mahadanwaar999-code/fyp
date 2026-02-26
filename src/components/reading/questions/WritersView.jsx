import React from 'react';

const WritersView = ({ question, answer, onChange, language }) => {
    // Writer's View / Claims
    // Usually Yes/No/Not Given or True/False/Not Given but focused on writer's opinion.
    // Or summary completion about writer's view.

    // Based on dummy data: { type: "writers-view", beforeGap: "...", afterGap: "...", questionText: "...", correctAnswer: "..." }
    // It seems to be a variation of sentence completion in the dummy data provided for question 226 and 334.
    // "The writer implies that a higher turnover of vehicles is [_____]."

    // If it acts like sentence completion:
    return (
        <div className="mb-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            {question.groupTitle && (
                <div className="mb-4">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b-2 border-gray-200 pb-1">
                        {question.groupTitle}
                    </span>
                </div>
            )}

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
                    className="min-w-[180px] px-4 py-1 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none bg-blue-50/30 text-center font-medium text-blue-900 transition-colors rounded"
                    placeholder={language === 'en' ? "type here..." : "在此输入..."}
                    autoComplete="off"
                />
                <span>{question.afterGap}</span>
            </div>
            {question.questionText && (
                <div className="mt-3 pl-12">
                    <p className="text-sm text-gray-400 font-medium tracking-wide">
                        Hint: {language === 'en' ? question.questionText.en : (question.questionText.zh || question.questionText.en)}
                    </p>
                </div>
            )}
        </div>
    );
};

export default WritersView;
