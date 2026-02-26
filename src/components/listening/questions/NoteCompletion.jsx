import React from 'react';

const NoteCompletion = ({ question, answer, onChange, language }) => {
    // question structure expected:
    // {
    //   id: 1,
    //   type: 'note-completion',
    //   title: "Bankside Recruitment Agency",
    //   notes: [
    //     { label: "Address of agency:", text: "497 Eastside, Docklands" },
    //     { label: "Name of agent:", isQuestion: true }, // implied question ID matches the question object ID? 
    //     // Actually for one "Question Object" in our data array, it usually maps to ONE input (question ID).
    //     // But Note Completion often groups multiple questions. 
    //     // HOWEVER, our backend/data model defined 'questions' array where each item has an ID.
    //     // So 'NoteCompletion' component might need to be rendered for EACH question, 
    //     // OR we render a "Group" component.
    //     // Given the current architecture (rendering questions by map), 
    //     // we should TREAT "Note Completion" as a wrapper if possible, or individual items.
    //     //
    //     // User Request: "Implement 6 reusable JSX components... randomly select 10 questions... EACH containing 10 questions"
    //     // If we select 10 'questions', and 5 of them are part of one 'Note Completion' block, 
    //     // we need to make sure they render visually together.
    //     //
    //     // STRATEGY: 
    //     // To keep it simple and compatible with "map(q => component)":
    //     // We will render each "Fill Blank" as a row, but if they share a "context" (like a title),
    //     // we might need to handle that via the data structure (e.g. 'groupTitle').
    //     // 
    //     // BUT, standard "Note Completion" visual is a block of text with gaps.
    //     // If we assume the "Question" object contains the FULL CONTEXT for that specific gap:
    //     // e.g. "Name of agent: [_____]"
    //     // We can just style it to look like a note entry.
    //   ]
    // }

    // Let's implement it as a single row entry that looks like a note line.
    // expecting question.beforeText, question.afterText

    return (
        <div className="mb-4 pl-4 border-l-4 border-blue-500 bg-gray-50 p-4 rounded-r-md">
            {question.groupTitle && (
                <h3 className="font-bold text-gray-700 mb-2">{question.groupTitle}</h3>
            )}
            <div className="flex flex-wrap items-center gap-2 text-lg">
                <span className="text-gray-800">{question.beforeGap || question.questionText.en}</span>
                <input
                    type="text"
                    value={answer || ''}
                    onChange={(e) => onChange(question.id, e.target.value)}
                    className="min-w-[150px] p-1 border-b-2 border-gray-400 bg-transparent focus:border-blue-600 focus:outline-none text-center font-semibold"
                    placeholder={language === 'en' ? "answer" : "答案"}
                />
                {question.afterGap && <span className="text-gray-800">{question.afterGap}</span>}
            </div>
        </div>
    );
};

export default NoteCompletion;
