import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, CheckCircle, Mic } from 'lucide-react';
import Part1Interview from './speaking/Part1Interview';
import Part2CueCard from './speaking/Part2CueCard';
import Part3Discussion from './speaking/Part3Discussion';

const API_BASE_URL = 'http://localhost:5001/api';

export function SpeakingTestPage({ isDark, language, onBack }) {
    const [testData, setTestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPart, setCurrentPart] = useState(1); // 1, 2, or 3
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    // Fetch Random Test
    useEffect(() => {
        const fetchTest = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/speaking/random`);
                setTestData(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching speaking test:', err);
                setError('Failed to load speaking test. Please ensure the backend is running.');
                setLoading(false);
            }
        };
        fetchTest();
    }, []);

    // Extract current part data
    const partData = testData?.parts.find(p => p.partNumber === currentPart);

    // Handle next question/part transitions
    const handleNext = () => {
        if (currentPart === 1) {
            if (currentQuestionIndex < partData.questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                setCurrentPart(2);
                setCurrentQuestionIndex(0);
            }
        } else if (currentPart === 2) {
            // Part 2 usually proceeds to Part 3 after completion
            setCurrentPart(3);
            setCurrentQuestionIndex(0);
        } else if (currentPart === 3) {
            // Flatten all questions from all subtopics for easy traversal
            const allPart3Questions = partData.discussionTopics.flatMap(topic => topic.questions);
            if (currentQuestionIndex < allPart3Questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                setIsCompleted(true);
            }
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className={`flex items-center justify-center h-screen ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50'}`}>
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex flex-col items-center justify-center h-screen ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50'}`}>
                <p className="text-red-500 mb-4">{error}</p>
                <button onClick={onBack} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Return</button>
            </div>
        );
    }

    // Completion screen
    if (isCompleted) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-6 ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50'}`}>
                <div className={`p-12 rounded-3xl shadow-2xl max-w-2xl w-full text-center ${isDark ? 'bg-[#252545] text-white' : 'bg-white text-gray-900'}`}>
                    <div className="mx-auto bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mb-8">
                        <CheckCircle className="w-14 h-14 text-green-600" />
                    </div>
                    <h2 className="text-4xl font-bold mb-4">Speaking Test Complete!</h2>
                    <p className="text-lg opacity-80 mb-10">
                        You have completed all three parts of the IELTS Speaking Test.<br />
                        Your responses have been recorded for evaluation.
                    </p>

                    <div className={`grid grid-cols-3 gap-4 mb-10 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <div className="text-3xl font-bold text-blue-500 mb-2">✓</div>
                            <p className="font-bold">Part 1</p>
                            <p className="text-sm opacity-70">Interview</p>
                        </div>
                        <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <div className="text-3xl font-bold text-purple-500 mb-2">✓</div>
                            <p className="font-bold">Part 2</p>
                            <p className="text-sm opacity-70">Long Turn</p>
                        </div>
                        <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <div className="text-3xl font-bold text-green-500 mb-2">✓</div>
                            <p className="font-bold">Part 3</p>
                            <p className="text-sm opacity-70">Discussion</p>
                        </div>
                    </div>

                    <button
                        onClick={onBack}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl rounded-2xl transition-all shadow-lg hover:shadow-xl"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Main test interface
    return (
        <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className={`flex-shrink-0 h-20 px-6 flex items-center justify-between shadow-md ${isDark ? 'bg-[#16213e] border-b border-gray-700' : 'bg-white border-b border-gray-200'}`}>
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className={`p-3 rounded-xl transition-all ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            IELTS Speaking Test
                        </h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-600 text-white uppercase tracking-wider">
                                Academic & General
                            </span>
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                11-14 minutes • 3 Parts
                            </span>
                        </div>
                    </div>
                </div>

                {/* Recording Indicator */}
                <div className="flex items-center gap-3 px-5 py-3 bg-red-900/20 text-red-400 rounded-xl">
                    <Mic className="w-5 h-5 animate-pulse" />
                    <span className="font-bold">Recording</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center p-6">
                {currentPart === 1 && (
                    <Part1Interview
                        question={partData.questions[currentQuestionIndex]}
                        mainTopic={partData.mainTopic}
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={partData.questions.length}
                        onNext={handleNext}
                        isDark={isDark}
                    />
                )}

                {currentPart === 2 && (
                    <Part2CueCard
                        cueCard={partData.cueCard}
                        onComplete={handleNext}
                        isDark={isDark}
                    />
                )}

                {currentPart === 3 && (
                    <Part3Discussion
                        question={partData.discussionTopics.flatMap(t => t.questions)[currentQuestionIndex]}
                        subTopic={partData.discussionTopics.find(t => t.questions.includes(partData.discussionTopics.flatMap(t => t.questions)[currentQuestionIndex]))?.subTopic}
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={partData.discussionTopics.flatMap(t => t.questions).length}
                        onNext={handleNext}
                        isDark={isDark}
                    />
                )}
            </div>
        </div>
    );
}

export default SpeakingTestPage;
