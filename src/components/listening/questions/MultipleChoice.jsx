import React from 'react';

const MultipleChoice = ({ question, answer, onChange, language }) => {
    // question.options can be ["Option A", "Option B"] or [{label: 'A', text: '...'}, ...]

    return (
        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h4 className="text-lg font-medium mb-4 text-gray-900 leading-relaxed">
                {language === 'en' ? question.questionText.en : (question.questionText.zh || question.questionText.en)}
            </h4>
            <div className="space-y-3">
                {question.options.map((option, index) => {
                    const label = String.fromCharCode(65 + index); // A, B, C...
                    const text = typeof option === 'string' ? option : option.text;
                    const value = label;
                    const isSelected = answer === value;

                    return (
                        <div
                            key={index}
                            onClick={() => onChange(question.id, value)}
                            className={`flex items-start p-3 rounded-md border cursor-pointer transition-all ${isSelected ? 'bg-blue-50 border-blue-500 shadow-sm' : 'hover:bg-gray-50 border-gray-200'}`}
                        >
                            <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm font-bold border ${isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-300'}`}>
                                {label}
                            </div>
                            <span className={`text-gray-800 pt-1 ${isSelected ? 'font-medium' : ''}`}>{text}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MultipleChoice;
