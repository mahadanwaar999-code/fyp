import React from 'react';
import GapFill from './GapFill';
import MultipleChoice from './MultipleChoice';
import Selection from './Selection';
import Matching from './Matching';

const QuestionFactory = ({ question, type, context }) => {
    // Determine effective type
    const effectiveType = type || question.type || 'gap-fill';

    // Render based on type
    switch (effectiveType) {
        case 'gap-fill':
        case 'note-completion':
        case 'table-completion':
        case 'form-completion':
            return <GapFill question={question} />;

        case 'map-labelling':
            return <GapFill question={question} isMap={true} />; // Map labelling usually just needs a letter input

        case 'multiple-choice':
            return <MultipleChoice question={question} />;

        case 'selection':
            return <Selection question={question} />;

        case 'matching':
            // Matching questions in the list often mimic gap-fill (input box for letter)
            // Or dropdown. Let's use GapFill for inputting the letter for now as it's standard.
            return <GapFill question={question} isMatching={true} />;

        default:
            return <div className="text-red-500">Unknown Type: {effectiveType}</div>;
    }
};

export default QuestionFactory;
