import React from 'react';

const FillBlank = ({ question, answer, onChange, language }) => {
    return (
        <div className="mb-4">
            <label className="block text-lg font-medium mb-2">
                {language === 'en' ? question.questionText.en : (question.questionText.zh || question.questionText.en)}
            </label>
            <input
                type="text"
                value={answer || ''}
                onChange={(e) => onChange(question.id, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={language === 'en' ? "Type your answer..." : "输入答案..."}
            />
        </div>
    );
};

export default FillBlank;
