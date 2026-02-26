import React, { useState, useEffect } from 'react';
import PartRenderer from './PartRenderer';

const ListeningTestPage = ({ onBack }) => {
    const [selectedTestNumber, setSelectedTestNumber] = useState(null);
    const [testList, setTestList] = useState([]);
    const [testData, setTestData] = useState(null);
    const [currentPartIndex, setCurrentPartIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch list of tests on mount and automatically select a random one
    useEffect(() => {
        if (!selectedTestNumber) {
            fetch('http://127.0.0.1:5001/api/listening/')
                .then(res => res.json())
                .then(data => {
                    setTestList(data);
                    // Automatically select a random test
                    if (data && data.length > 0) {
                        const randomIndex = Math.floor(Math.random() * data.length);
                        setSelectedTestNumber(data[randomIndex].testNumber);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [selectedTestNumber]);

    // Fetch specific test when selected
    useEffect(() => {
        if (selectedTestNumber) {
            setLoading(true);
            fetch(`http://127.0.0.1:5001/api/listening/${selectedTestNumber}`)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch test data');
                    return res.json();
                })
                .then(data => {
                    setTestData(data);
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [selectedTestNumber]);

    const handleNextPart = () => {
        if (currentPartIndex < testData.parts.length - 1) {
            setCurrentPartIndex(prev => prev + 1);
        } else {
            alert('Test Completed! (Submission logic to be added)');
        }
    };

    const handlePrevPart = () => {
        if (currentPartIndex > 0) {
            setCurrentPartIndex(prev => prev - 1);
        }
    };

    if (loading) return <div className="p-8 text-center text-xl">Loading your test...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    // Render Active Test
    if (!testData) return (
        <div className="p-8 text-center">
            <p className="mb-4">No Test Found</p>
            <button onClick={() => setSelectedTestNumber(null)} className="text-[#333399] underline">Back to List</button>
        </div>
    );

    const currentPart = testData.parts[currentPartIndex];

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
            <button
                onClick={onBack}
                className="mb-2 text-sm text-gray-500 hover:text-[#333399] flex items-center gap-1"
            >
                &larr; Back to Dashboard
            </button>

            <div className="flex justify-between items-center border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#333399]">Listening Test {testData.testNumber}</h1>
                    <p className="text-gray-600">{testData.bookTitle}</p>
                </div>
                <div className="text-lg font-semibold">
                    Part {currentPartIndex + 1} / {testData.parts.length}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 min-h-[400px]">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">{currentPart.title}</h2>

                {/* Audio Player - Keyed by Part to force reload on change */}
                {currentPart.audioUrl && (
                    <div className="mb-6 bg-gray-100 p-4 rounded-md">
                        <p className="text-sm font-bold text-gray-500 mb-2">Audio Track</p>
                        <audio
                            key={currentPart.partNumber}
                            controls
                            className="w-full"
                            autoPlay={false}
                        >
                            <source src={`http://127.0.0.1:5001${currentPart.audioUrl}`} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )}

                {/* Instructions */}
                {currentPart.instructions && (
                    <div className="mb-6 p-4 bg-blue-50 border-l-4 border-[#333399] italic text-gray-700">
                        {currentPart.instructions}
                    </div>
                )}

                {/* Dynamic Part Content */}
                <PartRenderer part={currentPart} />
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between mt-8 pt-4 border-t">
                <button
                    onClick={handlePrevPart}
                    disabled={currentPartIndex === 0}
                    className={`px-6 py-2 rounded font-semibold transition-colors ${currentPartIndex === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    Previous Part
                </button>

                <button
                    onClick={handleNextPart}
                    className="px-6 py-2 rounded font-semibold bg-[#333399] text-white hover:bg-blue-800 transition-colors"
                >
                    {currentPartIndex === testData.parts.length - 1 ? 'Finish Test' : 'Next Part'}
                </button>
            </div>
        </div>
    );
};

export default ListeningTestPage;
