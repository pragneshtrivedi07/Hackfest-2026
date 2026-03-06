import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PhaseBar from './components/PhaseBar';
import Hero from './components/Hero';
import RegistrationForm from './components/RegistrationForm';
import ProblemStatements from './components/ProblemStatements';
import Teams from './components/Teams';
import Judges from './components/Judges';
import Results from './components/Results';
import AdminPanel from './components/AdminPanel';
import ChatAssistant from './components/ChatAssistant';

const MainEvent = () => {
  const [phaseData, setPhaseData] = useState({ phase: 'pre-event', nextUnlock: null });

  useEffect(() => {
    const fetchPhase = async () => {
      try {
        const response = await fetch('/api/phase');
        const data = await response.json();
        setPhaseData(data);
      } catch (error) {
        console.error('Failed to fetch phase data. Is the backend running?', error);
      }
    };

    fetchPhase();
    // Refresh phase every minute just in case the app is left open
    const interval = setInterval(fetchPhase, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-navy-primary)] text-white font-sans selection:bg-[var(--color-gold-primary)] selection:text-[var(--color-navy-primary)] scroll-smooth">
      <PhaseBar phase={phaseData.phase} />
      <Navbar phase={phaseData.phase} />
      
      <main>
        <Hero phase={phaseData.phase} nextUnlock={phaseData.nextUnlock} />
        <ProblemStatements phase={phaseData.phase} nextUnlock={phaseData.nextUnlock} />
        <Teams />
        <Judges />
        <Results phase={phaseData.phase} />
      </main>

      <ChatAssistant />
      
      <footer className="bg-[var(--color-navy-mid)] py-8 border-t border-[var(--color-gold-primary)]/20 text-center text-sm text-gray-500">
        <p>&copy; 2026 IAR UDAAN HACKFEST. All rights reserved.</p>
        <p className="mt-2 text-[var(--color-gold-primary)]/50">Built for innovation.</p>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainEvent />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
};

export default App;
