import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Moon,
    Sun,
    Globe,
    Bell,
    User,
    Wallet as WalletIcon,
    History as HistoryIcon,
    LogOut,
    ChevronDown,
    FileText,
    BookOpen,
    ClipboardList,
    TrendingUp,
    Star,
    ChevronRight,
    MessageSquare,
    Video,
    Send,
    Paperclip,
    ArrowLeft,
    X,
    DollarSign,
    Plus,
    Minus,
    Shield,
    Headphones,
    FileEdit,
    Mic,
    Clock,
    Target,
    List,
    Play,
    Camera,
    Save,
    Key
} from 'lucide-react';
import { translations } from '../translations';
import ListeningTestPage from './listening/ListeningTestPage';
import { ReadingTestPage } from './ReadingTestPage';
import { WritingTestPage } from './WritingTestPage';
import { SpeakingTestPage } from './SpeakingTestPage';
import RequestTeacherModal from './RequestTeacherModal';

export function StudentPanel({ isDark, setIsDark, language, setLanguage, userName, userEmail, userPhoto, onLogout, onJoinLecture }) {
    const t = translations[language];
    const [currentView, setCurrentView] = useState('dashboard');
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [showRecommendedTeachers, setShowRecommendedTeachers] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const [currentScore, setCurrentScore] = useState(20);
    const [progress, setProgress] = useState(20);
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [testMode, setTestMode] = useState('academic');
    const [testOption, setTestOption] = useState(null);
    const [selectedTeacherForRequest, setSelectedTeacherForRequest] = useState(null);

    // API Data States
    const [dbTeachers, setDbTeachers] = useState([]);
    const [dbRequests, setDbRequests] = useState([]);
    const [dbNotifications, setDbNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Profile Edit State
    const { updateProfile, updatePassword } = useAuth();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [newName, setNewName] = useState(userName);
    const [newPhoto, setNewPhoto] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    // Refs for click outside
    const profileDropdownRef = useRef(null);
    const notificationsRef = useRef(null);

    // Reset test option when test mode changes
    useEffect(() => {
        setTestOption(null);
    }, [testMode]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { 'Authorization': `Bearer ${token}` };

                const [teachersRes, requestsRes, notificationsRes, walletRes] = await Promise.all([
                    fetch('http://localhost:5001/api/teachers', { headers }),
                    fetch('http://localhost:5001/api/requests/student', { headers }),
                    fetch('http://localhost:5001/api/notifications', { headers }),
                    fetch('http://localhost:5001/api/wallet/balance', { headers })
                ]);

                if (teachersRes.ok) setDbTeachers(await teachersRes.json());
                if (requestsRes.ok) setDbRequests(await requestsRes.json());
                if (notificationsRes.ok) setDbNotifications(await notificationsRes.json());
                if (walletRes.ok) {
                    const wallet = await walletRes.json();
                    setWalletBalance(wallet.balance);
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
        // Set up polling for notifications or use WebSockets in future
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    // handleRequestTeacher logic has been moved to RequestTeacherModal
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Mock data
    const teachers = [
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            photo: '👩‍🏫',
            qualifications: 'Ph.D. in Education, 15 years experience',
            rating: 4.8,
            experience: '15 years',
            status: 'assigned'
        },
        {
            id: 2,
            name: 'Prof. Michael Chen',
            photo: '👨‍🏫',
            qualifications: 'M.A. in Linguistics, 10 years experience',
            rating: 4.9,
            experience: '10 years',
            status: 'recommended'
        },
        {
            id: 3,
            name: 'Ms. Emily Davis',
            photo: '👩‍💼',
            qualifications: 'M.Ed., TESOL Certified, 8 years experience',
            rating: 4.7,
            experience: '8 years',
            status: 'recommended'
        },
        {
            id: 4,
            name: 'Mr. James Wilson',
            photo: '👨‍💼',
            qualifications: 'B.A. in English, 12 years experience',
            rating: 4.6,
            experience: '12 years',
            status: 'requested'
        }
    ];

    const assignedTeacher = teachers.find(t => t.status === 'assigned');
    const recommendedTeachers = teachers.filter(t => t.status === 'recommended');
    const requestedTeachers = teachers.filter(t => t.status === 'requested');

    const historyItems = [
        { id: 1, teacherName: 'Dr. Sarah Johnson', teacherPhoto: '👩‍🏫', date: 'Nov 10, 2025', rating: 5 },
        { id: 2, teacherName: 'Prof. Michael Chen', teacherPhoto: '👨‍🏫', date: 'Nov 5, 2025', rating: 4 },
        { id: 3, teacherName: 'Ms. Emily Davis', teacherPhoto: '👩‍💼', date: 'Oct 28, 2025', rating: 5 },
    ];

    const skillsData = [
        { name: t.speaking, score: 6.5, total: 9, description: t.speakingDesc, icon: '🎤' },
        { name: t.reading, score: 7.0, total: 9, description: t.readingDesc, icon: '📖' },
        { name: t.listening, score: 6.5, total: 9, description: t.listeningDesc, icon: '👂' },
        { name: t.writing, score: 6.0, total: 9, description: t.writingDesc, icon: '✍️' }
    ];

    // Calculate overall band score (average rounded to nearest 0.5)
    const overallBandScore = Math.round((skillsData.reduce((sum, skill) => sum + skill.score, 0) / skillsData.length) * 2) / 2;

    const chatMessages = [
        { id: 1, text: 'Hello! Ready for today\'s session?', time: '10:30 AM', sender: 'teacher' },
        { id: 2, text: 'Yes, I am! Looking forward to it.', time: '10:32 AM', sender: 'student' },
        { id: 3, text: 'Great! Let\'s start with speaking practice.', time: '10:35 AM', sender: 'teacher' },
    ];

    const notifications = [
        { id: 1, text: t.newPracticeTest, time: `2 ${t.hoursAgo}`, type: 'test' },
        { id: 2, text: `${t.messageFrom} Dr. Sarah Johnson`, time: `5 ${t.hoursAgo}`, type: 'message' },
        { id: 3, text: t.newTeacherRec, time: `1 ${t.dayAgo}`, type: 'recommendation' },
    ];

    const handleFileUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0].name);
        }
    };

    const getCurrentDay = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const now = new Date();
        return `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    };

    // Terms Modal
    const TermsModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`max-w-2xl w-full rounded-xl p-6 max-h-[80vh] overflow-y-auto ${isDark ? 'bg-[#252540]' : 'bg-white'
                }`}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Terms & Conditions
                    </h2>
                    <button
                        onClick={() => setShowTerms(false)}
                        className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'}`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <h3 className={`${isDark ? 'text-white' : 'text-gray-900'}`}>1. Acceptance of Terms</h3>
                    <p>By accessing and using ZLearn platform, you accept and agree to be bound by the terms and provision of this agreement.</p>

                    <h3 className={`${isDark ? 'text-white' : 'text-gray-900'}`}>2. Use License</h3>
                    <p>Permission is granted to temporarily access the materials on ZLearn's platform for personal, non-commercial transitory viewing only.</p>

                    <h3 className={`${isDark ? 'text-white' : 'text-gray-900'}`}>3. User Responsibilities</h3>
                    <p>Users are responsible for maintaining the confidentiality of their account and password. You agree to accept responsibility for all activities that occur under your account.</p>

                    <h3 className={`${isDark ? 'text-white' : 'text-gray-900'}`}>4. Payment Terms</h3>
                    <p>All payments are processed securely. Refunds are subject to our refund policy and must be requested within 7 days of purchase.</p>

                    <h3 className={`${isDark ? 'text-white' : 'text-gray-900'}`}>5. Privacy Policy</h3>
                    <p>Your privacy is important to us. We collect and use your personal information in accordance with our Privacy Policy.</p>

                    <h3 className={`${isDark ? 'text-white' : 'text-gray-900'}`}>6. Modifications</h3>
                    <p>ZLearn reserves the right to modify these terms at any time. Users will be notified of any significant changes.</p>
                </div>
                <button
                    onClick={() => setShowTerms(false)}
                    className="mt-6 w-full py-3 rounded-lg bg-[#333388] text-white hover:bg-[#4444aa] transition-all"
                >
                    Close
                </button>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50'
            }`}>
            {/* Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-40 border-b transition-all ${isDark ? 'bg-[#252540] border-gray-700' : 'bg-white border-gray-200'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Left - Logo */}
                        <div className="flex items-center">
                            <h1 className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Zlearn
                            </h1>
                        </div>

                        {/* Center - Current Day & Theme */}
                        <div className="hidden md:flex items-center gap-4">
                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                {getCurrentDay()}
                            </span>
                            <button
                                onClick={() => setIsDark(!isDark)}
                                className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'
                                    }`}
                            >
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Right - Language, Notifications, Profile */}
                        <div className="flex items-center gap-3">
                            {/* Language Toggle */}
                            <button
                                onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
                                className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'
                                    }`}
                            >
                                <Globe className="w-5 h-5" />
                            </button>

                            {/* Notifications */}
                            <div className="relative" ref={notificationsRef}>
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className={`p-2 rounded-lg transition-all hover:scale-110 relative ${isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'
                                        }`}
                                >
                                    <Bell className="w-5 h-5" />
                                    {notifications.length > 0 && (
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                    )}
                                </button>

                                {showNotifications && (
                                    <div className={`absolute right-[-60px] sm:right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-80 rounded-lg shadow-lg border overflow-hidden z-50 ${isDark ? 'bg-[#252540] border-gray-700' : 'bg-white border-gray-200'
                                        }`}>
                                        <div className="p-4 border-b border-gray-700">
                                            <h3 className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                Notifications
                                            </h3>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {dbNotifications.length > 0 ? dbNotifications.map((notif) => (
                                                <div
                                                    key={notif._id}
                                                    className={`p-4 border-b transition-colors ${isDark
                                                        ? 'border-gray-700 hover:bg-[#1a1a2e]'
                                                        : 'border-gray-200 hover:bg-gray-50'
                                                        } ${notif.isRead ? 'opacity-60' : ''}`}
                                                >
                                                    <p className={isDark ? 'text-white' : 'text-gray-900 font-semibold'}>
                                                        {notif.title}
                                                    </p>
                                                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {notif.message}
                                                    </p>
                                                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {new Date(notif.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            )) : (
                                                <div className="p-4 text-center text-gray-500">
                                                    No notifications.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Profile Dropdown */}
                            <div className="relative" ref={profileDropdownRef}>
                                <button
                                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:scale-105 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#333388] flex items-center justify-center text-white overflow-hidden">
                                        {userPhoto ? (
                                            <img src={`http://localhost:5001/uploads/${userPhoto}`} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            userName.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <ChevronDown className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                                </button>

                                {showProfileDropdown && (
                                    <div className={`absolute right-[-16px] sm:right-0 mt-2 w-[calc(100vw-2rem)] max-w-[256px] sm:w-64 rounded-lg shadow-lg border z-50 ${isDark ? 'bg-[#252540] border-gray-700' : 'bg-white border-gray-200'
                                        }`}>
                                        <div className={`p-2 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <p className={`px-3 py-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {userName}
                                            </p>
                                            <p className={`px-3 py-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {userEmail}
                                            </p>
                                        </div>
                                        <div className="p-2">
                                            <button
                                                onClick={() => {
                                                    setCurrentView('profile');
                                                    setShowProfileDropdown(false);
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${isDark
                                                    ? 'hover:bg-gray-700 text-white'
                                                    : 'hover:bg-gray-100 text-gray-900'
                                                    }`}
                                            >
                                                <User className="w-4 h-4" />
                                                View Profile
                                            </button>
                                            <button
                                                onClick={() => setShowTerms(true)}
                                                className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${isDark
                                                    ? 'hover:bg-gray-700 text-white'
                                                    : 'hover:bg-gray-100 text-gray-900'
                                                    }`}
                                            >
                                                <Shield className="w-4 h-4" />
                                                Terms & Conditions
                                            </button>
                                            <button
                                                onClick={onLogout}
                                                className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${isDark
                                                    ? 'hover:bg-gray-700 text-red-400'
                                                    : 'hover:bg-gray-100 text-red-600'
                                                    }`}
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-8 overflow-x-hidden">
                {/* Dashboard View */}
                {currentView === 'dashboard' && (
                    <div className="space-y-6">
                        {/* Top Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left - Score & Actions */}
                            <div className={`lg:col-span-2 p-6 rounded-xl ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                                }`}>
                                <div className="mb-4">
                                    <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {t.yourCurrentScore}
                                    </p>
                                    <p className={`text-5xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {currentScore}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-4 justify-center">
                                    <button
                                        onClick={() => setCurrentView('practice-test')}
                                        className="px-6 py-3 rounded-lg bg-[#333388] text-white hover:bg-[#4444aa] transition-all hover:scale-105 flex items-center justify-center gap-2"
                                    >
                                        <ClipboardList className="w-5 h-5" />
                                        {t.takePracticeTest}
                                    </button>
                                    <button
                                        onClick={() => setCurrentView('documents')}
                                        className={`px-6 py-3 rounded-lg border-2 transition-all hover:scale-105 flex items-center justify-center gap-2 ${isDark
                                            ? 'border-gray-600 text-white hover:bg-gray-700'
                                            : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        <FileText className="w-5 h-5" />
                                        {t.documents}
                                    </button>
                                </div>
                            </div>

                            {/* Right - Wallet, History, Progress */}
                            <div className="space-y-4">
                                {/* Wallet */}
                                <button
                                    onClick={() => setCurrentView('wallet')}
                                    className={`w-full p-4 rounded-xl transition-all hover:scale-105 flex items-center justify-between ${isDark ? 'bg-[#252540] hover:bg-[#2a2a50]' : 'bg-white shadow-lg hover:shadow-xl'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <WalletIcon className={`w-5 h-5 ${isDark ? 'text-[#6666ff]' : 'text-[#333388]'}`} />
                                        <span className={isDark ? 'text-white' : 'text-gray-900'}>{t.wallet}</span>
                                    </div>
                                    <span className="text-[#333388]">${walletBalance}</span>
                                </button>

                                {/* History */}
                                <button
                                    onClick={() => setCurrentView('history')}
                                    className={`w-full p-4 rounded-xl transition-all hover:scale-105 flex items-center justify-between ${isDark ? 'bg-[#252540] hover:bg-[#2a2a50]' : 'bg-white shadow-lg hover:shadow-xl'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <HistoryIcon className={`w-5 h-5 ${isDark ? 'text-[#6666ff]' : 'text-[#333388]'}`} />
                                        <span className={isDark ? 'text-white' : 'text-gray-900'}>{t.history}</span>
                                    </div>
                                    <ChevronRight className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                                </button>

                                {/* Progress */}
                                <div className={`p-4 rounded-xl ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                                    }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {t.progress}
                                        </span>
                                        <span className="text-[#333388]">{progress}/100</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-[#333388] h-2 rounded-full transition-all"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recommended Teachers */}
                        <div className={`p-6 rounded-xl ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                            }`}>
                            <button
                                onClick={() => setShowRecommendedTeachers(!showRecommendedTeachers)}
                                className="w-full flex items-center justify-between"
                            >
                                <h2 className={`text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {t.recommendedTeachers}
                                </h2>
                                <ChevronDown
                                    className={`w-5 h-5 transition-transform ${showRecommendedTeachers ? 'rotate-180' : ''
                                        } ${isDark ? 'text-white' : 'text-gray-900'}`}
                                />
                            </button>

                            {showRecommendedTeachers && (
                                <div className="mt-4 space-y-4">
                                    {dbTeachers.length > 0 ? dbTeachers.map((teacher) => (
                                        <div
                                            key={teacher._id}
                                            className={`p-4 rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-16 h-16 rounded-full bg-[#333388] flex items-center justify-center text-white overflow-hidden">
                                                    {teacher.profile.photoUrl ? (
                                                        <img src={`http://localhost:5001/uploads/${teacher.profile.photoUrl}`} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-8 h-8" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className={`mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        {teacher.profile.fullName}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                        <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                            {teacher.stats?.averageRating || 5.0}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => setSelectedTeacherForRequest(teacher)}
                                                        className="px-4 py-2 text-sm rounded-lg bg-[#333388] text-white hover:bg-[#4444aa] transition-all hover:scale-105"
                                                    >
                                                        {t.requestTeacher}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className={`text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            No teachers available at the moment.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Teacher Requests Section */}
                        <div className={`p-6 rounded-xl ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                            }`}>
                            <h2 className={`text-xl mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {t.requestedTeachers || 'Teacher Requests'}
                            </h2>
                            {dbRequests.length > 0 ? dbRequests.map((request) => (
                                <div
                                    key={request._id}
                                    className={`p-4 rounded-lg border mb-4 ${isDark ? 'border-gray-700' : 'border-gray-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[#333388] flex items-center justify-center text-white">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={isDark ? 'text-white' : 'text-gray-900'}>
                                                {request.teacherId.profile.fullName}
                                            </h3>
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                Status: {request.status}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <p className={`text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    You have not sent any lecture requests.
                                </p>
                            )}
                        </div>

                        {/* Assigned Teacher Section */}
                        <div className={`p-6 rounded-xl ${isDark ? 'bg-[#333388]' : 'bg-[#333388]'
                            }`}>
                            <h2 className="text-xl mb-4 text-white">
                                {t.assignedTeacher}
                            </h2>
                            {dbRequests.find(r => r.status === 'accepted') ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl overflow-hidden">
                                            {dbRequests.find(r => r.status === 'accepted').teacherId.profile.photoUrl ? (
                                                <img src={`http://localhost:5001/uploads/${dbRequests.find(r => r.status === 'accepted').teacherId.profile.photoUrl}`} alt="" />
                                            ) : (
                                                <User className="w-8 h-8 text-[#333388]" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-white mb-1">{dbRequests.find(r => r.status === 'accepted').teacherId.profile.fullName}</h3>
                                            <p className="text-sm text-gray-200">
                                                {dbRequests.find(r => r.status === 'accepted').teacherId.profile.qualifications || 'Professional Teacher'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => setCurrentView('chat')}
                                            className="px-4 py-2 text-sm rounded-lg bg-white text-[#333388] hover:bg-gray-100 transition-all hover:scale-105 flex items-center justify-center gap-2 w-full"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                            {t.openChat}
                                        </button>
                                        {onJoinLecture && (
                                            <button
                                                onClick={() => onJoinLecture(dbRequests.find(r => r.status === 'accepted')._id)}
                                                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all hover:scale-105 flex items-center justify-center gap-2 w-full animate-pulse shadow-lg shadow-red-500/50"
                                            >
                                                <Video className="w-4 h-4" />
                                                Join Live Lecture
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-white">No teacher assigned yet.</p>
                            )}
                        </div>

                        {/* Test Skills Progress */}
                        <div className={`p-6 rounded-xl ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                            }`}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className={`text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {t.testSkillsProgress}
                                </h2>
                                {/* Overall Band Score */}
                                <div className={`px-6 py-3 rounded-xl border-2 border-[#333388] ${isDark ? 'bg-[#333388]/10' : 'bg-[#333388]/5'
                                    }`}>
                                    <div className="text-center">
                                        <p className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {language === 'en' ? 'Overall Band' : '总分'}
                                        </p>
                                        <p className="text-3xl text-[#333388]">
                                            {overallBandScore}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {skillsData.map((skill, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${isDark ? 'border-gray-700 bg-[#1a1a2e]' : 'border-gray-200 bg-gray-50'
                                            }`}
                                    >
                                        <div className="text-center mb-3">
                                            <div className="text-4xl mb-2">{skill.icon}</div>
                                            <h3 className={`mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {skill.name}
                                            </h3>
                                            <div className="flex items-center justify-center gap-2">
                                                <p className="text-3xl text-[#333388]">
                                                    {skill.score}
                                                </p>
                                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    / {skill.total}
                                                </p>
                                            </div>
                                            <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                                {language === 'en' ? 'Band Score' : '分数段'}
                                            </p>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                            <div
                                                className="bg-[#333388] h-2 rounded-full transition-all"
                                                style={{ width: `${(skill.score / skill.total) * 100}%` }}
                                            ></div>
                                        </div>
                                        <p className={`text-xs text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {skill.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {selectedTeacherForRequest && (
                    <RequestTeacherModal
                        teacher={selectedTeacherForRequest}
                        isDark={isDark}
                        onClose={() => setSelectedTeacherForRequest(null)}
                        onSuccess={() => window.location.reload()}
                    />
                )}

                {/* Wallet View */}
                {currentView === 'wallet' && (
                    <div className="max-w-2xl mx-auto">
                        <button
                            onClick={() => setCurrentView('dashboard')}
                            className={`mb-6 flex items-center gap-2 ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'
                                }`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Dashboard
                        </button>

                        <div className={`p-8 rounded-xl mb-6 ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                            }`}>
                            <h2 className={`text-2xl mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Wallet
                            </h2>
                            <div className="text-center mb-8">
                                <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {t.currentBalance}
                                </p>
                                <p className={`text-5xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    ${walletBalance}
                                </p>
                            </div>
                            <div className="flex gap-4 justify-center">
                                <button className="px-6 py-2 text-sm rounded-lg bg-[#333388] text-white hover:bg-[#4444aa] transition-all hover:scale-105 flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    {t.addFunds}
                                </button>
                                <button className={`px-6 py-2 text-sm rounded-lg border-2 transition-all hover:scale-105 flex items-center justify-center gap-2 ${isDark
                                    ? 'border-gray-600 text-white hover:bg-gray-700'
                                    : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                                    }`}>
                                    <Minus className="w-4 h-4" />
                                    {t.withdraw}
                                </button>
                            </div>
                        </div>

                        {/* Transaction History */}
                        <div className={`p-6 rounded-xl ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                            }`}>
                            <h3 className={`text-xl mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Recent Transactions
                            </h3>
                            <div className="space-y-3">
                                <div className={`p-4 rounded-lg ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50'
                                    }`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className={isDark ? 'text-white' : 'text-gray-900'}>
                                                Deposit
                                            </p>
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                Nov 10, 2025
                                            </p>
                                        </div>
                                        <p className="text-green-500">+$50</p>
                                    </div>
                                </div>
                                <div className={`p-4 rounded-lg ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50'
                                    }`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className={isDark ? 'text-white' : 'text-gray-900'}>
                                                Mentorship Session
                                            </p>
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                Nov 8, 2025
                                            </p>
                                        </div>
                                        <p className="text-red-500">-$30</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* History View */}
                {currentView === 'history' && (
                    <div className="max-w-4xl mx-auto">
                        <button
                            onClick={() => setCurrentView('dashboard')}
                            className={`mb-6 flex items-center gap-2 ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'
                                }`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Dashboard
                        </button>

                        <h2 className={`text-2xl mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Teacher History
                        </h2>

                        <div className="space-y-4">
                            {historyItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={`p-6 rounded-xl transition-all hover:scale-102 ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-[#333388] flex items-center justify-center text-3xl">
                                            {item.teacherPhoto}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {item.teacherName}
                                            </h3>
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                Mentorship Session
                                            </p>
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {item.date}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-5 h-5 ${i < item.rating
                                                        ? 'text-yellow-500 fill-yellow-500'
                                                        : isDark
                                                            ? 'text-gray-600'
                                                            : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Chat View */}
                {currentView === 'chat' && assignedTeacher && (
                    <div className="max-w-4xl mx-auto">
                        <div className={`rounded-xl overflow-hidden h-[calc(100vh-140px)] flex flex-col ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                            }`}>
                            {/* Chat Header */}
                            <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-gray-700' : 'border-gray-200'
                                }`}>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setCurrentView('dashboard')}
                                        className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'
                                            }`}
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <div className="w-10 h-10 rounded-full bg-[#333388] flex items-center justify-center text-xl">
                                        {assignedTeacher.photo}
                                    </div>
                                    <div>
                                        <p className={isDark ? 'text-white' : 'text-gray-900'}>
                                            {assignedTeacher.name}
                                        </p>
                                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Online
                                        </p>
                                    </div>
                                </div>
                                <button className="p-2 rounded-lg bg-[#333388] text-white hover:bg-[#4444aa] transition-all hover:scale-110">
                                    <Video className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {chatMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === 'student'
                                                ? 'bg-[#333388] text-white'
                                                : isDark
                                                    ? 'bg-[#1a1a2e] text-white'
                                                    : 'bg-gray-100 text-gray-900'
                                                }`}
                                        >
                                            <p>{msg.text}</p>
                                            <p className={`text-xs mt-1 ${msg.sender === 'student' ? 'text-gray-200' : isDark ? 'text-gray-300' : 'text-gray-600'
                                                }`}>
                                                {msg.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input Area */}
                            <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'
                                }`}>
                                {selectedFile && (
                                    <div className={`mb-2 p-2 rounded-lg flex items-center justify-between ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-100'
                                        }`}>
                                        <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            📎 {selectedFile}
                                        </span>
                                        <button
                                            onClick={() => setSelectedFile(null)}
                                            className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} hover:text-red-500`}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <label className={`p-3 rounded-lg cursor-pointer transition-all hover:scale-110 ${isDark ? 'bg-[#1a1a2e] text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}>
                                        <input
                                            type="file"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                        <Paperclip className="w-5 h-5" />
                                    </label>
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className={`flex-1 px-4 py-2 rounded-lg border transition-all duration-300 ${isDark
                                            ? 'bg-[#1a1a2e] border-gray-700 text-white placeholder-gray-500'
                                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                                            }`}
                                    />
                                    <button className="p-3 rounded-lg bg-[#333388] text-white hover:bg-[#4444aa] transition-all hover:scale-110">
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Practice Test View */}
                {
                    currentView === 'practice-test' && (
                        <div className="max-w-6xl mx-auto">
                            <button
                                onClick={() => setCurrentView('dashboard')}
                                className={`mb-6 flex items-center gap-2 transition-all hover:scale-105 ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'
                                    }`}
                            >
                                <ArrowLeft className="w-5 h-5" />
                                {language === 'en' ? 'Back to Dashboard' : '返回仪表板'}
                            </button>

                            <div className="mb-8">
                                <h1 className={`text-3xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {language === 'en' ? 'Take Practice Test' : '参加练习测试'}
                                </h1>
                                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {language === 'en'
                                        ? 'Choose a test section to practice and improve your IELTS skills'
                                        : '选择一个测试部分来练习并提高您的IELTS技能'}
                                </p>
                            </div>

                            {/* Test Mode Selection */}
                            <div className="mb-8">
                                <h3 className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {language === 'en' ? 'Select Test Mode' : '选择测试模式'}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Academic Test Mode */}
                                    <button
                                        onClick={() => setTestMode('academic')}
                                        className={`p-6 rounded-xl text-left transition-all hover:scale-105 border-2 ${testMode === 'academic'
                                            ? 'border-[#333388] bg-[#333388]/10'
                                            : isDark
                                                ? 'border-gray-700 bg-[#252540] hover:border-gray-600'
                                                : 'border-gray-200 bg-white hover:border-gray-300 shadow-sm'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-lg ${testMode === 'academic' ? 'bg-[#333388]' : 'bg-gray-500'
                                                }`}>
                                                <BookOpen className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`text-lg mb-1 ${testMode === 'academic'
                                                    ? 'text-[#333388]'
                                                    : isDark ? 'text-white' : 'text-gray-900'
                                                    }`}>
                                                    {language === 'en' ? 'ACADEMIC TEST' : '学术类测试'}
                                                </h4>
                                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {language === 'en'
                                                        ? 'For university admissions and professional registration'
                                                        : '适用于大学入学和专业注册'}
                                                </p>
                                            </div>
                                            {testMode === 'academic' && (
                                                <div className="p-1 rounded-full bg-[#333388]">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </button>

                                    {/* General Training Mode */}
                                    <button
                                        onClick={() => setTestMode('general')}
                                        className={`p-6 rounded-xl text-left transition-all hover:scale-105 border-2 ${testMode === 'general'
                                            ? 'border-[#333388] bg-[#333388]/10'
                                            : isDark
                                                ? 'border-gray-700 bg-[#252540] hover:border-gray-600'
                                                : 'border-gray-200 bg-white hover:border-gray-300 shadow-sm'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-lg ${testMode === 'general' ? 'bg-[#333388]' : 'bg-gray-500'
                                                }`}>
                                                <User className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`text-lg mb-1 ${testMode === 'general'
                                                    ? 'text-[#333388]'
                                                    : isDark ? 'text-white' : 'text-gray-900'
                                                    }`}>
                                                    {language === 'en' ? 'GENERAL TRAINING' : '培训类测试'}
                                                </h4>
                                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {language === 'en'
                                                        ? 'For work experience, training programs, and migration'
                                                        : '适用于工作经验、培训计划和移民'}
                                                </p>
                                            </div>
                                            {testMode === 'general' && (
                                                <div className="p-1 rounded-full bg-[#333388]">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Test Sections for Selected Mode */}
                            <div className={`p-6 rounded-2xl border-2 ${isDark ? 'bg-[#1a1a2e] border-[#333388]' : 'bg-gray-50 border-[#333388]'
                                }`}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-[#333388]">
                                        {testMode === 'academic' ? (
                                            <BookOpen className="w-5 h-5 text-white" />
                                        ) : (
                                            <User className="w-5 h-5 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {testMode === 'academic'
                                                ? (language === 'en' ? 'Academic Test Sections' : '学术类测试部分')
                                                : (language === 'en' ? 'General Training Test Sections' : '培训类测试部分')
                                            }
                                        </h3>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {language === 'en' ? 'Choose how you want to practice' : '选择您想要的练习方式'}
                                        </p>
                                    </div>
                                </div>

                                {/* Test Options: Complete or Individual */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {/* Complete Test Option */}
                                    <button
                                        onClick={() => setTestOption(testOption === 'complete' ? null : 'complete')}
                                        className={`p-6 rounded-xl text-left transition-all hover:scale-105 border-2 ${testOption === 'complete'
                                            ? 'border-[#333388] bg-[#333388]/10'
                                            : isDark
                                                ? 'border-gray-700 bg-[#252540] hover:border-gray-600'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-3 rounded-lg ${testOption === 'complete' ? 'bg-[#333388]' : isDark ? 'bg-gray-700' : 'bg-gray-200'
                                                }`}>
                                                <Target className={`w-6 h-6 ${testOption === 'complete' ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`mb-1 ${testOption === 'complete'
                                                    ? 'text-[#333388]'
                                                    : isDark ? 'text-white' : 'text-gray-900'
                                                    }`}>
                                                    {language === 'en' ? 'Complete Test' : '完整测试'}
                                                </h4>
                                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {language === 'en'
                                                        ? 'Take all 4 sections together (2h 45min)'
                                                        : '一次性完成所有4个部分（2小时45分钟）'}
                                                </p>
                                            </div>
                                            {testOption === 'complete' && (
                                                <div className="p-1 rounded-full bg-[#333388]">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </button>

                                    {/* Individual Test Option */}
                                    <button
                                        onClick={() => setTestOption(testOption === 'individual' ? null : 'individual')}
                                        className={`p-6 rounded-xl text-left transition-all hover:scale-105 border-2 ${testOption === 'individual'
                                            ? 'border-[#333388] bg-[#333388]/10'
                                            : isDark
                                                ? 'border-gray-700 bg-[#252540] hover:border-gray-600'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-3 rounded-lg ${testOption === 'individual' ? 'bg-[#333388]' : isDark ? 'bg-gray-700' : 'bg-gray-200'
                                                }`}>
                                                <List className={`w-6 h-6 ${testOption === 'individual' ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`mb-1 ${testOption === 'individual'
                                                    ? 'text-[#333388]'
                                                    : isDark ? 'text-white' : 'text-gray-900'
                                                    }`}>
                                                    {language === 'en' ? 'Individual Test' : '单项测试'}
                                                </h4>
                                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {language === 'en'
                                                        ? 'Practice one section at a time'
                                                        : '一次练习一个部分'}
                                                </p>
                                            </div>
                                            {testOption === 'individual' && (
                                                <div className="p-1 rounded-full bg-[#333388]">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                </div>

                                {/* Complete Test Start Button */}
                                {testOption === 'complete' && (
                                    <div className={`p-6 rounded-xl mb-6 ${isDark ? 'bg-[#333388]/10 border border-[#333388]/30' : 'bg-[#333388]/5 border border-[#333388]/20'
                                        }`}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className={`mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {language === 'en' ? 'Full IELTS Practice Test' : '完整雅思模拟测试'}
                                                </h4>
                                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {language === 'en'
                                                        ? 'Listening (30min) → Reading (60min) → Writing (60min) → Speaking (15min)'
                                                        : '听力（30分钟）→ 阅读（60分钟）→ 写作（60分钟）→ 口语（15分钟）'}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setCurrentView('listening-test')}
                                                className="px-8 py-3 bg-[#333388] hover:bg-[#4444aa] text-white rounded-lg transition-all flex items-center gap-2 hover:scale-105"
                                            >
                                                <Play className="w-5 h-5" />
                                                {language === 'en' ? 'Start Test' : '开始测试'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Individual Test Cards */}
                                {testOption === 'individual' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Listening Test Card */}
                                        <button
                                            onClick={() => setCurrentView('listening-test')}
                                            className={`p-8 rounded-2xl text-left transition-all hover:scale-105 ${isDark ? 'bg-[#252540] hover:bg-[#2a2a50]' : 'bg-white shadow-lg hover:shadow-xl'
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="p-4 rounded-xl bg-[#4d4d99]">
                                                    <Headphones className="w-8 h-8 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className={`text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        {language === 'en' ? 'Listening Test' : '听力测试'}
                                                    </h3>
                                                    <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        {language === 'en'
                                                            ? 'Listen to audio recordings and answer questions. 4 sections, 30 minutes.'
                                                            : '听录音并回答问题。4个部分，30分钟。'}
                                                    </p>
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${isDark ? 'bg-[#4d4d99]/20 text-[#7777ff]' : 'bg-[#4d4d99]/10 text-[#4d4d99]'
                                                        }`}>
                                                        <Clock className="w-4 h-4" />
                                                        30 {language === 'en' ? 'min' : '分钟'}
                                                    </div>
                                                </div>
                                                <ChevronRight className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                            </div>
                                        </button>

                                        {/* Reading Test Card */}
                                        <button
                                            onClick={() => setCurrentView('reading-test')}
                                            className={`p-8 rounded-2xl text-left transition-all hover:scale-105 ${isDark ? 'bg-[#252540] hover:bg-[#2a2a50]' : 'bg-white shadow-lg hover:shadow-xl'
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="p-4 rounded-xl bg-[#5555aa]">
                                                    <BookOpen className="w-8 h-8 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className={`text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        {language === 'en' ? 'Reading Test' : '阅读测试'}
                                                    </h3>
                                                    <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        {language === 'en'
                                                            ? 'Read 3 passages and answer various question types. 60 minutes.'
                                                            : '阅读3篇文章并回答各种问题类型。60分钟。'}
                                                    </p>
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${isDark ? 'bg-[#5555aa]/20 text-[#8888ff]' : 'bg-[#5555aa]/10 text-[#5555aa]'
                                                        }`}>
                                                        <Clock className="w-4 h-4" />
                                                        60 {language === 'en' ? 'min' : '分钟'}
                                                    </div>
                                                </div>
                                                <ChevronRight className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                            </div>
                                        </button>

                                        {/* Writing Test Card */}
                                        <button
                                            onClick={() => setCurrentView('writing-test')}
                                            className={`p-8 rounded-2xl text-left transition-all hover:scale-105 ${isDark ? 'bg-[#252540] hover:bg-[#2a2a50]' : 'bg-white shadow-lg hover:shadow-xl'
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="p-4 rounded-xl bg-[#6666bb]">
                                                    <FileEdit className="w-8 h-8 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className={`text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        {language === 'en' ? 'Writing Test' : '写作测试'}
                                                    </h3>
                                                    <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        {language === 'en'
                                                            ? 'Complete 2 writing tasks: graph description and essay. 60 minutes.'
                                                            : '完成2个写作任务：图表描述和论文。60分钟。'}
                                                    </p>
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${isDark ? 'bg-[#6666bb]/20 text-[#9999ff]' : 'bg-[#6666bb]/10 text-[#6666bb]'
                                                        }`}>
                                                        <Clock className="w-4 h-4" />
                                                        60 {language === 'en' ? 'min' : '分钟'}
                                                    </div>
                                                </div>
                                                <ChevronRight className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                            </div>
                                        </button>

                                        {/* Speaking Test Card */}
                                        <button
                                            onClick={() => setCurrentView('speaking-test')}
                                            className={`p-8 rounded-2xl text-left transition-all hover:scale-105 ${isDark ? 'bg-[#252540] hover:bg-[#2a2a50]' : 'bg-white shadow-lg hover:shadow-xl'
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="p-4 rounded-xl bg-[#7777cc]">
                                                    <Mic className="w-8 h-8 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className={`text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        {language === 'en' ? 'Speaking Test' : '口语测试'}
                                                    </h3>
                                                    <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        {language === 'en'
                                                            ? 'Practice speaking with mock interview in 3 parts. 11-14 minutes.'
                                                            : '通过3个部分的模拟面试练习口语。11-14分钟。'}
                                                    </p>
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${isDark ? 'bg-[#7777cc]/20 text-[#aaaaff]' : 'bg-[#7777cc]/10 text-[#7777cc]'
                                                        }`}>
                                                        <Clock className="w-4 h-4" />
                                                        11-14 {language === 'en' ? 'min' : '分钟'}
                                                    </div>
                                                </div>
                                                <ChevronRight className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Info Box */}
                            <div className={`mt-8 p-6 rounded-2xl ${isDark ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
                                }`}>
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                                        <TrendingUp className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                                    </div>
                                    <div>
                                        <h4 className={`mb-1 ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
                                            {language === 'en' ? 'Track Your Progress' : '跟踪您的进度'}
                                        </h4>
                                        <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                                            {language === 'en'
                                                ? 'Complete all four sections to get a comprehensive assessment of your IELTS readiness. Your results will be saved in your profile.'
                                                : '完成所有四个部分以全面评估您的IELTS准备情况。您的结果将保存在您的个人资料中。'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Listening Test View */}
                {
                    currentView === 'listening-test' && (
                        <ListeningTestPage
                            isDark={isDark}
                            language={language}
                            onBack={() => setCurrentView('dashboard')}
                        />
                    )
                }

                {/* Reading Test View */}
                {
                    currentView === 'reading-test' && (
                        <ReadingTestPage
                            isDark={isDark}
                            language={language}
                            onBack={() => setCurrentView('dashboard')}
                        />
                    )
                }

                {/* Writing Test View */}
                {
                    currentView === 'writing-test' && (
                        <WritingTestPage
                            isDark={isDark}
                            language={language}
                            onBack={() => setCurrentView('dashboard')}
                        />
                    )
                }

                {/* Speaking Test View */}
                {
                    currentView === 'speaking-test' && (
                        <SpeakingTestPage
                            isDark={isDark}
                            language={language}
                            onBack={() => setCurrentView('dashboard')}
                        />
                    )
                }

                {/* Profile View */}
                {
                    currentView === 'profile' && (
                        <div className="max-w-4xl mx-auto">
                            <button
                                onClick={() => setCurrentView('dashboard')}
                                className={`mb-6 flex items-center gap-2 ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'
                                    }`}
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Back to Dashboard
                            </button>

                            <div className={`p-8 rounded-xl mb-6 ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                                }`}>
                                <h2 className={`text-2xl mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Profile Information
                                </h2>
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-[#333388] flex items-center justify-center text-white text-4xl overflow-hidden border-4 border-[#333388]">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        ) : userPhoto ? (
                                            <img src={`http://localhost:5001/uploads/${userPhoto}`} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            userName.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    {isEditingProfile && (
                                        <label className="absolute bottom-0 right-0 p-2 bg-[#333388] rounded-full text-white cursor-pointer hover:scale-110 transition-all shadow-lg">
                                            <Camera className="w-4 h-4" />
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setNewPhoto(file);
                                                        setPreviewUrl(URL.createObjectURL(file));
                                                    }
                                                }}
                                            />
                                        </label>
                                    )}
                                </div>
                                <div className="flex-1">
                                    {isEditingProfile ? (
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className={`text-xl font-bold px-3 py-2 rounded-lg border w-full max-w-md ${isDark
                                                ? 'bg-[#1a1a2e] border-gray-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                            autoFocus
                                        />
                                    ) : (
                                        <>
                                            <h3 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {userName}
                                            </h3>
                                            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                                {userEmail}
                                            </p>
                                        </>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {isEditingProfile ? (
                                        <>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const formData = new FormData();
                                                        if (newName !== userName) formData.append('fullName', newName);
                                                        if (newPhoto) formData.append('photo', newPhoto);

                                                        await updateProfile(formData);
                                                        setIsEditingProfile(false);
                                                        setStatusMessage({ type: 'success', text: 'Profile updated successfully!' });
                                                        setTimeout(() => setStatusMessage({ type: '', text: '' }), 3000);
                                                    } catch (err) {
                                                        setStatusMessage({ type: 'error', text: 'Failed to update profile.' });
                                                    }
                                                }}
                                                className="p-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all flex items-center gap-2"
                                            >
                                                <Save className="w-5 h-5" />
                                                Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsEditingProfile(false);
                                                    setNewName(userName);
                                                    setNewPhoto(null);
                                                    setPreviewUrl(null);
                                                }}
                                                className={`p-3 rounded-lg border ${isDark ? 'border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditingProfile(true)}
                                            className="p-3 rounded-lg bg-[#333388] text-white hover:bg-[#4444aa] transition-all flex items-center gap-2"
                                        >
                                            <FileEdit className="w-5 h-5" />
                                            Edit Profile
                                        </button>
                                    )}
                                </div>
                            </div>

                            {statusMessage.text && (
                                <div className={`mb-6 p-4 rounded-lg text-center ${statusMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {statusMessage.text}
                                </div>
                            )}

                            <div className="space-y-4 max-w-md">
                                <button
                                    onClick={() => setShowPasswordModal(true)}
                                    className="w-full py-3 rounded-lg bg-[#333388] text-white hover:bg-[#4444aa] transition-all hover:scale-105 flex items-center justify-center gap-2"
                                >
                                    <Key className="w-5 h-5" />
                                    Change Password
                                </button>
                            </div>
                        </div>
                    )
                }

                {/* Password Modal */}
                {showPasswordModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className={`max-w-md w-full rounded-xl p-6 ${isDark ? 'bg-[#252540]' : 'bg-white'}`}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Change Password
                                </h2>
                                <button onClick={() => setShowPasswordModal(false)}>
                                    <X className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className={`block text-sm mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Current Password</label>
                                    <input
                                        type="password"
                                        className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-[#1a1a2e] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'}`}
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>New Password</label>
                                    <input
                                        type="password"
                                        className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-[#1a1a2e] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'}`}
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Confirm New Password</label>
                                    <input
                                        type="password"
                                        className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-[#1a1a2e] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'}`}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    />
                                </div>
                                {statusMessage.text && (
                                    <p className={`text-sm ${statusMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>{statusMessage.text}</p>
                                )}
                                <button
                                    onClick={async () => {
                                        if (passwordData.newPassword !== passwordData.confirmPassword) {
                                            setStatusMessage({ type: 'error', text: 'Passwords do not match' });
                                            return;
                                        }
                                        try {
                                            await updatePassword(passwordData.currentPassword, passwordData.newPassword);
                                            setStatusMessage({ type: 'success', text: 'Password changed successfully!' });
                                            setTimeout(() => {
                                                setShowPasswordModal(false);
                                                setStatusMessage({ type: '', text: '' });
                                                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                            }, 2000);
                                        } catch (err) {
                                            setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
                                        }
                                    }}
                                    className="w-full py-3 rounded-lg bg-[#333388] text-white hover:bg-[#4444aa] transition-all"
                                >
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Documents View */}
                {
                    currentView === 'documents' && (
                        <div className="max-w-6xl mx-auto">
                            <button
                                onClick={() => setCurrentView('dashboard')}
                                className={`mb-6 flex items-center gap-2 ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'
                                    }`}
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Back to Dashboard
                            </button>

                            <div className={`p-6 rounded-xl mb-6 ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                                }`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <BookOpen className={`w-6 h-6 ${isDark ? 'text-[#6666ff]' : 'text-[#333388]'}`} />
                                    <h2 className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {t.lectureNotes}
                                    </h2>
                                </div>
                                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {t.lectureNotesDesc}
                                </p>
                            </div>

                            {/* Document Categories */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* IELTS Speaking Materials */}
                                <div className={`p-6 rounded-xl ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                                    }`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="text-4xl">🎤</div>
                                        <div>
                                            <h3 className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {t.speaking}
                                            </h3>
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {t.uploadedBy}: Dr. Sarah Johnson
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-102 ${isDark ? 'border-gray-700 hover:bg-[#1a1a2e]' : 'border-gray-200 hover:bg-gray-50'
                                            }`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <FileText className={`w-4 h-4 ${isDark ? 'text-[#6666ff]' : 'text-[#333388]'}`} />
                                                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        Speaking Tips & Strategies
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {t.uploadDate}: Nov 15, 2025 • {t.fileSize}: 2.4 MB
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-102 ${isDark ? 'border-gray-700 hover:bg-[#1a1a2e]' : 'border-gray-200 hover:bg-gray-50'
                                            }`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <FileText className={`w-4 h-4 ${isDark ? 'text-[#6666ff]' : 'text-[#333388]'}`} />
                                                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        Common Speaking Topics
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {t.uploadDate}: Nov 10, 2025 • {t.fileSize}: 1.8 MB
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* IELTS Reading Materials */}
                                <div className={`p-6 rounded-xl ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                                    }`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="text-4xl">📖</div>
                                        <div>
                                            <h3 className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {t.reading}
                                            </h3>
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {t.uploadedBy}: Prof. Michael Chen
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-102 ${isDark ? 'border-gray-700 hover:bg-[#1a1a2e]' : 'border-gray-200 hover:bg-gray-50'
                                            }`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <FileText className={`w-4 h-4 ${isDark ? 'text-[#6666ff]' : 'text-[#333388]'}`} />
                                                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        Reading Comprehension Guide
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {t.uploadDate}: Nov 12, 2025 • {t.fileSize}: 3.1 MB
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-102 ${isDark ? 'border-gray-700 hover:bg-[#1a1a2e]' : 'border-gray-200 hover:bg-gray-50'
                                            }`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <FileText className={`w-4 h-4 ${isDark ? 'text-[#6666ff]' : 'text-[#333388]'}`} />
                                                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        Vocabulary Building
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {t.uploadDate}: Nov 8, 2025 • {t.fileSize}: 2.2 MB
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* IELTS Listening Materials */}
                                <div className={`p-6 rounded-xl ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                                    }`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="text-4xl">👂</div>
                                        <div>
                                            <h3 className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {t.listening}
                                            </h3>
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {t.uploadedBy}: Dr. Sarah Johnson
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-102 ${isDark ? 'border-gray-700 hover:bg-[#1a1a2e]' : 'border-gray-200 hover:bg-gray-50'
                                            }`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <FileText className={`w-4 h-4 ${isDark ? 'text-[#6666ff]' : 'text-[#333388]'}`} />
                                                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        Listening Techniques
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {t.uploadDate}: Nov 14, 2025 • {t.fileSize}: 1.5 MB
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-102 ${isDark ? 'border-gray-700 hover:bg-[#1a1a2e]' : 'border-gray-200 hover:bg-gray-50'
                                            }`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <FileText className={`w-4 h-4 ${isDark ? 'text-[#6666ff]' : 'text-[#333388]'}`} />
                                                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        Note-taking Skills
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {t.uploadDate}: Nov 9, 2025 • {t.fileSize}: 1.2 MB
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* IELTS Writing Materials */}
                                <div className={`p-6 rounded-xl ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                                    }`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="text-4xl">✍️</div>
                                        <div>
                                            <h3 className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {t.writing}
                                            </h3>
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {t.uploadedBy}: Ms. Emily Davis
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-102 ${isDark ? 'border-gray-700 hover:bg-[#1a1a2e]' : 'border-gray-200 hover:bg-gray-50'
                                            }`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <FileText className={`w-4 h-4 ${isDark ? 'text-[#6666ff]' : 'text-[#333388]'}`} />
                                                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        Essay Writing Guide
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {t.uploadDate}: Nov 11, 2025 • {t.fileSize}: 2.8 MB
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-102 ${isDark ? 'border-gray-700 hover:bg-[#1a1a2e]' : 'border-gray-200 hover:bg-gray-50'
                                            }`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <FileText className={`w-4 h-4 ${isDark ? 'text-[#6666ff]' : 'text-[#333388]'}`} />
                                                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        Grammar & Structure
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {t.uploadDate}: Nov 7, 2025 • {t.fileSize}: 2.0 MB
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* General Study Materials */}
                                <div className={`p-6 rounded-xl ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                                    }`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="text-4xl">📚</div>
                                        <div>
                                            <h3 className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                General Resources
                                            </h3>
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {t.uploadedBy}: ZLEARN Team
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-102 ${isDark ? 'border-gray-700 hover:bg-[#1a1a2e]' : 'border-gray-200 hover:bg-gray-50'
                                            }`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <FileText className={`w-4 h-4 ${isDark ? 'text-[#6666ff]' : 'text-[#333388]'}`} />
                                                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        IELTS Test Format Overview
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {t.uploadDate}: Nov 1, 2025 • {t.fileSize}: 1.4 MB
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-102 ${isDark ? 'border-gray-700 hover:bg-[#1a1a2e]' : 'border-gray-200 hover:bg-gray-50'
                                            }`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <FileText className={`w-4 h-4 ${isDark ? 'text-[#6666ff]' : 'text-[#333388]'}`} />
                                                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        Study Schedule Template
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {t.uploadDate}: Oct 28, 2025 • {t.fileSize}: 0.8 MB
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Practice Materials */}
                                <div className={`p-6 rounded-xl ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                                    }`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="text-4xl">📝</div>
                                        <div>
                                            <h3 className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                Practice Tests
                                            </h3>
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {t.uploadedBy}: Dr. Sarah Johnson
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-102 ${isDark ? 'border-gray-700 hover:bg-[#1a1a2e]' : 'border-gray-200 hover:bg-gray-50'
                                            }`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <FileText className={`w-4 h-4 ${isDark ? 'text-[#6666ff]' : 'text-[#333388]'}`} />
                                                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        Sample Questions Bank
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {t.uploadDate}: Nov 13, 2025 • {t.fileSize}: 4.2 MB
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-102 ${isDark ? 'border-gray-700 hover:bg-[#1a1a2e]' : 'border-gray-200 hover:bg-gray-50'
                                            }`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <FileText className={`w-4 h-4 ${isDark ? 'text-[#6666ff]' : 'text-[#333388]'}`} />
                                                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        Mock Test Answer Keys
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {t.uploadDate}: Nov 6, 2025 • {t.fileSize}: 1.9 MB
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }


            </div >

            {/* Terms Modal */}
            {showTerms && <TermsModal />}
        </div >
    );
}
