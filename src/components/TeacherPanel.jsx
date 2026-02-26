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
    Check,
    X,
    Menu,
    Users,
    TrendingUp,
    Award,
    Calendar,
    Star,
    LayoutDashboard,
    Camera,
    Save,
    Key,
    FileEdit
} from 'lucide-react';
import { translations } from '../translations';
import { StudentList } from './StudentList';
import { StudentChat } from './StudentChat';

export function TeacherPanel({
    isDark,
    setIsDark,
    language,
    setLanguage,
    userName,
    userEmail,
    userPhoto,
    onLogout,
    onJoinLecture
}) {
    const t = translations[language];
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [currentView, setCurrentView] = useState('requests');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // API Data States
    const [dbRequests, setDbRequests] = useState([]);
    const [dbStudents, setDbStudents] = useState([]);
    const [dbNotifications, setDbNotifications] = useState([]);
    const [walletBalance, setWalletBalance] = useState(0);
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

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { 'Authorization': `Bearer ${token}` };

                const [requestsRes, studentsRes, notificationsRes, walletRes] = await Promise.all([
                    fetch('http://localhost:5001/api/requests/teacher', { headers }),
                    fetch('http://localhost:5001/api/requests/active-students', { headers }), // Need to add this route
                    fetch('http://localhost:5001/api/notifications', { headers }),
                    fetch('http://localhost:5001/api/wallet/balance', { headers })
                ]);

                if (requestsRes.ok) setDbRequests(await requestsRes.json());
                if (studentsRes.ok) setDbStudents(await studentsRes.json());
                if (notificationsRes.ok) setDbNotifications(await notificationsRes.json());
                if (walletRes.ok) {
                    const wallet = await walletRes.json();
                    setWalletBalance(wallet.balance);
                }
            } catch (err) {
                console.error('Error fetching teacher data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherData();
        const interval = setInterval(fetchTeacherData, 30000);
        return () => clearInterval(interval);
    }, []);
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
    const students = [
        { id: 1, name: 'Alice Johnson', avatar: '👩', subject: 'Mathematics', status: 'Active' },
        { id: 2, name: 'Bob Smith', avatar: '👨', subject: 'Physics', status: 'Active' },
        { id: 3, name: 'Carol White', avatar: '👩', subject: 'Chemistry', status: 'Active' },
        { id: 4, name: 'David Brown', avatar: '👨', subject: 'Biology', status: 'Active' },
        { id: 5, name: 'Emma Davis', avatar: '👩', subject: 'Chemistry', status: 'Active' },
        { id: 6, name: 'Frank Wilson', avatar: '👨', subject: 'Mathematics', status: 'Active' },
    ];

    const requests = [
        {
            id: 1,
            name: 'Emma Davis',
            avatar: '👩',
            subject: 'Chemistry',
            weakAreas: 'Weak in Chemistry: Organic Chemistry and Chemical Bonding',
        },
        {
            id: 2,
            name: 'John Smith',
            avatar: '👨',
            subject: 'Mathematics',
            weakAreas: 'Weak in Mathematics: Algebra and Calculus',
        },
    ];

    const pastStudents = [
        { id: 1, name: 'David Martinez', avatar: '👨', subject: 'Mathematics', sessions: 24, endDate: '2025-10-15', rating: 5.0 },
        { id: 2, name: 'Jennifer Lee', avatar: '👩', subject: 'Physics', sessions: 18, endDate: '2025-09-20', rating: 5.0 },
        { id: 3, name: 'Thomas Anderson', avatar: '👨', subject: 'Chemistry', sessions: 20, endDate: '2025-08-30', rating: 4.0 },
        { id: 4, name: 'Maria Garcia', avatar: '👩', subject: 'Mathematics', sessions: 16, endDate: '2025-07-10', rating: 5.0 },
    ];

    const monthlyEarnings = [
        { month: 'Jan', amount: 400 },
        { month: 'Feb', amount: 500 },
        { month: 'Mar', amount: 650 },
        { month: 'Apr', amount: 580 },
        { month: 'May', amount: 700 },
        { month: 'Jun', amount: 780 },
        { month: 'Jul', amount: 720 },
        { month: 'Aug', amount: 900 },
        { month: 'Sep', amount: 850 },
        { month: 'Oct', amount: 1000 },
    ];

    const completionRates = [75, 78, 82, 80, 85, 88, 87, 90, 92, 96];

    // Render Student List View
    if (currentView === 'students-list') {
        return (
            <StudentList
                isDark={isDark}
                setIsDark={setIsDark}
                language={language}
                setLanguage={setLanguage}
                students={dbStudents.map(req => ({
                    id: req._id,
                    name: req.studentId.profile.fullName,
                    avatar: req.studentId.profile.photoUrl ? (
                        <img src={`http://localhost:5001/uploads/${req.studentId.profile.photoUrl}`} alt="" className="w-full h-full object-cover rounded-full" />
                    ) : '👨',
                    subject: req.subject || 'IELTS',
                    status: req.status
                }))}
                onBack={() => setCurrentView('requests')}
                onSelectStudent={(student) => {
                    setSelectedStudent(student);
                    setCurrentView('student-chat');
                }}
                onJoinLecture={onJoinLecture}
            />
        );
    }

    const handleAccept = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5001/api/requests/accept/${requestId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                alert("Request accepted successfully!");
                // Refresh data
                window.location.reload();
            } else {
                const data = await res.json();
                alert(data.message || "Failed to accept request");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred");
        }
    };

    const handleReject = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5001/api/requests/reject/${requestId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                alert("Request rejected successfully!");
                window.location.reload();
            } else {
                const data = await res.json();
                alert(data.message || "Failed to reject request");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred");
        }
    };

    // Render Student Chat View
    if (currentView === 'student-chat' && selectedStudent) {
        return (
            <StudentChat
                isDark={isDark}
                setIsDark={setIsDark}
                language={language}
                setLanguage={setLanguage}
                studentName={selectedStudent.name}
                studentAvatar={selectedStudent.avatar}
                onBack={() => setCurrentView('students-list')}
            />
        );
    }

    // Terms Modal
    const termsModal = showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className={`max-w-2xl w-full rounded-lg p-6 max-h-[80vh] overflow-y-auto ${isDark ? 'bg-[#252540] text-white' : 'bg-white text-gray-900'
                }`}>
                <h2 className="text-2xl mb-4">{t.termsAndConditions}</h2>
                <div className={`space-y-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <h3 className={`${isDark ? 'text-white' : 'text-gray-900'}`}>1. Acceptance of Terms</h3>
                    <p>By accessing and using ZLearn, you accept and agree to be bound by the terms and provisions of this agreement.</p>

                    <h3 className={`${isDark ? 'text-white' : 'text-gray-900'}`}>2. Use License</h3>
                    <p>Permission is granted to temporarily use ZLearn for personal, non-commercial transitory viewing only.</p>

                    <h3 className={`${isDark ? 'text-white' : 'text-gray-900'}`}>3. Teacher Responsibilities</h3>
                    <p>Teachers must provide quality education services, maintain professionalism, and adhere to scheduled sessions.</p>

                    <h3 className={`${isDark ? 'text-white' : 'text-gray-900'}`}>4. Payment Terms</h3>
                    <p>All payments are processed securely. Teachers receive payment after successful completion of sessions.</p>

                    <h3 className={`${isDark ? 'text-white' : 'text-gray-900'}`}>5. Privacy Policy</h3>
                    <p>We are committed to protecting your privacy. Personal information is collected and used in accordance with our privacy policy.</p>

                    <h3 className={`${isDark ? 'text-white' : 'text-gray-900'}`}>6. Modifications</h3>
                    <p>ZLearn reserves the right to modify these terms at any time. Users will be notified of any significant changes.</p>
                </div>
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => setShowTerms(false)}
                        className="px-6 py-2 text-sm rounded-lg bg-[#333399] text-white hover:bg-[#4444aa] transition-all"
                    >
                        {t.close || 'Close'}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50'
            }`}>
            {termsModal}
            {/* Top Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${isDark
                ? 'bg-[#252540] border-gray-700'
                : 'bg-white border-gray-200 shadow-sm'
                }`}>
                <div className="px-4 py-3 flex items-center justify-between">
                    {/* Left: Logo and Menu */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={`p-2 rounded-lg transition-all hover:scale-110 lg:hidden ${isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'
                                }`}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className={`text-xl ${isDark ? 'text-white' : 'text-[#333399]'}`}>{t.zlearn}</h1>
                    </div>

                    {/* Right: Controls */}
                    <div className="flex items-center gap-3">
                        {/* Language Toggle */}
                        <button
                            onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
                            className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'
                                }`}
                        >
                            <Globe className="w-5 h-5" />
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'
                                }`}
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* Notifications */}
                        <div className="relative" ref={notificationsRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'
                                    }`}
                            >
                                <Bell className="w-5 h-5" />
                            </button>
                            {showNotifications && (
                                <div className={`absolute right-[-60px] sm:right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-80 rounded-lg shadow-lg border transition-all overflow-hidden z-50 ${isDark
                                    ? 'bg-[#252540] border-gray-700'
                                    : 'bg-white border-gray-200'
                                    }`}>
                                    <div className="p-4 border-b border-gray-700">
                                        <h3 className={`${isDark ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {dbNotifications.length > 0 ? dbNotifications.map((notif) => (
                                            <div key={notif._id} className={`p-4 border-b ${isDark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-100 hover:bg-gray-50'}`}>
                                                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{notif.title}</p>
                                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{notif.message}</p>
                                            </div>
                                        )) : (
                                            <div className="p-4 text-center text-gray-500">
                                                {t.noNotifications}
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
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:scale-105 ${isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'
                                    }`}
                            >
                                <div className="w-8 h-8 rounded-full bg-[#333388] flex items-center justify-center text-white overflow-hidden">
                                    {userPhoto ? (
                                        <img src={`http://localhost:5001/uploads/${userPhoto}`} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-5 h-5" />
                                    )}
                                </div>
                                <span className={`hidden md:inline`}>
                                    {userName}
                                </span>
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            {showProfileDropdown && (
                                <div className={`absolute right-[-16px] sm:right-0 mt-2 w-[calc(100vw-2rem)] max-w-[224px] sm:w-56 rounded-lg shadow-lg border transition-all z-50 ${isDark
                                    ? 'bg-[#252540] border-gray-700'
                                    : 'bg-white border-gray-200'
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
                                            className={`w-full text-center text-sm px-3 py-2 rounded transition-all hover:scale-105 ${isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'
                                                }`}
                                        >
                                            {t.viewProfile}
                                        </button>
                                        <button
                                            className={`w-full text-center text-sm px-3 py-2 rounded transition-all hover:scale-105 ${isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'
                                                }`}
                                        >
                                            {t.changePassword}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowTerms(true);
                                                setShowProfileDropdown(false);
                                            }}
                                            className={`w-full text-center text-sm px-3 py-2 rounded transition-all hover:scale-105 ${isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'
                                                }`}
                                        >
                                            {t.termsAndConditions}
                                        </button>
                                        <button
                                            onClick={onLogout}
                                            className={`w-full text-center text-sm px-3 py-2 rounded transition-all hover:scale-105 flex items-center justify-center gap-2 text-red-500 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                                }`}
                                        >
                                            <LogOut className="w-4 h-4" />
                                            {t.signOut}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex pt-16">
                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`
                    fixed lg:fixed inset-y-0 left-0 z-40
                    w-64 transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0 lg:static
                    border-r pt-16
                    ${isDark ? 'bg-[#252540] border-gray-700' : 'bg-white border-gray-200'}
                `}>
                    <div className="p-4 space-y-6">
                        {/* Dashboard Button */}
                        <button
                            onClick={() => setCurrentView('requests')}
                            className={`w-full p-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 ${currentView === 'requests'
                                ? 'bg-[#333399] text-white'
                                : isDark
                                    ? 'bg-[#1a1a2e] text-gray-300 hover:bg-gray-700'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            {t.dashboard}
                        </button>

                        {/* Wallet */}
                        <button
                            onClick={() => setCurrentView('wallet')}
                            className={`w-full p-4 rounded-lg transition-all duration-300 hover:scale-105 ${currentView === 'wallet'
                                ? 'bg-[#333399] text-white'
                                : isDark
                                    ? 'bg-[#1a1a2e] text-gray-300'
                                    : 'bg-gray-50 text-gray-700'
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <WalletIcon className="w-5 h-5" />
                                <span>{t.wallet}</span>
                            </div>
                            <p className="text-sm opacity-75">{t.currentBalance}</p>
                            <p className="text-lg">PKR {walletBalance}</p>
                        </button>

                        {/* My Students */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {t.myStudents}
                                </h3>
                                <button
                                    onClick={() => setCurrentView('students-list')}
                                    className={`text-sm hover:underline ${isDark ? 'text-[#6666ff]' : 'text-[#333399]'}`}
                                >
                                    {t.viewAll}
                                </button>
                            </div>
                            <div className="flex -space-x-2 mb-2">
                                {dbRequests.filter(r => r.status === 'accepted').slice(0, 5).map((request) => (
                                    <div
                                        key={request._id}
                                        className="w-10 h-10 rounded-full bg-[#333399] flex items-center justify-center text-white border-2 border-white dark:border-gray-800 transition-transform hover:scale-110"
                                        title={request.studentId.profile.fullName}
                                    >
                                        <User className="w-5 h-5" />
                                    </div>
                                ))}
                            </div>
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                {dbRequests.filter(r => r.status === 'accepted').length} {t.activeStudents}
                            </p>
                        </div>

                        {/* History Button */}
                        <button
                            onClick={() => setCurrentView('history')}
                            className={`w-full p-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 ${currentView === 'history'
                                ? 'bg-[#333399] text-white'
                                : isDark
                                    ? 'bg-[#1a1a2e] text-gray-300 hover:bg-gray-700'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <HistoryIcon className="w-5 h-5" />
                            {t.history}
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
                    {/* Student Requests View */}
                    {currentView === 'requests' && (
                        <div className="max-w-4xl mx-auto">
                            {/* Requests List */}
                            <div>
                                <div className={`rounded-xl p-6 transition-all duration-300 hover:shadow-2xl ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                                    }`}>
                                    <h2 className={`text-2xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {t.studentRequests}
                                    </h2>
                                    <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {t.reviewRequests}
                                    </p>

                                    <div className="space-y-4">
                                        {dbRequests.length > 0 ? dbRequests.map((request) => (
                                            <div
                                                key={request._id}
                                                className={`p-4 rounded-lg border transition-all duration-300 hover:scale-105 ${isDark
                                                    ? 'bg-[#1a1a2e] border-gray-700'
                                                    : 'bg-gray-50 border-gray-200'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-[#333399] flex items-center justify-center text-white">
                                                        <User className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className={`mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                            {request.studentId.profile.fullName}
                                                        </h3>
                                                        {request.requestedDate && (
                                                            <p className={`text-sm mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                                <span className="font-semibold">Requested Date:</span> {new Date(request.requestedDate).toLocaleString()}
                                                            </p>
                                                        )}
                                                        {request.message && (
                                                            <p className={`text-sm mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                                <span className="font-semibold">Message:</span> {request.message}
                                                            </p>
                                                        )}
                                                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                            {t.weakAreas}
                                                        </p>
                                                        <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-700'}`}>
                                                            {request.weakAreas || 'No specific weak areas mentioned.'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3 mt-4">
                                                    <button
                                                        onClick={() => handleAccept(request._id)}
                                                        className="flex-1 py-2 px-4 rounded-lg bg-[#333399] text-white hover:bg-[#4444aa] transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        {t.accept}
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(request._id)}
                                                        className={`flex-1 py-2 px-4 rounded-lg border transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 ${isDark
                                                            ? 'border-gray-700 text-gray-300 hover:bg-gray-700'
                                                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                                            }`}>
                                                        <X className="w-4 h-4" />
                                                        {t.reject}
                                                    </button>
                                                </div>
                                            </div>
                                        )) : (
                                            <p className={`text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                No student requests available.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* History View */}
                    {currentView === 'history' && (
                        <div className="space-y-6">
                            <h2 className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {t.teachingHistory}
                            </h2>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Total Students */}
                                <div className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 ${isDark ? 'bg-[#252540]' : 'bg-white shadow-md'
                                    }`}>
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {t.totalStudents}
                                            </p>
                                            <p className={`text-3xl ${isDark ? 'text-white' : 'text-gray-900'}`}>23</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                    </div>
                                </div>

                                {/* Total Sessions */}
                                <div className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 ${isDark ? 'bg-[#252540]' : 'bg-white shadow-md'
                                    }`}>
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {t.totalSessions}
                                            </p>
                                            <p className={`text-3xl ${isDark ? 'text-white' : 'text-gray-900'}`}>127</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>
                                </div>

                                {/* Avg. Rating */}
                                <div className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 ${isDark ? 'bg-[#252540]' : 'bg-white shadow-md'
                                    }`}>
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {t.avgRating}
                                            </p>
                                            <p className={`text-3xl ${isDark ? 'text-white' : 'text-gray-900'}`}>4.8 / 5.0</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                                            <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                        </div>
                                    </div>
                                </div>

                                {/* Completion Rate */}
                                <div className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 ${isDark ? 'bg-[#252540]' : 'bg-white shadow-md'
                                    }`}>
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {t.completionRate}
                                            </p>
                                            <p className={`text-3xl ${isDark ? 'text-white' : 'text-gray-900'}`}>96%</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Monthly Earnings Chart */}
                                <div className={`p-6 rounded-xl transition-all duration-300 ${isDark ? 'bg-[#252540]' : 'bg-white shadow-md'
                                    }`}>
                                    <h3 className={`text-lg mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {t.monthlyEarnings}
                                    </h3>
                                    <div className="h-80 relative px-4">
                                        {/* Y-axis labels */}
                                        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-sm text-gray-600 dark:text-gray-400 pr-4">
                                            <span>1200</span>
                                            <span>900</span>
                                            <span>600</span>
                                            <span>300</span>
                                            <span>0</span>
                                        </div>

                                        {/* Chart area */}
                                        <div className="ml-12 h-full pb-8">
                                            {/* Bars container */}
                                            <div className="relative h-full flex items-end justify-around gap-4">
                                                {monthlyEarnings.map((data, index) => {
                                                    const maxAmount = 1200;
                                                    const heightPercent = (data.amount / maxAmount) * 100;
                                                    return (
                                                        <div key={index} className="flex flex-col items-center flex-1 max-w-[40px]">
                                                            <div className="w-full flex flex-col items-center justify-end h-full relative group">
                                                                {/* Value on hover */}
                                                                <span className={`absolute -top-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                                    ${data.amount}
                                                                </span>
                                                                {/* Bar */}
                                                                <div
                                                                    className="w-8 bg-[#333399] hover:bg-[#4444aa] transition-all cursor-pointer"
                                                                    style={{ height: `${heightPercent}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* X-axis labels */}
                                        <div className="flex justify-around mt-3 ml-12">
                                            {monthlyEarnings.map((data, index) => (
                                                <span key={index} className={`flex-1 text-center text-sm max-w-[40px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {data.month}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Completion Rate Chart */}
                                <div className={`p-6 rounded-xl transition-all duration-300 ${isDark ? 'bg-[#252540]' : 'bg-white shadow-md'
                                    }`}>
                                    <h3 className={`text-lg mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {t.completionRate} (%)
                                    </h3>
                                    <div className="h-64">
                                        <div className="relative h-full border-b border-l border-gray-300 dark:border-gray-600 pb-8 pl-8">
                                            {/* Y-axis labels */}
                                            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 pr-2">
                                                <span>100</span>
                                                <span>75</span>
                                                <span>50</span>
                                                <span>25</span>
                                                <span>0</span>
                                            </div>

                                            {/* Grid lines */}
                                            <div className="absolute inset-0 ml-8 mb-8">
                                                {[0, 25, 50, 75, 100].map((val, i) => (
                                                    <div
                                                        key={i}
                                                        className="absolute w-full border-t border-dashed border-gray-200 dark:border-gray-700"
                                                        style={{ bottom: `${val}%` }}
                                                    />
                                                ))}
                                            </div>

                                            {/* Line chart */}
                                            <svg className="w-full h-full relative z-10" viewBox="0 0 500 200" preserveAspectRatio="none">
                                                <defs>
                                                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" stopColor="#333399" />
                                                        <stop offset="100%" stopColor="#6666ff" />
                                                    </linearGradient>
                                                </defs>

                                                {/* Line */}
                                                <polyline
                                                    points={completionRates.map((rate, i) => {
                                                        const x = (i * 500) / (completionRates.length - 1);
                                                        const y = 200 - (rate * 2);
                                                        return `${x},${y}`;
                                                    }).join(' ')}
                                                    fill="none"
                                                    stroke="url(#lineGradient)"
                                                    strokeWidth="3"
                                                />

                                                {/* Points */}
                                                {completionRates.map((rate, i) => {
                                                    const x = (i * 500) / (completionRates.length - 1);
                                                    const y = 200 - (rate * 2);
                                                    return (
                                                        <circle
                                                            key={i}
                                                            cx={x}
                                                            cy={y}
                                                            r="5"
                                                            fill="#333399"
                                                            className="hover:r-7 transition-all cursor-pointer"
                                                        />
                                                    );
                                                })}
                                            </svg>
                                        </div>
                                        {/* X-axis labels */}
                                        <div className="flex justify-between mt-2 pl-8">
                                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((month, index) => (
                                                <span key={index} className={`flex-1 text-center text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {month}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Past Students Table */}
                            <div className={`rounded-xl p-6 transition-all duration-300 hover:shadow-2xl ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                                }`}>
                                <h3 className={`text-xl mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {t.pastStudents}
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                                <th className={`text-left py-3 px-4 ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
                                                    {t.studentCol}
                                                </th>
                                                <th className={`text-left py-3 px-4 ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
                                                    {t.subject}
                                                </th>
                                                <th className={`text-left py-3 px-4 ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
                                                    {t.sessions}
                                                </th>
                                                <th className={`text-left py-3 px-4 ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
                                                    {t.endDate}
                                                </th>
                                                <th className={`text-left py-3 px-4 ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
                                                    {t.rating}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pastStudents.map((student) => (
                                                <tr
                                                    key={student.id}
                                                    className={`border-b transition-all hover:scale-105 ${isDark
                                                        ? 'border-gray-700 hover:bg-gray-700'
                                                        : 'border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-[#333399] flex items-center justify-center text-white">
                                                                {student.avatar}
                                                            </div>
                                                            <span className={isDark ? 'text-white' : 'text-gray-900'}>
                                                                {student.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="px-2 py-1 rounded text-xs text-white bg-[#333399]">
                                                            {student.subject}
                                                        </span>
                                                    </td>
                                                    <td className={`py-3 px-4 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                                                        {student.sessions}
                                                    </td>
                                                    <td className={`py-3 px-4 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                                                        {student.endDate}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-4 h-4 ${i < Math.floor(student.rating)
                                                                        ? 'fill-[#333399] text-[#333399]'
                                                                        : isDark ? 'text-gray-600' : 'text-gray-400'
                                                                        }`}
                                                                />
                                                            ))}
                                                            <span className={`ml-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                                                                {student.rating}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Profile View */}
                    {currentView === 'profile' && (
                        <div className="max-w-2xl mx-auto">
                            <div className={`rounded-xl p-6 transition-all duration-300 hover:shadow-2xl ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                                }`}>
                                <h2 className={`text-2xl mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {t.userProfile}
                                </h2>

                                <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full bg-[#333388] flex items-center justify-center text-white text-4xl overflow-hidden border-4 border-[#333388]">
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            ) : userPhoto ? (
                                                <img src={`http://localhost:5001/uploads/${userPhoto}`} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                userName.charAt(0).toUpperCase()
                                            )}
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
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
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

                                <div className={`p-4 rounded-lg border ${isDark ? 'border-gray-700 bg-[#1a1a2e]' : 'border-gray-200 bg-gray-50'
                                    }`}>
                                    <h4 className={`mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Account Security
                                    </h4>
                                    <button
                                        onClick={() => setShowPasswordModal(true)}
                                        className="py-2 px-4 rounded-lg bg-[#333388] text-white hover:bg-[#4444aa] transition-all flex items-center gap-2"
                                    >
                                        <Key className="w-4 h-4" />
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Wallet View */}
                    {currentView === 'wallet' && (
                        <div className="max-w-2xl mx-auto space-y-6">
                            <div className={`rounded-xl p-6 transition-all duration-300 hover:shadow-2xl ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                                }`}>
                                <h2 className={`text-2xl mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {t.wallet}
                                </h2>

                                <div className="text-center mb-6">
                                    <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {t.currentBalance}
                                    </p>
                                    <p className={`text-5xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        $1,250.00
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <input
                                        type="number"
                                        placeholder={t.enterAmount}
                                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:scale-105 ${isDark
                                            ? 'bg-[#1a1a2e] border-gray-700 text-white placeholder-gray-500'
                                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                                            }`}
                                    />
                                    <button className="w-full py-3 rounded-lg bg-[#333399] text-white hover:bg-[#4444aa] transition-all duration-300 hover:scale-105">
                                        {t.withdrawFunds}
                                    </button>
                                </div>
                            </div>

                            <div className={`rounded-xl p-6 transition-all duration-300 hover:shadow-2xl ${isDark ? 'bg-[#252540]' : 'bg-white shadow-lg'
                                }`}>
                                <h3 className={`text-xl mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {t.transactionHistory}
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { date: '2025-11-10', amount: '+$120.00', type: 'Earned' },
                                        { date: '2025-11-05', amount: '-$500.00', type: 'Withdrawn' },
                                        { date: '2025-11-01', amount: '+$200.00', type: 'Earned' },
                                    ].map((transaction, i) => (
                                        <div
                                            key={i}
                                            className={`p-3 rounded-lg border flex justify-between items-center transition-all hover:scale-105 ${isDark
                                                ? 'border-gray-700 bg-[#1a1a2e]'
                                                : 'border-gray-200 bg-gray-50'
                                                }`}
                                        >
                                            <div>
                                                <p className={isDark ? 'text-white' : 'text-gray-900'}>
                                                    {transaction.type}
                                                </p>
                                                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    {transaction.date}
                                                </p>
                                            </div>
                                            <p className={`${transaction.amount.startsWith('+') ? 'text-green-500' : 'text-red-500'
                                                }`}>
                                                {transaction.amount}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                {/* Password Modal */}
                {showPasswordModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className={`max-w-md w-full rounded-xl p-6 ${isDark ? 'bg-[#252540]' : 'bg-white shadow-xl'}`}>
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
                                    <label className={`block text-sm mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#333399] outline-none transition-all ${isDark ? 'bg-[#1a1a2e] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#333399] outline-none transition-all ${isDark ? 'bg-[#1a1a2e] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#333399] outline-none transition-all ${isDark ? 'bg-[#1a1a2e] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                                    />
                                </div>

                                {statusMessage.text && statusMessage.type === 'error' && (
                                    <p className="text-red-500 text-sm">{statusMessage.text}</p>
                                )}

                                <button
                                    onClick={async () => {
                                        if (passwordData.newPassword !== passwordData.confirmPassword) {
                                            setStatusMessage({ type: 'error', text: 'Passwords do not match!' });
                                            return;
                                        }
                                        try {
                                            await updatePassword(passwordData.currentPassword, passwordData.newPassword);
                                            setShowPasswordModal(false);
                                            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                            setStatusMessage({ type: 'success', text: 'Password updated successfully!' });
                                            setTimeout(() => setStatusMessage({ type: '', text: '' }), 3000);
                                        } catch (err) {
                                            setStatusMessage({ type: 'error', text: err.message || 'Failed to update password.' });
                                        }
                                    }}
                                    className="w-full py-3 rounded-lg bg-[#333388] text-white hover:bg-[#4444aa] transition-all hover:scale-105"
                                >
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
