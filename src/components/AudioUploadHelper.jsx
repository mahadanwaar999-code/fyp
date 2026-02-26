import React from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

export function AudioUploadHelper({ isDark }) {
    const [uploadStatus, setUploadStatus] = React.useState({
        1: false,
        2: false,
        3: false,
        4: false,
    });

    const checkAudioFiles = async () => {
        const results = {};

        for (let i = 1; i <= 4; i++) {
            try {
                const response = await fetch(`/audio/listening/section${i}.mp3`, { method: 'HEAD' });
                results[i] = response.ok;
            } catch {
                results[i] = false;
            }
        }

        setUploadStatus(results);
    };

    React.useEffect(() => {
        checkAudioFiles();
    }, []);

    const allFilesPresent = Object.values(uploadStatus).every(status => status);

    return (
        <div className={`p-4 rounded-lg border ${isDark
                ? 'bg-[#1a1a2e] border-gray-700'
                : 'bg-gray-50 border-gray-200'
            }`}>
            <div className="flex items-start gap-3 mb-3">
                {allFilesPresent ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                    <h4 className={`text-sm mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {allFilesPresent ? 'Audio Files Ready' : 'Audio Files Required'}
                    </h4>
                    <p className={`text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {allFilesPresent
                            ? 'All listening section audio files are available.'
                            : 'Please add MP3 audio files to enable the listening test.'}
                    </p>

                    <div className="space-y-2">
                        {[1, 2, 3, 4].map((section) => (
                            <div key={section} className="flex items-center gap-2">
                                {uploadStatus[section] ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                    <Upload className="w-4 h-4 text-gray-400" />
                                )}
                                <span className={`text-xs ${uploadStatus[section]
                                        ? 'text-green-600'
                                        : isDark ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                    section{section}.mp3 {uploadStatus[section] ? '✓' : '(missing)'}
                                </span>
                            </div>
                        ))}
                    </div>

                    {!allFilesPresent && (
                        <div className={`mt-3 p-3 rounded text-xs ${isDark ? 'bg-[#252540]' : 'bg-white'
                            }`}>
                            <p className={`mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                <strong>Quick Setup:</strong>
                            </p>
                            <ol className={`list-decimal list-inside space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                <li>Create folder: <code className="bg-black/20 px-1 rounded">/public/audio/listening/</code></li>
                                <li>Add MP3 files named: section1.mp3, section2.mp3, section3.mp3, section4.mp3</li>
                                <li>See <code className="bg-black/20 px-1 rounded">/public/audio/README.md</code> for download sources</li>
                            </ol>

                            <button
                                onClick={checkAudioFiles}
                                className={`mt-3 px-3 py-1.5 rounded text-xs transition-all ${isDark
                                        ? 'bg-[#333399] text-white hover:bg-[#4444aa]'
                                        : 'bg-[#333399] text-white hover:bg-[#4444aa]'
                                    }`}
                            >
                                Check Files Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
