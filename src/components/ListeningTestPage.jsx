import { useState, useEffect, useRef } from 'react';
import {
    ArrowLeft,
    Clock,
    PlayCircle,
    PauseCircle,
    Volume2,
    ChevronLeft,
    ChevronRight,
    Check,
    AlertCircle
} from 'lucide-react';
import { translations } from '../translations';
import FillBlank from './listening/questions/FillBlank';
import MultipleChoice from './listening/questions/MultipleChoice';
import Matching from './listening/questions/Matching';
import TableCompletion from './listening/questions/TableCompletion';
import NoteCompletion from './listening/questions/NoteCompletion';
import NoteCompletionSub from './listening/questions/NoteCompletionSub';
import MultipleResponse from './listening/questions/MultipleResponse';
import AnswerSheet from './listening/AnswerSheet';
import { questionPool } from '../data/listeningData';

export function ListeningTestPage({ isDark, language, onBack }) {
    const t = translations[language];

    // State
    const [testData, setTestData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [currentSection, setCurrentSection] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});

    // Timer: 30 mins (1800s) for audio, then 10 mins (600s) for answer sheet
    const [timeRemaining, setTimeRemaining] = useState(30 * 60);
    const [isAnswerSheetMode, setIsAnswerSheetMode] = useState(false);

    const [isPlaying, setIsPlaying] = useState(false);
    const [audioElement, setAudioElement] = useState(null);

    const [showResults, setShowResults] = useState(false);
    const [testResult, setTestResult] = useState(null);

    // Test Generation Logic
    useEffect(() => {
        const generateTest = () => {
            const sections = ['section1', 'section2', 'section3', 'section4'];
            const generatedSections = sections.map((secKey, index) => {
                // Randomly select 10 questions from the pool
                const pool = questionPool[secKey] || [];
                // Simple shuffle
                const shuffled = [...pool].sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 10);

                return {
                    id: index + 1,
                    title: { en: `Section ${index + 1}`, zh: `第${index + 1}部分` },
                    description: { en: `Section ${index + 1} Content`, zh: `第${index + 1}部分内容` },
                    audioSrc: `/audio/IELTS15_test1_audio${index + 1}.mp3`, // Mock audio
                    questions: selected
                };
            });

            // Assign global sequential IDs (1-40) for the test session
            let globalIndex = 1;
            generatedSections.forEach(sec => {
                sec.questions.forEach(q => {
                    q.checkId = q.id; // Keep original ID for debugging/tracking
                    q.id = globalIndex++; // Remap ID to 1-40 for this session
                });
            });

            setTestData({ sections: generatedSections });
            setLoading(false);
        };

        generateTest();
    }, []);

    // Timer Logic
    useEffect(() => {
        if (!testData || showResults) return;

        if (timeRemaining > 0) {
            const timer = setTimeout(() => setTimeRemaining(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            // Time ran out
            if (!isAnswerSheetMode) {
                // Switch to Answer Sheet
                setIsAnswerSheetMode(true);
                setTimeRemaining(10 * 60); // 10 minutes transfer time
            } else {
                // Submit automatically
                handleSubmit();
            }
        }
    }, [timeRemaining, isAnswerSheetMode, showResults, testData]);

    // Audio Logic
    useEffect(() => {
        if (!testData || isAnswerSheetMode || showResults) {
            if (audioElement) {
                audioElement.pause();
                setAudioElement(null);
                setIsPlaying(false);
            }
            return;
        }

        // Just stop audio when switching sections if needed, or keep playing?
        // Typically IELTS audio is one long track or per section. Implementation assumes per section.
        const currentAudioSrc = testData.sections[currentSection].audioSrc;
        const newAudio = new Audio(currentAudioSrc);

        if (audioElement) {
            audioElement.pause();
        }

        setAudioElement(newAudio);
        setIsPlaying(false);

        newAudio.addEventListener('ended', () => setIsPlaying(false));

        return () => {
            newAudio.pause();
        };
    }, [currentSection, testData, isAnswerSheetMode, showResults]);

    useEffect(() => {
        if (!audioElement) return;
        if (isPlaying) {
            audioElement.play().catch(e => console.error("Audio play error:", e));
        } else {
            audioElement.pause();
        }
    }, [isPlaying, audioElement]);


    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = (questionId, answer) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const moveToAnswerSheet = () => {
        setIsAnswerSheetMode(true);
        setTimeRemaining(10 * 60);
    };

    const handleSubmit = async () => {
        // Evaluate locally since we have the data
        let score = 0;
        let details = [];

        testData.sections.forEach(section => {
            section.questions.forEach(q => {
                const userAns = userAnswers[q.id];
                const correct = q.correctAnswer;
                let isCorrect = false;

                // Basic comparison
                if (typeof correct === 'string') {
                    isCorrect = userAns && userAns.toString().trim().toLowerCase() === correct.toString().trim().toLowerCase();
                } else if (Array.isArray(correct)) {
                    // For multiple response, check if arrays match (order independent)
                    if (Array.isArray(userAns)) {
                        const sortedUser = [...userAns].sort();
                        const sortedCorrect = [...correct].sort();
                        isCorrect = JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);
                    }
                }

                if (isCorrect) score++;

                details.push({
                    questionId: q.id,
                    correct: isCorrect,
                    userAnswer: userAns,
                    correctAnswer: correct
                });
            });
        });

        setTestResult({
            score: score,
            totalQuestions: 40,
            details: details
        });
        setShowResults(true);
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current mx-auto mb-4"></div>
                    <p>Generating Test...</p>
                </div>
            </div>
        );
    }

    // Check if error handling needed? Removed as we generate locally.

    // ... Results View and Answer Sheet View checks stay roughly same but verify AnswerSheet prop ...

    // -- Results View --
    if (showResults) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className={`text-center mb-8 p-8 rounded-2xl ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                        <Check className={`mx-auto mb-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} size={64} />
                        <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
                            {language === 'en' ? 'Test Submitted Successfully!' : '测试提交成功！'}
                        </h2>

                        <div className="text-6xl font-bold text-[#333399] mb-4">
                            {testResult?.score} <span className="text-2xl text-gray-500">/ {testResult?.totalQuestions}</span>
                        </div>

                        <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {language === 'en' ? 'Your Score' : '你的分数'}
                        </p>
                    </div>

                    <button
                        onClick={onBack}
                        className="w-full px-6 py-3 bg-[#333399] text-white rounded-lg hover:bg-[#2a2a7a] transition-colors font-semibold"
                    >
                        {language === 'en' ? 'Back to Dashboard' : '返回仪表盘'}
                    </button>
                </div>
            </div>
        );
    }

    // -- Answer Sheet View --
    if (isAnswerSheetMode) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-100'} py-8`}>
                <AnswerSheet
                    answers={userAnswers}
                    totalQuestions={40}
                    onAnswerChange={handleAnswerChange}
                    onSubmit={handleSubmit}
                    timeLeft={timeRemaining}
                    language={language}
                />
            </div>
        );
    }

    // -- Main Test View --
    const currentSectionData = testData.sections[currentSection];

    const renderQuestionComponent = (question, index) => {
        const commonProps = {
            key: question.id,
            question: question,
            answer: userAnswers[question.id],
            onChange: handleAnswerChange,
            language: language
        };

        // Render based on type
        switch (question.type) {
            case 'note-completion':
                return <NoteCompletion {...commonProps} />;
            case 'note-completion-sub':
                return <NoteCompletionSub {...commonProps} />;
            case 'multiple-response':
                return <MultipleResponse {...commonProps} />;
            case 'multiple-choice':
                return <MultipleChoice {...commonProps} />;
            case 'matching':
                return <Matching {...commonProps} />;
            case 'table-completion':
                return <TableCompletion {...commonProps} />;
            case 'fill-blank':
            default:
                // Fallback or treat as fill-blank
                return <FillBlank {...commonProps} />;
        }
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
            {/* Top Bar with Timer */}
            <div className={`fixed top-0 left-0 right-0 z-50 border-b ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                        <button
                            onClick={onBack}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center sm:justify-start ${isDark ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-100'}`}
                        >
                            <ArrowLeft size={20} />
                            <span>{language === 'en' ? 'Back' : '返回'}</span>
                        </button>

                        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                            {/* Audio Player */}
                            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg flex-1 sm:flex-initial ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                <Volume2 className={isDark ? 'text-[#6b6bff]' : 'text-[#333399]'} size={20} />
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className={`p-1 rounded-full transition-colors ${isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-200 text-black'}`}
                                >
                                    {isPlaying ? <PauseCircle size={22} /> : <PlayCircle size={22} />}
                                </button>
                                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {language === 'en' ? `S${currentSection + 1} Audio` : `第${currentSection + 1}部分音频`}
                                </span>
                            </div>

                            {/* Timer */}
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${timeRemaining < 300
                                ? 'bg-red-500/20 text-red-500'
                                : isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
                                }`}>
                                <Clock size={20} />
                                <span className="font-mono text-sm sm:text-base">{formatTime(timeRemaining)}</span>
                            </div>

                            {/* Skip to Answer Sheet Button (for testing/speed) */}
                            <button
                                onClick={moveToAnswerSheet}
                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-lg border-2 border-emerald-400 shadow-md transition-all"
                            >
                                {language === 'en' ? 'Go to Answer Sheet' : '转到答题纸'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Tabs */}
            <div className={`border-b mt-24 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-1 overflow-x-auto">
                        {testData.sections.map((section, idx) => (
                            <button
                                key={section.id}
                                onClick={() => setCurrentSection(idx)}
                                className={`px-6 py-4 transition-all whitespace-nowrap relative ${currentSection === idx
                                    ? isDark ? 'text-white' : 'text-[#333399]'
                                    : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <span>
                                    {language === 'en' ? `Section ${section.id}` : `第${section.id}部分`}
                                </span>
                                {currentSection === idx && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#333399]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-8 pb-32">
                {/* Section Header */}
                <div className="mb-8">
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
                        {typeof currentSectionData.title === 'object' ? currentSectionData.title[language] : currentSectionData.title}
                    </h2>
                    <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {typeof currentSectionData.description === 'object' ? currentSectionData.description[language] : currentSectionData.description}
                    </p>
                </div>

                {/* Questions */}
                <div className="space-y-8">
                    {currentSectionData.questions.map((question, index) => renderQuestionComponent(question, index))}
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className={`fixed bottom-0 left-0 right-0 border-t ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} shadow-lg`}>
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                            disabled={currentSection === 0}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${currentSection === 0
                                ? 'opacity-50 cursor-not-allowed'
                                : isDark ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'
                                }`}
                        >
                            <ChevronLeft size={20} />
                            <span>{language === 'en' ? 'Previous' : '上一个'}</span>
                        </button>

                        {currentSection < testData.sections.length - 1 ? (
                            <button
                                onClick={() => setCurrentSection(Math.min(testData.sections.length - 1, currentSection + 1))}
                                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#333399] text-white hover:bg-[#2a2a7a] transition-colors"
                            >
                                <span>{language === 'en' ? 'Next' : '下一个'}</span>
                                <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button
                                onClick={moveToAnswerSheet}
                                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold border-2 border-emerald-400 shadow-lg transition-all"
                            >
                                <span className="text-white">{language === 'en' ? 'Go to Answer Sheet' : '转到答题纸'}</span>
                                <ChevronRight size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
