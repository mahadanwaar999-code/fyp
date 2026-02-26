import React from 'react';
import { Check } from 'lucide-react';

const ReadingQuestionRenderer = ({ group, userAnswers, onAnswerChange }) => {
    const { type, instructions, questions, options } = group;

    const renderQuestion = (q) => {
        const answer = userAnswers[q.qNumber] || '';

        // Handle different question formats within groups
        switch (type) {
            case 'note-completion':
            case 'summary-completion':
            case 'table-completion':
            case 'sentence-completion':
                return (
                    <div key={q.qNumber} className="flex flex-col gap-2 p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-[#333399] text-white rounded-full flex items-center justify-center font-bold text-sm">
                                {q.qNumber}
                            </span>
                            <div className="flex-grow">
                                {q.text && q.text.includes('____') ? (
                                    <div className="flex flex-wrap items-center gap-x-2 leading-relaxed">
                                        {q.text.split('____').map((part, i, arr) => (
                                            <React.Fragment key={i}>
                                                <span>{part}</span>
                                                {i < arr.length - 1 && (
                                                    <input
                                                        type="text"
                                                        className="px-3 py-2 border-2 border-[#333399] rounded-lg focus:bg-blue-50 outline-none w-full sm:w-64 transition-all font-medium text-left shadow-sm"
                                                        value={answer}
                                                        onChange={(e) => onAnswerChange(q.qNumber, e.target.value)}
                                                        placeholder="Type here..."
                                                    />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                        <span className="text-gray-800">{q.text}</span>
                                        <input
                                            type="text"
                                            className="px-3 py-2 border-2 border-[#333399] rounded-lg focus:bg-blue-50 outline-none w-full sm:w-64 transition-all font-medium text-left shadow-sm mt-2 sm:mt-0"
                                            value={answer}
                                            onChange={(e) => onAnswerChange(q.qNumber, e.target.value)}
                                            placeholder="Type here..."
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 'true-false-not-given':
            case 'tfng':
            case 'y n n g':
            case 'yes-no-not-given':
                const choices = (type.includes('true') || type.includes('tfng'))
                    ? ['TRUE', 'FALSE', 'NOT GIVEN']
                    : ['YES', 'NO', 'NOT GIVEN'];
                return (
                    <div key={q.qNumber} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 flex-grow">
                            <span className="flex-shrink-0 w-8 h-8 bg-[#333399] text-white rounded-full flex items-center justify-center font-bold text-sm">
                                {q.qNumber}
                            </span>
                            <span className="text-gray-800">{q.text}</span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {choices.map(choice => (
                                <button
                                    key={choice}
                                    onClick={() => onAnswerChange(q.qNumber, choice)}
                                    className={`px-3 py-1 text-xs font-bold rounded-full border-2 transition-all ${answer === choice
                                        ? 'bg-[#333399] border-[#333399] text-white'
                                        : 'bg-white border-gray-200 text-gray-500 hover:border-[#333399] hover:text-[#333399]'
                                        }`}
                                >
                                    {choice}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 'multiple-choice':
                const mcqOptions = q.options || options || {};
                return (
                    <div key={q.qNumber} className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm space-y-3">
                        <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-[#333399] text-white rounded-full flex items-center justify-center font-bold text-sm">
                                {q.qNumber}
                            </span>
                            <span className="text-gray-800 font-medium">{q.text}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-11">
                            {Object.entries(mcqOptions).map(([key, text]) => (
                                <button
                                    key={key}
                                    onClick={() => onAnswerChange(q.qNumber, key)}
                                    className={`text-left px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-3 ${answer === key
                                        ? 'bg-[#333399] border-[#333399] text-white'
                                        : 'bg-gray-50 border-transparent text-gray-700 hover:bg-white hover:border-[#333399]'
                                        }`}
                                >
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${answer === key ? 'border-white' : 'border-[#333399] text-[#333399]'}`}>
                                        {key}
                                    </span>
                                    <span className="text-sm">{text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 'matching-information':
            case 'matching-features':
            case 'matching-headings':
            case 'matching-sentence-endings':
                return (
                    <div key={q.qNumber} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 flex-grow">
                            <span className="flex-shrink-0 w-8 h-8 bg-[#333399] text-white rounded-full flex items-center justify-center font-bold text-sm">
                                {q.qNumber}
                            </span>
                            <span className="text-gray-800">{q.text}</span>
                        </div>
                        <input
                            type="text"
                            maxLength={1}
                            className="w-14 h-12 border-2 border-[#333399] rounded-lg text-left px-4 font-bold text-lg focus:bg-blue-50 outline-none uppercase shadow-sm"
                            value={answer}
                            onChange={(e) => onAnswerChange(q.qNumber, e.target.value.toUpperCase())}
                            placeholder="?"
                        />
                    </div>
                );

            case 'summary-selection':
                return (
                    <div key={q.qNumber} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 flex-grow">
                            <span className="flex-shrink-0 w-8 h-8 bg-[#333399] text-white rounded-full flex items-center justify-center font-bold text-sm">
                                {q.qNumber}
                            </span>
                            <span className="text-gray-800">{q.text}</span>
                        </div>
                        <input
                            type="text"
                            maxLength={1}
                            className="w-14 h-12 border-2 border-[#333399] rounded-lg text-left px-4 font-bold text-lg focus:bg-blue-50 outline-none uppercase shadow-sm"
                            value={answer}
                            onChange={(e) => onAnswerChange(q.qNumber, e.target.value.toUpperCase())}
                            placeholder="?"
                        />
                    </div>
                );

            default:
                return (
                    <div key={q.qNumber} className="p-4 border border-dashed border-red-200 text-red-400 rounded-lg">
                        TODO: Renderer for {type}
                    </div>
                );
        }
    };

    const renderGroup = () => {
        if (type === 'multiple-selection') {
            const selectionId = group.qNumbers[0];
            const currentSelection = Array.isArray(userAnswers[selectionId]) ? userAnswers[selectionId] : [];

            const toggleSelection = (key) => {
                let newSelection;
                if (currentSelection.includes(key)) {
                    newSelection = currentSelection.filter(k => k !== key);
                } else {
                    if (currentSelection.length < group.qNumbers.length) {
                        newSelection = [...currentSelection, key];
                    } else {
                        return;
                    }
                }
                group.qNumbers.forEach(qNum => onAnswerChange(qNum, newSelection));
            };

            return (
                <div key={group.qNumbers.join('-')} className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="flex flex-col gap-1">
                            {group.qNumbers.map(qNum => (
                                <span key={qNum} className="w-8 h-8 bg-[#333399] text-white rounded-full flex items-center justify-center font-bold text-xs">
                                    {qNum}
                                </span>
                            ))}
                        </div>
                        <div className="flex-grow pt-1">
                            <span className="text-gray-800 font-bold block mb-1">Select {group.qNumbers.length} options:</span>
                            <span className="text-sm text-gray-500 italic">Remaining: {group.qNumbers.length - currentSelection.length}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 pl-12">
                        {Array.isArray(options) ? options.map((opt, i) => {
                            const key = opt.trim().charAt(0);
                            const isSelected = currentSelection.includes(key);
                            return (
                                <button
                                    key={i}
                                    onClick={() => toggleSelection(key)}
                                    className={`text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-4 ${isSelected
                                        ? 'bg-blue-50 border-[#333399] text-[#333399]'
                                        : 'bg-gray-50 border-transparent text-gray-700 hover:bg-white hover:border-gray-300'
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-[#333399] border-[#333399]' : 'bg-white border-gray-300'}`}>
                                        {isSelected && <Check className="w-4 h-4 text-white" />}
                                    </div>
                                    <span className="text-sm font-medium">{opt}</span>
                                </button>
                            );
                        }) : Object.entries(options || {}).map(([key, text], i) => {
                            const isSelected = currentSelection.includes(key);
                            return (
                                <button
                                    key={i}
                                    onClick={() => toggleSelection(key)}
                                    className={`text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-4 ${isSelected
                                        ? 'bg-blue-50 border-[#333399] text-[#333399]'
                                        : 'bg-gray-50 border-transparent text-gray-700 hover:bg-white hover:border-gray-300'
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-[#333399] border-[#333399]' : 'bg-white border-gray-300'}`}>
                                        {isSelected && <Check className="w-4 h-4 text-white" />}
                                    </div>
                                    <span className="text-sm font-medium">{key}: {text}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {(questions || []).map(renderQuestion)}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 italic text-gray-700 text-sm">
                {instructions}
            </div>

            {/* Labels for matching if present and not handled in-line */}
            {options && !['multiple-choice', 'multiple-selection'].includes(type) && (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-200">
                    <h4 className="font-bold text-center mb-4 uppercase tracking-wider text-gray-600 underline">List of Options</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Array.isArray(options) ? options.map((opt, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white p-2 rounded border border-gray-100 shadow-sm">
                                <span className="text-sm font-medium">{opt}</span>
                            </div>
                        )) : Object.entries(options).map(([key, text]) => (
                            <div key={key} className="flex items-center gap-3 bg-white p-2 rounded border border-gray-100 shadow-sm">
                                <span className="w-8 h-8 bg-gray-800 text-white rounded flex items-center justify-center font-bold text-xs">{key}</span>
                                <span className="text-sm font-medium">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {renderGroup()}
        </div>
    );
};

export default ReadingQuestionRenderer;
