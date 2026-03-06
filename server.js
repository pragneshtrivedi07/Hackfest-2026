import express from 'express';
import Database from 'better-sqlite3';
import multer from 'multer';
import * as xlsx from 'xlsx';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'dist')));

const db = new Database('hackfest.db');

// Initialize DB schema
db.exec(`
  CREATE TABLE IF NOT EXISTS teams (id INTEGER PRIMARY KEY, team_name TEXT UNIQUE, year INTEGER, leader_name TEXT, iar_number TEXT, leader_email TEXT, leader_phone TEXT);
  CREATE TABLE IF NOT EXISTS participants (id INTEGER PRIMARY KEY, team_id INTEGER, name TEXT, FOREIGN KEY(team_id) REFERENCES teams(id));
  CREATE TABLE IF NOT EXISTS judges (id INTEGER PRIMARY KEY, name TEXT, designation TEXT, institute TEXT, year INTEGER);
  CREATE TABLE IF NOT EXISTS results (id INTEGER PRIMARY KEY, year INTEGER, position INTEGER, team_name TEXT, prize TEXT);
`);

// Migrate existing DB if columns are missing (safe for existing deployments)
try {
  db.exec(`ALTER TABLE teams ADD COLUMN leader_name TEXT;`);
} catch(e) { /* column already exists */ }
try {
  db.exec(`ALTER TABLE teams ADD COLUMN iar_number TEXT;`);
} catch(e) { /* column already exists */ }
try {
  db.exec(`ALTER TABLE teams ADD COLUMN leader_email TEXT;`);
} catch(e) { /* column already exists */ }
try {
  db.exec(`ALTER TABLE teams ADD COLUMN leader_phone TEXT;`);
} catch(e) { /* column already exists */ }

const upload = multer({ storage: multer.memoryStorage() });

// Calculate Phase
const getPhase = () => {
  // Current time in IST
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in ms
  
  // Create a proper IST date object for comparison
  const nowIST = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + istOffset);
  
  // Thresholds in IST
  const d1 = new Date(Date.UTC(2026, 2, 22, 18, 30, 0)); // 23 Mar 2026 00:00 IST
  const d2 = new Date(Date.UTC(2026, 2, 23, 18, 30, 0)); // 24 Mar 2026 00:00 IST
  const d3 = new Date(Date.UTC(2026, 2, 24, 18, 30, 0)); // 25 Mar 2026 00:00 IST
  const resultsDay = new Date(Date.UTC(2026, 2, 25, 18, 30, 0)); // 26 Mar 2026 00:00 IST
  
  if (now.getTime() < d1.getTime()) {
    return { phase: 'pre-event', nextUnlock: d1.toISOString() };
  } else if (now.getTime() < d2.getTime()) {
    return { phase: 'day1', nextUnlock: d2.toISOString() };
  } else if (now.getTime() < d3.getTime()) {
    return { phase: 'day2', nextUnlock: d3.toISOString() };
  } else if (now.getTime() < resultsDay.getTime()) {
    return { phase: 'day3', nextUnlock: resultsDay.toISOString() };
  } else {
    return { phase: 'results', nextUnlock: null };
  }
};

// Phase API
app.get('/api/phase', (req, res) => {
  res.json(getPhase());
});

// Import Teams & Participants
app.post('/api/import-participants', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
    let teamsImported = 0;
    let participantsImported = 0;
    
    const insertTeam = db.prepare(`
      INSERT OR IGNORE INTO teams (team_name, year, leader_name, iar_number, leader_email)
      VALUES (?, ?, ?, ?, ?)
    `);
    const updateTeamLeader = db.prepare(`
      UPDATE teams SET leader_name=?, iar_number=?, leader_email=? WHERE team_name=?
    `);
    const getTeamId = db.prepare('SELECT id FROM teams WHERE team_name = ?');
    const insertParticipant = db.prepare('INSERT INTO participants (team_id, name) VALUES (?, ?)');
    
    db.transaction(() => {
      const uniqueTeams = new Set();
      data.forEach(row => {
        if (row.TeamName && row.Year) {
          if (!uniqueTeams.has(row.TeamName)) {
            const result = insertTeam.run(
              row.TeamName,
              row.Year,
              row.LeaderName || '',
              row.IARNumber || '',
              row.LeaderEmail || ''
            );
            if (result.changes > 0) {
              teamsImported++;
            } else {
              // Team already exists, update leader info if provided
              if (row.LeaderName || row.IARNumber || row.LeaderEmail) {
                updateTeamLeader.run(row.LeaderName || '', row.IARNumber || '', row.LeaderEmail || '', row.TeamName);
              }
            }
            uniqueTeams.add(row.TeamName);
          }
          
          const team = getTeamId.get(row.TeamName);
          if (team && row.ParticipantName) {
            insertParticipant.run(team.id, row.ParticipantName);
            participantsImported++;
          }
        }
      });
    })();
    
    res.json({ success: true, teamsImported, participantsImported });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process Excel file', details: error.message });
  }
});

// Import Judges
app.post('/api/import-judges', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
    let judgesImported = 0;
    const insertJudge = db.prepare('INSERT INTO judges (name, designation, institute, year) VALUES (?, ?, ?, ?)');
    
    db.transaction(() => {
      data.forEach(row => {
        if (row.Name && row.Year) {
          insertJudge.run(row.Name, row.Designation || '', row.Institute || '', row.Year);
          judgesImported++;
        }
      });
    })();
    
    res.json({ success: true, judgesImported });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process Excel file', details: error.message });
  }
});

// Import Results
app.post('/api/import-results', upload.single('file'), (req, res) => {
  const { phase } = getPhase();
  if (phase !== 'results' && phase !== 'day3' && phase !== 'day2' && phase !== 'day1' && phase !== 'pre-event') {
    // Actually prompt says "only shown after 25 Mar 2026" on frontend, so backend can accept it anytime.
  }
  
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
    const insertResult = db.prepare('INSERT INTO results (year, position, team_name, prize) VALUES (?, ?, ?, ?)');
    
    db.transaction(() => {
      // Clear existing results to avoid duplicates
      db.prepare('DELETE FROM results').run();
      
      data.forEach(row => {
        if (row.Position && row.TeamName && row.Year) {
          insertResult.run(row.Year, row.Position, row.TeamName, row.Prize || '');
        }
      });
    })();
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process Excel file', details: error.message });
  }
});

// GET Teams
app.get('/api/teams', (req, res) => {
  const year = req.query.year || 1;
  const getTeams = db.prepare('SELECT id, team_name as teamName, year, leader_name as leaderName, iar_number as iarNumber, leader_email as leaderEmail, leader_phone as leaderPhone FROM teams WHERE year = ?');
  const getParticipants = db.prepare('SELECT name FROM participants WHERE team_id = ?');
  
  const teams = getTeams.all(year);
  const result = teams.map(t => {
    const participants = getParticipants.all(t.id).map(p => p.name);
    return { ...t, participants };
  });
  
  res.json(result);
});

// GET Judges
app.get('/api/judges', (req, res) => {
  const year = req.query.year || 1;
  const judges = db.prepare('SELECT name, designation, institute, year FROM judges WHERE year = ?').all(year);
  res.json(judges);
});

// GET Results
app.get('/api/results', (req, res) => {
  const { phase } = getPhase();
  if (phase !== 'results') {
    return res.json({ locked: true });
  }
  
  const results = db.prepare('SELECT year, position, team_name as teamName, prize FROM results ORDER BY year, position').all();
  
  const formatted = { year1: [], year2: [], year3: [] };
  results.forEach(r => {
    if (r.year === 1) formatted.year1.push(r);
    if (r.year === 2) formatted.year2.push(r);
    if (r.year === 3) formatted.year3.push(r);
  });
  
  res.json(formatted);
});

// Manual Add Team + Participants
app.post('/api/add-team-manual', (req, res) => {
  try {
    const { teamName, year, leaderName, iarNumber, leaderEmail, participants } = req.body;
    if (!teamName || !year) return res.status(400).json({ error: 'TeamName and Year are required' });

    const insertTeam = db.prepare(`
      INSERT OR REPLACE INTO teams (team_name, year, leader_name, iar_number, leader_email)
      VALUES (?, ?, ?, ?, ?)
    `);
    const getTeamId = db.prepare('SELECT id FROM teams WHERE team_name = ?');
    const clearParticipants = db.prepare('DELETE FROM participants WHERE team_id = ?');
    const insertParticipant = db.prepare('INSERT INTO participants (team_id, name) VALUES (?, ?)');

    db.transaction(() => {
      insertTeam.run(teamName, year, leaderName || '', iarNumber || '', leaderEmail || '');
      const team = getTeamId.get(teamName);
      if (team && Array.isArray(participants) && participants.length > 0) {
        clearParticipants.run(team.id);
        participants.forEach(name => {
          if (name && name.trim()) insertParticipant.run(team.id, name.trim());
        });
      }
    })();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Delete Team
app.post('/api/delete-team', (req, res) => {
  try {
    const { teamId } = req.body;
    console.log(`[DELETE] Request to delete team ID: ${teamId}`);
    if (!teamId) return res.status(400).json({ error: 'Team ID is required' });

    const deleteParticipants = db.prepare('DELETE FROM participants WHERE team_id = ?');
    const deleteTeam = db.prepare('DELETE FROM teams WHERE id = ?');

    db.transaction(() => {
      const pResult = deleteParticipants.run(teamId);
      const tResult = deleteTeam.run(teamId);
      console.log(`[DELETE] Success: Deleted ${pResult.changes} participants and ${tResult.changes} team.`);
    })();

    res.json({ success: true, message: 'Team deleted successfully' });
  } catch (error) {
    console.error('[DELETE] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Manual Add Judge
app.post('/api/add-judge-manual', (req, res) => {
  try {
    const { name, designation, institute, year } = req.body;
    if (!name || !year) return res.status(400).json({ error: 'Name and Year are required' });

    db.prepare('INSERT INTO judges (name, designation, institute, year) VALUES (?, ?, ?, ?)'
    ).run(name, designation || '', institute || '', year);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Manual Add Result
app.post('/api/add-result-manual', (req, res) => {
  try {
    const { year, position, teamName, prize } = req.body;
    if (!year || !position || !teamName) return res.status(400).json({ error: 'Year, Position, and TeamName are required' });

    // Remove existing entry for this year+position before inserting
    db.prepare('DELETE FROM results WHERE year = ? AND position = ?').run(year, position);
    db.prepare('INSERT INTO results (year, position, team_name, prize) VALUES (?, ?, ?, ?)'
    ).run(year, position, teamName, prize || '');

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Public Self-Registration
app.post('/api/register', (req, res) => {
  try {
    const { teamName, year, leaderName, iarNumber, leaderEmail, leaderPhone, members } = req.body;
    if (!teamName || !year || !leaderName || !iarNumber || !leaderEmail) {
      return res.status(400).json({ error: 'Team Name, Year, Leader Name, IAR Number, and Email are required.' });
    }

    const insertTeam = db.prepare(`
      INSERT OR REPLACE INTO teams (team_name, year, leader_name, iar_number, leader_email, leader_phone)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const getTeamId = db.prepare('SELECT id FROM teams WHERE team_name = ?');
    const clearParticipants = db.prepare('DELETE FROM participants WHERE team_id = ?');
    const insertParticipant = db.prepare('INSERT INTO participants (team_id, name) VALUES (?, ?)');

    db.transaction(() => {
      insertTeam.run(teamName.trim(), year, leaderName.trim(), iarNumber.trim(), leaderEmail.trim(), leaderPhone ? leaderPhone.trim() : '');
      const team = getTeamId.get(teamName.trim());
      if (team && Array.isArray(members) && members.length > 0) {
        clearParticipants.run(team.id);
        members.forEach(name => {
          if (name && name.trim()) insertParticipant.run(team.id, name.trim());
        });
      }
    })();

    res.json({ success: true, message: `Team "${teamName}" registered successfully!` });
  } catch (error) {
    console.error(error);
    if (error.message && error.message.includes('UNIQUE constraint')) {
      return res.status(409).json({ error: `A team with the name "${req.body.teamName}" already exists. Please use a different team name or contact admin.` });
    }
    res.status(500).json({ error: error.message });
  }
});

// Local Mock Chat API (Since no key is available)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }
    
    // Get the latest user message
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
    
    // Simulate a slight network delay to make it feel like AI
    await new Promise(resolve => setTimeout(resolve, 800));

    let responseText = "I am the standard Hackfest AI Assistant. I can help you with questions about the hackathon schedule, what RAG is, or the tech stack requirements! What would you like to know?";
    
    // More robust keyword matching
    if (
      lastMessage.includes("team size") || 
      lastMessage.includes("team") || 
      lastMessage.includes("members") || 
      lastMessage.includes("female")
    ) {
      responseText = "A team must consist of exactly 4 participants, and having at least 1 female participant is mandatory.";
    } 
    else if (
      lastMessage.includes("fee") || 
      lastMessage.includes("cost") || 
      lastMessage.includes("pay") || 
      lastMessage.includes("free") ||
      lastMessage.includes("registration")
    ) {
      responseText = "Great news! The IAR UDAAN Hackfest 2026 is totally free to enter. There are no registration fees.";
    } 
    else if (
      lastMessage.includes("food") || 
      lastMessage.includes("lunch") || 
      lastMessage.includes("dinner") || 
      lastMessage.includes("meal") ||
      lastMessage.includes("accommodation")
    ) {
      responseText = "Please note that there will be no food provided during the hackathon. Participants are expected to manage their own meals.";
    } 
    else if (
      lastMessage.match(/\b(who|eligibility|eligible|participate|college|university)\b/i) &&
      !lastMessage.includes("win") // prevent mixup with "how to win"
    ) {
      responseText = "This hackathon is open exclusively to anyone currently studying at IAR University.";
    } 
    else if (
      lastMessage.includes("laptop") || 
      lastMessage.includes("hardware") || 
      lastMessage.includes("computer") || 
      lastMessage.includes("bring")
    ) {
      responseText = "Yes, participants must bring their own laptops and any other hardware they might need to build their projects.";
    }
    else if (lastMessage.includes("prize") || lastMessage.includes("cash") || lastMessage.includes("award") || lastMessage.includes("goodies") || lastMessage.includes("certificate")) {
      responseText = "The college is giving away massive Cash Prizes to the winners! Plus, all participants will receive official GeeksforGeeks Certificates and Goodies.";
    }
    else if (lastMessage.includes("rag") || lastMessage.includes("retrieval augmented generation")) {
      responseText = "RAG (Retrieval-Augmented Generation) is an AI framework where the model retrieves facts from an external database or knowledge base to improve the accuracy and context of its answers. Look into it for Day 2 and Day 3!";
    } 
    else if (lastMessage.includes("tech stack") || lastMessage.includes("stack") || lastMessage.includes(" technologies") || lastMessage.includes("suggest")) {
      responseText = "We highly recommend building your frontend using React/Vite with TailwindCSS, and Node.js + Express for backend. For the AI, look into LangChain and vector databases like Pinecone.";
    } 
    else if (lastMessage.includes("win") || lastMessage.includes("strategy") || lastMessage.includes("tips")) {
      responseText = "To win, focus heavily on the 'Scalability Hook' mentioned in each problem statement. The judges want to see solutions that don't just work locally, but can scale across domains!";
    } 
    else if (lastMessage.includes("day 1") || lastMessage.includes("education")) {
      responseText = "Day 1 (23 March) focuses on the Education domain. Prepare for Gen-AI, NLP, Speech-to-Text, and translation logic.";
    } 
    else if (lastMessage.includes("day 2") || lastMessage.includes("smart cities")) {
      responseText = "Day 2 (24 March) focuses on Smart Cities! You'll need to brush up on RAG, Multi-modal AI and Classification systems.";
    } 
    else if (lastMessage.includes("day 3") || lastMessage.includes("finance")) {
      responseText = "Day 3 (25 March) focuses on Finance & Banking. Agentic AI, real-time streaming, and Anomaly detection will be critical here!";
    } 
    else if (lastMessage.includes("hello") || lastMessage.includes("hi ") || lastMessage.includes("hey")) {
      responseText = "Hello there! Welcome to IAR UDAAN Hackfest 2026. How can I assist you with your project today?";
    }

    res.json({ text: responseText });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Failed to communicate with AI Assistant' });
  }
});

// SPA Catch-all: Serve index.html for any unknown routes (for React Router)
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
