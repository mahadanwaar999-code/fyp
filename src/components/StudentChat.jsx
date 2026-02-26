import { useState } from 'react';
import { Video, Send, Upload, ArrowLeft, Paperclip, Moon, Sun, Globe } from 'lucide-react';
import { translations } from '../translations';

export function StudentChat({ isDark, setIsDark, language, setLanguage, studentName, studentAvatar, onBack }) {
    const t = translations[language];
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const chatMessages = [
        { id: 1, text: 'Hello! I need help with Chemistry.', time: '10:30 AM', sender: 'student' },
        { id: 2, text: 'Of course! What time works best for you?', time: '10:32 AM', sender: 'teacher' },
        { id: 3, text: 'How about 3 PM?', time: '10:35 AM', sender: 'student' },
    ];

    const handleFileUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0].name);
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50'
            }`}>
            <div className="max-w-4xl mx-auto h-screen flex flex-col">
                {/* Header */}
                <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'bg-[#252540] border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'
                                }`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-[#333399] flex items-center justify-center text-white text-xl">
                            {studentAvatar}
                        </div>
                        <div>
                            <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>{studentName}</p>
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Online</p>
                        </div>
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

                        {/* Video Call */}
                        <button className="p-2 rounded-lg bg-[#333399] text-white hover:bg-[#4444aa] transition-all hover:scale-110">
                            <Video className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {chatMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === 'teacher'
                                        ? 'bg-[#333399] text-white'
                                        : isDark
                                            ? 'bg-[#252540] text-white'
                                            : 'bg-gray-100 text-gray-900'
                                    }`}
                            >
                                <p>{msg.text}</p>
                                <p className={`text-xs mt-1 ${msg.sender === 'teacher' ? 'text-gray-200' : isDark ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    {msg.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className={`p-4 border-t ${isDark ? 'bg-[#252540] border-gray-700' : 'bg-white border-gray-200'
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
                            placeholder={t.typeMessage}
                            className={`flex-1 px-4 py-2 rounded-lg border transition-all duration-300 ${isDark
                                    ? 'bg-[#1a1a2e] border-gray-700 text-white placeholder-gray-400'
                                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                                }`}
                        />
                        <button className="p-3 rounded-lg bg-[#333399] text-white hover:bg-[#4444aa] transition-all hover:scale-110">
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
