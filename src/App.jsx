console.log('[DEBUG] App.jsx loading...');
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
  console.log('[DEBUG] MainEvent initializing');
  const [phaseData, setPhaseData] = useState({ phase: 'pre-event', nextUnlock: null });
  const [renderError, setRenderError] = useState(null);

  useEffect(() => {
    console.log('[DEBUG] MainEvent mounted');
    const fetchPhase = async () => {
      try {
        const response = await fetch('/api/phase');
        if (!response.ok) throw new Error('API Error');
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

  if (renderError) {
    return (
      <div style={{ background: '#7f1d1d', color: 'white', padding: '20px', position: 'fixed', inset: 0, zIndex: 9999, overflow: 'auto' }}>
        <h1>MainEvent.jsx Render Error</h1>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: 'small' }}>{renderError.toString()}</pre>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: 'x-small' }}>{renderError.stack}</pre>
        <button onClick={() => window.location.reload()} style={{ background: 'white', color: 'black', padding: '5px 10px', marginTop: '10px' }}>Refresh</button>
      </div>
    );
  }

  try {
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
  } catch (err) {
    console.error('[DEBUG] MainEvent CRASHED', err);
    setRenderError(err);
    return null;
  }
};

const App = () => {
  console.log('[DEBUG] App initializing');
  try {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<MainEvent />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    );
  } catch (err) {
    console.error('[DEBUG] App WRAPPER CRASHED', err);
    return <div style={{ color: 'red' }}>App Wrapper Error: {err.message}</div>;
  }
};

export default App;
