import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Clock, Save, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://localhost:5001/api';

export const WritingTestPage = ({ isDark, language, onBack }) => {
    // State
    const [testData, setTestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [task1Answer, setTask1Answer] = useState('');
    const [task2Answer, setTask2Answer] = useState('');
    const [activeTask, setActiveTask] = useState(1); // 1 or 2

    // Fetch Random Test
    useEffect(() => {
        const fetchTest = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/writing/random`);
                setTestData(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching writing test:', err);
                setError('Failed to load writing test. Please ensure the backend is running.');
                setLoading(false);
            }
        };
        fetchTest();
    }, []);

    // Timer Logic
    useEffect(() => {
        if (loading || isSubmitted || !testData) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleSubmit(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [loading, isSubmitted, testData]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const countWords = (text) => {
        return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
    };

    const handleSubmit = async (auto = false) => {
        if (!auto) {
            const t1Count = countWords(task1Answer);
            const t2Count = countWords(task2Answer);

            if (t1Count === 0 || t2Count === 0) {
                if (!window.confirm('You have not completed both tasks. Do you still want to submit your test?')) {
                    return;
                }
            }
        }

        try {
            const submissionData = {
                testId: testData._id,
                testNumber: testData.testNumber,
                responses: [
                    {
                        taskNumber: 1,
                        essayContent: task1Answer,
                        wordCount: countWords(task1Answer),
                        timeTaken: Math.max(0, (60 * 60) - timeLeft)
                    },
                    {
                        taskNumber: 2,
                        essayContent: task2Answer,
                        wordCount: countWords(task2Answer),
                        timeTaken: 0
                    }
                ]
            };

            await axios.post(`${API_BASE_URL}/writing/submit`, submissionData);
            setIsSubmitted(true);
        } catch (err) {
            console.error('Error submitting test:', err);
            alert('Failed to submit test. Please check your connection.');
        }
    };

    if (loading) {
        return (
            <div className={`flex flex-col items-center justify-center h-screen ${isDark ? 'bg-[#0f172a] text-white' : 'bg-slate-50 text-slate-900'}`}>
                <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                <p className="text-xl font-medium tracking-tight opacity-70">Initializing Exam Environment...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex flex-col items-center justify-center h-screen ${isDark ? 'bg-[#0f172a] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
                <div className={`p-8 rounded-2xl text-center max-w-md border shadow-xl ${isDark ? 'bg-slate-900/50 border-red-500/20' : 'bg-red-50 border-red-100'}`}>
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-red-400' : 'text-red-900'}`}>Technical Error</h2>
                    <p className={`mb-6 ${isDark ? 'text-white' : 'text-red-700'}`}>{error}</p>
                    <button onClick={onBack} className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors">
                        Return to Panel
                    </button>
                </div>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-6 ${isDark ? 'bg-[#0f172a]' : 'bg-slate-50'}`}>
                <div className={`p-10 rounded-3xl shadow-2xl max-w-2xl w-full text-center ${isDark ? 'bg-[#1e293b] text-white border border-slate-700/50' : 'bg-white text-slate-900'}`}>
                    <div className="mx-auto bg-green-500/10 w-24 h-24 rounded-full flex items-center justify-center mb-8">
                        <CheckCircle className="w-14 h-14 text-green-500" />
                    </div>
                    <h2 className="text-4xl font-black mb-4 tracking-tight">Test Completed</h2>
                    <p className="opacity-70 mb-10 text-xl leading-relaxed">Your IELTS Writing test has been submitted successfully for evaluation.</p>

                    <div className="grid grid-cols-2 gap-6 mb-12">
                        <div className={`p-8 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-blue-50/50 border-blue-100'}`}>
                            <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-2">Task 1 Word Count</p>
                            <p className="text-4xl font-black text-blue-500">{countWords(task1Answer)}</p>
                        </div>
                        <div className={`p-8 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-purple-50/50 border-purple-100'}`}>
                            <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-2">Task 2 Word Count</p>
                            <p className="text-4xl font-black text-purple-500">{countWords(task2Answer)}</p>
                        </div>
                    </div>

                    <button onClick={onBack} className="w-full py-5 bg-blue-600 text-white font-black text-lg rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25">
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const currentTask = testData.tasks.find(t => t.taskNumber === activeTask);

    return (
        <div className={`h-screen flex flex-col overflow-hidden font-sans ${isDark ? 'bg-[#0f172a] text-white' : 'bg-slate-100 text-slate-900'}`}>
            {/* Exam Header */}
            <header className={`h-20 px-8 flex items-center justify-between border-b-2 z-50 transition-colors ${isDark ? 'bg-[#1e293b] border-slate-700/50 shadow-lg' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className={`p-3 rounded-xl transition-all ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-600 hover:text-blue-600'}`}>
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">{testData.bookTitle}</h1>
                        <p className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-500 opacity-60'}`}>Writing Test {testData.testNumber}</p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    {/* Task Toggle Buttons */}
                    <div className="hidden md:flex bg-slate-200/50 dark:bg-slate-900/30 p-1.5 rounded-2xl border border-slate-300/30 dark:border-slate-800">
                        <button
                            onClick={() => setActiveTask(1)}
                            className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTask === 1 ? (isDark ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-blue-700 shadow-md') : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                        >
                            Task 1
                        </button>
                        <button
                            onClick={() => setActiveTask(2)}
                            className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTask === 2 ? (isDark ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-blue-700 shadow-md') : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                        >
                            Task 2
                        </button>
                    </div>

                    <div className={`flex items-center gap-4 px-6 py-2.5 rounded-2xl font-mono text-3xl font-black border-2 transition-all ${timeLeft < 300 ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                        <Clock className="w-7 h-7" />
                        {formatTime(timeLeft)}
                    </div>

                    <button
                        onClick={() => handleSubmit(false)}
                        className={`px-8 py-3.5 text-white font-black rounded-xl transition-all font-sans flex items-center gap-3 shadow-lg hover:scale-105 active:scale-95 ${isDark ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20' : 'bg-[#333399] hover:bg-[#4444aa] shadow-indigo-900/10'}`}
                    >
                        <Save className="w-5 h-5 flex-shrink-0" />
                        <span className="whitespace-nowrap">Finish & Submit</span>
                    </button>
                </div>
            </header>

            {/* Split Screen Layout */}
            <main className="flex-1 flex flex-row overflow-hidden">
                {/* Left Side: Question Section (50%) */}
                <section className={`w-[0%] flex flex-col overflow-y-auto border-r-2 transition-colors ${isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-slate-50/50 border-slate-200'}`}>
                    <div className="p-8 lg:p-12 space-y-8">
                        {/* Task Header & Instructions */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <h2 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Writing Task {activeTask}
                                </h2>
                                <div className="flex gap-6">
                                    <div className="flex flex-col items-end">
                                        <span className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Target</span>
                                        <span className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentTask.wordLimit}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Instructions Box */}
                            <div className={`p-6 rounded-2xl border-l-4 shadow-md transition-all ${isDark ? 'bg-slate-800/40 border-blue-500 text-slate-300' : 'bg-white border-blue-600 text-slate-600'}`}>
                                <h4 className="text-[9px] font-black uppercase tracking-widest text-blue-500 mb-2">Instructions</h4>
                                <p className="text-lg leading-relaxed font-medium">{currentTask.instructions}</p>
                            </div>
                        </div>

                        {/* The Question Prompt */}
                        <div className="space-y-4">
                            <h3 className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Question Prompt</h3>
                            <p className={`text-xl lg:text-2xl font-bold leading-snug tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {currentTask.prompt}
                            </p>
                        </div>

                        {/* Visual Stimulus (Image) - Optimized for half screen */}
                        {currentTask.chartData?.imageUrl && (
                            <div className="space-y-4">
                                <h3 className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Visual Reference</h3>
                                <div className={`p-4 rounded-3xl border-2 transition-all overflow-hidden ${isDark ? 'bg-white/5 border-slate-700/50' : 'bg-white border-slate-200 shadow-lg'}`}>
                                    <img
                                        src={`http://localhost:5001/Writing${currentTask.chartData.imageUrl}`}
                                        alt="Task Data Visualization"
                                        className={`w-[85%] max-h-[260px] mx-auto object-contain rounded-xl ${isDark ? 'opacity-90 contrast-125' : ''}`}
                                    />
                                    {currentTask.chartData.title && (
                                        <p className="text-center mt-4 text-xs font-bold opacity-60 italic tracking-tight">{currentTask.chartData.title}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Specific Sub-questions for Task 2 */}
                        {currentTask.specificQuestions && currentTask.specificQuestions.length > 0 && (
                            <div className={`p-8 rounded-2xl border-2 space-y-4 transition-all ${isDark ? 'bg-slate-900/30 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                <h4 className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Questions to Address</h4>
                                <ul className="space-y-3">
                                    {currentTask.specificQuestions.map((q, i) => (
                                        <li key={i} className="flex gap-4 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 flex-shrink-0"></div>
                                            <span className={`text-lg font-bold leading-relaxed ${isDark ? 'text-white' : 'text-slate-700'}`}>{q}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="h-12"></div>
                    </div>
                </section>

                {/* Right Side: Response Section (50%) */}
                <section className={`w-[10%] flex flex-col relative transition-colors ${isDark ? 'bg-[#020617]' : 'bg-white'}`}>

                    {/* Sticky Word Counter Bar */}
                    <div className={`flex items-center justify-between px-10 py-6 border-b z-10 sticky top-0 backdrop-blur-md transition-all ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50/90 border-slate-200'}`}>
                        <div className="flex items-center gap-4">
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-white' : 'opacity-40'}`}>Live Analysis</span>
                            <div className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${countWords(activeTask === 1 ? task1Answer : task2Answer) >= (activeTask === 1 ? 150 : 250) ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                {activeTask === 1 ? 'Task 1: Target 150' : 'Task 2: Target 250'}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] block ${isDark ? 'text-white' : 'opacity-40'}`}>Words Written</span>
                                </div>
                                <span className={`text-3xl font-black font-mono transition-all ${countWords(activeTask === 1 ? task1Answer : task2Answer) >= (activeTask === 1 ? 150 : 250) ? 'text-green-500' : 'text-blue-500'}`}>
                                    {countWords(activeTask === 1 ? task1Answer : task2Answer)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Editor Area */}
                    <div className="flex-1 flex flex-col p-10 lg:p-14 overflow-hidden">
                        <div className={`flex-1 flex flex-col p-8 rounded-3xl border-2 transition-all duration-300 ${isDark
                            ? 'bg-slate-900/40 border-slate-800 focus-within:border-blue-500/50 focus-within:bg-slate-900 focus-within:shadow-[0_0_50px_-12px_rgba(59,130,246,0.25)]'
                            : 'bg-white border-slate-200 focus-within:border-blue-600 focus-within:shadow-2xl shadow-blue-900/5'
                            }`}>
                            <textarea
                                value={activeTask === 1 ? task1Answer : task2Answer}
                                onChange={(e) => activeTask === 1 ? setTask1Answer(e.target.value) : setTask2Answer(e.target.value)}
                                placeholder={`Concentrate and write your response here...`}
                                spellCheck="false"
                                autoFocus
                                className={`flex-1 w-full bg-transparent resize-none focus:outline-none text-xl lg:text-2xl font-serif font-medium leading-relaxed tracking-tight placeholder:opacity-20 caret-blue-500 ${isDark ? 'text-white selection:bg-blue-500/30' : 'text-slate-800 selection:bg-blue-200'}`}
                            />
                        </div>
                    </div>

                    {/* Tip Bar */}
                    <div className={`px-10 py-4 text-[9px] font-black uppercase tracking-[0.4em] opacity-20 text-center ${isDark ? 'border-t border-slate-800' : 'border-t border-slate-100'}`}>
                        Secure IELTS Test Interface • Professional Exam Mode
                    </div>
                </section>
            </main>

            {/* Mobile Task Switcher */}
            <div className={`lg:hidden flex p-3 gap-2 border-t z-50 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <button
                    onClick={() => setActiveTask(1)}
                    className={`flex-1 py-4 font-black rounded-2xl transition-all uppercase tracking-widest text-xs ${activeTask === 1 ? 'bg-blue-600 text-white shadow-lg' : 'opacity-40 text-slate-500'}`}
                >
                    Task 1
                </button>
                <button
                    onClick={() => setActiveTask(2)}
                    className={`flex-1 py-4 font-black rounded-2xl transition-all uppercase tracking-widest text-xs ${activeTask === 2 ? 'bg-blue-600 text-white shadow-lg' : 'opacity-40 text-slate-500'}`}
                >
                    Task 2
                </button>
            </div>
        </div>
    );
};

export default WritingTestPage;
