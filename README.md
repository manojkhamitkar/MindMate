
# 🧠 MindMate - Real-time Mental Wellness Companion

**MindMate** is an interactive and privacy-focused web-based application designed to empower individuals to track, reflect, and improve their mental well-being using real-time tools and intuitive UI/UX.

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Live Demo](#live-demo)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Authentication System](#authentication-system)
- [Data Privacy](#data-privacy)
- [Customizations](#customizations)
- [Planned Features](#planned-features)
- [License](#license)

---

## 🧭 Overview

**MindMate** is a stigma-free mental wellness app that:
- Helps you **track your daily mood**
- Encourages **guided journaling and reflection**
- Provides **smart insights** from your entries
- Promotes **wellness actions** like breathing exercises
- Ensures **local data privacy** (no backend server)

---

## 🌟 Features

### 🎯 Core Functionality
- Mood Tracking (5-point scale with emoji feedback)
- Reflection Prompts with journaling
- Smart AI-driven wellness insights
- Breathing & mindfulness suggestions
- Beautiful UI with real-time feedback

### 🔒 Authentication System
- Login & Register interface
- Password strength meter
- Toggle visibility & validations
- Session-based user state (no persistent storage)

### 📈 Real-time Analytics
- Mood trend chart (Chart.js)
- Dominant mood factor identification
- Weekly summaries and mood streak tracking

### 🎨 UX Enhancements
- Responsive design with animations
- Tab-based navigation for Dashboard, Mood Tracker, Reflection, and Insights
- Real-time interaction feedback and transitions

---

## 🚀 Getting Started

### Option 1: Open in Browser (No setup)
```bash
1. Download or clone this repository
2. Open `login.html` to start authentication
3. Upon login, `index.html` loads the main dashboard
```

### Option 2: Local Server (Recommended)
Using Python:
```bash
python -m http.server 8000
# Open browser at: http://localhost:8000/login.html
```

---

## 📁 Project Structure

```
MindMate/
├── index.html          # Main wellness dashboard (post-login)
├── login.html          # Authentication page (login/register)
├── script.js           # Core logic (mood tracking, analysis, insights)
├── auth-script.js      # Login/register logic (validations, session, UI)
├── style.css           # Global styles (dashboard, mood tracking, etc.)
├── auth-style.css      # Auth form styles (login/register forms)
├── README.md           # Documentation (you are here)
```

---

## 🛠️ Technology Stack

- **HTML5 + CSS3**: Interface and layout
- **JavaScript (ES6+)**: Functionality and logic
- **Chart.js**: Mood trend visualizations
- **Font Awesome**: Icon library
- **Google Fonts (Poppins)**: Typography
- **localStorage**: Persistent client-side data
- **sessionStorage**: Session-based login state

---

## 🔐 Authentication System

Implemented in `auth-script.js` + `login.html`:
- Password strength meter with real-time feedback
- Toggle password visibility (👁️)
- Email and password validation
- Session-based user tracking (using `sessionStorage`)
- Separate Login & Register UI with smooth transitions

> Note: This system is frontend-only and uses session memory, meaning users stay logged in only for the browser session.

---

## 🔎 Data Privacy

MindMate respects user privacy:
- All data (mood entries, reflections) is stored **locally** in the user's browser via `localStorage`
- No data is sent to a backend server or cloud
- No tracking, analytics, or cookies involved
- Users can clear browser storage anytime to erase their data

---

## ✨ Customizations

You can easily extend or modify:

### Mood Factors
Edit inside `index.html` in the mood tracker section:
```html
<span class="tag" data-factor="sleep">😴 Sleep</span>
```

### Reflection Prompts
Update `reflectionPrompts` array in `script.js` to add your own reflective questions.

### Color Theme
Customize gradients, accent colors, and animations via:
- `style.css` (dashboard UI)
- `auth-style.css` (login/register)

---

## 🎯 Planned Features (Future Enhancements)

- Offline-first support with PWA
- Therapist mode with guided check-ins
- Export mood and reflection data
- Daily goals and achievements
- Companion mobile app (React Native)
- Cloud sync (optional, user-consented)

---

## 📸 Screenshots


![Login](images\login.png)
![Welcome page](images\welcome.png)
![Mood tracker](images\moodtracker.png)
![Reflection](images\reflection.png)
![Insight](images\insight.png)


---

## 📜 License

This project is created for educational and mental wellness purposes only. Please use responsibly. It is **not a replacement for professional mental health care**.

---

## 💙 Final Note

MindMate is your private mental wellness companion. Track your emotions, reflect on your thoughts, and take a small step each day toward a better you. ✨

> “Mental health… is not a destination, but a process. It's about how you drive, not where you're going.” — Noam Shpancer
