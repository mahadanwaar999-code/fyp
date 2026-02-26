import { passagePool } from '../data/readingData';
import { questionPool } from '../data/listeningData';
import { task1Templates, task2Templates } from '../data/writingData';
import { speakingTests } from '../data/speakingData';

// Utility to get a random item from an array
const getRandomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

export const generateTest = (type) => {
    switch (type) {
        case 'reading':
             // Generate dynamic reading test
             const shuffledPool = [...passagePool].sort(() => 0.5 - Math.random());
             const selectedPassages = shuffledPool.slice(0, 3);
             
             let globalIdCounter = 1;
             selectedPassages.forEach(p => {
                 p.questions.forEach(q => {
                     q.checkId = q.id;
                     q.id = globalIdCounter++;
                     q.displayId = q.id;
                 });
             });
             
             return {
                 id: Date.now(),
                 passages: selectedPassages,
                 totalQuestions: globalIdCounter - 1
             };
        case 'listening':
            // Generate a dynamic listening test from the pool
            const sections = ['section1', 'section2', 'section3', 'section4'];
            const generatedSections = sections.map((secKey, index) => {
                const pool = questionPool[secKey] || [];
                const shuffled = [...pool].sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 10);
                return {
                    id: index + 1,
                    title: { en: `Section ${index + 1}`, zh: `第${index + 1}部分` },
                    description: { en: `Section ${index + 1} Content`, zh: `第${index + 1}部分内容` },
                    audioSrc: `/audio/IELTS15_test1_audio${index + 1}.mp3`,
                    questions: selected
                };
            });
            // Construct a "Test" object similar to what existing components expect
            return {
                id: Date.now(),
                sections: generatedSections
            };
        case 'writing':
            // Return the template arrays for the Writing module to handle
            return { task1Templates, task2Templates };
        case 'speaking':
            return getRandomItem(speakingTests);
        default:
            return null;
    }
};
