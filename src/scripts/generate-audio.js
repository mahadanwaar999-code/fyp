/**
 * IELTS Listening Audio Generator
 * 
 * This script helps generate placeholder audio files for testing.
 * 
 * IMPORTANT: This is for TESTING ONLY. For production, use official IELTS audio.
 * 
 * Requirements:
 * - Node.js installed
 * - Internet connection (for Google TTS API demo)
 * 
 * Usage:
 *   node scripts/generate-audio.js
 * 
 * OR use the web-based generator:
 *   Open: public/audio-generator.html in your browser
 * 
 * OR use online TTS services (RECOMMENDED):
 *   - https://ttsmaker.com/ (Free, no login)
 *   - https://www.naturalreaders.com/online/
 *   - https://cloud.google.com/text-to-speech
 */

const fs = require('fs');
const path = require('path');

// Audio content for each section
const sections = {
  1: `Good morning, City Library. How may I help you?

Hello. I'd like to renew my library membership, please.

Certainly. Could I have your membership number?

Yes, it's L-H-two-seven-nine-four-six.

Thank you. And may I have your full name, please?

It's Sarah Johnson. That's S-A-R-A-H, Johnson, J-O-H-N-S-O-N.

Perfect. I can see your account here. Now, would you like the standard membership for twelve months, or the premium membership for twenty-four months?

What's the difference?

Well, the standard membership is thirty-five dollars and allows you to borrow up to five books at a time. The premium membership is sixty dollars and you can borrow up to ten books, plus you get access to our online resources.

I'll go with the premium one, please.

Excellent choice. And would you like to add any family members?

Yes, my son. His name is David, and he's fifteen years old.

Great. That's an additional fifteen dollars for a junior membership. So your total is seventy-five dollars. How would you like to pay?

Can I pay by credit card over the phone?

Yes, absolutely. Your renewal is now complete. Your new membership card will arrive by post within five working days. Is there anything else I can help you with today?

No, that's everything. Thank you very much.

You're welcome. Have a great day!`,

  2: `Welcome to the National Science Museum. My name is Doctor Emily Watson, and I'll be your guide for today's tour.

Before we begin, I'd like to give you some important information about the museum. The building has four floors, and we'll be visiting three of them today. On the ground floor, where we are now, you'll find the reception desk, the gift shop, and the café. The café is open from nine in the morning until five in the afternoon, and it serves hot and cold drinks as well as sandwiches and cakes.

On the first floor, we have our permanent exhibition on space exploration. This includes real spacecraft that have been to the moon, and you can even touch a piece of moon rock. Please note that photography is not allowed in this section due to the sensitive nature of the materials.

The second floor houses our dinosaur exhibition. This is very popular with children, and there are several interactive displays where you can dig for fossils. We ask that adults supervise their children in this area.

The third floor contains our temporary exhibitions. At the moment, we're showing a special collection on ancient Egypt, which includes several mummies and artifacts that are over three thousand years old. This exhibition will be here until the end of next month.

Now, our tour will last approximately ninety minutes, and we'll be starting on the first floor. Please stay together as a group, and feel free to ask questions at any time. We'll have a fifteen-minute break halfway through in the museum café. Does anyone have any questions before we start? Excellent, let's begin.`,

  3: `Good morning, Sarah and Michael. How are you both getting on with your research project?

Pretty well, thanks. We've collected most of our data now.

Yes, we conducted twenty interviews last week, which took longer than we expected.

That's good progress. And what about the analysis? Have you started looking at the results?

We have. The preliminary findings are quite interesting. We found that sixty percent of respondents prefer online learning to traditional classroom-based learning.

Sixty percent? That's higher than I would have expected. Did you find any reasons for this preference?

Yes, the main reason was flexibility. People said they could study at their own pace and fit learning around their work and family commitments.

I see. And what about the disadvantages of online learning? Did people mention any concerns?

They did. The most common complaint was the lack of face-to-face interaction with teachers and other students. About forty-five percent of respondents mentioned this.

Interesting. And what's your next step?

We're going to write up our findings and compare them with similar studies from other universities. Then we'll prepare our final presentation.

Sounds good. When's your deadline?

The end of this month. We're planning to submit the written report on the twenty-eighth, and then we'll do our presentation in the first week of next month.

Excellent. Keep up the good work. I look forward to seeing your final results.`,

  4: `Good morning, everyone. Today's lecture will focus on climate change and its impact on ocean ecosystems.

As you know, the Earth's oceans play a crucial role in regulating our planet's climate. They absorb approximately thirty percent of the carbon dioxide produced by human activities, which helps to reduce the greenhouse effect. However, this process has significant consequences for marine life.

One of the most serious effects is ocean acidification. When carbon dioxide dissolves in seawater, it forms carbonic acid, which lowers the pH of the water. Since the beginning of the Industrial Revolution, ocean acidity has increased by approximately thirty percent. This makes it difficult for marine organisms, particularly those with calcium carbonate shells, such as corals, mollusks, and some plankton, to build and maintain their shells.

Another major concern is the rise in ocean temperatures. Over the past century, average ocean surface temperatures have increased by approximately zero point eight degrees Celsius. While this may not seem like much, it has profound effects on marine ecosystems. Warmer waters hold less oxygen, which can lead to dead zones where marine life cannot survive. Additionally, many species of fish are migrating towards cooler waters, disrupting established ecosystems and fishing industries.

Coral reefs are particularly vulnerable to these changes. When water temperatures rise too high, corals expel the algae living in their tissues, causing coral bleaching. Without these algae, the corals cannot survive for long. Scientists estimate that if current trends continue, we could lose ninety percent of coral reefs by the year two thousand and fifty.

The loss of coral reefs would be catastrophic, not only for marine biodiversity but also for the estimated five hundred million people worldwide who depend on reefs for food, income, and coastal protection.

In conclusion, the impact of climate change on our oceans is profound and far-reaching. Addressing this challenge requires global cooperation and immediate action to reduce carbon emissions and protect marine ecosystems. Thank you for your attention.`
};

console.log('\n🎧 IELTS Listening Audio Generator\n');
console.log('═══════════════════════════════════════════════════════════\n');

// Create directory if it doesn't exist
const audioDir = path.join(__dirname, '..', 'public', 'audio', 'listening');

if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
  console.log('✅ Created directory: /public/audio/listening/\n');
}

// Save text scripts
console.log('📝 Saving audio scripts...\n');

for (let i = 1; i <= 4; i++) {
  const scriptPath = path.join(audioDir, `section${i}-script.txt`);
  fs.writeFileSync(scriptPath, sections[i]);
  console.log(`   ✓ Saved section${i}-script.txt`);
}

console.log('\n═══════════════════════════════════════════════════════════\n');
console.log('⚠️  NEXT STEPS:\n');
console.log('Node.js cannot directly generate high-quality MP3 files without');
console.log('additional dependencies. Please use ONE of these methods:\n');

console.log('🌐 METHOD 1: Online TTS (RECOMMENDED - Easiest)\n');
console.log('   1. Open: https://ttsmaker.com/');
console.log('   2. Copy text from: public/audio/listening/section1-script.txt');
console.log('   3. Paste into TTSMaker');
console.log('   4. Select "English (UK)" voice');
console.log('   5. Click "Convert to Speech" then "Download"');
console.log('   6. Save as: section1.mp3 in public/audio/listening/');
console.log('   7. Repeat for sections 2, 3, and 4\n');

console.log('🎨 METHOD 2: Use HTML Generator\n');
console.log('   1. Open in browser: public/audio-generator.html');
console.log('   2. Click "Generate Audio" for each section');
console.log('   3. Use the online TTS links provided');
console.log('   4. Download and save as section1.mp3, etc.\n');

console.log('💿 METHOD 3: Official IELTS Audio\n');
console.log('   • Cambridge IELTS Books (1-18)');
console.log('   • British Council: learnenglish.britishcouncil.org');
console.log('   • IELTS Liz: ieltsliz.com/ielts-listening-practice-tests/\n');

console.log('═══════════════════════════════════════════════════════════\n');
console.log('📂 Audio files should be placed here:\n');
console.log(`   ${audioDir}/section1.mp3`);
console.log(`   ${audioDir}/section2.mp3`);
console.log(`   ${audioDir}/section3.mp3`);
console.log(`   ${audioDir}/section4.mp3\n`);

console.log('═══════════════════════════════════════════════════════════\n');
console.log('✅ Scripts saved! Use one of the methods above to create MP3s.\n');

// Check if MP3 files already exist
console.log('🔍 Checking for existing MP3 files...\n');
let allPresent = true;

for (let i = 1; i <= 4; i++) {
  const mp3Path = path.join(audioDir, `section${i}.mp3`);
  const exists = fs.existsSync(mp3Path);
  
  if (exists) {
    const stats = fs.statSync(mp3Path);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`   ✅ section${i}.mp3 (${sizeMB} MB)`);
  } else {
    console.log(`   ❌ section${i}.mp3 (missing)`);
    allPresent = false;
  }
}

if (allPresent) {
  console.log('\n🎉 All audio files are present! Your listening test is ready.\n');
} else {
  console.log('\n⚠️  Some audio files are missing. Follow the steps above to add them.\n');
}

console.log('═══════════════════════════════════════════════════════════\n');
