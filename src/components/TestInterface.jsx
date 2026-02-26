import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, Check, X, PlayCircle, PauseCircle, ChevronRight } from 'lucide-react';
import { getRandomTest, calculateBandScore } from '../testDatabase';
import { translations } from '../translations';
import { AudioUploadHelper } from './AudioUploadHelper';

export function TestInterface({ isDark, language, onBack }) {
    const t = translations[language];
    const [currentStep, setCurrentStep] = useState('select-mode');
    const [testMode, setTestMode] = useState('individual');
    const [testType, setTestType] = useState('Academic');
    const [selectedSection, setSelectedSection] = useState(null);
    const [fullTestSections, setFullTestSections] = useState(['listening', 'reading', 'writing', 'speaking']);
    const [currentFullTestIndex, setCurrentFullTestIndex] = useState(0);
    const [currentTest, setCurrentTest] = useState(null);
    const [allTests, setAllTests] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [allSectionAnswers, setAllSectionAnswers] = useState({
        listening: {},
        reading: {},
        writing: {},
        speaking: {}
    });
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [testStarted, setTestStarted] = useState(false);
    const [writingText, setWritingText] = useState({});
    const [currentSection, setCurrentSection] = useState(0);
    const [completedSections, setCompletedSections] = useState([]);
    const [audioPlayed, setAudioPlayed] = useState(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [audioCurrentTime, setAudioCurrentTime] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
    const [currentWritingTask, setCurrentWritingTask] = useState(0); // 0 for Task 1, 1 for Task 2
    const [writingAnswers, setWritingAnswers] = useState({ task1: '', task2: '' });
    const [currentSpeakingPart, setCurrentSpeakingPart] = useState(0); // 0 for Part 1, 1 for Part 2, 2 for Part 3
    const [speakingPart2Preparation, setSpeakingPart2Preparation] = useState(true);
    const [preparationTimeRemaining, setPreparationTimeRemaining] = useState(60);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedAnswers, setRecordedAnswers] = useState({});
    const [audioRef, setAudioRef] = useState(null);

    // Timer effect
    useEffect(() => {
        if (testStarted && timeRemaining > 0 && currentStep === 'taking-test') {
            const timer = setTimeout(() => {
                setTimeRemaining(timeRemaining - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeRemaining === 0 && testStarted) {
            handleSubmitTest();
        }
    }, [timeRemaining, testStarted, currentStep]);



    // Preparation timer for Speaking Part 2
    useEffect(() => {
        if (
            selectedSection === 'speaking' &&
            currentSpeakingPart === 1 &&
            speakingPart2Preparation &&
            preparationTimeRemaining > 0
        ) {
            const prepTimer = setTimeout(() => {
                setPreparationTimeRemaining(preparationTimeRemaining - 1);
            }, 1000);
            return () => clearTimeout(prepTimer);
        } else if (
            selectedSection === 'speaking' &&
            currentSpeakingPart === 1 &&
            speakingPart2Preparation &&
            preparationTimeRemaining === 0
        ) {
            setSpeakingPart2Preparation(false);
        }
    }, [selectedSection, currentSpeakingPart, speakingPart2Preparation, preparationTimeRemaining]);

    // Initialize audio element for listening section
    useEffect(() => {
        if (selectedSection === 'listening' && !audioRef) {
            const audio = new Audio();
            audio.addEventListener('loadedmetadata', () => {
                setAudioDuration(Math.floor(audio.duration));
            });
            audio.addEventListener('timeupdate', () => {
                setAudioCurrentTime(Math.floor(audio.currentTime));
            });
            audio.addEventListener('ended', () => {
                setIsAudioPlaying(false);
            });
            audio.addEventListener('play', () => {
                setIsAudioPlaying(true);
            });
            audio.addEventListener('pause', () => {
                setIsAudioPlaying(false);
            });
            audio.addEventListener('error', () => {
                // Silently handle missing audio - user will see the visual indicator
                setIsAudioPlaying(false);
            });
            setAudioRef(audio);
        }

        return () => {
            if (audioRef) {
                audioRef.pause();
                audioRef.src = '';
            }
        };
    }, [selectedSection]);

    // Update audio source when section changes
    useEffect(() => {
        if (selectedSection === 'listening' && audioRef && currentSection >= 0) {
            const audioPath = `/audio/listening/section${currentSection + 1}.mp3`;

            // Check if file exists before loading
            fetch(audioPath, { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        // File exists, load it
                        audioRef.src = audioPath;
                        audioRef.load();
                    } else {
                        // File doesn't exist, don't try to load
                        audioRef.src = '';
                        setAudioDuration(0);
                    }
                })
                .catch(() => {
                    // Network error or file doesn't exist
                    audioRef.src = '';
                    setAudioDuration(0);
                });

            setAudioPlayed(false);
            setIsAudioPlaying(false);
            setAudioCurrentTime(0);
        }
    }, [currentSection, audioRef, selectedSection]);

    const handleSelectTestMode = (mode) => {
        setTestMode(mode);
        if (mode === 'full') {
            setCurrentStep('select-type');
        } else {
            setCurrentStep('select-type');
        }
    };

    const handleSelectTestType = (type) => {
        setTestType(type);
        if (testMode === 'full') {
            // For full test, start with the first section automatically
            setSelectedSection('listening');
            const test = getRandomTest('listening', type);
            setCurrentTest(test);
            setCurrentStep('test-intro');
        } else {
            setCurrentStep('select-section');
        }
    };

    const handleSelectSection = (section) => {
        setSelectedSection(section);
        const test = getRandomTest(section, testType);
        setCurrentTest(test);
        setCurrentStep('test-intro');
    };

    const handleStartTest = () => {
        setTestStarted(true);
        setCurrentStep('taking-test');

        // Set time based on section
        if (selectedSection === 'listening') {
            setTimeRemaining(40 * 60); // 40 minutes (30 + 10 transfer)
        } else if (selectedSection === 'reading') {
            setTimeRemaining(60 * 60); // 60 minutes
        } else if (selectedSection === 'writing') {
            setTimeRemaining(60 * 60); // 60 minutes
        } else if (selectedSection === 'speaking') {
            setTimeRemaining(14 * 60); // 14 minutes
        }
    };

    const handleAnswerChange = (questionId, answer) => {
        setUserAnswers({
            ...userAnswers,
            [questionId]: answer
        });
    };

    const handleSubmitTest = () => {
        if (testMode === 'full') {
            // Save answers for the current section
            setAllSectionAnswers(prev => ({
                ...prev,
                [selectedSection]: userAnswers
            }));
            // Mark the section as completed
            setCompletedSections(prev => [...prev, selectedSection]);
            // Move to the next section
            if (currentFullTestIndex < fullTestSections.length - 1) {
                setCurrentFullTestIndex(currentFullTestIndex + 1);
                const nextSection = fullTestSections[currentFullTestIndex + 1];
                setSelectedSection(nextSection);
                const test = getRandomTest(nextSection, testType);
                setCurrentTest(test);
                setCurrentStep('test-intro');
                setUserAnswers({});
                setCurrentQuestionIndex(0);
                setCurrentSection(0);
            } else {
                setCurrentStep('results');
                setTestStarted(false);
            }
        } else {
            setCurrentStep('results');
            setTestStarted(false);
        }
    };

    const calculateScore = () => {
        if (!currentTest) return { correct: 0, total: 0, band: 0 };

        let correct = 0;
        let total = 0;

        if (selectedSection === 'listening') {
            currentTest.sections.forEach((section) => {
                section.questions.forEach((q) => {
                    total++;
                    const userAnswer = userAnswers[q.id]?.toLowerCase().trim();
                    const correctAnswer = q.answer.toLowerCase().trim();
                    if (userAnswer === correctAnswer) {
                        correct++;
                    }
                });
            });
        } else if (selectedSection === 'reading') {
            currentTest.passages.forEach((passage) => {
                passage.questions.forEach((q) => {
                    total++;
                    const userAnswer = userAnswers[q.id]?.toLowerCase().trim();
                    const correctAnswer = q.answer.toLowerCase().trim();
                    if (userAnswer === correctAnswer) {
                        correct++;
                    }
                });
            });
        }

        const band = calculateBandScore(correct, total);
        return { correct, total, band };
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getWordCount = (text) => {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    const getCurrentQuestions = () => {
        if (selectedSection === 'listening') {
            return currentTest?.sections[currentSection]?.questions || [];
        } else if (selectedSection === 'reading') {
            return currentTest?.passages[currentSection]?.questions || [];
        } else if (selectedSection === 'writing') {
            return currentTest?.tasks || [];
        } else if (selectedSection === 'speaking') {
            return currentTest?.parts[currentSection]?.questions || [];
        }
        return [];
    };

    // Test Mode Selection
    if (currentStep === 'select-mode') {
        return (
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                <button
                    onClick={onBack}
                    className={`mb-6 flex items-center gap-2 text-sm ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'
                        }`}
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>

                <div className={`p-6 sm:p-8 rounded-xl ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                    }`}>
                    <h2 className={`text-2xl sm:text-3xl mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Select Test Mode
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => handleSelectTestMode('individual')}
                            className={`p-6 rounded-lg border-2 transition-all hover:scale-105 ${isDark
                                    ? 'border-[#333399] hover:bg-[#333399]/20 text-white'
                                    : 'border-[#333399] hover:bg-[#333399]/10 text-gray-900'
                                }`}
                        >
                            <h3 className="text-xl mb-2">Individual Section</h3>
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                Practice a single section of the IELTS test
                            </p>
                        </button>

                        <button
                            onClick={() => handleSelectTestMode('full')}
                            className={`p-6 rounded-lg border-2 transition-all hover:scale-105 ${isDark
                                    ? 'border-[#333399] hover:bg-[#333399]/20 text-white'
                                    : 'border-[#333399] hover:bg-[#333399]/10 text-gray-900'
                                }`}
                        >
                            <h3 className="text-xl mb-2">Full Test</h3>
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                Practice all sections of the IELTS test
                            </p>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Test Type Selection
    if (currentStep === 'select-type') {
        return (
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                <button
                    onClick={() => setCurrentStep('select-mode')}
                    className={`mb-6 flex items-center gap-2 text-sm ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'
                        }`}
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>

                <div className={`p-6 sm:p-8 rounded-xl ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                    }`}>
                    <h2 className={`text-2xl sm:text-3xl mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Select Test Type
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => handleSelectTestType('Academic')}
                            className={`p-6 rounded-lg border-2 transition-all hover:scale-105 ${isDark
                                    ? 'border-[#333399] hover:bg-[#333399]/20 text-white'
                                    : 'border-[#333399] hover:bg-[#333399]/10 text-gray-900'
                                }`}
                        >
                            <h3 className="text-xl mb-2">IELTS Academic</h3>
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                For those applying to higher education or professional registration
                            </p>
                        </button>

                        <button
                            onClick={() => handleSelectTestType('General Training')}
                            className={`p-6 rounded-lg border-2 transition-all hover:scale-105 ${isDark
                                    ? 'border-[#333399] hover:bg-[#333399]/20 text-white'
                                    : 'border-[#333399] hover:bg-[#333399]/10 text-gray-900'
                                }`}
                        >
                            <h3 className="text-xl mb-2">IELTS General Training</h3>
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                For those migrating to English-speaking countries or applying for work experience
                            </p>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Section Selection
    if (currentStep === 'select-section') {
        return (
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                <button
                    onClick={() => setCurrentStep('select-type')}
                    className={`mb-6 flex items-center gap-2 text-sm ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'
                        }`}
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>

                <div className={`p-6 sm:p-8 rounded-xl ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                    }`}>
                    <h2 className={`text-2xl sm:text-3xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Select Test Section
                    </h2>
                    <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {testType} - Choose a section to practice
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => handleSelectSection('listening')}
                            className={`p-6 rounded-lg transition-all hover:scale-105 ${isDark ? 'bg-[#1a1a2e] hover:bg-[#333399]/20' : 'bg-gray-50 hover:bg-[#333399]/10'
                                }`}
                        >
                            <h3 className={`text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                🎧 Listening
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                4 sections • 40 questions • ~40 minutes
                            </p>
                        </button>

                        <button
                            onClick={() => handleSelectSection('reading')}
                            className={`p-6 rounded-lg transition-all hover:scale-105 ${isDark ? 'bg-[#1a1a2e] hover:bg-[#333399]/20' : 'bg-gray-50 hover:bg-[#333399]/10'
                                }`}
                        >
                            <h3 className={`text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                📖 Reading
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                3 passages • 40 questions • 60 minutes
                            </p>
                        </button>

                        <button
                            onClick={() => handleSelectSection('writing')}
                            className={`p-6 rounded-lg transition-all hover:scale-105 ${isDark ? 'bg-[#1a1a2e] hover:bg-[#333399]/20' : 'bg-gray-50 hover:bg-[#333399]/10'
                                }`}
                        >
                            <h3 className={`text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                ✍️ Writing
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                2 tasks • 60 minutes total
                            </p>
                        </button>

                        <button
                            onClick={() => handleSelectSection('speaking')}
                            className={`p-6 rounded-lg transition-all hover:scale-105 ${isDark ? 'bg-[#1a1a2e] hover:bg-[#333399]/20' : 'bg-gray-50 hover:bg-[#333399]/10'
                                }`}
                        >
                            <h3 className={`text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                🎤 Speaking
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                3 parts • 11-14 minutes
                            </p>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Test Introduction
    if (currentStep === 'test-intro' && currentTest) {
        return (
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                <button
                    onClick={() => setCurrentStep('select-section')}
                    className={`mb-6 flex items-center gap-2 text-sm ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'
                        }`}
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>

                <div className={`p-6 sm:p-8 rounded-xl ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                    }`}>
                    <h2 className={`text-2xl sm:text-3xl mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {selectedSection?.charAt(0).toUpperCase() + selectedSection?.slice(1)} Test
                    </h2>
                    <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {testType}
                    </p>

                    {/* Audio Status for Listening */}
                    {selectedSection === 'listening' && (
                        <div className="mb-6">
                            <AudioUploadHelper isDark={isDark} />
                        </div>
                    )}

                    <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50'
                        }`}>
                        <h3 className={`text-lg mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Test Structure:
                        </h3>

                        {selectedSection === 'listening' && (
                            <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                <li>✓ 4 sections with 10 questions each (40 total)</li>
                                <li>✓ Audio played once only</li>
                                <li>✓ ~30 minutes listening + 10 minutes transfer time</li>
                                <li>✓ Various question types: completion, multiple choice, matching</li>
                            </ul>
                        )}

                        {selectedSection === 'reading' && (
                            <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                <li>✓ 3 passages with 40 questions total</li>
                                <li>✓ 60 minutes (20 minutes per passage recommended)</li>
                                <li>✓ Question types: True/False/Not Given, multiple choice, matching, completion</li>
                                <li>✓ {testType === 'Academic' ? 'Academic texts from journals and books' : 'Everyday and work-related texts'}</li>
                            </ul>
                        )}

                        {selectedSection === 'writing' && (
                            <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                <li>✓ Task 1: {testType === 'Academic' ? 'Describe visual information (150 words, 20 mins)' : 'Write a letter (150 words, 20 mins)'}</li>
                                <li>✓ Task 2: Write an essay (250 words, 40 mins)</li>
                                <li>✓ Task 2 carries more weight in scoring</li>
                            </ul>
                        )}

                        {selectedSection === 'speaking' && (
                            <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                <li>✓ Part 1: Introduction & Interview (4-5 mins)</li>
                                <li>✓ Part 2: Long Turn with cue card (3-4 mins)</li>
                                <li>✓ Part 3: Discussion (4-5 mins)</li>
                                <li>✓ Total: 11-14 minutes</li>
                            </ul>
                        )}
                    </div>

                    <button
                        onClick={handleStartTest}
                        className="w-full py-3 rounded-lg bg-[#333399] text-white hover:bg-[#4444aa] transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <PlayCircle className="w-5 h-5" />
                        Start Test
                    </button>
                </div>
            </div>
        );
    }

    // Taking Test
    if (currentStep === 'taking-test' && currentTest) {
        const questions = getCurrentQuestions();
        const currentQuestion = questions[currentQuestionIndex];

        return (
            <div className="max-w-6xl mx-auto p-4 sm:p-6">
                {/* Timer and Progress */}
                <div className={`sticky top-0 z-10 p-4 rounded-lg mb-4 ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                    }`}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </span>
                            {selectedSection === 'listening' && (
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Section {currentSection + 1} of 4
                                </span>
                            )}
                            {selectedSection === 'reading' && (
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Passage {currentSection + 1} of 3
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeRemaining < 300 ? 'bg-red-500/20 text-red-500' : isDark ? 'bg-[#1a1a2e] text-white' : 'bg-gray-100 text-gray-900'
                                }`}>
                                <Clock className="w-5 h-5" />
                                <span className="font-mono">{formatTime(timeRemaining)}</span>
                            </div>

                            <button
                                onClick={handleSubmitTest}
                                className="px-4 py-2 rounded-lg bg-[#333399] text-white hover:bg-[#4444aa] transition-all text-sm"
                            >
                                Submit Test
                            </button>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                        <div
                            className="bg-[#333399] h-2 rounded-full transition-all"
                            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question Content */}
                <div className={`p-6 sm:p-8 rounded-xl ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                    }`}>
                    {/* Listening Audio Player */}
                    {selectedSection === 'listening' && currentTest.sections[currentSection] && (
                        <div className={`mb-6 p-6 rounded-lg ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50'}`}>
                            <h3 className={`text-xl mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                🎧 Section {currentSection + 1}: {currentTest.sections[currentSection].title}
                            </h3>

                            {!audioPlayed && (
                                <div className={`p-4 mb-4 rounded-lg border-2 border-yellow-500 bg-yellow-500/10`}>
                                    <p className={`text-sm ${isDark ? 'text-yellow-200' : 'text-yellow-700'}`}>
                                        ⚠️ <strong>Important:</strong> You must listen to the audio before answering questions. The audio can only be played once, just like in the real IELTS test.
                                    </p>
                                </div>
                            )}

                            <div className={`flex flex-col gap-4 p-4 rounded-lg ${isDark ? 'bg-[#252540]' : 'bg-white'}`}>
                                {/* Real Audio Player */}
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => {
                                            if (!audioRef) return;

                                            if (!audioPlayed) {
                                                setAudioPlayed(true);
                                                audioRef.play().catch(() => {
                                                    // Silently handle - AudioUploadHelper shows which files are missing
                                                    setIsAudioPlaying(false);
                                                });
                                            } else if (isAudioPlaying) {
                                                audioRef.pause();
                                            } else if (audioCurrentTime < audioDuration) {
                                                audioRef.play().catch(() => {
                                                    setIsAudioPlaying(false);
                                                });
                                            }
                                        }}
                                        disabled={!audioRef || (audioPlayed && audioCurrentTime >= audioDuration)}
                                        className={`p-4 rounded-full transition-all ${!audioRef || (audioPlayed && audioCurrentTime >= audioDuration)
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-[#333399] hover:bg-[#4444aa] hover:scale-110'
                                            } text-white`}
                                    >
                                        {isAudioPlaying ? (
                                            <PauseCircle className="w-8 h-8" />
                                        ) : (
                                            <PlayCircle className="w-8 h-8" />
                                        )}
                                    </button>

                                    <div className="flex-1">
                                        <div className="flex justify-between mb-2">
                                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {formatTime(audioCurrentTime)}
                                            </span>
                                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {formatTime(audioDuration)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-300 rounded-full h-2">
                                            <div
                                                className="bg-[#333399] h-2 rounded-full transition-all"
                                                style={{ width: `${audioDuration > 0 ? (audioCurrentTime / audioDuration) * 100 : 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                {audioPlayed && audioCurrentTime >= audioDuration && (
                                    <div className={`p-3 rounded-lg ${isDark ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                                        <p className="text-sm">✓ Audio completed. You can now answer the questions.</p>
                                    </div>
                                )}

                                {audioPlayed && audioCurrentTime < audioDuration && (
                                    <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                                        <p className="text-sm">🎵 Audio playing... Listen carefully!</p>
                                    </div>
                                )}

                                {!audioPlayed && (
                                    <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                        <p className="text-sm">Click play to start the audio for this section</p>
                                    </div>
                                )}
                            </div>

                            {/* Instructions */}
                            <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-[#252540] border border-gray-700' : 'bg-white border border-gray-200'}`}>
                                <h4 className={`text-sm mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Instructions:
                                </h4>
                                <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <li>• Listen to the audio carefully</li>
                                    <li>• You can answer questions while listening or after</li>
                                    <li>• The audio will only play once</li>
                                    <li>• Take notes if needed</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Reading Passage */}
                    {selectedSection === 'reading' && (
                        <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50'}`}>
                            <h3 className={`text-xl mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {currentTest.passages[currentSection].title}
                            </h3>
                            <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {currentTest.passages[currentSection].text}
                            </div>
                        </div>
                    )}

                    {/* Writing Tasks */}
                    {selectedSection === 'writing' && (
                        <div className="space-y-6">
                            {/* Task Tabs */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentWritingTask(0)}
                                    className={`flex-1 py-3 px-6 rounded-lg transition-all ${currentWritingTask === 0
                                            ? 'bg-[#333399] text-white'
                                            : isDark
                                                ? 'bg-[#1a1a2e] text-white hover:bg-[#333399]/20'
                                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                        }`}
                                >
                                    Task 1 (20 mins, 150 words min.)
                                </button>
                                <button
                                    onClick={() => setCurrentWritingTask(1)}
                                    className={`flex-1 py-3 px-6 rounded-lg transition-all ${currentWritingTask === 1
                                            ? 'bg-[#333399] text-white'
                                            : isDark
                                                ? 'bg-[#1a1a2e] text-white hover:bg-[#333399]/20'
                                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                        }`}
                                >
                                    Task 2 (40 mins, 250 words min.) ⭐
                                </button>
                            </div>

                            {/* Task 1 Content */}
                            {currentWritingTask === 0 && (
                                <div className={`p-6 rounded-lg ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className={`text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                Task 1
                                            </h3>
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {testType === 'Academic'
                                                    ? 'Describe the visual information in your own words'
                                                    : 'Write a letter based on the given situation'}
                                            </p>
                                        </div>
                                        <div className={`px-4 py-2 rounded-lg ${getWordCount(writingAnswers.task1) >= 150
                                                ? 'bg-green-500/20 text-green-600'
                                                : 'bg-yellow-500/20 text-yellow-600'
                                            }`}>
                                            <span className="text-sm">
                                                {getWordCount(writingAnswers.task1)} / 150 words
                                            </span>
                                        </div>

                  </div >

    {/* Task 1 Instructions */ }
    < div className = {`p-4 rounded-lg mb-4 border ${isDark ? 'bg-[#252540] border-gray-700' : 'bg-white border-gray-200'
        }`}>
            <h4 className={`mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {currentTest.tasks[0].prompt}
            </h4>

{
    testType === 'Academic' && (
        <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-100'}`}>
            <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                📊 {currentTest.tasks[0].visualInfo}
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                (In a real test, you would see a graph, chart, table, or diagram here)
            </p>
        </div>
    )
}

<div className={`mt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
    <p className="mb-2">You should:</p>
    <ul className="list-disc list-inside space-y-1">
        {testType === 'Academic' ? (
            <>
                <li>Write at least 150 words</li>
                <li>Describe the main features</li>
                <li>Make comparisons where relevant</li>
                <li>Do not give your opinion</li>
            </>
        ) : (
            <>
                <li>Write at least 150 words</li>
                <li>Use appropriate tone (formal/semi-formal/informal)</li>
                <li>Cover all the bullet points given</li>
                <li>Use proper letter format</li>
            </>
        )}
    </ul>
</div>
                  </div >

    {/* Task 1 Text Area */ }
    < textarea
value = { writingAnswers.task1 }
onChange = {(e) => setWritingAnswers({ ...writingAnswers, task1: e.target.value })}
placeholder = { testType === 'Academic'
    ? "Begin your response here. Remember to describe the visual information objectively without giving opinions..."
    : "Begin your letter here. Remember to use the appropriate format and tone..."}
className = {`w-full h-64 px-4 py-3 rounded-lg border resize-none ${isDark
        ? 'bg-[#252540] border-gray-700 text-white placeholder-gray-500'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
    }`}
                  />
                </div >
              )}

{/* Task 2 Content */ }
{
    currentWritingTask === 1 && (
        <div className={`p-6 rounded-lg ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50'}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className={`text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Task 2 ⭐
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Write an essay - This task carries more weight in scoring
                    </p>
                </div>
                <div className={`px-4 py-2 rounded-lg ${getWordCount(writingAnswers.task2) >= 250
                        ? 'bg-green-500/20 text-green-600'
                        : 'bg-yellow-500/20 text-yellow-600'
                    }`}>
                    <span className="text-sm">
                        {getWordCount(writingAnswers.task2)} / 250 words
                    </span>
                </div>
            </div>

            {/* Task 2 Instructions */}
            <div className={`p-4 rounded-lg mb-4 border ${isDark ? 'bg-[#252540] border-gray-700' : 'bg-white border-gray-200'
                }`}>
                <h4 className={`mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {currentTest.tasks[1].prompt}
                </h4>

                <div className={`mt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <p className="mb-2">You should:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Write at least 250 words</li>
                        <li>Present a clear position</li>
                        <li>Support your ideas with examples</li>
                        <li>Organize your essay logically</li>
                        <li>Use a range of vocabulary and grammar</li>
                    </ul>
                </div>
            </div>

            {/* Task 2 Text Area */}
            <textarea
                value={writingAnswers.task2}
                onChange={(e) => setWritingAnswers({ ...writingAnswers, task2: e.target.value })}
                placeholder="Begin your essay here. Remember to plan your response, present clear arguments, and support them with examples..."
                className={`w-full h-80 px-4 py-3 rounded-lg border resize-none ${isDark
                        ? 'bg-[#252540] border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
            />
        </div>
    )
}

{/* Submit Button for Writing */ }
<div className="flex justify-center">
    <button
        onClick={handleSubmitTest}
        disabled={getWordCount(writingAnswers.task1) < 150 || getWordCount(writingAnswers.task2) < 250}
        className={`px-8 py-3 rounded-lg transition-all ${getWordCount(writingAnswers.task1) >= 150 && getWordCount(writingAnswers.task2) >= 250
                ? 'bg-[#333399] text-white hover:bg-[#4444aa] hover:scale-105'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
    >
        Submit Writing Test
    </button>
</div>
            </div >
          )}

{/* Speaking Test - Complete Interface with 3 Parts */ }
{
    selectedSection === 'speaking' && currentTest?.parts && (
        <div className="space-y-6">
            {/* Part Tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => {
                        setCurrentSpeakingPart(0);
                        setCurrentQuestionIndex(0);
                    }}
                    className={`flex-1 py-3 px-4 text-sm rounded-lg transition-all ${currentSpeakingPart === 0
                            ? 'bg-[#333399] text-white'
                            : isDark
                                ? 'bg-[#1a1a2e] text-white hover:bg-[#333399]/20'
                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                >
                    Part 1
                </button>
                <button
                    onClick={() => {
                        setCurrentSpeakingPart(1);
                        setCurrentQuestionIndex(0);
                        setSpeakingPart2Preparation(true);
                        setPreparationTimeRemaining(60);
                    }}
                    className={`flex-1 py-3 px-4 text-sm rounded-lg transition-all ${currentSpeakingPart === 1
                            ? 'bg-[#333399] text-white'
                            : isDark
                                ? 'bg-[#1a1a2e] text-white hover:bg-[#333399]/20'
                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                >
                    Part 2
                </button>
                <button
                    onClick={() => {
                        setCurrentSpeakingPart(2);
                        setCurrentQuestionIndex(0);
                    }}
                    className={`flex-1 py-3 px-4 text-sm rounded-lg transition-all ${currentSpeakingPart === 2
                            ? 'bg-[#333399] text-white'
                            : isDark
                                ? 'bg-[#1a1a2e] text-white hover:bg-[#333399]/20'
                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                >
                    Part 3
                </button>
            </div>

            {currentSpeakingPart === 0 && (
                <div className={`p-6 rounded-lg ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50'}`}>
                    <h3 className={`text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Part 1: Introduction & Interview (4-5 mins)</h3>
                    <p className={`text-sm mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>General questions about yourself</p>
                    <div className={`p-4 rounded-lg mb-6 border ${isDark ? 'bg-[#252540] border-gray-700' : 'bg-white border-gray-200'}`}>
                        <p className={`text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentTest?.parts?.[0]?.questions?.[currentQuestionIndex]?.question || 'Question not available'}</p>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>💡 Give short, direct answers (2-3 sentences)</div>
                    </div>
                    <div className={`p-4 rounded-lg ${isDark ? 'bg-[#252540]' : 'bg-white'}`}>
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <button onClick={() => { setIsRecording(!isRecording); if (!isRecording) setRecordedAnswers({ ...recordedAnswers, [currentQuestionIndex]: true }); }} className={`p-6 rounded-full transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-[#333399] hover:bg-[#4444aa]'} text-white hover:scale-110`}>
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" /><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" /></svg>
                            </button>
                        </div>
                        <p className={`text-center text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{isRecording ? '🔴 Recording...' : recordedAnswers[currentQuestionIndex] ? '✓ Recorded' : 'Click to record'}</p>
                    </div>
                    <div className="flex justify-between items-center mt-6">
                        <button onClick={() => currentQuestionIndex > 0 && setCurrentQuestionIndex(currentQuestionIndex - 1)} disabled={currentQuestionIndex === 0} className={`px-6 py-2 rounded-lg ${currentQuestionIndex === 0 ? 'opacity-50' : ''} ${isDark ? 'bg-[#1a1a2e] text-white' : 'bg-gray-100 text-gray-900'}`}>Previous</button>
                        <button onClick={() => currentQuestionIndex < (currentTest?.parts?.[0]?.questions?.length || 1) - 1 ? setCurrentQuestionIndex(currentQuestionIndex + 1) : (setCurrentSpeakingPart(1), setCurrentQuestionIndex(0), setSpeakingPart2Preparation(true), setPreparationTimeRemaining(60))} className="px-6 py-2 rounded-lg bg-[#333399] text-white hover:bg-[#4444aa] transition-all">Next<ChevronRight className="w-4 h-4 inline ml-2" /></button>
                    </div>
                </div>
            )}

            {currentSpeakingPart === 1 && speakingPart2Preparation && (
                <div className={`p-6 rounded-lg ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50'}`}>
                    <h3 className={`text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Part 2: Long Turn (3-4 mins)</h3>
                    <p className={`text-sm mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>1 minute preparation, 1-2 minutes speaking</p>
                    <div className={`p-6 rounded-lg mb-6 border-2 ${preparationTimeRemaining > 0 ? 'border-yellow-500' : 'border-green-500'} ${preparationTimeRemaining > 0 ? 'bg-yellow-500/10' : 'bg-green-500/10'}`}>
                        <div className={`text-5xl font-mono text-center mb-4 ${preparationTimeRemaining > 10 ? (isDark ? 'text-white' : 'text-gray-900') : 'text-red-500'}`}>0:{preparationTimeRemaining.toString().padStart(2, '0')}</div>
                        <p className="text-center">{preparationTimeRemaining > 0 ? '⏱️ Preparation time' : '✓ Ready to speak!'}</p>
                    </div>
                    <div className={`p-6 rounded-lg mb-6 border ${isDark ? 'bg-[#252540] border-gray-700' : 'bg-white border-gray-200'}`}>
                        <h4 className={`mb-4 text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentTest?.parts?.[1]?.taskCard?.topic || 'Describe a topic'}</h4>
                        <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}><p className="mb-3">You should say:</p><ul className="space-y-2">{(currentTest?.parts?.[1]?.taskCard?.points || []).map((point, idx) => (<li key={idx}>• {point}</li>))}</ul></div>
                    </div>
                    <textarea placeholder="Make notes here..." className={`w-full h-32 px-4 py-3 rounded-lg border mb-4 resize-none ${isDark ? 'bg-[#252540] border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'}`} />
                    {preparationTimeRemaining === 0 && <button onClick={() => setSpeakingPart2Preparation(false)} className="w-full py-3 rounded-lg bg-[#333399] text-white hover:bg-[#4444aa]">Start Speaking</button>}
                </div>
            )}

            {currentSpeakingPart === 1 && !speakingPart2Preparation && (
                <div className={`p-6 rounded-lg ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50'}`}>
                    <h3 className={`text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Part 2: Long Turn - Speaking</h3>
                    <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-[#252540]' : 'bg-white'}`}><h4 className={`mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentTest?.parts?.[1]?.taskCard?.topic || 'Describe a topic'}</h4><ul className={`text-sm space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{(currentTest?.parts?.[1]?.taskCard?.points || []).map((p, i) => (<li key={i}>• {p}</li>))}</ul></div>
                    <div className={`p-6 rounded-lg ${isDark ? 'bg-[#252540]' : 'bg-white'}`}>
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <button onClick={() => { setIsRecording(!isRecording); if (!isRecording) setRecordedAnswers({ ...recordedAnswers, [100]: true }); }} className={`p-6 rounded-full transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-[#333399] hover:bg-[#4444aa]'} text-white`}>
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" /><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" /></svg>
                            </button>
                        </div>
                        <p className={`text-center text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{isRecording ? '🔴 Recording... Speak for 1-2 minutes' : recordedAnswers[100] ? '✓ Response recorded' : 'Click to record'}</p>
                    </div>
                    <button onClick={() => { setCurrentSpeakingPart(2); setCurrentQuestionIndex(0); }} className="w-full mt-6 py-3 rounded-lg bg-[#333399] text-white hover:bg-[#4444aa]">Continue to Part 3</button>
                </div>
            )}

            {currentSpeakingPart === 2 && (
                <div className={`p-6 rounded-lg ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50'}`}>
                    <h3 className={`text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Part 3: Discussion (4-5 mins)</h3>
                    <p className={`text-sm mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Abstract and analytical questions</p>
                    <div className={`p-4 rounded-lg mb-6 border ${isDark ? 'bg-[#252540] border-gray-700' : 'bg-white border-gray-200'}`}>
                        <p className={`text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentTest?.parts?.[2]?.questions?.[currentQuestionIndex]?.question || 'Question not available'}</p>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>💡 Give longer, detailed answers with analysis</div>
                    </div>
                    <div className={`p-4 rounded-lg ${isDark ? 'bg-[#252540]' : 'bg-white'}`}>
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <button onClick={() => { setIsRecording(!isRecording); if (!isRecording) setRecordedAnswers({ ...recordedAnswers, [200 + currentQuestionIndex]: true }); }} className={`p-6 rounded-full transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-[#333399] hover:bg-[#4444aa]'} text-white`}>
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" /><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" /></svg>
                            </button>
                        </div>
                        <p className={`text-center text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{isRecording ? '🔴 Recording...' : recordedAnswers[200 + currentQuestionIndex] ? '✓ Recorded' : 'Click to record'}</p>
                    </div>
                    <div className="flex justify-between items-center mt-6">
                        <button onClick={() => currentQuestionIndex > 0 && setCurrentQuestionIndex(currentQuestionIndex - 1)} disabled={currentQuestionIndex === 0} className={`px-6 py-2 rounded-lg ${currentQuestionIndex === 0 ? 'opacity-50' : ''} ${isDark ? 'bg-[#1a1a2e] text-white' : 'bg-gray-100'}`}>Previous</button>
                        {currentQuestionIndex < (currentTest?.parts?.[2]?.questions?.length || 1) - 1 ? <button onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)} className="px-6 py-2 rounded-lg bg-[#333399] text-white hover:bg-[#4444aa]">Next<ChevronRight className="w-4 h-4 inline ml-2" /></button> : <button onClick={handleSubmitTest} className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">Submit Test</button>}
                    </div>
                </div>
            )}
        </div>
    )
}

{/* Question (for Listening, Reading only) */ }
{
    (selectedSection === 'listening' || selectedSection === 'reading') && (
        <div className="mb-6">
            <h4 className={`text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {currentQuestion.type === 'multiple-choice' ? 'Multiple Choice' :
                    currentQuestion.type === 'true-false-notgiven' ? 'True / False / Not Given' :
                        currentQuestion.type === 'yes-no-notgiven' ? 'Yes / No / Not Given' :
                            currentQuestion.type === 'form-completion' ? 'Complete the form' :
                                currentQuestion.type === 'sentence-completion' ? 'Complete the sentence' :
                                    currentQuestion.type === 'short-answer' ? 'Short Answer' :
                                        currentQuestion.type === 'matching' ? 'Matching' :
                                            'Question'}
            </h4>

            <p className={`mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {currentQuestion.question}
            </p>

            {/* Answer Input */}
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                <div className="space-y-2">
                    {currentQuestion.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswerChange(currentQuestion.id, option)}
                            className={`w-full p-3 rounded-lg text-left transition-all ${userAnswers[currentQuestion.id] === option
                                    ? 'bg-[#333399] text-white'
                                    : isDark
                                        ? 'bg-[#1a1a2e] text-white hover:bg-[#333399]/20'
                                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                                }`}
                        >
                            {String.fromCharCode(65 + idx)}. {option}
                        </button>
                    ))}
                </div>
            )}

            {(currentQuestion.type === 'true-false-notgiven' || currentQuestion.type === 'yes-no-notgiven') && (
                <div className="flex gap-2">
                    {currentQuestion.type === 'true-false-notgiven' ? (
                        <>
                            <button
                                onClick={() => handleAnswerChange(currentQuestion.id, 'True')}
                                className={`flex-1 py-3 rounded-lg transition-all ${userAnswers[currentQuestion.id] === 'True'
                                        ? 'bg-[#333399] text-white'
                                        : isDark ? 'bg-[#1a1a2e] text-white' : 'bg-gray-50 text-gray-900'
                                    }`}
                            >
                                True
                            </button>
                            <button
                                onClick={() => handleAnswerChange(currentQuestion.id, 'False')}
                                className={`flex-1 py-3 rounded-lg transition-all ${userAnswers[currentQuestion.id] === 'False'
                                        ? 'bg-[#333399] text-white'
                                        : isDark ? 'bg-[#1a1a2e] text-white' : 'bg-gray-50 text-gray-900'
                                    }`}
                            >
                                False
                            </button>
                            <button
                                onClick={() => handleAnswerChange(currentQuestion.id, 'Not Given')}
                                className={`flex-1 py-3 rounded-lg transition-all ${userAnswers[currentQuestion.id] === 'Not Given'
                                        ? 'bg-[#333399] text-white'
                                        : isDark ? 'bg-[#1a1a2e] text-white' : 'bg-gray-50 text-gray-900'
                                    }`}
                            >
                                Not Given
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => handleAnswerChange(currentQuestion.id, 'Yes')}
                                className={`flex-1 py-3 rounded-lg transition-all ${userAnswers[currentQuestion.id] === 'Yes'
                                        ? 'bg-[#333399] text-white'
                                        : isDark ? 'bg-[#1a1a2e] text-white' : 'bg-gray-50 text-gray-900'
                                    }`}
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => handleAnswerChange(currentQuestion.id, 'No')}
                                className={`flex-1 py-3 rounded-lg transition-all ${userAnswers[currentQuestion.id] === 'No'
                                        ? 'bg-[#333399] text-white'
                                        : isDark ? 'bg-[#1a1a2e] text-white' : 'bg-gray-50 text-gray-900'
                                    }`}
                            >
                                No
                            </button>
                            <button
                                onClick={() => handleAnswerChange(currentQuestion.id, 'Not Given')}
                                className={`flex-1 py-3 rounded-lg transition-all ${userAnswers[currentQuestion.id] === 'Not Given'
                                        ? 'bg-[#333399] text-white'
                                        : isDark ? 'bg-[#1a1a2e] text-white' : 'bg-gray-50 text-gray-900'
                                    }`}
                            >
                                Not Given
                            </button>
                        </>
                    )}
                </div>
            )}

            {(currentQuestion.type === 'form-completion' ||
                currentQuestion.type === 'sentence-completion' ||
                currentQuestion.type === 'short-answer' ||
                currentQuestion.type === 'matching') && (
                    <input
                        type="text"
                        value={userAnswers[currentQuestion.id] || ''}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        placeholder="Type your answer here..."
                        className={`w-full px-4 py-3 rounded-lg border ${isDark
                                ? 'bg-[#1a1a2e] border-gray-700 text-white placeholder-gray-500'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                            }`}
                    />
                )}
        </div>
    )
}

{/* Navigation */ }
{
    (selectedSection === 'listening' || selectedSection === 'reading') && (
        <div className="flex justify-between items-center">
            <button
                onClick={() => {
                    if (currentQuestionIndex > 0) {
                        setCurrentQuestionIndex(currentQuestionIndex - 1);
                    }
                }}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-2 rounded-lg transition-all ${currentQuestionIndex === 0
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:scale-105'
                    } ${isDark ? 'bg-[#1a1a2e] text-white' : 'bg-gray-100 text-gray-900'}`}
            >
                Previous
            </button>

            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {Object.keys(userAnswers).length} of {questions.length} answered
            </span>

            <button
                onClick={() => {
                    if (currentQuestionIndex < questions.length - 1) {
                        setCurrentQuestionIndex(currentQuestionIndex + 1);
                    } else {
                        // Move to next section if available
                        if (selectedSection === 'listening' && currentSection < 3) {
                            setCurrentSection(currentSection + 1);
                            setCurrentQuestionIndex(0);
                        } else if (selectedSection === 'reading' && currentSection < 2) {
                            setCurrentSection(currentSection + 1);
                            setCurrentQuestionIndex(0);
                        }
                    }
                }}
                className="px-6 py-2 rounded-lg bg-[#333399] text-white hover:bg-[#4444aa] transition-all hover:scale-105 flex items-center gap-2"
            >
                {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Next Section'}
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    )
}
        </div >
      </div >
    );
  }

// Results
if (currentStep === 'results') {
    const score = calculateScore();

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
            <button
                onClick={onBack}
                className={`mb-6 flex items-center gap-2 text-sm ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'
                    }`}
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
            </button>

            <div className={`p-6 sm:p-8 rounded-xl text-center ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                }`}>
                <div className="mb-8">
                    <h2 className={`text-3xl mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Test Complete!
                    </h2>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {selectedSection?.charAt(0).toUpperCase() + selectedSection?.slice(1)} - {testType}
                    </p>
                </div>

                {(selectedSection === 'listening' || selectedSection === 'reading') && (
                    <div className="mb-8">
                        <div className={`inline-block p-8 rounded-full mb-4 ${isDark ? 'bg-[#333399]/20' : 'bg-[#333399]/10'
                            }`}>
                            <span className={`text-6xl font-bold ${isDark ? 'text-white' : 'text-[#333399]'}`}>
                                {score.band}
                            </span>
                        </div>
                        <h3 className={`text-2xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Band Score
                        </h3>
                        <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {score.correct} correct out of {score.total}
                        </p>

                        <div className={`inline-block px-6 py-3 rounded-lg ${score.band >= 7 ? 'bg-green-500/20 text-green-600' :
                                score.band >= 6 ? 'bg-yellow-500/20 text-yellow-600' :
                                    'bg-red-500/20 text-red-600'
                            }`}>
                            {score.band >= 7 ? 'Excellent Performance!' :
                                score.band >= 6 ? 'Good Performance' :
                                    'Keep Practicing'}
                        </div>
                    </div>
                )}

                {(selectedSection === 'writing' || selectedSection === 'speaking') && (
                    <div className="mb-8">
                        <p className={`text-lg mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Your {selectedSection} test has been submitted.
                        </p>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Your teacher will review and provide feedback within 48 hours.
                        </p>
                    </div>
                )}

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => {
                            setCurrentStep('select-section');
                            setUserAnswers({});
                            setCurrentQuestionIndex(0);
                            setCurrentSection(0);
                        }}
                        className="px-6 py-3 rounded-lg bg-[#333399] text-white hover:bg-[#4444aa] transition-all hover:scale-105"
                    >
                        Take Another Test
                    </button>

                    <button
                        onClick={onBack}
                        className={`px-6 py-3 rounded-lg transition-all hover:scale-105 ${isDark ? 'bg-[#1a1a2e] text-white' : 'bg-gray-100 text-gray-900'
                            }`}
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}

return null;
}
