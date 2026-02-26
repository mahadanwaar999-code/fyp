// IELTS Test Database
// This database contains sample tests for all four IELTS sections

export const ieltsTestDatabase = {
  listening: [
    {
      id: 1,
      testType: 'Academic',
      sections: [
        {
          sectionNumber: 1,
          title: 'Booking a Hotel Room',
          audioUrl: 'audio-placeholder-1.mp3',
          duration: 300, // 5 minutes
          questions: [
            { id: 1, type: 'form-completion', question: 'Guest Name: ___________', answer: 'Sarah Johnson' },
            { id: 2, type: 'form-completion', question: 'Phone Number: ___________', answer: '555-0123' },
            { id: 3, type: 'multiple-choice', question: 'What type of room does she want?', options: ['Single', 'Double', 'Suite', 'Twin'], answer: 'Double' },
            { id: 4, type: 'form-completion', question: 'Check-in Date: ___________', answer: '15th June' },
            { id: 5, type: 'multiple-choice', question: 'How many nights?', options: ['2', '3', '4', '5'], answer: '3' },
            { id: 6, type: 'form-completion', question: 'Special Request: ___________', answer: 'Sea view' },
            { id: 7, type: 'multiple-choice', question: 'Payment Method:', options: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer'], answer: 'Credit Card' },
            { id: 8, type: 'short-answer', question: 'What time does she expect to arrive?', answer: '3 PM' },
            { id: 9, type: 'form-completion', question: 'Email: ___________', answer: 'sarah.j@email.com' },
            { id: 10, type: 'multiple-choice', question: 'Breakfast included?', options: ['Yes', 'No', 'Not mentioned'], answer: 'Yes' }
          ]
        },
        {
          sectionNumber: 2,
          title: 'Museum Tour Guide',
          audioUrl: 'audio-placeholder-2.mp3',
          duration: 300,
          questions: [
            { id: 11, type: 'map-labeling', question: 'Label A on the map shows: ___________', answer: 'Main entrance' },
            { id: 12, type: 'map-labeling', question: 'Label B on the map shows: ___________', answer: 'Gift shop' },
            { id: 13, type: 'multiple-choice', question: 'What time does the museum open?', options: ['8 AM', '9 AM', '10 AM', '11 AM'], answer: '9 AM' },
            { id: 14, type: 'matching', question: 'Match the exhibition to the floor:', answer: 'Ancient Egypt - Ground Floor' },
            { id: 15, type: 'multiple-choice', question: 'How long is the tour?', options: ['30 minutes', '45 minutes', '1 hour', '2 hours'], answer: '1 hour' },
            { id: 16, type: 'note-completion', question: 'Photography is ___________ in most areas', answer: 'allowed' },
            { id: 17, type: 'multiple-choice', question: 'Where can visitors store their bags?', options: ['Reception', 'Lockers', 'Gift shop', 'Cafe'], answer: 'Lockers' },
            { id: 18, type: 'short-answer', question: 'What day is the museum closed?', answer: 'Monday' },
            { id: 19, type: 'note-completion', question: 'Student discount: ___________', answer: '20%' },
            { id: 20, type: 'multiple-choice', question: 'Special exhibition theme:', options: ['Renaissance Art', 'Modern Sculpture', 'Egyptian Mummies', 'Asian Ceramics'], answer: 'Egyptian Mummies' }
          ]
        },
        {
          sectionNumber: 3,
          title: 'University Assignment Discussion',
          audioUrl: 'audio-placeholder-3.mp3',
          duration: 300,
          questions: [
            { id: 21, type: 'multiple-choice', question: 'What is the assignment about?', options: ['Climate change', 'Economics', 'Psychology', 'History'], answer: 'Climate change' },
            { id: 22, type: 'matching', question: 'Match students to their research topics:', answer: 'John - Renewable energy' },
            { id: 23, type: 'multiple-choice', question: 'When is the deadline?', options: ['Next Monday', 'Next Friday', 'In two weeks', 'End of month'], answer: 'Next Friday' },
            { id: 24, type: 'note-completion', question: 'Word limit: ___________', answer: '2000 words' },
            { id: 25, type: 'multiple-choice', question: 'How many sources required?', options: ['5', '8', '10', '15'], answer: '10' },
            { id: 26, type: 'short-answer', question: 'What citation style should be used?', answer: 'Harvard' },
            { id: 27, type: 'multiple-choice', question: 'Group size:', options: ['Individual', 'Pairs', 'Groups of 3', 'Groups of 4'], answer: 'Pairs' },
            { id: 28, type: 'note-completion', question: 'Presentation date: ___________', answer: '20th March' },
            { id: 29, type: 'multiple-choice', question: 'What percentage is the assignment worth?', options: ['20%', '30%', '40%', '50%'], answer: '40%' },
            { id: 30, type: 'short-answer', question: 'Where should they submit?', answer: 'Online portal' }
          ]
        },
        {
          sectionNumber: 4,
          title: 'University Lecture on Climate Science',
          audioUrl: 'audio-placeholder-4.mp3',
          duration: 300,
          questions: [
            { id: 31, type: 'note-completion', question: 'Global temperature has increased by ___________ degrees', answer: '1.1' },
            { id: 32, type: 'multiple-choice', question: 'Main cause of climate change:', options: ['Natural cycles', 'Human activity', 'Solar radiation', 'Volcanic activity'], answer: 'Human activity' },
            { id: 33, type: 'flow-chart', question: 'Step 1 in carbon cycle: ___________', answer: 'Photosynthesis' },
            { id: 34, type: 'multiple-choice', question: 'Largest CO2 emitter:', options: ['USA', 'China', 'India', 'Russia'], answer: 'China' },
            { id: 35, type: 'note-completion', question: 'Sea levels rising at ___________ mm per year', answer: '3.3' },
            { id: 36, type: 'short-answer', question: 'What year was the Paris Agreement signed?', answer: '2015' },
            { id: 37, type: 'multiple-choice', question: 'Target temperature increase limit:', options: ['1.5°C', '2°C', '2.5°C', '3°C'], answer: '1.5°C' },
            { id: 38, type: 'diagram-labeling', question: 'Label shows greenhouse effect: ___________', answer: 'Trapped heat' },
            { id: 39, type: 'note-completion', question: 'Renewable energy share target by 2050: ___________%', answer: '80' },
            { id: 40, type: 'multiple-choice', question: 'Most effective solution mentioned:', options: ['Electric cars', 'Solar panels', 'Reforestation', 'All of the above'], answer: 'All of the above' }
          ]
        }
      ]
    },
    {
      id: 2,
      testType: 'General Training',
      sections: [
        {
          sectionNumber: 1,
          title: 'Enrolling in a Gym',
          audioUrl: 'audio-placeholder-5.mp3',
          duration: 300,
          questions: [
            { id: 1, type: 'form-completion', question: 'Member Name: ___________', answer: 'Michael Chen' },
            { id: 2, type: 'form-completion', question: 'Age: ___________', answer: '28' },
            { id: 3, type: 'multiple-choice', question: 'Membership type:', options: ['Monthly', 'Quarterly', 'Annual', 'Day pass'], answer: 'Annual' },
            { id: 4, type: 'short-answer', question: 'What is the monthly fee?', answer: '$50' },
            { id: 5, type: 'multiple-choice', question: 'Preferred class time:', options: ['Morning', 'Afternoon', 'Evening', 'Weekend'], answer: 'Evening' },
            { id: 6, type: 'form-completion', question: 'Emergency Contact: ___________', answer: 'Lisa Chen' },
            { id: 7, type: 'form-completion', question: 'Phone: ___________', answer: '555-7890' },
            { id: 8, type: 'multiple-choice', question: 'Free trial period:', options: ['1 day', '3 days', '1 week', '2 weeks'], answer: '1 week' },
            { id: 9, type: 'note-completion', question: 'Gym opens at: ___________', answer: '6 AM' },
            { id: 10, type: 'short-answer', question: 'What day can he start?', answer: 'Tomorrow' }
          ]
        },
        {
          sectionNumber: 2,
          title: 'Community Center Announcement',
          audioUrl: 'audio-placeholder-6.mp3',
          duration: 300,
          questions: [
            { id: 11, type: 'multiple-choice', question: 'Event name:', options: ['Spring Fair', 'Summer Festival', 'Autumn Market', 'Winter Carnival'], answer: 'Summer Festival' },
            { id: 12, type: 'form-completion', question: 'Date: ___________', answer: '15th July' },
            { id: 13, type: 'multiple-choice', question: 'Start time:', options: ['9 AM', '10 AM', '11 AM', '12 PM'], answer: '10 AM' },
            { id: 14, type: 'note-completion', question: 'Entry fee: $___________', answer: '5' },
            { id: 15, type: 'matching', question: 'Match activity to location:', answer: 'Face painting - Tent A' },
            { id: 16, type: 'short-answer', question: 'Where can you buy tickets?', answer: 'Online or at the gate' },
            { id: 17, type: 'multiple-choice', question: 'Parking available:', options: ['Yes, free', 'Yes, paid', 'No', 'Street parking only'], answer: 'Yes, free' },
            { id: 18, type: 'note-completion', question: 'Food vendors: ___________', answer: '12' },
            { id: 19, type: 'multiple-choice', question: 'Live music starts at:', options: ['11 AM', '12 PM', '2 PM', '4 PM'], answer: '2 PM' },
            { id: 20, type: 'short-answer', question: 'What to bring for children?', answer: 'Sun hat and water' }
          ]
        },
        {
          sectionNumber: 3,
          title: 'Workplace Training Discussion',
          audioUrl: 'audio-placeholder-7.mp3',
          duration: 300,
          questions: [
            { id: 21, type: 'multiple-choice', question: 'Training topic:', options: ['Safety', 'Customer Service', 'Technology', 'Management'], answer: 'Customer Service' },
            { id: 22, type: 'note-completion', question: 'Duration: ___________ days', answer: '3' },
            { id: 23, type: 'multiple-choice', question: 'Attendance:', options: ['Optional', 'Mandatory', 'Recommended', 'For new staff only'], answer: 'Mandatory' },
            { id: 24, type: 'short-answer', question: 'Who is the trainer?', answer: 'Dr. Williams' },
            { id: 25, type: 'form-completion', question: 'Training room: ___________', answer: 'Conference Room B' },
            { id: 26, type: 'multiple-choice', question: 'Lunch provided:', options: ['Yes, free', 'Yes, subsidized', 'No', 'Bring your own'], answer: 'Yes, free' },
            { id: 27, type: 'note-completion', question: 'Certification valid for: ___________ years', answer: '2' },
            { id: 28, type: 'short-answer', question: 'What materials are provided?', answer: 'Manual and workbook' },
            { id: 29, type: 'multiple-choice', question: 'Assessment type:', options: ['Written test', 'Practical', 'Presentation', 'All of the above'], answer: 'All of the above' },
            { id: 30, type: 'note-completion', question: 'Pass mark: ___________%', answer: '75' }
          ]
        },
        {
          sectionNumber: 4,
          title: 'Lecture on Workplace Productivity',
          audioUrl: 'audio-placeholder-8.mp3',
          duration: 300,
          questions: [
            { id: 31, type: 'note-completion', question: 'Average worker is productive for ___________ hours per day', answer: '3' },
            { id: 32, type: 'multiple-choice', question: 'Biggest productivity killer:', options: ['Email', 'Meetings', 'Social media', 'Phone calls'], answer: 'Meetings' },
            { id: 33, type: 'short-answer', question: 'Recommended break frequency:', answer: 'Every 90 minutes' },
            { id: 34, type: 'multiple-choice', question: 'Best time for complex tasks:', options: ['Morning', 'Midday', 'Afternoon', 'Evening'], answer: 'Morning' },
            { id: 35, type: 'note-completion', question: 'Ideal meeting length: ___________ minutes', answer: '30' },
            { id: 36, type: 'short-answer', question: 'What technique was mentioned for focus?', answer: 'Pomodoro' },
            { id: 37, type: 'multiple-choice', question: 'Remote work productivity compared to office:', options: ['Lower', 'Same', 'Higher', 'Varies'], answer: 'Higher' },
            { id: 38, type: 'note-completion', question: 'Open plan offices reduce productivity by ___________%', answer: '15' },
            { id: 39, type: 'short-answer', question: 'Recommended daily goal setting time:', answer: '5-10 minutes' },
            { id: 40, type: 'multiple-choice', question: 'Most important factor:', options: ['Environment', 'Tools', 'Motivation', 'All equal'], answer: 'Motivation' }
          ]
        }
      ]
    }
  ],

  reading: [
    {
      id: 1,
      testType: 'Academic',
      passages: [
        {
          passageNumber: 1,
          title: 'The History of Chocolate',
          text: `Chocolate has been enjoyed by humans for over 3,000 years. The ancient Mayans and Aztecs were the first to cultivate cacao trees and create chocolate drinks. These beverages were quite different from the sweet chocolate we know today – they were often bitter and spicy.

The Spanish conquistadors brought chocolate to Europe in the 16th century, where it quickly became popular among the wealthy. Sugar was added to make it sweeter, and by the 17th century, chocolate houses were as popular as coffee houses in London.

The Industrial Revolution brought chocolate to the masses. In 1828, Dutch chemist Coenraad van Houten invented a process to remove much of the cocoa butter from cacao beans, creating cocoa powder. This made chocolate more affordable and easier to mix with milk. In 1847, the British company J.S. Fry and Sons created the first solid chocolate bar.

Today, chocolate is a multi-billion dollar industry. Switzerland and Belgium are famous for their high-quality chocolate, while the largest chocolate consumers are actually in Europe, with the Swiss eating about 20 pounds per person annually.`,
          questions: [
            { id: 1, type: 'true-false-notgiven', question: 'The ancient Mayans added sugar to their chocolate drinks.', answer: 'False' },
            { id: 2, type: 'true-false-notgiven', question: 'Chocolate reached Europe in the 1600s.', answer: 'False' },
            { id: 3, type: 'multiple-choice', question: 'Who invented cocoa powder?', options: ['The Mayans', 'Spanish conquistadors', 'Coenraad van Houten', 'J.S. Fry'], answer: 'Coenraad van Houten' },
            { id: 4, type: 'sentence-completion', question: 'The first solid chocolate bar was created in ___________.', answer: '1847' },
            { id: 5, type: 'true-false-notgiven', question: 'The Swiss consume more chocolate than any other nationality.', answer: 'Not Given' },
            { id: 6, type: 'matching-headings', question: 'Match paragraph 3 to heading:', options: ['Ancient Origins', 'European Introduction', 'Industrial Revolution', 'Modern Industry'], answer: 'Industrial Revolution' },
            { id: 7, type: 'short-answer', question: 'How long have humans been enjoying chocolate?', answer: 'Over 3,000 years' },
            { id: 8, type: 'multiple-choice', question: 'What did van Houten remove from cacao beans?', options: ['Sugar', 'Cocoa butter', 'Water', 'Spices'], answer: 'Cocoa butter' },
            { id: 9, type: 'yes-no-notgiven', question: 'The writer thinks modern chocolate is better than ancient chocolate.', answer: 'Not Given' },
            { id: 10, type: 'sentence-completion', question: 'Swiss people eat about ___________ pounds of chocolate per year.', answer: '20' },
            { id: 11, type: 'true-false-notgiven', question: 'Chocolate houses were more popular than coffee houses in London.', answer: 'False' },
            { id: 12, type: 'multiple-choice', question: 'Which countries are famous for high-quality chocolate?', options: ['Spain and Mexico', 'Britain and Netherlands', 'Switzerland and Belgium', 'USA and Canada'], answer: 'Switzerland and Belgium' },
            { id: 13, type: 'matching-information', question: 'Which paragraph mentions affordability?', answer: 'Paragraph 3' }
          ]
        },
        {
          passageNumber: 2,
          title: 'Renewable Energy Solutions',
          text: `The world is facing an energy crisis. Fossil fuels, which have powered our civilization for over a century, are running out and causing environmental damage. Scientists and engineers are working on renewable energy solutions to address these challenges.

Solar power is one of the most promising renewable energy sources. Solar panels convert sunlight directly into electricity using photovoltaic cells. The efficiency of solar panels has improved dramatically in recent years, with some modern panels converting over 22% of sunlight into electricity. Solar farms are now being built in deserts around the world, where sunshine is abundant.

Wind energy is another rapidly growing sector. Wind turbines generate electricity when wind spins their blades. Offshore wind farms are particularly effective, as winds over water are stronger and more consistent than on land. Denmark generates over 40% of its electricity from wind power, demonstrating the viability of this technology.

Hydroelectric power has been used for over a century but remains important. Large dams can generate enormous amounts of electricity, though they can have environmental impacts on rivers and local ecosystems. Small-scale hydro projects are now being developed to minimize these effects while still harnessing water power.

The future of energy will likely involve a mix of these renewable sources, along with improved energy storage technology to ensure consistent power supply even when the sun isn't shining or the wind isn't blowing.`,
          questions: [
            { id: 14, type: 'matching-headings', question: 'Match paragraph 2 to heading:', options: ['Wind Power', 'Solar Revolution', 'Water Energy', 'Energy Mix'], answer: 'Solar Revolution' },
            { id: 15, type: 'true-false-notgiven', question: 'Solar panels are 100% efficient.', answer: 'False' },
            { id: 16, type: 'multiple-choice', question: 'Where are offshore wind farms located?', options: ['In deserts', 'Over water', 'In forests', 'Underground'], answer: 'Over water' },
            { id: 17, type: 'sentence-completion', question: 'Denmark generates over ___________% of electricity from wind.', answer: '40' },
            { id: 18, type: 'yes-no-notgiven', question: 'The writer believes hydroelectric dams are completely safe.', answer: 'No' },
            { id: 19, type: 'multiple-choice', question: 'What do photovoltaic cells convert?', options: ['Wind to electricity', 'Sunlight to electricity', 'Water to electricity', 'Heat to electricity'], answer: 'Sunlight to electricity' },
            { id: 20, type: 'true-false-notgiven', question: 'Fossil fuels will last forever.', answer: 'False' },
            { id: 21, type: 'short-answer', question: 'What percentage of sunlight do modern panels convert?', answer: 'Over 22%' },
            { id: 22, type: 'matching-features', question: 'Match: Strong consistent winds', answer: 'Offshore locations' },
            { id: 23, type: 'sentence-completion', question: 'The future will need improved energy ___________ technology.', answer: 'storage' },
            { id: 24, type: 'multiple-choice', question: 'What is the main problem with hydroelectric dams?', options: ['Too expensive', 'Environmental impact', 'Low efficiency', 'Unreliable'], answer: 'Environmental impact' },
            { id: 25, type: 'true-false-notgiven', question: 'Solar farms are only built in hot countries.', answer: 'Not Given' },
            { id: 26, type: 'yes-no-notgiven', question: 'The author is optimistic about renewable energy.', answer: 'Yes' }
          ]
        },
        {
          passageNumber: 3,
          title: 'The Psychology of Decision Making',
          text: `Human decision-making is far more complex than simple logical analysis. Psychologists have identified numerous cognitive biases that affect how we make choices, often leading us to make decisions that appear irrational to outside observers.

One of the most significant is confirmation bias, where people tend to search for, interpret, and remember information that confirms their existing beliefs. This can lead to poor decision-making in business, politics, and personal life. For example, an investor who believes a stock will rise might focus only on positive news about the company while ignoring warning signs.

The availability heuristic causes people to overestimate the importance of information that is readily available to them. After seeing news reports about airplane crashes, people may believe flying is more dangerous than it actually is, even though statistically it remains one of the safest forms of transport. This bias can significantly impact risk assessment and decision-making.

Loss aversion is another powerful force. Research by psychologists Daniel Kahneman and Amos Tversky showed that people feel the pain of losing something about twice as strongly as the pleasure of gaining something of equal value. This explains why people often hold onto losing investments too long – the fear of realizing the loss is greater than the potential gain from cutting their losses and investing elsewhere.

The anchoring effect demonstrates how initial information disproportionately influences decisions. In salary negotiations, the first number mentioned often becomes an anchor that affects the final agreed amount. Skilled negotiators understand this and try to establish favorable anchors early in discussions.

Understanding these biases doesn't eliminate them, but awareness can help people make better decisions. Many organizations now train their employees in recognizing cognitive biases, and some use structured decision-making processes to minimize their impact. However, these biases are deeply ingrained in human psychology and will likely never be completely overcome.`,
          questions: [
            { id: 27, type: 'matching-headings', question: 'Match paragraph 2 to heading:', options: ['Memory Effects', 'Confirming Beliefs', 'Feeling Losses', 'First Impressions'], answer: 'Confirming Beliefs' },
            { id: 28, type: 'true-false-notgiven', question: 'Cognitive biases make all decisions irrational.', answer: 'False' },
            { id: 29, type: 'multiple-choice', question: 'Who researched loss aversion?', options: ['Freud', 'Kahneman and Tversky', 'Pavlov', 'Skinner'], answer: 'Kahneman and Tversky' },
            { id: 30, type: 'sentence-completion', question: 'People feel loss about ___________ times more strongly than gain.', answer: 'twice' },
            { id: 31, type: 'yes-no-notgiven', question: 'The writer believes cognitive biases can be completely eliminated.', answer: 'No' },
            { id: 32, type: 'true-false-notgiven', question: 'Flying is actually very safe despite perceptions.', answer: 'True' },
            { id: 33, type: 'matching-features', question: 'Match: First number affects negotiation', answer: 'Anchoring effect' },
            { id: 34, type: 'short-answer', question: 'What type of bias affects investors who ignore warning signs?', answer: 'Confirmation bias' },
            { id: 35, type: 'multiple-choice', question: 'What do organizations do to help employees?', options: ['Eliminate biases', 'Train in recognizing biases', 'Avoid decisions', 'Use computers only'], answer: 'Train in recognizing biases' },
            { id: 36, type: 'true-false-notgiven', question: 'The availability heuristic affects risk assessment.', answer: 'True' },
            { id: 37, type: 'sentence-completion', question: 'Cognitive biases are deeply ___________ in human psychology.', answer: 'ingrained' },
            { id: 38, type: 'yes-no-notgiven', question: 'The author thinks awareness of biases is useless.', answer: 'No' },
            { id: 39, type: 'multiple-choice', question: 'What example is given for availability heuristic?', options: ['Stock market', 'Airplane crashes', 'Salary negotiation', 'Business decisions'], answer: 'Airplane crashes' },
            { id: 40, type: 'matching-information', question: 'Which paragraph discusses training?', answer: 'Paragraph 6' }
          ]
        }
      ]
    },
    {
      id: 2,
      testType: 'General Training',
      passages: [
        {
          passageNumber: 1,
          title: 'Community Center Activities',
          text: `Welcome to Riverside Community Center! We offer a wide range of activities for all ages.

Swimming Pool: Open daily 6am-10pm. Lane swimming 6-8am and 6-8pm. Family swim 2-5pm weekends. Monthly membership: $50 adults, $30 children.

Fitness Classes: Yoga (Mon/Wed/Fri 7am & 6pm), Pilates (Tue/Thu 7pm), Zumba (Wed/Sat 10am). Drop-in $12 or 10-class pass $100.

Children's Activities: After-school club (Mon-Fri 3-6pm, $15 per session), Saturday art classes (10am-12pm, $20), Summer camp (June-August, $200 per week).

Meeting Rooms: Available for hire. Small room (10 people) $25/hour, Large room (50 people) $50/hour. Includes WiFi and projector.

Contact: Call 555-1234 or email info@riversidecc.org`,
          questions: [
            { id: 1, type: 'multiple-choice', question: 'When is family swim?', options: ['Weekday mornings', 'Weekend afternoons', 'Every evening', 'Weekday afternoons'], answer: 'Weekend afternoons' },
            { id: 2, type: 'true-false-notgiven', question: 'Children pay $30 for monthly swimming membership.', answer: 'True' },
            { id: 3, type: 'short-answer', question: 'How much is a drop-in fitness class?', answer: '$12' },
            { id: 4, type: 'matching-information', question: 'Find: Zumba class day', answer: 'Wednesday and Saturday' },
            { id: 5, type: 'true-false-notgiven', question: 'Art classes are only for teenagers.', answer: 'Not Given' },
            { id: 6, type: 'sentence-completion', question: 'Summer camp costs $_____ per week.', answer: '200' },
            { id: 7, type: 'multiple-choice', question: 'What is included with room hire?', options: ['Food', 'WiFi and projector', 'Parking', 'Catering'], answer: 'WiFi and projector' },
            { id: 8, type: 'short-answer', question: 'What is the phone number?', answer: '555-1234' },
            { id: 9, type: 'true-false-notgiven', question: 'The pool opens at 5am.', answer: 'False' },
            { id: 10, type: 'sentence-completion', question: 'After-school club runs until _____pm.', answer: '6' },
            { id: 11, type: 'multiple-choice', question: 'How many people fit in the large meeting room?', options: ['10', '25', '50', '100'], answer: '50' },
            { id: 12, type: 'true-false-notgiven', question: 'You must book fitness classes in advance.', answer: 'Not Given' },
            { id: 13, type: 'short-answer', question: 'How much can you save with a 10-class pass?', answer: '$20' }
          ]
        },
        {
          passageNumber: 2,
          title: 'Company Policies and Staff Development',
          text: `Employee Handbook - Key Policies

Working Hours: Standard hours are 9am-5pm Monday to Friday. Flexible working is available with manager approval. Core hours (must be present) are 10am-3pm.

Leave Entitlement: Annual leave is 25 days plus public holidays. Staff must request leave at least 2 weeks in advance. Unused leave can be carried over (maximum 5 days) to the next year.

Training and Development: Each employee has a £1,000 annual training budget. This can be used for courses, conferences, or professional certifications. Requests should be submitted to HR with a brief justification.

Performance Reviews: Conducted twice yearly in January and July. Employees meet with their line manager to discuss goals, achievements, and development needs.

Health and Safety: All staff must complete health and safety training within the first month. Fire drills occur quarterly. First aid kits are located on each floor near the elevators.

Dress Code: Business casual Monday-Thursday. Casual Friday allows jeans and trainers. Client-facing staff should dress formally when meeting clients.

Communication: Check email at least twice daily. Respond to urgent messages within 2 hours. Use instant messaging for quick questions. Schedule meetings through the online calendar system.`,
          questions: [
            { id: 14, type: 'multiple-choice', question: 'What are the core hours?', options: ['9am-5pm', '10am-3pm', '9am-3pm', '10am-5pm'], answer: '10am-3pm' },
            { id: 15, type: 'true-false-notgiven', question: 'Employees get 20 days annual leave.', answer: 'False' },
            { id: 16, type: 'sentence-completion', question: 'Leave requests need _____ weeks notice.', answer: '2' },
            { id: 17, type: 'short-answer', question: 'How much is the annual training budget?', answer: '£1,000' },
            { id: 18, type: 'multiple-choice', question: 'When are performance reviews?', options: ['Every month', 'Quarterly', 'Twice yearly', 'Annually'], answer: 'Twice yearly' },
            { id: 19, type: 'true-false-notgiven', question: 'Health and safety training must be completed in the first month.', answer: 'True' },
            { id: 20, type: 'matching-information', question: 'Find: Fire drill frequency', answer: 'Quarterly' },
            { id: 21, type: 'sentence-completion', question: 'Jeans are allowed on _____.', answer: 'Friday' },
            { id: 22, type: 'true-false-notgiven', question: 'All staff can work from home any day.', answer: 'Not Given' },
            { id: 23, type: 'short-answer', question: 'Where are first aid kits located?', answer: 'Near elevators on each floor' },
            { id: 24, type: 'multiple-choice', question: 'Maximum carry-over leave:', options: ['3 days', '5 days', '10 days', 'Unlimited'], answer: '5 days' },
            { id: 25, type: 'true-false-notgiven', question: 'Urgent emails need response within 2 hours.', answer: 'True' },
            { id: 26, type: 'sentence-completion', question: 'Training requests go to _____.', answer: 'HR' }
          ]
        },
        {
          passageNumber: 3,
          title: 'The Impact of Remote Work',
          text: `The COVID-19 pandemic dramatically accelerated the shift to remote work. What was once a perk offered by progressive companies became a necessity almost overnight. Now, as offices reopen, companies and employees are reevaluating what the future of work looks like.

Many employees have discovered they prefer working from home. A recent survey found that 65% of workers want to continue remote work at least part-time. The reasons are clear: no commute saves time and money, flexibility allows better work-life balance, and many people report being more productive in their home environment.

However, remote work isn't without challenges. Some employees struggle with isolation and miss the social aspects of office life. Collaboration can be more difficult, especially for creative tasks that benefit from spontaneous discussions. New employees may find it harder to learn company culture and build relationships with colleagues.

Companies are also weighing the pros and cons. Office space is expensive, and many businesses are reducing their real estate footprint, saving millions. However, some worry about team cohesion and company culture. Managers accustomed to supervising in person have had to develop new skills.

The hybrid model is emerging as a popular compromise. Employees might work from home three days a week and come to the office for two days. This allows for both flexibility and face-to-face interaction. However, implementing hybrid work fairly and effectively requires careful planning.

Technology has been crucial in making remote work possible. Video conferencing tools like Zoom became household names. Project management software helps teams coordinate across distances. Cloud computing ensures employees can access files from anywhere. As these technologies improve, remote work will likely become even more seamless.

The long-term effects of this shift are still unfolding. Commercial real estate markets may change significantly. Some people are moving away from expensive cities now that they don't need to commute daily. Environmental benefits could be substantial if fewer people are driving to work every day.

Whatever form it takes, the future of work will almost certainly involve more flexibility than before the pandemic. The question is no longer whether remote work is possible, but how to make it work best for both employees and employers.`,
          questions: [
            { id: 27, type: 'matching-headings', question: 'Match paragraph 2 to heading:', options: ['Company Benefits', 'Employee Preferences', 'Technology Solutions', 'Future Predictions'], answer: 'Employee Preferences' },
            { id: 28, type: 'true-false-notgiven', question: '65% of workers want full-time remote work.', answer: 'False' },
            { id: 29, type: 'yes-no-notgiven', question: 'The writer thinks remote work has only benefits.', answer: 'No' },
            { id: 30, type: 'multiple-choice', question: 'What percentage want to continue remote work at least part-time?', options: ['50%', '55%', '65%', '75%'], answer: '65%' },
            { id: 31, type: 'short-answer', question: 'What problem do some employees face with remote work?', answer: 'Isolation' },
            { id: 32, type: 'true-false-notgiven', question: 'Office space is expensive for companies.', answer: 'True' },
            { id: 33, type: 'matching-features', question: 'Match: Work 3 days home, 2 days office', answer: 'Hybrid model' },
            { id: 34, type: 'sentence-completion', question: 'Video conferencing tools like _____ became popular.', answer: 'Zoom' },
            { id: 35, type: 'yes-no-notgiven', question: 'The author believes remote work will disappear.', answer: 'No' },
            { id: 36, type: 'multiple-choice', question: 'What helps teams coordinate remotely?', options: ['Email only', 'Phone calls', 'Project management software', 'Meetings'], answer: 'Project management software' },
            { id: 37, type: 'true-false-notgiven', question: 'New employees find it easier to learn remotely.', answer: 'False' },
            { id: 38, type: 'short-answer', question: 'What type of real estate might be affected?', answer: 'Commercial' },
            { id: 39, type: 'sentence-completion', question: 'Cloud computing lets employees access _____ from anywhere.', answer: 'files' },
            { id: 40, type: 'true-false-notgiven', question: 'Environmental benefits are possible with less commuting.', answer: 'True' }
          ]
        }
      ]
    }
  ],

  writing: [
    {
      id: 1,
      testType: 'Academic',
      tasks: [
        {
          taskNumber: 1,
          type: 'graph',
          title: 'Task 1: Line Graph',
          prompt: 'The line graph below shows the percentage of households with internet access in five countries from 2000 to 2020. Summarize the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
          imageUrl: 'graph-placeholder.png',
          timeLimit: 20,
          wordCount: { min: 150, max: null }
        },
        {
          taskNumber: 2,
          type: 'essay',
          title: 'Task 2: Opinion Essay',
          prompt: 'Some people believe that technology has made our lives more complicated. Others think it has made life easier. Discuss both views and give your own opinion. Write at least 250 words.',
          timeLimit: 40,
          wordCount: { min: 250, max: null }
        }
      ]
    },
    {
      id: 2,
      testType: 'General Training',
      tasks: [
        {
          taskNumber: 1,
          type: 'letter',
          title: 'Task 1: Formal Letter',
          prompt: 'You recently bought a product online but when it arrived it was damaged. Write a letter to the company. In your letter:\n- Explain what you ordered and when\n- Describe the damage\n- Say what you want the company to do\n\nWrite at least 150 words.',
          timeLimit: 20,
          wordCount: { min: 150, max: null }
        },
        {
          taskNumber: 2,
          type: 'essay',
          title: 'Task 2: Discussion Essay',
          prompt: 'Many people believe that social media has a negative impact on society. To what extent do you agree or disagree? Write at least 250 words.',
          timeLimit: 40,
          wordCount: { min: 250, max: null }
        }
      ]
    },
    {
      id: 3,
      testType: 'Academic',
      tasks: [
        {
          taskNumber: 1,
          type: 'bar-chart',
          title: 'Task 1: Bar Chart',
          prompt: 'The bar chart shows the number of visitors to three London museums from 2007 to 2012. Summarize the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
          imageUrl: 'bar-chart-placeholder.png',
          timeLimit: 20,
          wordCount: { min: 150, max: null }
        },
        {
          taskNumber: 2,
          type: 'essay',
          title: 'Task 2: Advantage/Disadvantage Essay',
          prompt: 'In many countries, people are moving away from rural areas and towards urban areas. What are the advantages and disadvantages of this trend? Write at least 250 words.',
          timeLimit: 40,
          wordCount: { min: 250, max: null }
        }
      ]
    }
  ],

  speaking: [
    {
      id: 1,
      testType: 'Both',
      parts: [
        {
          partNumber: 1,
          title: 'Introduction and Interview',
          duration: 5,
          questions: [
            'What is your full name?',
            'Can I see your identification?',
            'Where are you from?',
            'Do you work or study?',
            'What do you do in your free time?',
            'Do you prefer spending time indoors or outdoors?',
            'Tell me about your hometown.',
            'What do you like most about where you live?',
            'Do you think you will continue living there?',
            'What kind of music do you like?',
            'How often do you listen to music?',
            'Have you ever been to a concert?'
          ]
        },
        {
          partNumber: 2,
          title: 'Long Turn',
          duration: 4,
          cueCard: {
            topic: 'Describe a book that had a major influence on you.',
            points: [
              'What the book was about',
              'When you read it',
              'Why it influenced you',
              'How it changed your thinking'
            ],
            preparationTime: 1,
            speakingTime: 2
          },
          followUp: [
            'Do you still think about this book?',
            'Have you recommended it to others?'
          ]
        },
        {
          partNumber: 3,
          title: 'Discussion',
          duration: 5,
          questions: [
            'Do you think people read less nowadays than in the past?',
            'What are the benefits of reading books compared to watching videos?',
            'How has technology changed the way people read?',
            'Do you think physical books will disappear in the future?',
            'Should governments invest more money in libraries?',
            'What makes a book worth reading?',
            'How important is reading for children\'s development?'
          ]
        }
      ]
    },
    {
      id: 2,
      testType: 'Both',
      parts: [
        {
          partNumber: 1,
          title: 'Introduction and Interview',
          duration: 5,
          questions: [
            'What is your full name?',
            'Can I see your identification?',
            'Where are you from?',
            'Do you work or study?',
            'What do you like about your job/studies?',
            'Do you prefer working/studying in the morning or evening?',
            'Tell me about your family.',
            'How much time do you spend with your family?',
            'Do you have a large or small family?',
            'What do you like to do on weekends?',
            'Do you prefer relaxing or being active on your days off?',
            'Have you ever tried any extreme sports?'
          ]
        },
        {
          partNumber: 2,
          title: 'Long Turn',
          duration: 4,
          cueCard: {
            topic: 'Describe a place you visited that surprised you.',
            points: [
              'Where it was',
              'When you went there',
              'What surprised you about it',
              'Whether you would visit again'
            ],
            preparationTime: 1,
            speakingTime: 2
          },
          followUp: [
            'Did you take any photos there?',
            'Have you told others about this place?'
          ]
        },
        {
          partNumber: 3,
          title: 'Discussion',
          duration: 5,
          questions: [
            'Why do people like to travel to new places?',
            'How has tourism changed in your country over the years?',
            'What are the positive and negative effects of tourism?',
            'Do you think virtual reality will replace real travel in the future?',
            'Should tourists learn about local customs before visiting?',
            'How can tourism benefit local communities?',
            'What makes a destination popular with tourists?'
          ]
        }
      ]
    }
  ]
};

// Helper function to get random test for a section
export function getRandomTest(section, testType = 'Academic') {
  const tests = ieltsTestDatabase[section].filter(test => 
    test.testType === testType || test.testType === 'Both'
  );
  
  if (tests.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * tests.length);
  return tests[randomIndex];
}

// Calculate score for listening and reading (out of 40 questions)
export function calculateBandScore(correctAnswers, totalQuestions = 40) {
  const bandScores = {
    40: 9.0, 39: 9.0,
    38: 8.5, 37: 8.5,
    36: 8.0, 35: 8.0,
    34: 7.5, 33: 7.5,
    32: 7.0, 31: 7.0, 30: 6.5,
    29: 6.5, 28: 6.5, 27: 6.0,
    26: 6.0, 25: 6.0, 24: 5.5,
    23: 5.5, 22: 5.5, 21: 5.0,
    20: 5.0, 19: 5.0, 18: 5.0,
    17: 4.5, 16: 4.5, 15: 4.5,
    14: 4.0, 13: 4.0, 12: 4.0,
    11: 3.5, 10: 3.5
  };
  
  return bandScores[correctAnswers] || 3.0;
}
