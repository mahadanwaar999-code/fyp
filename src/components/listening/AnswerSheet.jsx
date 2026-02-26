import React from 'react';

const AnswerSheet = ({ answers, totalQuestions, onAnswerChange, onSubmit, timeLeft, language }) => {

    // Create an array of 40 numbers
    const questionNumbers = Array.from({ length: totalQuestions }, (_, i) => i + 1);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    {language === 'en' ? "Answer Sheet" : "答题纸"}
                </h2>
                <div className="text-xl font-mono font-bold text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                    {language === 'en' ? "Time Left: " : "剩余时间: "}{formatTime(timeLeft)}
                </div>
            </div>

            <p className="mb-6 text-gray-600 italic">
                {language === 'en'
                    ? "Please transfer your answers to this sheet. You have 10 minutes."
                    : "请将您的答案填写在此答题纸上。您有10分钟时间。"}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {questionNumbers.map((num) => (
                    <div key={num} className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-600 mb-1">
                            Q{num}
                        </label>
                        <input
                            type="text"
                            value={answers[num] || ''} // Using global ID assuming 1-40 mapping
                            onChange={(e) => onAnswerChange(num, e.target.value)}
                            className="p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none bg-gray-50 focus:bg-white transition-colors"
                        />
                    </div>
                ))}
            </div>

            <div className="flex justify-end pt-4 border-t">
                <button
                    onClick={onSubmit}
                    className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transform transition hover:scale-105 shadow-md"
                >
                    {language === 'en' ? "Submit Test" : "提交测试"}
                </button>
            </div>
        </div>
    );
};

export default AnswerSheet;
