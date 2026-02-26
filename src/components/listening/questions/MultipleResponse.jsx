import React from 'react';

const MultipleResponse = ({ question, answer, onChange, language }) => {
    // answer is expected to be an array of selected options, e.g. ["A", "C"]
    const selectedOptions = Array.isArray(answer) ? answer : [];

    const handleToggle = (option) => {
        let newSelection;
        if (selectedOptions.includes(option)) {
            newSelection = selectedOptions.filter(item => item !== option);
        } else {
            // Usually limited to specific number, e.g. 2. 
            // We can check question.maxSelection if provided, default to 2.
            const maxSelection = question.maxSelection || 2;
            if (selectedOptions.length < maxSelection) {
                newSelection = [...selectedOptions, option];
            } else {
                // Optionally replace partial? Or just block.
                // Let's block if max reached.
                return;
            }
        }
        onChange(question.id, newSelection);
    };

    return (
        <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
            <p className="text-lg font-medium mb-4">
                {language === 'en' ? question.questionText.en : (question.questionText.zh || question.questionText.en)}
                <span className="ml-2 text-sm text-gray-500 font-normal">
                    (Choose {question.maxSelection || 2})
                </span>
            </p>
            <div className="space-y-3">
                {question.options.map((option, index) => {
                    const isSelected = selectedOptions.includes(option.label); // Assuming options are objects {label: 'A', text: '...'} or simple strings
                    // To handle both:
                    const label = typeof option === 'string' ? option.split(' ')[0] : option.label; // Simple heuristic or explicit
                    // Actually for consistency, let's assume option is string "A. Description" or just "Description" and we assign A,B,C...
                    // Better yet, let question.options be simple strings, and we prefix A, B, C etc.
                    const letter = String.fromCharCode(65 + index); // A, B, C...
                    const text = typeof option === 'string' ? option : option.text;
                    const value = letter; // Use letter as the value to store

                    const isActive = selectedOptions.includes(value);

                    return (
                        <div
                            key={index}
                            onClick={() => handleToggle(value)}
                            className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors ${isActive ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50 border-gray-200'}`}
                        >
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm font-bold ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                {letter}
                            </div>
                            <span className="text-gray-800">{text}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MultipleResponse;
