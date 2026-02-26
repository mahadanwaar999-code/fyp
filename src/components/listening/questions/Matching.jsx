import React from 'react';

const Matching = ({ question, answer, onChange, language }) => {
    // answer is expected to be a string (the letter selected) for this SPECIFIC question ID.
    // NOTE: In the previous implementation, 'Matching' was one giant component for multiple questions.
    // The requirement is "10 questions per section, each calling a component".
    // If Question 21-25 is a Matching SET, usually we render the BOX once, and then Q21, Q22, Q23...
    // But if we are iterating map(q => component), we have a problem: we don't want to render the BOX 5 times.
    //
    // SOLUTION:
    // We will include the "Box Options" ONLY in the first question of the set, OR we assume the "Box" is metadata passed to all.
    // For simplicity in this "dynamic" random rendering (where we might just get Q23 without Q21?), 
    // it's safer to embed the box in the component but maybe hide it if it was just shown? 
    // No, random selection 10 questions... if we pick 10 random questions, we might break sets.
    //
    // CRITICAL: The user said "Randomly select 10 questions per section".
    // If we select random questions from a matching set, we MUST show the matching options box for THAT question.
    // So every matching question component needs to show the box, OR we simply grouped them in the data.
    //
    // Let's allow the component to render the box. If multiple appear sequentially, it might look repetitive, 
    // but for "Random 10 questions" it ensures context is available. 
    // Ideally, the "Box" is the 'context' or 'prompt' and the question is the line item.

    const options = question.matchingOptions || []; // [{label: 'A', text: 'outgoing'}, ...]

    return (
        <div className="mb-8">
            <div className="mb-4">
                <p className="text-lg font-medium mb-4">
                    {language === 'en' ? question.questionText.en : (question.questionText.zh || question.questionText.en)}
                </p>

                {/* Options Box */}
                <div className="border-2 border-gray-300 p-4 rounded-md mb-6 bg-gray-50 max-w-lg">
                    <h4 className="font-bold mb-2 text-gray-700 uppercase text-sm">Options</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {options.map((opt, idx) => (
                            <div key={idx} className="flex items-center">
                                <span className="font-bold text-gray-900 w-8">{opt.label || String.fromCharCode(65 + idx)}</span>
                                <span className="text-gray-700">{opt.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* The Question Input Line */}
                <div className="flex items-center gap-4 p-3 bg-white rounded border border-gray-200 shadow-sm max-w-2xl">
                    <span className="font-bold text-gray-500 w-8">{question.displayId ? question.displayId : ''}</span>
                    <span className="flex-1 text-gray-800">{question.itemText}</span>

                    <div className="relative">
                        <select
                            value={answer || ''}
                            onChange={(e) => onChange(question.id, e.target.value)}
                            className="appearance-none w-20 px-3 py-2 border-2 border-blue-100 rounded-md focus:border-blue-500 focus:outline-none bg-white font-bold text-center text-blue-700"
                        >
                            <option value="">-</option>
                            {options.map((opt, idx) => {
                                const label = opt.label || String.fromCharCode(65 + idx);
                                return <option key={idx} value={label}>{label}</option>
                            })}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Matching;
