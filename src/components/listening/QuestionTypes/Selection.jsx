import React, { useState } from 'react';

const Selection = ({ question }) => {
    // Question usually has qNumbers: [23, 24] and one text.
    // We need multiple selects.

    const [selected, setSelected] = useState([]);

    const toggle = (opt) => {
        if (selected.includes(opt)) {
            setSelected(selected.filter(s => s !== opt));
        } else {
            if (selected.length < (question.qNumbers ? question.qNumbers.length : 2)) {
                setSelected([...selected, opt]);
            }
        }
    };

    const options = question.options || []; // Array of strings like "A description..."

    // Debug: log the question data
    console.log('Selection question:', question);
    console.log('Options:', options);

    return (
        <div className="bg-white p-5 rounded-lg border-2 border-gray-200 mb-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-3 mb-4">
                <div className="flex-shrink-0 px-3 h-10 rounded-full bg-[#333399] text-white flex items-center justify-center font-bold text-base shadow-md">
                    {question.qNumbers ? question.qNumbers.join(' & ') : question.qNumber}
                </div>
                <p className="font-semibold text-lg text-gray-800 leading-relaxed">{question.text}</p>
            </div>

            {/* Display options */}
            {options && options.length > 0 ? (
                <>
                    <div className="ml-13 grid md:grid-cols-2 gap-3">
                        {options.map((optStr, i) => {
                            // Parse "A description" -> key="A", text="description"
                            // Usually the string starts with the letter
                            const match = optStr.match(/^([A-Z])\s+(.*)/);
                            const key = match ? match[1] : String.fromCharCode(65 + i); // A, B, C, etc.
                            const text = match ? match[2] : optStr;

                            const isSelected = selected.includes(key);

                            return (
                                <div
                                    key={i}
                                    onClick={() => toggle(key)}
                                    className={`p-4 rounded-lg border-2 cursor-pointer flex gap-3 transition-all ${isSelected ? 'bg-[#333399] text-white border-[#333399] shadow-md transform scale-105' : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}
                                >
                                    <span className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-[#333399]'}`}>{key}</span>
                                    <span className="flex-1 text-base">{text}</span>
                                </div>
                            );
                        })}
                    </div>
                    <p className="ml-13 mt-3 text-sm font-medium text-gray-600 bg-blue-50 px-3 py-2 rounded-md inline-block">
                        Select {question.qNumbers ? question.qNumbers.length : 2} options
                    </p>
                </>
            ) : (
                <div className="ml-13 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 font-medium">No options available for this question</p>
                    <p className="text-sm text-red-500 mt-1">Question data: {JSON.stringify(question, null, 2)}</p>
                </div>
            )}
        </div>
    );
};

export default Selection;
