import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Clock,
    ChevronLeft,
    ChevronRight,
    Check,
    BookOpen,
    FileText,
    AlertCircle
} from 'lucide-react';
import { translations } from '../translations';

// Import refined renderer
import ReadingQuestionRenderer from './reading/ReadingQuestionRenderer';

export function ReadingTestPage({ isDark, language, onBack }) {
    const t = translations[language];

    // Test State
    const [testData, setTestData] = useState(null);
    const [currentPassage, setCurrentPassage] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Timer: 60 minutes (3600s) for reading phase
    const [timeRemaining, setTimeRemaining] = useState(60 * 60);
    const [isAnswerSheetMode, setIsAnswerSheetMode] = useState(false);

    const [showResults, setShowResults] = useState(false);
    const [testResult, setTestResult] = useState(null);
    const [showInstructions, setShowInstructions] = useState(true);

    // Fetch Random Test from Backend
    useEffect(() => {
        const fetchTest = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('http://127.0.0.1:5001/api/reading/random');
                if (!response.ok) throw new Error('Failed to fetch reading test');
                const data = await response.json();
                setTestData(data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching reading test:', err);
                setError(err.message);
                setIsLoading(false);
            }
        };
        fetchTest();
    }, []);

    // Timer Logic
    useEffect(() => {
        if (!testData || showResults || showInstructions) return;

        if (timeRemaining > 0) {
            const timer = setTimeout(() => setTimeRemaining(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            // Auto-submit on time up
            handleSubmit();
        }
    }, [timeRemaining, showResults, showInstructions, testData]);


    const handleAnswerChange = (qNumber, value) => {
        setUserAnswers(prev => ({ ...prev, [qNumber]: value }));
    };

    const handleNextPassage = () => {
        if (currentPassage < testData.passages.length - 1) {
            setCurrentPassage(currentPassage + 1);
        }
    };

    const handlePreviousPassage = () => {
        if (currentPassage > 0) {
            setCurrentPassage(currentPassage - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5001/api/reading/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    testNumber: testData.testNumber,
                    answers: userAnswers
                })
            });
            const result = await response.json();
            setTestResult(result);
            setShowResults(true);
        } catch (err) {
            console.error('Error submitting test:', err);
            alert('Failed to submit test. Please try again.');
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading) return (
        <div className={`flex h-screen items-center justify-center ${isDark ? 'bg-[#1a1a2e] text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#333399] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xl font-medium">Loading Reading Test...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex h-screen items-center justify-center bg-red-50 text-red-600 p-8">
            <div className="text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4" />
                <p className="text-xl font-bold mb-4">{error}</p>
                <button onClick={onBack} className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold">Back to Dashboard</button>
            </div>
        </div>
    );

    // -- Sub-Render Functions --

    if (!testData) return (
        <div className={`flex h-screen items-center justify-center ${isDark ? 'bg-[#1a1a2e] text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xl font-medium">Generating Personalised Test...</p>
            </div>
        </div>
    );

    if (showInstructions) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#1a1a2e] text-white' : 'bg-gray-50 text-gray-900'}`}>
                <div className="max-w-3xl w-full px-6">
                    <div className={`p-8 md:p-12 rounded-3xl shadow-2xl ${isDark ? 'bg-[#252545]' : 'bg-white'}`}>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 bg-blue-100 rounded-2xl">
                                <BookOpen className="w-8 h-8 text-blue-700" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold">{language === 'en' ? 'IELTS Reading Test' : 'IELTS 阅读测试'}</h1>
                        </div>

                        <div className="space-y-6 text-lg leading-relaxed opacity-90 mb-10">
                            <p>
                                {language === 'en'
                                    ? `This test consists of ${testData.passages.length} passages with a total of ${testData.totalQuestions} questions.`
                                    : `该测试包含 ${testData.passages.length} 篇文章，共 ${testData.totalQuestions} 道题。`}
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3">
                                    <Clock className="w-6 h-6 text-blue-500" />
                                    <span>
                                        <strong>60 minutes</strong> {language === 'en' ? 'for reading and answering.' : '用于阅读和回答。'}
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-green-500" />
                                    <span>
                                        <strong>10 minutes</strong> {language === 'en' ? 'transfer time to fill the answer sheet.' : '用于填写答题纸的誊写时间。'}
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <AlertCircle className="w-6 h-6 text-orange-500" />
                                    <span>
                                        {language === 'en' ? 'All answers must be transferred to the answer sheet to be counted.' : '所有答案必须誊写到答题纸上才算分。'}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={() => setShowInstructions(false)}
                            className="w-full py-5 bg-[#5555ff] text-white rounded-2xl text-xl font-bold hover:bg-[#4444dd] transform transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
                        >
                            {language === 'en' ? 'Start Test' : '开始测试'} <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (showResults) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#1a1a2e] text-white' : 'bg-gray-50 text-gray-900'}`}>
                <div className="max-w-2xl w-full px-6 text-center">
                    <div className={`p-10 rounded-3xl shadow-2xl ${isDark ? 'bg-[#252545]' : 'bg-white'}`}>
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-12 h-12 text-green-600" />
                        </div>
                        <h1 className="text-4xl font-bold mb-2">{language === 'en' ? 'Test Completed' : '测试完成'}</h1>
                        <p className="text-gray-500 mb-8">{language === 'en' ? 'Here is your estimated band score.' : '这是您的预估分数。'}</p>

                        <div className="mb-10">
                            <div className="text-7xl font-bold text-[#5555ff] mb-2">
                                {testResult.score} <span className="text-4xl text-gray-400">/ 40</span>
                            </div>
                            <p className="text-xl font-medium opacity-80">
                                {language === 'en' ? 'Raw Score' : '原始分数'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                                <p className="text-sm text-gray-500 mb-1">Band Score Estimate</p>
                                <p className="text-2xl font-bold">{(testResult.score / 40 * 9).toFixed(1)}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                                <p className="text-sm text-gray-500 mb-1">Accuracy</p>
                                <p className="text-2xl font-bold">{Math.round((testResult.score / 40) * 100)}%</p>
                            </div>
                        </div>

                        <button onClick={onBack} className="w-full py-4 bg-gray-200 text-gray-800 rounded-xl font-bold hover:bg-gray-300 transition-colors">
                            {language === 'en' ? 'Return to Dashboard' : '返回仪表板'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isAnswerSheetMode) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-100'} py-8`}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Answer Sheet
                        </h2>
                        <div className="text-red-500 font-mono text-xl bg-red-50 px-4 py-2 rounded-lg border border-red-100">
                            {formatTime(answerSheetTime)}
                        </div>
                    </div>
                    <AnswerSheet
                        answers={userAnswers}
                        totalQuestions={testData.totalQuestions}
                        onAnswerChange={handleAnswerChange}
                        onSubmit={handleSubmit}
                        timeLeft={answerSheetTime}
                        language={language}
                    />
                </div>
            </div>
        );
    }

    // -- Main Reading Interface --
    const currentPassageData = testData.passages[currentPassage];

    return (
        <div className={`h-screen flex flex-col overflow-hidden ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50'}`}>
            {/* Top Bar */}
            <div className={`flex-shrink-0 h-16 flex items-center justify-between px-6 shadow-md z-20 ${isDark ? 'bg-[#252545] text-white' : 'bg-white text-gray-900'}`}>
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100/10 rounded-full transition"><ArrowLeft className="w-6 h-6" /></button>
                    <h1 className="font-bold text-lg hidden sm:block">{testData.bookTitle} - Test {testData.testNumber}</h1>
                    <div className="flex gap-1">
                        {testData.passages.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2.5 h-2.5 rounded-full ${idx === currentPassage ? 'bg-[#333399]' : 'bg-gray-300'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${timeRemaining < 300 ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-200 text-gray-700 bg-gray-50'}`}>
                    <Clock className="w-5 h-5" />
                    <span className="font-mono font-bold text-xl tracking-widest">{formatTime(timeRemaining)}</span>
                </div>

                <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 text-sm font-bold bg-[#333399] hover:bg-[#4444aa] text-white px-5 py-3 rounded-lg transition-all shadow-lg"
                >
                    <Check className="w-5 h-5" />
                    <span>{language === 'en' ? 'Submit Test' : '提交测试'}</span>
                </button>
            </div>

            {/* Split Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Passage - LEFT 50% */}
                <div
                    className={`
                        flex-1 w-1/2 min-w-0 overflow-y-auto 
                        border-r ${isDark ? 'border-gray-700' : 'border-gray-200'}
                        ${isDark ? 'bg-[#1a1a2e] text-gray-300' : 'bg-white text-gray-800'}
                        p-6 lg:p-10
                    `}
                >
                    <div className="max-w-4xl mx-auto prose prose-blue font-serif leading-relaxed">
                        <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-[#333399] border-b-4 border-[#333399] pb-2 inline-block">
                            {currentPassageData.title}
                        </h2>
                        {currentPassageData.content.split('\n').map((para, i) => (
                            para.trim() && <p key={i} className="mb-6 indent-8 text-justify">{para}</p>
                        ))}
                    </div>
                </div>

                {/* Questions - RIGHT 50% */}
                <div
                    className={`
                        flex-1 w-1/2 min-w-0 overflow-y-auto 
                        ${isDark ? 'bg-[#202030]' : 'bg-gray-50/50'}
                        p-6 lg:p-10
                    `}
                >
                    <div className="max-w-4xl mx-auto space-y-12">
                        {currentPassageData.questionGroups?.map((group, groupIdx) => (
                            <div key={groupIdx} className="border-b border-gray-200 pb-8 last:border-0">
                                <ReadingQuestionRenderer
                                    group={group}
                                    userAnswers={userAnswers}
                                    onAnswerChange={handleAnswerChange}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Nav */}
            <div className={`flex-shrink-0 h-20 flex items-center justify-between px-6 border-t z-20 ${isDark ? 'bg-[#252545] border-gray-700' : 'bg-white border-gray-200'}`}>
                <button
                    onClick={handlePreviousPassage}
                    disabled={currentPassage === 0}
                    className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all ${currentPassage === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100 hover:scale-105'}`}
                >
                    <ChevronLeft className="w-5 h-5 mr-1" /> {language === 'en' ? 'Previous Passage' : '上一篇'}
                </button>

                <div className="flex gap-2">
                    {[0, 1, 2].map(idx => (
                        <button
                            key={idx}
                            onClick={() => setCurrentPassage(idx)}
                            className={`w-10 h-10 rounded-lg font-bold transition-all ${currentPassage === idx ? 'bg-[#333399] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>

                {currentPassage < 2 ? (
                    <button
                        onClick={handleNextPassage}
                        className="flex items-center px-8 py-3 rounded-xl bg-[#333399] text-white font-bold hover:bg-[#4444aa] hover:shadow-lg hover:scale-105 transition-all"
                    >
                        {language === 'en' ? 'Next Passage' : '下一篇'} <ChevronRight className="w-5 h-5 ml-1" />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        className="flex items-center px-8 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 hover:shadow-lg hover:scale-105 transition-all"
                    >
                        {language === 'en' ? 'Finish & Submit' : '完成并提交'} <Check className="w-5 h-5 ml-1" />
                    </button>
                )}
            </div>
        </div>
    );
}
