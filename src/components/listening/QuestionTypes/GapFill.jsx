import React, { useState, useRef, useEffect } from 'react';

const GapFill = ({ question, isMap, isMatching }) => {
    const [val, setVal] = useState('');
    const inputRef = useRef(null);

    // Auto-focus the first input when component mounts
    useEffect(() => {
        if (inputRef.current && question.qNumber === 1) {
            inputRef.current.focus();
        }
    }, [question.qNumber]);

    const renderContent = () => {
        // Logic to replace "____" with input
        if (question.text && question.text.includes('____')) {
            const parts = question.text.split('____');
            return (
                <span className="flex flex-wrap items-center gap-2">
                    {parts.map((part, i) => (
                        <React.Fragment key={i}>
                            <span>{part}</span>
                            {i < parts.length - 1 && (
                                <input
                                    ref={i === 0 ? inputRef : null}
                                    type="text"
                                    className="px-4 py-2 border-2 border-[#333399] rounded-md focus:border-[#4444aa] focus:ring-2 focus:ring-[#333399]/20 outline-none w-full max-w-[12rem] sm:w-48 font-bold text-center bg-blue-50 text-gray-800 text-lg transition-all"
                                    placeholder="Type here..."
                                    value={val}
                                    onChange={(e) => setVal(e.target.value)}
                                    autoComplete="off"
                                />
                            )}
                        </React.Fragment>
                    ))}
                </span>
            );
        }
        return (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full">
                <span className="flex-grow text-lg">{question.text}</span>
                <input
                    ref={inputRef}
                    type="text"
                    className="px-4 py-2 border-2 border-[#333399] rounded-md focus:border-[#4444aa] focus:ring-2 focus:ring-[#333399]/20 outline-none w-full sm:w-48 sm:max-w-xs font-bold text-center bg-blue-50 text-gray-800 text-lg transition-all"
                    placeholder="Type here..."
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    autoComplete="off"
                />
            </div>
        );
    };

    return (
        <div className="flex items-start gap-3 py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#333399] text-white flex items-center justify-center font-bold text-base mt-0.5 shadow-md">
                {question.qNumber}
            </div>
            <div className="flex-grow text-gray-800 text-lg leading-relaxed">
                {renderContent()}
            </div>
        </div>
    );
};

export default GapFill;
