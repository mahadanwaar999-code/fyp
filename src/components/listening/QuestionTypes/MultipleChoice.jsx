import React, { useState } from 'react';

const MultipleChoice = ({ question }) => {
    const [selected, setSelected] = useState('');

    // Options can be a Map (object) or Array
    const options = question.options; // { A: "...", B: "..." } or Array?

    // Schema said Map, but import logic might have kept it as object.
    // Test 1 Part 2 JSON has options as Object.

    return (
        <div className="bg-white p-5 rounded-lg border-2 border-gray-200 mb-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#333399] text-white flex items-center justify-center font-bold text-base shadow-md">
                    {question.qNumber}
                </div>
                <p className="font-semibold text-lg text-gray-800 leading-relaxed">{question.text}</p>
            </div>

            <div className="ml-13 space-y-3">
                {options && !Array.isArray(options) && Object.entries(options).map(([key, text]) => (
                    <label key={key} className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${selected === key ? 'border-[#333399] bg-blue-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}>
                        <input
                            type="radio"
                            name={`q-${question.qNumber}`}
                            value={key}
                            checked={selected === key}
                            onChange={() => setSelected(key)}
                            className="mt-1 w-5 h-5 text-[#333399] focus:ring-2 focus:ring-[#333399]/20 cursor-pointer"
                        />
                        <span className={`font-bold text-lg ${selected === key ? 'text-[#333399]' : 'text-gray-600'}`}>{key}</span>
                        <span className="flex-1 text-base text-gray-700">{text}</span>
                    </label>
                ))}

                {/* Fallback if options is array or missing */}
                {(!options || Array.isArray(options)) && <p className="text-red-400">Error rendering options</p>}
            </div>
        </div>
    );
};

export default MultipleChoice;
