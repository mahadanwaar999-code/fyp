import React from 'react';
import QuestionFactory from './QuestionTypes/QuestionFactory';

const PartRenderer = ({ part }) => {
    if (!part) return null;

    // Debug: Log part structure
    console.log('PartRenderer - Full part data:', part);
    console.log('Part number:', part.partNumber);
    console.log('Has noteCompletion:', !!part.noteCompletion);
    console.log('Has matching:', !!part.matching);
    if (part.matching) {
        console.log('Matching options:', part.matching.options);
        console.log('Matching topicOptions:', part.matching.topicOptions);
        console.log('Matching questions:', part.matching.questions);
    }

    return (
        <div className="space-y-8">
            {/* 1. Direct Questions */}
            {part.questions && part.questions.length > 0 && (
                <div className="space-y-4">
                    {part.questions.map((q, idx) => (
                        <QuestionFactory key={q.qNumber || idx} question={q} />
                    ))}
                </div>
            )}

            {/* 2. Sections / SubSections */}
            {((part.sections && part.sections.length > 0) || (part.subSections && part.subSections.length > 0)) &&
                ((part.sections && part.sections.length > 0) ? part.sections : part.subSections).map((section, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded border">
                        {section.title && <h3 className="font-bold mb-3">{section.title}</h3>}
                        <div className="space-y-4">
                            {section.questions && section.questions.map((q, qIdx) => (
                                <QuestionFactory key={q.qNumber || qIdx} question={q} />
                            ))}
                        </div>
                    </div>
                ))}

            {/* 3. Multiple Choice Array (Mixed) */}
            {part.multipleChoice && part.multipleChoice.length > 0 && (
                <div className="space-y-6">
                    {part.multipleChoice.map((q, idx) => (
                        <QuestionFactory key={q.qNumber || idx} question={q} />
                    ))}
                </div>
            )}

            {/* 4. Map Labelling */}
            {part.mapLabelling && (
                <div className="bg-gray-50 p-4 rounded">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="w-full">
                            {part.mapLabelling.title && <h3 className="font-bold mb-2">{part.mapLabelling.title}</h3>}
                            {part.mapLabelling.imageUrl && (
                                <img
                                    src={`http://127.0.0.1:5001/public/listening-media${part.mapLabelling.imageUrl}`}
                                    alt="Map"
                                    className="w-full max-w-full rounded border"
                                    onError={(e) => {
                                        console.error('Image failed to load:', e.target.src);
                                        e.target.style.display = 'none';
                                    }}
                                />
                            )}
                        </div>
                        <div className="space-y-3 w-full overflow-hidden">
                            {part.mapLabelling.labels && part.mapLabelling.labels.length > 0 && (
                                <p className="font-medium text-gray-700 mb-2">Labels: {part.mapLabelling.labels.join(', ')}</p>
                            )}
                            {part.mapLabelling.questions && part.mapLabelling.questions.map((q, idx) => (
                                <QuestionFactory key={q.qNumber || idx} question={q} context="map" />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 5. Note Completion - Render BEFORE matching if both exist */}
            {part.noteCompletion && (
                <div className="space-y-4">
                    <h3 className="font-bold text-lg text-gray-800">Complete the notes:</h3>
                    {part.noteCompletion.questions && part.noteCompletion.questions.map((q, idx) => (
                        <QuestionFactory key={q.qNumber || idx} question={q} />
                    ))}
                </div>
            )}

            {/* 6. Matching */}
            {part.matching && part.matching.questions && part.matching.questions.length > 0 && (
                <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-sm">
                    {/* Labels Section */}
                    {((part.matching.options && Object.keys(part.matching.options).length > 0) ||
                        (part.matching.topicOptions && Object.keys(part.matching.topicOptions).length > 0)) && (
                            <div className="mb-6 bg-gray-50 p-5 rounded-lg border-2 border-dashed border-gray-300">
                                <h4 className="font-bold text-lg text-gray-800 mb-4 text-center">Labels:</h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {Object.entries(part.matching.options || part.matching.topicOptions || {}).map(([key, val]) => (
                                        <li key={key} className="flex gap-2 items-start">
                                            <span className="font-bold text-[#333399] text-lg">{key}</span>
                                            <span className="text-gray-700">{val}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    {/* Matching Questions */}
                    <div className="mt-4">
                        <h4 className="font-bold text-base text-gray-700 mb-3">Match options:</h4>
                        <div className="space-y-3">
                            {part.matching.questions.map((q, idx) => (
                                <QuestionFactory key={q.qNumber || idx} question={q} type="matching" />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 7. Multiple Selection */}
            {part.multipleSelection && part.multipleSelection.length > 0 && (
                <div className="space-y-6">
                    {part.multipleSelection.map((q, idx) => (
                        <QuestionFactory key={idx} question={q} type="selection" />
                    ))}
                </div>
            )}

        </div>
    );
};

export default PartRenderer;
