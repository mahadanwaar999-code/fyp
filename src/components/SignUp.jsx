import { useState } from 'react';
import { Moon, Sun, Upload, ArrowUp, Globe } from 'lucide-react';
import { translations } from '../translations';
import { useAuth } from '../context/AuthContext';

export function SignUp({ isDark, setIsDark, language, setLanguage, role, onSignInClick, onBack, onSignUp }) {
    const [step, setStep] = useState(1);
    const [signUpMethod, setSignUpMethod] = useState('phone');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const [documents, setDocuments] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        identifier: '', // email or phone
        password: '',
        confirmPassword: ''
    });

    const t = translations[language];

    const handleProfilePicUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePic(e.target.files[0].name);
        }
    };

    const handleDocumentsUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setDocuments(e.target.files[0].name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const signupData = {
            fullName: formData.fullName,
            password: formData.password,
            photoUrl: profilePic || ''
        };

        if (signUpMethod === 'email') {
            signupData.email = formData.identifier;
        } else {
            signupData.phoneNumber = formData.identifier;
        }

        if (role === 'teacher') {
            signupData.ieltsCertificate = documents || '';
        }

        onSignUp(signupData);
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
            <main className="flex items-center justify-center px-4 pt-2">
                <div className={`w-full max-w-md rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl ${isDark
                    ? 'bg-[#252540]'
                    : 'bg-white shadow-lg'
                    }`}>
                    {/* Logo and Title */}
                    <div className="text-center mb-6">
                        <h1 className="text-3xl mb-2 text-[#333399]">
                            {t.zlearn}
                        </h1>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                            {t.createYourAccount}
                        </p>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${step === 1 ? 'bg-[#333399]' : 'bg-gray-400'
                            }`}>
                            1
                        </div>
                        <div className={`w-12 h-0.5 ${step === 2 ? 'bg-[#333399]' : 'bg-gray-400'
                            }`}></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-[#333399] text-white' : 'bg-gray-300 text-gray-600'
                            }`}>
                            2
                        </div>
                    </div>

                    {/* Step 1 Form */}
                    {step === 1 && (
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                            {/* Full Name */}
                            <div>
                                <label className={`block mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    {t.fullName}
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    placeholder={t.enterFullName}
                                    required
                                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:scale-105 focus:shadow-lg ${isDark
                                        ? 'bg-[#1a1a2e] border-gray-700 text-white placeholder-gray-500 focus:border-[#333399]'
                                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#333399]'
                                        }`}
                                />
                            </div>

                            {/* Sign up with toggle */}
                            <div>
                                <label className={`block mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    {t.signUpWith}
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSignUpMethod('phone')}
                                        className={`flex-1 py-2 rounded-lg transition-all duration-300 hover:scale-105 text-center ${signUpMethod === 'phone'
                                            ? 'bg-[#333399] text-white'
                                            : isDark
                                                ? 'bg-[#1a1a2e] text-gray-300 border border-gray-700'
                                                : 'bg-gray-50 text-gray-600 border border-gray-300'
                                            }`}
                                    >
                                        {t.phone}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSignUpMethod('email')}
                                        className={`flex-1 py-2 rounded-lg transition-all duration-300 hover:scale-105 text-center ${signUpMethod === 'email'
                                            ? 'bg-[#333399] text-white'
                                            : isDark
                                                ? 'bg-[#1a1a2e] text-gray-300 border border-gray-700'
                                                : 'bg-gray-50 text-gray-600 border border-gray-300'
                                            }`}
                                    >
                                        {t.email}
                                    </button>
                                </div>
                            </div>

                            {/* Email Address / Phone Number */}
                            <div>
                                <label className={`block mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    {signUpMethod === 'email' ? t.emailAddress : t.phoneNumber}
                                </label>
                                <input
                                    type={signUpMethod === 'email' ? 'email' : 'tel'}
                                    value={formData.identifier}
                                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                                    placeholder={signUpMethod === 'email' ? 'example@email.com' : t.enterPhoneNumber}
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
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    required
                                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:scale-105 focus:shadow-lg ${isDark
                                        ? 'bg-[#1a1a2e] border-gray-700 text-white placeholder-gray-500 focus:border-[#333399]'
                                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#333399]'
                                        }`}
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className={`block mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    {t.confirmPassword}
                                </label>
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder={t.confirmPasswordPlaceholder}
                                    required
                                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:scale-105 focus:shadow-lg ${isDark
                                        ? 'bg-[#1a1a2e] border-gray-700 text-white placeholder-gray-500 focus:border-[#333399]'
                                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#333399]'
                                        }`}
                                />
                            </div>

                            {/* Next Button */}
                            <button
                                type="submit"
                                className="w-full py-3 rounded-lg bg-[#333399] text-white hover:bg-[#4444aa] transition-all duration-300 hover:scale-105 mt-6 text-center"
                            >
                                {t.next}
                            </button>

                            {/* Sign In Link */}
                            <div className="text-center mt-4">
                                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                    {t.alreadyHaveAccount}{' '}
                                </span>
                                <button
                                    type="button"
                                    onClick={onSignInClick}
                                    className={`hover:text-[#4444aa] transition-all hover:scale-105 ${isDark ? 'text-[#6666ff]' : 'text-[#333399]'}`}
                                >
                                    {t.signIn2}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 2 Form */}
                    {step === 2 && (
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* Upload Profile Pic */}
                            <div>
                                <label className={`block mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    {t.uploadProfilePic}
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="profile-pic"
                                        accept="image/*"
                                        onChange={handleProfilePicUpload}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="profile-pic"
                                        className={`flex items-center justify-between w-full px-4 py-3 rounded-lg border cursor-pointer transition-all duration-300 hover:scale-105 ${isDark
                                            ? 'bg-[#1a1a2e] border-gray-700 text-gray-300 hover:border-gray-600'
                                            : 'bg-gray-50 border-gray-300 text-gray-600 hover:border-gray-400'
                                            }`}
                                    >
                                        <span>{profilePic || t.clickToUploadProfile}</span>
                                        <Upload className="w-4 h-4" />
                                    </label>
                                </div>
                            </div>

                            {/* Upload Documents (Teacher only) */}
                            {role === 'teacher' && (
                                <div>
                                    <label className={`block mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                        {t.uploadIeltsCertificate}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id="documents"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleDocumentsUpload}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="documents"
                                            className={`flex flex-col items-center justify-center w-full px-4 py-8 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-300 hover:scale-105 ${isDark
                                                ? 'bg-[#1a1a2e] border-gray-700 text-gray-500 hover:border-gray-600'
                                                : 'bg-gray-50 border-gray-300 text-gray-400 hover:border-gray-400'
                                                }`}
                                        >
                                            <ArrowUp className="w-6 h-6 mb-2" />
                                            <span className="text-center">
                                                {documents || t.clickToUploadIelts}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Terms and Conditions */}
                            <div className="flex items-start gap-2 mt-4">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="mt-1 w-4 h-4 rounded border-gray-400 text-[#333399] focus:ring-[#333399]"
                                />
                                <label
                                    htmlFor="terms"
                                    className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                                >
                                    {t.agreeToTerms}
                                </label>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className={`flex-1 py-3 rounded-lg border transition-all duration-300 hover:scale-105 text-center ${isDark
                                        ? 'border-gray-700 text-gray-300 hover:bg-gray-700'
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {t.back}
                                </button>
                                <button
                                    type="submit"
                                    disabled={!agreedToTerms}
                                    className={`flex-1 py-3 rounded-lg transition-all duration-300 hover:scale-105 text-center ${agreedToTerms
                                        ? 'bg-[#333399] text-white hover:bg-[#4444aa]'
                                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                        }`}
                                >
                                    {t.signUp}
                                </button>
                            </div>

                            {/* Sign In Link */}
                            <div className="text-center mt-4">
                                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                    {t.alreadyHaveAccount}{' '}
                                </span>
                                <button
                                    type="button"
                                    onClick={onSignInClick}
                                    className={`hover:text-[#4444aa] transition-all hover:scale-105 ${isDark ? 'text-[#6666ff]' : 'text-[#333399]'}`}
                                >
                                    {t.signIn2}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Back to Role Selection (only on step 1) */}
                    {step === 1 && (
                        <button
                            onClick={onBack}
                            className={`mt-4 w-full py-2 rounded-lg border transition-all duration-300 hover:scale-105 text-center ${isDark
                                ? 'border-gray-700 text-gray-300 hover:bg-gray-700'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {t.backToRoleSelection}
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}
