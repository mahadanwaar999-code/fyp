# IELTS Listening Test Page - Guide

## Overview
The Listening Test Page is a complete IELTS Listening Test interface with 4 sections and various question types, designed to match the authentic IELTS format.

## Features

### 1. **Complete Test Structure**
- **4 Sections**: Each section represents a different context
  - Section 1: Social Conversation (housing accommodation)
  - Section 2: Monologue (community center tour)
  - Section 3: Academic Discussion (research project)
  - Section 4: Academic Lecture (urbanization and wildlife)

### 2. **Question Types**
Each section includes diverse question types:
- **Multiple Choice Questions (MCQ)**: Radio button selections
- **Fill in the Blank**: Text input fields
- **Short Answer**: Brief text responses
- **Matching**: Connect items from two lists

### 3. **User Interface Elements**

#### Top Bar (Sticky)
- **Back Button**: Return to dashboard
- **Audio Player**: Placeholder audio controls with play/pause button
- **Timer**: Countdown timer (30:00) that changes to red when < 5 minutes
  - Format: MM:SS
  - Auto-submits when time runs out

#### Section Navigation
- **4 Tabs**: Switch between sections
- **Active indicator**: Purple underline for current section
- **Question counter**: Shows answered/total questions

#### Question Display
- **Question Numbers**: Purple circular badges
- **Context Box**: Italic gray box with scenario description
- **Interactive Elements**:
  - Radio buttons for MCQ
  - Text inputs for fill-in-the-blank and short answers
  - Dropdown selects for matching questions

#### Bottom Navigation (Sticky)
- **Previous Button**: Navigate to previous section
- **Next Button**: Navigate to next section
- **Submit Button**: Appears on the last section
- **Progress Indicator**: Shows "X / 40 questions answered"

### 4. **Styling & Theming**

#### Light Mode
- White background
- Black text
- Gray borders
- Purple accents (#333399)

#### Dark Mode
- Black background (#000000)
- White text
- Gray-800 cards
- Bright purple accents
- All text and icons visible

### 5. **Bilingual Support**
- **English**: Full support with natural phrasing
- **Chinese**: Complete translations for all UI elements and questions

## How to Access

### From Student Dashboard:
1. Log in as a student
2. On the dashboard, find the "Listening Test" button (with headphone icon)
3. Click to start the test

### Button Location:
- Located in the center score card
- Between "Take Practice Test" and "Documents" buttons
- Purple background with headphone icon

## Technical Details

### File Structure
```
/components/ListeningTestPage.tsx  - Main component
/translations.ts                   - Bilingual text support
/components/StudentPanel_fixed.tsx - Integration point
```

### Key Components
1. **Timer Logic**: Auto-countdown with auto-submit
2. **State Management**: Tracks answers for all 40 questions
3. **Responsive Design**: Works on desktop and mobile
4. **Dummy Data**: Pre-populated with realistic IELTS content

### Question Numbering
- Section 1: Questions 1-10
- Section 2: Questions 11-20 (with matching questions spanning multiple numbers)
- Section 3: Questions 21-30
- Section 4: Questions 31-40

## Future Enhancements (Optional)
- Real audio file integration
- Answer validation and scoring
- Progress saving
- Review mode
- Detailed results breakdown
- Individual section timing

## Design Notes
- **Color Scheme**: Maintains ZLEARN branding (#333399)
- **Spacing**: Generous whitespace for readability
- **Accessibility**: Clear labels, focus states, keyboard navigation
- **Professional**: Mimics official IELTS test appearance
- **User-Friendly**: Clear instructions and intuitive controls

## Usage Tips
1. The audio button is a placeholder - no real audio plays
2. All 40 questions are dummy data for demonstration
3. Users can navigate freely between sections
4. Timer starts immediately upon page load
5. Submit shows completion summary with question count
