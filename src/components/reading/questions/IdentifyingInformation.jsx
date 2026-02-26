import React from 'react';

const IdentifyingInformation = ({ question, answer, onChange, language }) => {
    // Identifying Information (True/False/Not Given equivalent for Paragraphs or "Which paragraph contains...")
    // Often: "Which paragraph contains the following information?" -> Options: A, B, C...
    // question.options should be something like ["Paragraph A", "Paragraph B", ...]

    return (
        <div className="mb-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start gap-4">
                {question.displayId && (
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 font-bold rounded-full text-sm select-none">
                        {question.displayId}
                    </span>
                )}
                <div className="flex-1">
                    <p className="text-lg text-gray-800 mb-4 font-serif leading-relaxed">
                        {language === 'en' ? question.questionText.en : (question.questionText.zh || question.questionText.en)}
                    </p>

                    <div className="flex flex-wrap gap-3">
                        {question.options && question.options.map((opt) => {
                            // Extract just the letter if possible for cleaner UI, e.g. "Paragraph A" -> "A"
                            const label = opt.replace(/Paragraph\s*/i, '');
                            return (
                                <button
                                    key={opt}
                                    onClick={() => onChange(question.id, opt)}
                                    className={`w-12 h-12 rounded-lg font-bold text-lg transition-all border flex items-center justify-center ${answer === opt
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    title={opt}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IdentifyingInformation;
