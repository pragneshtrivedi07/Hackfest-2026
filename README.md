# IAR UDAAN HACKFEST 2026

A full-stack dynamic website for "IAR UDAAN HACKFEST 2026" — an inter-college AI Hackathon themed around AI, Gen-AI, and RAG.

## Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS v4
- **Backend**: Node.js + Express.js
- **Database**: SQLite (via better-sqlite3)
- **AI Chat**: Anthropic Claude API (claude-3-5-sonnet-20241022)

## 🚀 Setup & Run Instructions

```bash
# 1. Install all dependencies (Frontend and Backend share the same package.json)
npm install

# 2. Create a .env file in the root directory and add the following:
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ADMIN_PASSWORD=
PORT=3001

# 3. Start the Backend API (opens on port 3001)
# Open a terminal and run:
node server.js

# 4. Start the Frontend (opens on port 5173 typically)
# Open ANOTHER terminal and run:
npm run dev
```

## Features
- **Time-Gated Reveal System**: The entire site changes based on current IST time.
- **Admin Panel**: Import Participants, Judges, and Results via `.xlsx` Excel uploads at `/admin`.
- **HACKFEST AI Assistant**: A helpful Claude-powered chatbot on the bottom right.
- **Premium Design**: Navy blue and gold theme with modern animations.

## Excel Templates for Admin Imports

### participants_template.xlsx
| Year | TeamName | ParticipantName |
|---|---|---|
| 1 | ByteBuilders | Aarav Shah |

### judges_template.xlsx
| Year | Name | Designation | Institute |
|---|---|---|---|
| 1 | Dr. Anita Sharma | Professor | IIT Ahmedabad |

### results_template.xlsx (Visible after 25 Mar 2026)
| Year | Position | TeamName | Prize |
|---|---|---|---|
| 1 | 1 | ByteBuilders | ₹15,000 |
