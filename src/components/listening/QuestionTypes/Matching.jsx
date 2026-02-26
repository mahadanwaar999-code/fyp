import React, { useState } from 'react';

const Matching = ({ question }) => {
    // Usually just a line with question text and an input box for the letter
    // Relying on GapFill logic since it looks similar in layout?
    // But Matching usually has the text on the left, and answer box on right or left.
    // "25. The Pickwick Papers [BOX]"

    // I will just use GapFill logic but hardcode isMatching flag if needed to distinct style.
    // Currently using QuestionFactory -> GapFill(isMatching=true)
    // So this file might be redundant unless I want to customize.
    // I'll keep it empty placeholder or export default null if unused, 
    // BUT QuestionFactory imports it.
    // Start simple: reuse GapFill logic by deleting this file or making it redirect?
    // No, let's just make it a specialized simple renderer.

    return null; // Logic is handled in QuestionFactory -> GapFill for now. 
};

// Actually, I should update QuestionFactory to use this if I want to decouple.
// For now, I'll delete this file request or just create a stub.
// Let's create a stub that re-exports GapFill logic? No that's messy.
// I'll just write a basic implementation just in case I change my mind in Factory.
import GapFill from './GapFill';
export default (props) => <GapFill {...props} isMatching={true} />;
