# 🦊 Agentic Advisor

> Upload your Degree Works audit. Get your plan. Built for Marist students.

![Agentic Advisor](public/advisorlogo.jfif)

---

## What It Does

Agentic Advisor is an AI-powered academic planning assistant for Marist College students. It takes the confusion out of interpreting Degree Works audits and turns them into a clear, actionable semester plan.

**Upload your audit → Get your analysis → Plan your next semester → Export to calendar**

---

## Features

- 📄 **PDF Upload** — Drop in your Degree Works audit, no account needed
- 🤖 **AI Analysis** — Extracts your major, GPA, completed classes, transfer credits, AP exam credits, and remaining requirements
- ✅ **Smart Cross-Reference** — Compares your completed courses against Marist's actual requirement structure
- 🎓 **Semester Planner** — Pick a goal (balanced, easiest, GPA recovery, fast graduation) and get 4-5 recommended classes with explanations
- 📚 **Requirements Tracker** — Grouped by Core, Distribution, Pathway, and Concentration with interactive dropdowns
- 🔢 **Credit Progress Bars** — Live tracking of distribution and liberal arts credits as you plan
- 📅 **Calendar Export** — .ics file ready to import into Google Calendar
- 💾 **Persistent State** — Survives accidental page refreshes via localStorage

---

## Tech Stack

| Layer | Choice |
|---|---|
| Backend | Node.js + Express |
| PDF Parsing | pdf2json |
| AI Model | Groq API (llama-3.3-70b-versatile) — free tier |
| Frontend | Vanilla HTML/CSS/JS |
| Persistence | localStorage |

---

## Setup

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/agentic-advisor.git
cd agentic-advisor
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add your Groq API key
Create a `.env` file in the root:
```
GROQ_API_KEY=your_key_here
```
Get a free key at [console.groq.com](https://console.groq.com)

### 4. Run the server
```bash
node server.js
```

### 5. Open in browser
```
http://localhost:3000
```

---

## How to Get Your Degree Works Audit

1. Log into [my.marist.edu](https://my.marist.edu)
2. Go to **Student Records → Degree Works**
3. Click **Print** or **Export as PDF**
4. Upload that file to Agentic Advisor

---

## Current Support

| Major | Concentration | Status |
|---|---|---|
| Computer Science | Software Development | ✅ Fully mapped |
| All others | — | ⚠️ Classes extracted, requirements coming soon |

---

## Built At

Marist College Campus Enterprise Computing Hackathon  
Solo build · ~21 hours

---

## Roadmap

- [ ] Calendar export (.ics) with real Marist academic calendar dates
- [ ] Pathway comparison tool (see how your classes map to other pathways)
- [ ] Multi-major requirement support
- [ ] Prerequisite chain visualization
- [ ] Live Marist course section data integration

---

## Disclaimer

This tool is a proof of concept and is not affiliated with or endorsed by Marist College. Always verify your academic plan with your official advisor.
