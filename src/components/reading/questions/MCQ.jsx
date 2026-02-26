import React from 'react';

const MCQ = ({ question, answer, onChange, language }) => {
    // Multiple Choice Question
    // question.options = ["A. ...", "B. ...", "C. ..."]

    return (
        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start gap-4 mb-4">
                {question.displayId && (
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 font-bold rounded-full text-sm select-none">
                        {question.displayId}
                    </span>
                )}
                <p className="text-lg text-gray-800 font-serif font-medium leading-relaxed">
                    {language === 'en' ? question.questionText.en : (question.questionText.zh || question.questionText.en)}
                </p>
            </div>

            <div className="space-y-3 pl-12">
                {question.options && question.options.map((opt, index) => {
                    // Extract A/B/C/D if possible
                    const letter = String.fromCharCode(65 + index); // A, B, C...

                    // Check if option text starts with "A." or similar, if so use it, otherwise keep full
                    // Our dummy data: "A. 7-9 years"

                    // Simple parsing to separate letter for styling if needed, or just display whole string
                    const isSelected = answer === letter || (answer && opt.startsWith(answer));

                    return (
                        <div
                            key={index}
                            onClick={() => onChange(question.id, letter)}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 group ${isSelected
                                    ? 'bg-blue-50 border-blue-500 shadow-sm'
                                    : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-bold text-sm transition-colors ${isSelected
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-500 border-gray-300 group-hover:border-blue-400 group-hover:text-blue-500'
                                }`}>
                                {letter}
                            </div>
                            <span className={`text-base ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>
                                {opt}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MCQ;
