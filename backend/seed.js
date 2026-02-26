const mongoose = require('mongoose');
const ListeningQuestion = require('./models/ListeningQuestion');
require('dotenv').config();

const listeningTests = [
    {
        id: 1,
        title: { en: "IELTS Practice Test 1", zh: "雅思练习测试 1" },
        sections: [
            {
                id: 1,
                title: { en: "Section 1: Social Conversation", zh: "第一节：社交对话" },
                audioSrc: "/audio/IELTS15_test1_audio1.mp3",
                questions: [
                    { id: 1, type: "fill-blank", question: { en: "Caller's Name:", zh: "来电者姓名：" }, correctAnswer: "Jamieson" },
                    { id: 2, type: "mcq", question: { en: "Reason for calling:", zh: "以此致电的原因：" }, options: ["Booking inquiry", "Complaint", "Feedback"], correctAnswer: "Booking inquiry" },
                    { id: 3, type: "fill-blank", question: { en: "Date of reservation:", zh: "预定日期：" }, correctAnswer: "23rd May" },
                    { id: 4, type: "mcq", question: { en: "Number of people:", zh: "人数：" }, options: ["2", "3", "4", "5"], correctAnswer: "4" },
                    { id: 5, type: "fill-blank", question: { en: "Contact Phone:", zh: "联系电话：" }, correctAnswer: "07765 8992" },
                    { id: 6, type: "mcq", question: { en: "Type of event:", zh: "活动类型：" }, options: ["Birthday", "Anniversary", "Business"], correctAnswer: "Birthday" },
                    { id: 7, type: "fill-blank", question: { en: "Dietary requirement:", zh: "饮食要求：" }, correctAnswer: "Vegetarian" },
                    { id: 8, type: "mcq", question: { en: "Venue preference:", zh: "场地偏好：" }, options: ["Garden", "Main Hall", "Private Room"], correctAnswer: "Garden" },
                    { id: 9, type: "fill-blank", question: { en: "Deposit amount:", zh: "押金金额：" }, correctAnswer: "20 pounds" },
                    { id: 10, type: "mcq", question: { en: "Payment method:", zh: "支付方式：" }, options: ["Cash", "Card", "Online"], correctAnswer: "Card" }
                ]
            },
            {
                id: 2,
                title: { en: "Section 2: Social Monologue", zh: "第二节：社交独白" },
                audioSrc: "/audio/IELTS15_test1_audio2.mp3",
                questions: [
                    { id: 11, type: "mcq", question: { en: "The tour begins at:", zh: "游览开始于：" }, options: ["9:00", "9:30", "10:00"], correctAnswer: "9:30" },
                    { id: 12, type: "mcq", question: { en: "First stop is:", zh: "第一站是：" }, options: ["Library", "Museum", "Park"], correctAnswer: "Museum" },
                    { id: 13, type: "matching", question: { en: "Match main features:", zh: "匹配主要特征：" }, matchingLeft: ["Main Hall", "Gallery A", "Garden"], matchingRight: ["Paintings", "Statues", "Fountains"], correctAnswer: {12: "Statues", 13: "Paintings", 14: "Fountains"} }, 
                    { id: 16, type: "mcq", question: { en: "Lunch break time:", zh: "午休时间：" }, options: ["30 mins", "45 mins", "1 hour"], correctAnswer: "45 mins" },
                    { id: 17, type: "fill-blank", question: { en: "Meeting point post-lunch:", zh: "午餐后集合点：" }, correctAnswer: "Main Gate" },
                    { id: 18, type: "mcq", question: { en: "Cost of guide:", zh: "导游费用：" }, options: ["Free", "$5", "$10"], correctAnswer: "Free" },
                    { id: 19, type: "fill-blank", question: { en: "Recommended item to bring:", zh: "建议携带物品：" }, correctAnswer: "Water bottle" },
                    { id: 20, type: "mcq", question: { en: "Tour ends at:", zh: "游览结束于：" }, options: ["3:00 PM", "4:00 PM", "5:00 PM"], correctAnswer: "4:00 PM" }
                ]
            },
            {
                id: 3,
                title: { en: "Section 3: Academic Conversation", zh: "第三节：学术对话" },
                audioSrc: "/audio/IELTS15_test1_audio3.mp3",
                questions: [
                    { id: 21, type: "mcq", question: { en: "Topic of assignment:", zh: "作业主题：" }, options: ["History", "Environment", "Economy"], correctAnswer: "Environment" },
                    { id: 22, type: "fill-blank", question: { en: "Deadline:", zh: "截止日期：" }, correctAnswer: "15th June" },
                    { id: 23, type: "mcq", question: { en: "Focus area:", zh: "重点区域：" }, options: ["Urban", "Rural", "Coastal"], correctAnswer: "Urban" },
                    { id: 24, type: "fill-blank", question: { en: "Required word count:", zh: "要求的字数：" }, correctAnswer: "2000" },
                    { id: 25, type: "mcq", question: { en: "Research method:", zh: "研究方法：" }, options: ["Survey", "Interview", "Observation"], correctAnswer: "Survey" },
                    { id: 26, type: "matching", question: { en: "Match tasks:", zh: "匹配任务：" }, matchingLeft: ["Data Collection", "Analysis", "Writing"], matchingRight: ["John", "Sarah", "Both"], correctAnswer: {26: "John", 27: "Both", 28: "Sarah"} },
                    { id: 29, type: "mcq", question: { en: "Next meeting:", zh: "下次会议：" }, options: ["Monday", "Wednesday", "Friday"], correctAnswer: "Wednesday" },
                    { id: 30, type: "fill-blank", question: { en: "Room number:", zh: "房间号：" }, correctAnswer: "304" }
                ]
            },
            {
                id: 4,
                title: { en: "Section 4: Academic Monologue", zh: "第四节：学术独白" },
                audioSrc: "/audio/IELTS15_test1_audio4.mp3",
                questions: [
                    { id: 31, type: "fill-blank", question: { en: "Lecture topic:", zh: "讲座主题：" }, correctAnswer: "Marine Biology" },
                    { id: 32, type: "mcq", question: { en: "Main threat discussed:", zh: "讨论的主要威胁：" }, options: ["Pollution", "Overfishing", "Climate Change"], correctAnswer: "Climate Change" },
                    { id: 33, type: "fill-blank", question: { en: "Affected species:", zh: "受影响物种：" }, correctAnswer: "Coral Reefs" },
                    { id: 34, type: "mcq", question: { en: "Percentage lost:", zh: "损失百分比：" }, options: ["20%", "30%", "50%"], correctAnswer: "50%" },
                    { id: 35, type: "fill-blank", question: { en: "Predicted year of collapse:", zh: "预测崩溃年份：" }, correctAnswer: "2050" },
                    { id: 36, type: "mcq", question: { en: "Proposed solution:", zh: "提议的解决方案：" }, options: ["New laws", "Protected areas", "Education"], correctAnswer: "Protected areas" },
                    { id: 37, type: "fill-blank", question: { en: "Key researcher:", zh: "主要研究员：" }, correctAnswer: "Dr. Smith" },
                    { id: 38, type: "mcq", question: { en: "Research duration:", zh: "研究持续时间：" }, options: ["5 years", "10 years", "20 years"], correctAnswer: "10 years" },
                    { id: 39, type: "fill-blank", question: { en: "Funding source:", zh: "资金来源：" }, correctAnswer: "Government" },
                    { id: 40, type: "mcq", question: { en: "Conclusion:", zh: "结论：" }, options: ["Optimistic", "Pessimistic", "Neutral"], correctAnswer: "Neutral" }
                ]
            }
        ]
    }
];

// Helper to transform frontend data format to Mongoose schema
const transformData = () => {
    let allQuestions = [];
    
    listeningTests.forEach(test => {
        test.sections.forEach(section => {
            section.questions.forEach(q => {
                // Determine type based on properties or existing type field
                let type = 'fill-blank';
                if (q.type) type = q.type;
                if (q.options) type = 'multiple-choice';
                if (q.matchingLeft) type = 'matching';
                
                // Map to schema
                // IMPORTANT: Generate a unique ID that doesn't conflict. 
                // Original data mocks reused IDs 1-40 for each test. We want a large pool.
                // We'll construct a unique ID: TestID * 1000 + QuestionID
                const uniqueId = test.id * 1000 + q.id;

                const newQ = {
                    id: uniqueId,
                    section: section.id,
                    type: type, // 'mcq' -> 'multiple-choice' mapping if needed, or update enum
                    questionText: q.question,
                    correctAnswer: q.correctAnswer,
                    audioSrc: section.audioSrc // Assign section audio to question for simplicity if needed, or handle in frontend
                };

                if (type === 'mcq') newQ.type = 'multiple-choice';
                if (type === 'fill-blank') newQ.type = 'fill-blank';
                if (type === 'matching') newQ.type = 'matching';

                if (q.options) newQ.options = q.options;
                if (q.matchingLeft) {
                    newQ.matchingLeft = q.matchingLeft;
                    newQ.matchingRight = q.matchingRight;
                }

                allQuestions.push(newQ);
            });
        });
    });
    return allQuestions;
};

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ielts_listening', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        await ListeningQuestion.deleteMany({});
        console.log('Cleared existing questions');

        const questions = transformData();
        await ListeningQuestion.insertMany(questions);
        console.log(`Seeded ${questions.length} questions`);

        mongoose.connection.close();
    } catch (err) {
        console.error('Error seeding database:', err);
    }
};

seedDB();
