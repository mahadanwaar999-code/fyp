# 🎧 Quick Audio Setup Guide

## ⚡ Fastest Method (5 minutes)

### Option 1: Use TTSMaker (Recommended - Free, No Login)

1. **Open TTSMaker:** https://ttsmaker.com/

2. **For Each Section (1-4):**
   - Open `/public/audio-generator.html` in your browser
   - Copy the text from Section 1
   - Paste into TTSMaker
   - Select voice: "English (US) - Female" or "English (UK) - Female"
   - Click "Convert to Speech"
   - Click "Download" 
   - Save as `section1.mp3`
   - Repeat for sections 2, 3, and 4

3. **Place Files:**
   ```
   Move all 4 MP3 files to:
   /public/audio/listening/
   
   Files should be named:
   - section1.mp3
   - section2.mp3
   - section3.mp3
   - section4.mp3
   ```

4. **Test:**
   - Go to your app: http://localhost:5173 (or your dev server)
   - Navigate to Student Panel → Take Practice Test
   - Click "Check Files Again"
   - All 4 sections should show ✓ (green checkmark)

---

## 🎯 Alternative Methods

### Option 2: Natural Readers (High Quality)

1. Visit: https://www.naturalreaders.com/online/
2. Copy text from `/public/audio-generator.html`
3. Select "British English" voice
4. Click "Download" (may need free account)
5. Rename and place in `/public/audio/listening/`

### Option 3: Google Cloud TTS (Best Quality)

1. Visit: https://cloud.google.com/text-to-speech
2. Try the demo (no account needed for testing)
3. Paste scripts from audio-generator.html
4. Select "English (UK) - Standard" or "Wavenet"
5. Download MP3
6. Rename and place in folder

### Option 4: Use Official IELTS Audio

**Free Resources:**
- British Council: https://learnenglish.britishcouncil.org/skills/listening
- IELTS Liz: https://ieltsliz.com/ielts-listening-practice-tests/
- IELTS Online Tests: https://ieltsonlinetests.com/

**Paid (Best Quality):**
- Cambridge IELTS Books (1-18) - includes audio CDs
- Official IELTS Practice Materials

---

## 📂 Folder Structure

Your project should have:

```
your-project/
├── public/
│   ├── audio/
│   │   ├── listening/
│   │   │   ├── section1.mp3  ← Add this
│   │   │   ├── section2.mp3  ← Add this
│   │   │   ├── section3.mp3  ← Add this
│   │   │   └── section4.mp3  ← Add this
│   │   └── README.md
│   └── audio-generator.html
└── ...
```

---

## ✅ Verification Steps

After adding files:

1. **Check file names** (must be exact):
   - ✓ section1.mp3
   - ✓ section2.mp3
   - ✓ section3.mp3
   - ✓ section4.mp3
   - ✗ Section1.mp3 (wrong - capital S)
   - ✗ section_1.mp3 (wrong - underscore)
   - ✗ section1.wav (wrong - must be .mp3)

2. **Check file location:**
   - Files must be in `/public/audio/listening/`
   - Not in `/audio/listening/`
   - Not in `/src/audio/listening/`

3. **Check in browser:**
   - Open dev tools (F12)
   - Go to Network tab
   - Start a listening test
   - Look for section1.mp3 request
   - Should show status 200 (not 404)

---

## 🐛 Troubleshooting

### Problem: "Audio file not found" error

**Solutions:**
- Verify files are in `/public/audio/listening/`
- Check file names are exactly: section1.mp3, section2.mp3, etc.
- Restart your development server
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### Problem: Files show as "missing" in checker

**Solutions:**
- Wait 2-3 seconds and click "Check Files Again"
- Ensure dev server is running
- Try accessing directly: http://localhost:5173/audio/listening/section1.mp3
- Check browser console for errors (F12)

### Problem: Audio plays but no sound

**Solutions:**
- Check device volume
- Check browser tab is not muted
- Try different browser
- Check MP3 file is valid (open in media player)

### Problem: Audio cuts off or glitches

**Solutions:**
- Re-export MP3 at higher quality (128kbps minimum)
- Check file isn't corrupted
- Try different TTS voice/service
- Use official IELTS audio

---

## 🎬 Quick Demo Video Instructions

**If you want to record your own:**

1. Use your phone or computer microphone
2. Read the scripts naturally from `/public/audio-generator.html`
3. For conversations (Sections 1 & 3), have 2 people alternate
4. Export as MP3 using any audio app
5. Transfer files to the folder

**Apps you can use:**
- **Mobile:** Voice Memos (iOS), Voice Recorder (Android)
- **Desktop:** Audacity (free), QuickTime (Mac), Voice Recorder (Windows)

---

## 📊 Audio Specifications

For best results:
- **Format:** MP3
- **Bitrate:** 128 kbps minimum (192 kbps recommended)
- **Sample Rate:** 44.1 kHz
- **Duration:** 3-7 minutes per section
- **Size:** ~3-10 MB per file

---

## 🚀 Ready to Test!

Once files are in place:

1. Start your app
2. Go to **Student Panel**
3. Click **"Take Practice Test"**
4. Select **"Individual Section"**
5. Choose **"IELTS Academic"**
6. Select **"Listening"**
7. You should see: **"Audio Files Ready"** ✓
8. Click **"Start Test"**
9. Audio should play automatically! 🎉

---

## 💡 Pro Tips

- **For testing:** TTSMaker is fastest (no login required)
- **For quality:** Use Cambridge IELTS official audio
- **For realism:** Record with multiple speakers
- **File size:** Keep under 10MB per file for fast loading
- **Backup:** Keep original audio files in a safe place

---

## 📞 Still Having Issues?

1. Check `/public/audio/README.md` for detailed documentation
2. Open `/public/audio-generator.html` in browser for the generator tool
3. See `/scripts/generate-sample-audio.md` for step-by-step TTS instructions
4. Verify folder structure matches exactly as shown above

---

**Need help?** Make sure:
- ✅ Files are in `/public/audio/listening/`
- ✅ Files are named exactly: section1.mp3, section2.mp3, section3.mp3, section4.mp3
- ✅ Files are in MP3 format
- ✅ Dev server is running
- ✅ You've clicked "Check Files Again" in the app

Good luck with your IELTS practice! 🎓
