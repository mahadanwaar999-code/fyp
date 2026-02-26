// IELTS Academic Writing - Template Data
// Each test randomly selects 1 Task 1 template + 1 Task 2 template

export const task1Templates = [
    {
        id: 'task1_bar_chart',
        type: 'BarChart',
        title: 'Student Distribution by Class',
        instruction: 'The bar chart below shows the number of students in different classes.',
        prompt: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
        imageUrl: '/images/writing/bar_chart_students.png',
        minWords: 150
    },
    {
        id: 'task1_line_graph',
        type: 'LineGraph',
        title: 'Temperature Changes Over Time',
        instruction: 'The line graph below shows average monthly temperatures in three cities over a year.',
        prompt: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
        imageUrl: null, // Placeholder for future image
        minWords: 150
    },
    {
        id: 'task1_pie_chart',
        type: 'PieChart',
        title: 'Student Distribution',
        instruction: 'The pie chart below shows the number of students in different classes.',
        prompt: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
        imageUrl: '/images/writing/pie_chart_students.png',
        minWords: 150
    },
    {
        id: 'task1_table',
        type: 'Table',
        title: 'Population Statistics',
        instruction: 'The table below shows population data for five countries in 2020 and 2023.',
        prompt: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
        imageUrl: null, // Placeholder for future image
        minWords: 150
    },
    {
        id: 'task1_diagram',
        type: 'Diagram',
        title: 'Coffee Production Process',
        instruction: 'The diagram below shows the process of coffee production from bean to cup.',
        prompt: 'Summarise the information by selecting and reporting the main features.',
        imageUrl: null, // Placeholder for future image
        minWords: 150
    }
];

export const task2Templates = [
    {
        id: 'task2_opinion',
        type: 'Opinion',
        title: 'University Education',
        topic: 'In some countries, owning a home rather than renting one is very important for people.',
        questions: [
            'Why might this be the case?',
            'Do you think this is a positive or negative situation?'
        ],
        instruction: 'Give reasons for your answer and include any relevant examples from your own knowledge or experience.',
        minWords: 250
    },
    {
        id: 'task2_discussion',
        type: 'Discussion',
        title: 'Work-Life Balance',
        topic: 'Some people believe that everyone has the right to university education, while others believe that university education should only be for those who have high academic ability.',
        questions: [
            'Discuss both views and give your opinion.'
        ],
        instruction: 'Give reasons for your answer and include any relevant examples from your own knowledge or experience.',
        minWords: 250
    },
    {
        id: 'task2_problem_solution',
        type: 'ProblemSolution',
        title: 'Environmental Issues',
        topic: 'Many cities around the world are facing serious air pollution problems.',
        questions: [
            'What are the causes of this problem?',
            'What solutions can you suggest?'
        ],
        instruction: 'Give reasons for your answer and include any relevant examples from your own knowledge or experience.',
        minWords: 250
    },
    {
        id: 'task2_advantage_disadvantage',
        type: 'AdvantageDisadvantage',
        title: 'Online Shopping',
        topic: 'More and more people are choosing to shop online instead of going to physical stores.',
        questions: [
            'What are the advantages and disadvantages of this trend?'
        ],
        instruction: 'Give reasons for your answer and include any relevant examples from your own knowledge or experience.',
        minWords: 250
    },
    {
        id: 'task2_double_question',
        type: 'DoubleQuestion',
        title: 'Technology and Children',
        topic: 'Children today spend a lot of time using computers, tablets, and smartphones.',
        questions: [
            'Why do you think this is happening?',
            'Is this a positive or negative development?'
        ],
        instruction: 'Give reasons for your answer and include any relevant examples from your own knowledge or experience.',
        minWords: 250
    }
];
