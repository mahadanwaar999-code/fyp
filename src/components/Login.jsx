import { Moon, Sun, Globe } from 'lucide-react';
import { translations } from '../translations';

export function Login({ isDark, setIsDark, language, setLanguage, role, onSignUpClick, onBack, onLogin }) {
    const t = translations[language];

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const identifier = formData.get('identifier');
        const password = formData.get('password');
        onLogin(identifier, password);
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark
            ? 'bg-[#1a1a2e]'
            : 'bg-gray-50'
            }`}>
            {/* Header with Theme & Language Toggle */}
            <header className="flex justify-end items-center px-4 py-4 sm:px-8 sm:py-6 gap-3">
                {/* Language Toggle */}
                <button
                    onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
                    className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    title={language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
                >
                    <Globe className="w-5 h-5" />
                </button>

                {/* Theme Toggle */}
                <button
                    onClick={() => setIsDark(!isDark)}
                    className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
            </header>

            {/* Main Content */}
            <main className="flex items-center justify-center px-4 pt-4 sm:pt-8">
                <div className={`w-full max-w-md rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl ${isDark
                    ? 'bg-[#252540]'
                    : 'bg-white shadow-lg'
                    }`}>
                    {/* Logo and Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl mb-2 text-[#333399]">
                            {t.zlearn}
                        </h1>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                            {t.signInToAccount}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email or Phone Number */}
                        <div>
                            <label className={`block mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                {t.emailOrPhone}
                            </label>
                            <input
                                type="text"
                                name="identifier"
                                placeholder="Email or Phone Number"
                                required
                                className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:scale-105 focus:shadow-lg ${isDark
                                    ? 'bg-[#1a1a2e] border-gray-700 text-white placeholder-gray-500 focus:border-[#333399]'
                                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#333399]'
                                    }`}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className={`block mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                {t.password}
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                required
                                className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:scale-105 focus:shadow-lg ${isDark
                                    ? 'bg-[#1a1a2e] border-gray-700 text-white placeholder-gray-500 focus:border-[#333399]'
                                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#333399]'
                                    }`}
                            />
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="text-[#333399] hover:text-[#4444aa] transition-all hover:scale-105"
                            >
                                {t.forgotPassword}
                            </button>
                        </div>

                        {/* Sign In Button */}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-full max-w-xs py-3 rounded-lg bg-[#333399] text-white hover:bg-[#4444aa] transition-all duration-300 hover:scale-105 text-center"
                            >
                                {t.signIn}
                            </button>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center mt-4">
                            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                {t.dontHaveAccount}{' '}
                            </span>
                            <button
                                type="button"
                                onClick={onSignUpClick}
                                className="text-[#333399] hover:text-[#4444aa] transition-all hover:scale-105"
                            >
                                {t.signUp}
                            </button>
                        </div>
                    </form>

                    {/* Back Button */}
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={onBack}
                            className={`w-full max-w-xs py-2 rounded-lg border transition-all duration-300 hover:scale-105 text-center ${isDark
                                ? 'border-gray-700 text-gray-300 hover:bg-gray-700'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {t.backToRoleSelection}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
