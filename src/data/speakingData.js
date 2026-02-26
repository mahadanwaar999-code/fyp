// IELTS Speaking Test - Question Data
// Part 1: Interview (4-5 minutes)
// Part 2: Long Turn / Cue Card (3-4 minutes)
// Part 3: Discussion (4-5 minutes)

export const part1Questions = [
    // Work/Studies
    { id: 'p1_01', topic: 'Work/Studies', question: 'Do you work or are you a student?' },
    { id: 'p1_02', topic: 'Work/Studies', question: 'What subject are you studying?' },
    { id: 'p1_03', topic: 'Work/Studies', question: 'Why did you choose this subject?' },
    { id: 'p1_04', topic: 'Work/Studies', question: 'What do you like most about your job/studies?' },
    
    // Hometown
    { id: 'p1_05', topic: 'Hometown', question: 'Where are you from?' },
    { id: 'p1_06', topic: 'Hometown', question: 'What do you like about your hometown?' },
    { id: 'p1_07', topic: 'Hometown', question: 'Has your hometown changed much over the years?' },
    
    // Home
    { id: 'p1_08', topic: 'Home', question: 'Do you live in a house or an apartment?' },
    { id: 'p1_09', topic: 'Home', question: 'What is your favorite room in your home?' },
    { id: 'p1_10', topic: 'Home', question: 'Would you like to move to a different home in the future?' },
    
    // Hobbies
    { id: 'p1_11', topic: 'Hobbies', question: 'What do you like to do in your free time?' },
    { id: 'p1_12', topic: 'Hobbies', question: 'Have your hobbies changed since you were a child?' },
    { id: 'p1_13', topic: 'Hobbies', question: 'Do you prefer indoor or outdoor activities?' },
    
    // Friends/Family
    { id: 'p1_14', topic: 'Friends/Family', question: 'Do you spend much time with your family?' },
    { id: 'p1_15', topic: 'Friends/Family', question: 'What do you usually do with your friends?' },
    { id: 'p1_16', topic: 'Friends/Family', question: 'Is it easy to make friends in your country?' }
];

export const part2CueCards = [
    {
        id: 'p2_01',
        type: 'Person',
        title: 'Describe a person who has influenced you',
        prompt: 'Describe a person who has had an important influence on your life.',
        bulletPoints: [
            'Who this person is',
            'How you know this person',
            'What influence this person has had on you',
            'And explain why this person is important to you'
        ]
    },
    {
        id: 'p2_02',
        type: 'Place',
        title: 'Describe a place you like to visit',
        prompt: 'Describe a place you like to visit in your free time.',
        bulletPoints: [
            'Where this place is',
            'How often you go there',
            'What you do there',
            'And explain why you like this place'
        ]
    },
    {
        id: 'p2_03',
        type: 'Object',
        title: 'Describe something you own that is important to you',
        prompt: 'Describe something you own which is very important to you.',
        bulletPoints: [
            'What this thing is',
            'When you got it',
            'How you use it',
            'And explain why it is important to you'
        ]
    },
    {
        id: 'p2_04',
        type: 'Event',
        title: 'Describe a memorable event',
        prompt: 'Describe a memorable event from your childhood.',
        bulletPoints: [
            'What the event was',
            'When it happened',
            'Who was there',
            'And explain why it was memorable'
        ]
    },
    {
        id: 'p2_05',
        type: 'Activity',
        title: 'Describe a skill you would like to learn',
        prompt: 'Describe a skill you would like to learn in the future.',
        bulletPoints: [
            'What the skill is',
            'Why you want to learn it',
            'How you would learn it',
            'And explain how this skill would benefit you'
        ]
    }
];

export const part3Questions = [
    // Related to Person topic
    { id: 'p3_01', relatedTo: 'Person', question: 'How have family structures changed in your country over the past few decades?' },
    { id: 'p3_02', relatedTo: 'Person', question: 'Do you think famous people have a positive or negative influence on young people?' },
    { id: 'p3_03', relatedTo: 'Person', question: 'What qualities make a good role model?' },
    
    // Related to Place topic
    { id: 'p3_04', relatedTo: 'Place', question: 'How has tourism affected your country?' },
    { id: 'p3_05', relatedTo: 'Place', question: 'Do you think cities will become more or less popular in the future?' },
    { id: 'p3_06', relatedTo: 'Place', question: 'What are the advantages and disadvantages of living in a big city?' },
    
    // Related to Object topic
    { id: 'p3_07', relatedTo: 'Object', question: 'How has technology changed the way people communicate?' },
    { id: 'p3_08', relatedTo: 'Object', question: 'Do you think people buy too many things they don\'t need?' },
    { id: 'p3_09', relatedTo: 'Object', question: 'What impact does advertising have on consumer behavior?' },
    
    // Related to Event topic
    { id: 'p3_10', relatedTo: 'Event', question: 'How important are traditional celebrations in modern society?' },
    { id: 'p3_11', relatedTo: 'Event', question: 'Do you think childhood experiences shape who we become as adults?' },
    { id: 'p3_12', relatedTo: 'Event', question: 'How have family celebrations changed over the years?' },
    
    // Related to Activity topic
    { id: 'p3_13', relatedTo: 'Activity', question: 'What skills do you think are most important in today\'s world?' },
    { id: 'p3_14', relatedTo: 'Activity', question: 'How has education changed in your country?' },
    { id: 'p3_15', relatedTo: 'Activity', question: 'Do you think people should continue learning throughout their lives?' }
];
