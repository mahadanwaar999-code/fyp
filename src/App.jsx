import { useState } from 'react';
import { Moon, Sun, BookOpen, IdCard, Globe } from 'lucide-react';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { TeacherPanel } from './components/TeacherPanel';
import { StudentPanel } from './components/StudentPanel';
import LectureRoom from './components/LectureRoom';
import { translations } from './translations';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { user, role, loading, login, signup, logout } = useAuth();
  const [isDark, setIsDark] = useState(true);
  const [language, setLanguage] = useState('en');
  const [currentPage, setCurrentPage] = useState('role-selection');
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeSessionId, setActiveSessionId] = useState(null);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e] text-white">Loading...</div>;
  }

  const t = translations[language];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setCurrentPage('login');
  };

  const handleBackToRoleSelection = () => {
    setCurrentPage('role-selection');
    setSelectedRole(null);
  };

  const handleLogin = async (identifier, password) => {
    try {
      await login(identifier, password);
      if (selectedRole === 'teacher') {
        setCurrentPage('teacher-panel');
      } else if (selectedRole === 'student') {
        setCurrentPage('student-panel');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  const handleSignUp = async (data) => {
    try {
      await signup({ ...data, role: selectedRole });
      if (selectedRole === 'teacher') {
        setCurrentPage('teacher-panel');
      } else if (selectedRole === 'student') {
        setCurrentPage('student-panel');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  const handleLogoutClick = () => {
    logout();
    setCurrentPage('role-selection');
    setSelectedRole(null);
  };

  const handleJoinLecture = async (requestId) => {
    try {
      const res = await fetch(`http://localhost:5001/api/lecture-sessions/by-request/${requestId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const session = await res.json();
        setActiveSessionId(session._id);
        setCurrentPage('lecture-room');
      } else {
        alert("Lecture session not found or not active yet.");
      }
    } catch (e) {
      console.error(e);
      alert("Error joining lecture.");
    }
  };

  // Render Teacher Panel
  if (currentPage === 'teacher-panel' && user && role === 'teacher') {
    return (
      <TeacherPanel
        isDark={isDark}
        setIsDark={setIsDark}
        language={language}
        setLanguage={setLanguage}
        userName={user.profile.fullName || 'John Doe'}
        userEmail={user.auth.email || user.auth.phoneNumber}
        userPhoto={user.profile.photoUrl}
        onLogout={handleLogoutClick}
        onJoinLecture={handleJoinLecture}
      />
    );
  }

  // Render Student Panel
  if (currentPage === 'student-panel' && user && role === 'student') {
    return (
      <StudentPanel
        isDark={isDark}
        setIsDark={setIsDark}
        language={language}
        setLanguage={setLanguage}
        userName={user.profile.fullName || 'Jane Smith'}
        userEmail={user.auth.email || user.auth.phoneNumber}
        userPhoto={user.profile.photoUrl}
        onLogout={handleLogoutClick}
        onJoinLecture={handleJoinLecture}
      />
    );
  }

  // Render Lecture Room
  if (currentPage === 'lecture-room' && activeSessionId) {
    return (
      <LectureRoom
        sessionId={activeSessionId}
        user={user}
        role={role}
        onExit={() => {
          setActiveSessionId(null);
          setCurrentPage(role === 'teacher' ? 'teacher-panel' : 'student-panel');
        }}
      />
    );
  }

  // Render Login Page
  if (currentPage === 'login' && selectedRole) {
    return (
      <Login
        isDark={isDark}
        setIsDark={setIsDark}
        language={language}
        setLanguage={setLanguage}
        role={selectedRole}
        onSignUpClick={() => setCurrentPage('signup')}
        onBack={handleBackToRoleSelection}
        onLogin={handleLogin}
      />
    );
  }

  // Render SignUp Page
  if (currentPage === 'signup' && selectedRole) {
    return (
      <SignUp
        isDark={isDark}
        setIsDark={setIsDark}
        language={language}
        setLanguage={setLanguage}
        role={selectedRole}
        onSignInClick={() => setCurrentPage('login')}
        onBack={handleBackToRoleSelection}
        onSignUp={handleSignUp}
      />
    );
  }

  // Render Role Selection Page
  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark
      ? 'bg-[#1a1a2e]'
      : 'bg-gray-50'
      }`}>
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
        {/* Empty spacer for larger screens */}
        <div className="flex-1"></div>

        {/* Logo - centered on all screens */}
        <div className="flex flex-1 justify-center items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#333399] flex items-center justify-center transition-transform hover:scale-110">
            <span className="text-white font-bold text-base sm:text-xl">Z</span>
          </div>
          <span className={`text-lg sm:text-xl md:text-2xl tracking-tight ${isDark ? 'text-white' : 'text-black'
            }`}>
            {t.zlearn}
          </span>
        </div>

        {/* Theme & Language Toggle - with proper spacing on mobile */}
        <div className="flex flex-1 justify-end gap-2 sm:gap-3">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
            className="p-2 sm:p-2.5 md:p-3 rounded-lg bg-[#333399] text-white hover:bg-[#4444aa] transition-all hover:scale-105"
            title={language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
          >
            <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 sm:p-2.5 md:p-3 rounded-lg bg-[#333399] text-white hover:bg-[#4444aa] transition-all hover:scale-105"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pb-12">
        {/* Title Section */}
        <div className="text-center mb-24 sm:mb-32 md:mb-40">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-[#5252d4] transition-all">
            {t.chooseYourRole}
          </h1>
          <p className={`text-lg sm:text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
            {t.roleDescription}
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 max-w-5xl mx-auto w-full">
          {/* Student Card */}
          <div className={`rounded-3xl p-8 sm:p-10 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isDark
            ? 'bg-[#252540] hover:bg-[#2a2a50]'
            : 'bg-white shadow-lg hover:shadow-xl'
            }`}>
            {/* Icon */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${isDark
                ? 'bg-[#333399]/20'
                : 'bg-[#333399]/10'
                }`}>
                <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-[#5252d4]" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-8 sm:mb-10">
              <h2 className={`text-2xl sm:text-3xl font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-[#333399]'
                }`}>
                {t.student}
              </h2>
              <p className={`text-base sm:text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                {t.studentDescription}
              </p>
            </div>

            {/* Button */}
            <button
              onClick={() => handleRoleSelect('student')}
              className="w-full py-3 sm:py-4 text-lg font-medium rounded-xl bg-[#5252d4] text-white hover:bg-[#6262e4] transition-all duration-300 hover:scale-105 text-center"
            >
              {t.selectStudent}
            </button>
          </div>

          {/* Teacher Card */}
          <div className={`rounded-3xl p-8 sm:p-10 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isDark
            ? 'bg-[#252540] hover:bg-[#2a2a50]'
            : 'bg-white shadow-lg hover:shadow-xl'
            }`}>
            {/* Icon */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${isDark
                ? 'bg-[#333399]/20'
                : 'bg-[#333399]/10'
                }`}>
                <IdCard className="w-10 h-10 sm:w-12 sm:h-12 text-[#5252d4]" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-8 sm:mb-10">
              <h2 className={`text-2xl sm:text-3xl font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-[#333399]'
                }`}>
                {t.teacher}
              </h2>
              <p className={`text-base sm:text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                {t.teacherDescription}
              </p>
            </div>

            {/* Button */}
            <button
              onClick={() => handleRoleSelect('teacher')}
              className="w-full py-3 sm:py-4 text-lg font-medium rounded-xl bg-[#5252d4] text-white hover:bg-[#6262e4] transition-all duration-300 hover:scale-105 text-center"
            >
              {t.selectTeacher}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}