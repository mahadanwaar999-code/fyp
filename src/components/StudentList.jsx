import { ArrowLeft, Moon, Sun, Globe } from 'lucide-react';
import { translations } from '../translations';

export function StudentList({ isDark, setIsDark, language, setLanguage, students, onBack, onSelectStudent, onJoinLecture }) {
    const t = translations[language];

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50'
            }`}>
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'
                                }`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h2 className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {t.myStudents}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
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
                    </div>
                </div>

                {/* Student Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {students.map((student) => (
                        <button
                            key={student.id}
                            onClick={() => onSelectStudent(student)}
                            className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl text-left ${isDark ? 'bg-[#252540] hover:bg-[#2a2a50]' : 'bg-white shadow-lg hover:shadow-xl'
                                }`}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full bg-[#333399] flex items-center justify-center text-white text-xl">
                                    {student.avatar}
                                </div>
                                <div>
                                    <h3 className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {student.name}
                                    </h3>
                                    {student.subject && (
                                        <span className="inline-block px-2 py-1 rounded text-xs text-white bg-[#333399] mt-1">
                                            {student.subject}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {student.status && (
                                <div className="flex justify-between items-center mt-4">
                                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {student.status}
                                    </p>
                                    {onJoinLecture && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onJoinLecture(student.id); }}
                                            className="px-3 py-1.5 bg-[#333399] hover:bg-[#4444aa] text-white text-sm rounded-lg transition-colors"
                                        >
                                            Join Lecture
                                        </button>
                                    )}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
