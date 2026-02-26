export const questionPool = {
    section1: [
        {
            id: 101,
            type: 'note-completion',
            groupTitle: 'Bankside Recruitment Agency',
            beforeGap: "Address of agency:",
            afterGap: ", Docklands",
            questionText: { en: "Address of agency", zh: "代理机构地址" },
            correctAnswer: "497 Eastside"
        },
        {
            id: 102,
            type: 'note-completion',
            beforeGap: "Name of agent: Becky",
            questionText: { en: "Name of agent", zh: "代理人姓名" },
            correctAnswer: "Jamieson"
        },
        {
            id: 103,
            type: 'note-completion',
            beforeGap: "Best to call her in the",
            questionText: { en: "Best time to call", zh: "最佳致电时间" },
            correctAnswer: "afternoon"
        },
        {
            id: 104,
            type: 'note-completion',
            groupTitle: 'Typical Jobs',
            beforeGap: "Must have good",
            afterGap: "skills",
            questionText: { en: "Skills required", zh: "所需技能" },
            correctAnswer: "clerical"
        },
        {
            id: 105,
            type: 'note-completion',
            beforeGap: "Pay is usually",
            afterGap: "per hour",
            questionText: { en: "Pay rate", zh: "工资率" },
            correctAnswer: "10 pounds"
        },
        {
            id: 106,
            type: 'table-completion',
            rowLabel: "Monday",
            beforeGap: "Activity:",
            questionText: { en: "Monday Activity", zh: "周一活动" },
            correctAnswer: "Orientation"
        },
        {
            id: 107,
            type: 'table-completion',
            rowLabel: "Tuesday",
            beforeGap: "Room:",
            questionText: { en: "Tuesday Room", zh: "周二房间" },
            correctAnswer: "Suite 102"
        },
        {
            id: 108,
            type: 'multiple-choice',
            questionText: { en: "What should the student bring?", zh: "学生应该带什么？" },
            options: ["ID Card", "Passport", "Library Card"],
            correctAnswer: "A"
        },
        {
            id: 109,
            type: 'multiple-choice',
            questionText: { en: "Where is the meeting point?", zh: "集合点在哪里？" },
            options: ["Main Hall", "Car Park", "Reception"],
            correctAnswer: "C"
        },
        {
            id: 110,
            type: 'fill-blank',
            questionText: { en: "Contact Phone:", zh: "联系电话：" },
            correctAnswer: "07788 123456"
        },
        {
            id: 111, // Extra for randomness
            type: 'note-completion',
            beforeGap: "Bring a copy of",
            questionText: { en: "Document to bring", zh: "携带文件" },
            correctAnswer: "CV"
        },
        {
            id: 112,
            type: 'multiple-choice',
            questionText: { en: "Parking available at:", zh: "停车位于：" },
            options: ["Rear", "Front", "Basement"],
            correctAnswer: "A"
        }
    ],
    section2: [
        {
            id: 201,
            type: 'multiple-choice',
            questionText: { en: "According to the speaker, the company...", zh: "根据演讲者，公司..." },
            options: ["has been in business long", "arranges more destinations", "has more customers"],
            correctAnswer: "B"
        },
        {
            id: 202,
            type: 'multiple-choice',
            questionText: { en: "Customers often complain about...", zh: "客户经常抱怨..." },
            options: ["Price", "Time", "Service"],
            correctAnswer: "A"
        },
        {
            id: 203,
            type: 'multiple-response',
            questionText: { en: "Choose TWO facilities available:", zh: "选择两项可用设施：" },
            options: ["Gym", "Pool", "Spa", "Tennis", "Golf"],
            correctAnswer: ["B", "C"],
            maxSelection: 2
        },
        {
            id: 204,
            type: 'matching',
            questionText: { en: "Match the event to the location:", zh: "将活动与地点匹配：" },
            matchingOptions: [{label: 'A', text: 'Main Hall'}, {label: 'B', text: 'Garden'}, {label: 'C', text: 'Library'}],
            displayId: "14",
            itemText: "Welcome Speech",
            correctAnswer: "A"
        },
        {
            id: 205,
            type: 'matching',
            questionText: { en: "Match the event to the location:", zh: "将活动与地点匹配：" },
            matchingOptions: [{label: 'A', text: 'Main Hall'}, {label: 'B', text: 'Garden'}, {label: 'C', text: 'Library'}],
            displayId: "15",
            itemText: "Afternoon Tea",
            correctAnswer: "B"
        },
        {
            id: 206,
            type: 'matching',
            questionText: { en: "Match the event to the location:", zh: "将活动与地点匹配：" },
            matchingOptions: [{label: 'A', text: 'Main Hall'}, {label: 'B', text: 'Garden'}, {label: 'C', text: 'Library'}],
            displayId: "16",
            itemText: "Book Signing",
            correctAnswer: "C"
        },
        {
            id: 207,
            type: 'note-completion-sub',
            beforeGap: "Main entrance is closed until",
            questionText: { en: "Entrance closed", zh: "入口关闭" },
            correctAnswer: "6pm"
        },
        {
            id: 208,
            type: 'note-completion-sub',
            beforeGap: "Use the side door for",
            questionText: { en: "Side door usage", zh: "侧门使用" },
            correctAnswer: "deliveries"
        },
        {
            id: 209,
            type: 'table-completion',
            rowLabel: "Day 1",
            beforeGap: "Hotel dining room has view of the",
            questionText: { en: "View", zh: "景观" },
            correctAnswer: "ocean"
        },
        {
            id: 210,
            type: 'table-completion',
            rowLabel: "Day 2",
            beforeGap: "Visit the ancient",
            questionText: { en: "Visit", zh: "参观" },
            correctAnswer: "castle"
        },
        {
            id: 211,
            type: 'multiple-choice',
            questionText: { en: "The tour guide is:", zh: "导游是：" },
            options: ["Local", "Student", "Historian"],
            correctAnswer: "A"
        }
    ],
    section3: [
        {
            id: 301,
            type: 'note-completion',
            groupTitle: 'The Eucalyptus Tree',
            beforeGap: "It provides food for a wide range of",
            questionText: { en: "Provides for", zh: "提供给" },
            correctAnswer: "species"
        },
        {
            id: 302,
            type: 'note-completion',
            beforeGap: "Its leaves provide",
            afterGap: "which is used as disinfectant",
            questionText: { en: "Leaves provide", zh: "树叶提供" },
            correctAnswer: "oil"
        },
        {
            id: 303,
            type: 'note-completion-sub',
            groupTitle: 'Reasons for decline',
            beforeGap: "Disease Cause:",
            afterGap: "absorbed",
            questionText: { en: "Disease cause", zh: "疾病原因" },
            correctAnswer: "lime"
        },
        {
            id: 304,
            type: 'note-completion-sub',
            beforeGap: "Trees unable to take in necessary",
            questionText: { en: "Nutrient missing", zh: "缺失营养" },
            correctAnswer: "iron"
        },
        {
            id: 305,
            type: 'multiple-response',
            questionText: { en: "Which TWO things affect the bell-miner bird?", zh: "哪两件事影响bell-miner鸟？" },
            options: ["A. Food Supply", "B. Predators", "C. Habitat loss", "D. Weather", "E. Noise"],
            correctAnswer: ["A", "C"],
            maxSelection: 2
        },
        {
            id: 306,
            type: 'matching',
            questionText: { en: "Match student to task:", zh: "匹配学生与任务：" },
            matchingOptions: [{label: 'A', text: 'Data Collection'}, {label: 'B', text: 'Analysis'}, {label: 'C', text: 'Report Writing'}],
            displayId: "26",
            itemText: "John",
            correctAnswer: "A"
        },
        {
            id: 307,
            type: 'matching',
            questionText: { en: "Match student to task:", zh: "匹配学生与任务：" },
            matchingOptions: [{label: 'A', text: 'Data Collection'}, {label: 'B', text: 'Analysis'}, {label: 'C', text: 'Report Writing'}],
            displayId: "27",
            itemText: "Susan",
            correctAnswer: "B"
        },
        {
            id: 308,
            type: 'matching',
            questionText: { en: "Match student to task:", zh: "匹配学生与任务：" },
            matchingOptions: [{label: 'A', text: 'Data Collection'}, {label: 'B', text: 'Analysis'}, {label: 'C', text: 'Report Writing'}],
            displayId: "28",
            itemText: "David",
            correctAnswer: "C"
        },
        {
            id: 309,
            type: 'table-completion',
            rowLabel: "Phase 1",
            beforeGap: "Duration:",
            questionText: { en: "Duration", zh: "时长" },
            correctAnswer: "2 weeks"
        },
        {
            id: 310,
            type: 'table-completion',
            rowLabel: "Phase 2",
            beforeGap: "Method:",
            questionText: { en: "Method", zh: "方法" },
            correctAnswer: "Interview"
        }
    ],
    section4: [
        {
            id: 401,
            type: 'note-completion',
            groupTitle: 'Marine Biology Lecture',
            beforeGap: "Main threat discussed:",
            questionText: { en: "Threat", zh: "威胁" },
            correctAnswer: "pollution"
        },
        {
            id: 402,
            type: 'note-completion',
            beforeGap: "Affected species include:",
            questionText: { en: "Species", zh: "物种" },
            correctAnswer: "whales"
        },
        {
            id: 403,
            type: 'note-completion-sub',
            beforeGap: "Population declined by",
            afterGap: "percent",
            questionText: { en: "Decline percent", zh: "下降百分比" },
            correctAnswer: "40"
        },
        {
            id: 404,
            type: 'multiple-choice',
            questionText: { en: "The lecturer suggests...", zh: "讲师建议..." },
            options: ["More funding", "Better laws", "Public awareness"],
            correctAnswer: "C"
        },
        {
            id: 405,
            type: 'multiple-choice',
            questionText: { en: "Research will continue for...", zh: "研究将持续..." },
            options: ["2 years", "5 years", "10 years"],
            correctAnswer: "B"
        },
        {
            id: 406,
            type: 'matching',
            questionText: { en: "Match trait to animal:", zh: "匹配特征与动物：" },
            matchingOptions: [{label: 'A', text: 'Aggressive'}, {label: 'B', text: 'Shy'}, {label: 'C', text: 'Social'}],
            displayId: "36",
            itemText: "Dolphin",
            correctAnswer: "C"
        },
        {
            id: 407,
            type: 'matching',
            questionText: { en: "Match trait to animal:", zh: "匹配特征与动物：" },
            matchingOptions: [{label: 'A', text: 'Aggressive'}, {label: 'B', text: 'Shy'}, {label: 'C', text: 'Social'}],
            displayId: "37",
            itemText: "Shark",
            correctAnswer: "A"
        },
        {
            id: 408,
            type: 'table-completion',
            rowLabel: "Region A",
            beforeGap: "Status:",
            questionText: { en: "Status A", zh: "状态 A" },
            correctAnswer: "Critical"
        },
        {
            id: 409,
            type: 'table-completion',
            rowLabel: "Region B",
            beforeGap: "Status:",
            questionText: { en: "Status B", zh: "状态 B" },
            correctAnswer: "Stable"
        },
        {
            id: 410,
            type: 'note-completion',
            beforeGap: "Final Conclusion: The ecosystem is",
            questionText: { en: "Conclusion", zh: "结论" },
            correctAnswer: "resilient"
        },
        {
            id: 411,
            type: 'note-completion',
            beforeGap: "Key factor:",
            questionText: { en: "Factor", zh: "因素" },
            correctAnswer: "temperature"
        }
    ]
};
