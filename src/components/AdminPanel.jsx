import React, { useState, useEffect } from 'react';
import {
  Upload, FileDown, CheckCircle, AlertCircle, Lock,
  PlusCircle, Trash2, UserPlus, ChevronDown
} from 'lucide-react';

const API = '/api';

// ── Tiny reusable helpers ──────────────────────────────────────────────────────
const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs text-gray-400 uppercase tracking-wider">{label}</label>}
    <input
      {...props}
      className="bg-[var(--color-navy-primary)] border border-gray-700 focus:border-[var(--color-gold-primary)] rounded-lg px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-gray-600"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs text-gray-400 uppercase tracking-wider">{label}</label>}
    <select
      {...props}
      className="bg-[var(--color-navy-primary)] border border-gray-700 focus:border-[var(--color-gold-primary)] rounded-lg px-3 py-2 text-sm text-white outline-none transition-colors"
    >
      {(options || []).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const StatusBadge = ({ status }) => {
  if (!status) return null;
  return (
    <div className={`mt-3 flex items-start gap-2 p-3 rounded-lg text-sm ${status.isError ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
      {status.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
      <span>{status.message}</span>
    </div>
  );
};

const TabPill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${active ? 'bg-[var(--color-gold-primary)] text-[var(--color-navy-primary)]' : 'text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500'}`}
  >
    {label}
  </button>
);

const yearOptions = [
  { value: 1, label: '1st Year' },
  { value: 2, label: '2nd Year' },
  { value: 3, label: '3rd Year' },
];

// ── PARTICIPANTS SECTION ───────────────────────────────────────────────────────
const ParticipantsSection = () => {
  const [tab, setTab] = useState('manual');
  const [status, setStatus] = useState(null);
  const [manageYear, setManageYear] = useState(1);
  const [teamsList, setTeamsList] = useState([]);
  
  // Manual state
  const [form, setForm] = useState({ teamName: '', year: 1, leaderName: '', iarNumber: '', leaderEmail: '' });
  const [members, setMembers] = useState(['', '', '', '']);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setMember = (i, v) => setMembers(m => m.map((x, j) => j === i ? v : x));
  const addMember = () => setMembers(m => [...m, '']);
  const removeMember = i => setMembers(m => m.filter((_, j) => j !== i));

  const fetchTeamsForManage = async (year) => {
    try {
      console.log(`[Admin] Fetching teams for year: ${year}`);
      const r = await fetch(`${API}/teams?year=${year}`);
      const d = await r.json();
      setTeamsList(d);
    } catch (e) { 
      console.error('[Admin] Fetch error:', e); 
      setStatus({ message: 'Failed to load teams list', isError: true });
    }
  };

  useEffect(() => {
    if (tab === 'manage') fetchTeamsForManage(manageYear);
  }, [tab, manageYear]);

  const handleDeleteTeam = async (id) => {
    console.log(`[Admin] Attempting to delete team ID: ${id}`);
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    
    try {
      const r = await fetch(`${API}/delete-team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: id })
      });
      const data = await r.json();
      
      if (r.ok && data.success) {
        console.log('[Admin] Deletion success');
        setStatus({ message: 'Team deleted successfully', isError: false });
        fetchTeamsForManage(manageYear);
      } else {
        console.error('[Admin] Deletion failed:', data.error);
        setStatus({ message: data.error || 'Failed to delete team', isError: true });
      }
    } catch (error) { 
      console.error('[Admin] Network error during deletion:', error);
      setStatus({ message: 'Network error. Is the backend running?', isError: true }); 
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: 'Saving...', isError: false });
    try {
      const r = await fetch(`${API}/add-team-manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, participants: members.filter(m => m.trim()) })
      });
      const d = await r.json();
      if (r.ok && d.success) setStatus({ message: '✅ Team saved successfully!', isError: false });
      else setStatus({ message: d.error || 'Failed to save', isError: true });
    } catch { setStatus({ message: 'Server error. Is the backend running?', isError: true }); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    if (!file.name.endsWith('.xlsx')) return setStatus({ message: 'Please upload a .xlsx file', isError: true });
    const fd = new FormData(); fd.append('file', file);
    setStatus({ message: 'Uploading...', isError: false });
    try {
      const r = await fetch(`${API}/import-participants`, { method: 'POST', body: fd });
      const d = await r.json();
      if (r.ok && d.success) setStatus({ message: `✅ ${d.teamsImported} teams, ${d.participantsImported} participants imported.`, isError: false });
      else setStatus({ message: d.error || 'Upload failed', isError: true });
    } catch { setStatus({ message: 'Server error. Is the backend running?', isError: true }); }
    e.target.value = '';
  };

  return (
    <div className="bg-[var(--color-navy-mid)] rounded-2xl border border-gray-700 overflow-hidden">
      <div className="p-5 border-b border-gray-700 flex items-center justify-between">
        <h3 className="font-bold text-white flex items-center gap-2"><UserPlus className="w-4 h-4 text-[var(--color-gold-primary)]" /> Participants</h3>
        <div className="flex gap-2">
          <TabPill label="Add" active={tab === 'manual'} onClick={() => setTab('manual')} />
          <TabPill label="Import" active={tab === 'excel'} onClick={() => setTab('excel')} />
          <TabPill label="Manage" active={tab === 'manage'} onClick={() => setTab('manage')} />
        </div>
      </div>

      <div className="p-5">
        {tab === 'manage' ? (
          <div className="space-y-4">
            <Select label="Year to View" value={manageYear} onChange={e => setManageYear(+e.target.value)} options={yearOptions} />
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 scrollbar-hide">
              {!Array.isArray(teamsList) || teamsList.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-4 italic">No teams registered for this year.</p>
              ) : (
                teamsList.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-3 bg-[var(--color-navy-primary)] rounded-lg border border-gray-800 group transition-colors hover:border-[var(--color-gold-primary)]/30">
                    <div className="truncate pr-2">
                      <p className="text-sm font-bold text-white truncate">{t.teamName}</p>
                      <p className="text-[10px] text-gray-500 font-mono tracking-tighter truncate">{t.leaderEmail}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteTeam(t.id)}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors bg-white/5 rounded-md hover:bg-red-500/10"
                      title="Delete Team"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : tab === 'excel' ? (
          <div className="space-y-3">
            <p className="text-xs text-gray-400">Columns: <span className="text-gray-300 font-mono">Year | TeamName | LeaderName | IARNumber | LeaderEmail | ParticipantName</span></p>
            <label className="cursor-pointer flex justify-center items-center w-full bg-[var(--color-gold-primary)]/10 hover:bg-[var(--color-gold-primary)]/20 border border-[var(--color-gold-primary)]/30 text-[var(--color-gold-light)] py-3 rounded-lg font-semibold transition-colors text-sm gap-2">
              <FileDown className="w-4 h-4" /> Select .xlsx File
              <input type="file" accept=".xlsx" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Team Name *" value={form.teamName} onChange={e => setField('teamName', e.target.value)} required placeholder="e.g. ByteBuilders" />
              <Select label="Year *" value={form.year} onChange={e => setField('year', +e.target.value)} options={yearOptions} />
            </div>

            <div className="border-t border-gray-700 pt-4">
              <p className="text-xs text-[var(--color-gold-primary)] font-bold uppercase tracking-wider mb-3">Team Leader Details</p>
              <div className="grid grid-cols-1 gap-3">
                <Input label="Leader Name" value={form.leaderName} onChange={e => setField('leaderName', e.target.value)} placeholder="Full name" />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="IAR Number" value={form.iarNumber} onChange={e => setField('iarNumber', e.target.value)} placeholder="e.g. IAR2023001" />
                  <Input label="Leader Email" value={form.leaderEmail} onChange={e => setField('leaderEmail', e.target.value)} type="email" placeholder="email@iar.ac.in" />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>All Members (including leader)</span>
                <button type="button" onClick={addMember} className="text-[var(--color-gold-primary)] hover:text-[var(--color-gold-light)] text-xs flex items-center gap-1">
                  <PlusCircle className="w-3 h-3" /> Add
                </button>
              </p>
              <div className="space-y-2">
                {(members || []).map((m, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={m} onChange={e => setMember(i, e.target.value)} placeholder={`Member ${i + 1} name`} />
                    {members.length > 1 && (
                      <button type="button" onClick={() => removeMember(i)} className="text-gray-600 hover:text-red-400 transition-colors mt-6">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full bg-[var(--color-gold-primary)] hover:bg-[var(--color-gold-light)] text-[var(--color-navy-primary)] font-bold py-2.5 rounded-lg transition-colors text-sm">
              Save Team
            </button>
          </form>
        )}
        <StatusBadge status={status} />
      </div>
    </div>
  );
};

// ── JUDGES SECTION ─────────────────────────────────────────────────────────────
const JudgesSection = () => {
  const [tab, setTab] = useState('manual');
  const [status, setStatus] = useState(null);
  const [form, setForm] = useState({ name: '', designation: '', institute: '', year: 1 });
  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: 'Saving...', isError: false });
    try {
      const r = await fetch(`${API}/add-judge-manual`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const d = await r.json();
      if (r.ok && d.success) { setStatus({ message: '✅ Judge saved!', isError: false }); setForm({ name: '', designation: '', institute: '', year: 1 }); }
      else setStatus({ message: d.error || 'Failed', isError: true });
    } catch { setStatus({ message: 'Server error. Is the backend running?', isError: true }); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const fd = new FormData(); fd.append('file', file);
    setStatus({ message: 'Uploading...', isError: false });
    try {
      const r = await fetch(`${API}/import-judges`, { method: 'POST', body: fd });
      const d = await r.json();
      if (r.ok && d.success) setStatus({ message: `✅ ${d.judgesImported} judges imported.`, isError: false });
      else setStatus({ message: d.error || 'Upload failed', isError: true });
    } catch { setStatus({ message: 'Server error. Is the backend running?', isError: true }); }
    e.target.value = '';
  };

  return (
    <div className="bg-[var(--color-navy-mid)] rounded-2xl border border-gray-700 overflow-hidden">
      <div className="p-5 border-b border-gray-700 flex items-center justify-between">
        <h3 className="font-bold text-white flex items-center gap-2"><UserPlus className="w-4 h-4 text-[var(--color-gold-primary)]" /> Judges</h3>
        <div className="flex gap-2">
          <TabPill label="Manual Entry" active={tab === 'manual'} onClick={() => setTab('manual')} />
          <TabPill label="Import Excel" active={tab === 'excel'} onClick={() => setTab('excel')} />
        </div>
      </div>

      <div className="p-5">
        {tab === 'excel' ? (
          <div className="space-y-3">
            <p className="text-xs text-gray-400">Columns: <span className="text-gray-300 font-mono">Year | Name | Designation | Institute</span></p>
            <label className="cursor-pointer flex justify-center items-center w-full bg-[var(--color-gold-primary)]/10 hover:bg-[var(--color-gold-primary)]/20 border border-[var(--color-gold-primary)]/30 text-[var(--color-gold-light)] py-3 rounded-lg font-semibold transition-colors text-sm gap-2">
              <FileDown className="w-4 h-4" /> Select .xlsx File
              <input type="file" accept=".xlsx" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Full Name *" value={form.name} onChange={e => setField('name', e.target.value)} required placeholder="Dr. Anita Sharma" />
              <Select label="Year *" value={form.year} onChange={e => setField('year', +e.target.value)} options={yearOptions} />
            </div>
            <Input label="Designation" value={form.designation} onChange={e => setField('designation', e.target.value)} placeholder="e.g. Professor, Dept of AI" />
            <Input label="Institute" value={form.institute} onChange={e => setField('institute', e.target.value)} placeholder="e.g. IAR University" />
            <button type="submit" className="w-full bg-[var(--color-gold-primary)] hover:bg-[var(--color-gold-light)] text-[var(--color-navy-primary)] font-bold py-2.5 rounded-lg transition-colors text-sm">
              Save Judge
            </button>
          </form>
        )}
        <StatusBadge status={status} />
      </div>
    </div>
  );
};

// ── RESULTS SECTION ────────────────────────────────────────────────────────────
const ResultsSection = () => {
  const [tab, setTab] = useState('manual');
  const [status, setStatus] = useState(null);
  const [form, setForm] = useState({ year: 1, position: 1, teamName: '', prize: '' });
  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: 'Saving...', isError: false });
    try {
      const r = await fetch(`${API}/add-result-manual`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const d = await r.json();
      if (r.ok && d.success) { setStatus({ message: '✅ Result saved!', isError: false }); setForm({ year: 1, position: 1, teamName: '', prize: '' }); }
      else setStatus({ message: d.error || 'Failed', isError: true });
    } catch { setStatus({ message: 'Server error. Is the backend running?', isError: true }); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const fd = new FormData(); fd.append('file', file);
    setStatus({ message: 'Uploading...', isError: false });
    try {
      const r = await fetch(`${API}/import-results`, { method: 'POST', body: fd });
      const d = await r.json();
      if (r.ok && d.success) setStatus({ message: '✅ Results imported.', isError: false });
      else setStatus({ message: d.error || 'Upload failed', isError: true });
    } catch { setStatus({ message: 'Server error. Is the backend running?', isError: true }); }
    e.target.value = '';
  };

  return (
    <div className="bg-[var(--color-navy-mid)] rounded-2xl border border-gray-700 overflow-hidden">
      <div className="p-5 border-b border-gray-700 flex items-center justify-between">
        <h3 className="font-bold text-white flex items-center gap-2"><Upload className="w-4 h-4 text-[var(--color-gold-primary)]" /> Results</h3>
        <div className="flex gap-2">
          <TabPill label="Manual Entry" active={tab === 'manual'} onClick={() => setTab('manual')} />
          <TabPill label="Import Excel" active={tab === 'excel'} onClick={() => setTab('excel')} />
        </div>
      </div>

      <div className="p-5">
        {tab === 'excel' ? (
          <div className="space-y-3">
            <p className="text-xs text-gray-400">Columns: <span className="text-gray-300 font-mono">Year | Position | TeamName | Prize</span></p>
            <label className="cursor-pointer flex justify-center items-center w-full bg-[var(--color-gold-primary)]/10 hover:bg-[var(--color-gold-primary)]/20 border border-[var(--color-gold-primary)]/30 text-[var(--color-gold-light)] py-3 rounded-lg font-semibold transition-colors text-sm gap-2">
              <FileDown className="w-4 h-4" /> Select .xlsx File
              <input type="file" accept=".xlsx" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Select label="Year *" value={form.year} onChange={e => setField('year', +e.target.value)} options={yearOptions} />
              <Select label="Position *" value={form.position} onChange={e => setField('position', +e.target.value)} options={[
                { value: 1, label: '🥇 1st Place' }, { value: 2, label: '🥈 2nd Place' }, { value: 3, label: '🥉 3rd Place' }
              ]} />
            </div>
            <Input label="Team Name *" value={form.teamName} onChange={e => setField('teamName', e.target.value)} required placeholder="e.g. ByteBuilders" />
            <Input label="Prize" value={form.prize} onChange={e => setField('prize', e.target.value)} placeholder="e.g. ₹15,000" />
            <button type="submit" className="w-full bg-[var(--color-gold-primary)] hover:bg-[var(--color-gold-light)] text-[var(--color-navy-primary)] font-bold py-2.5 rounded-lg transition-colors text-sm">
              Save Result
            </button>
          </form>
        )}
        <StatusBadge status={status} />
      </div>
    </div>
  );
};

// ── MAIN ADMIN PANEL ───────────────────────────────────────────────────────────
const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'UDAAN2026@ADMIN') { setIsAuthenticated(true); setError(''); }
    else setError('Invalid admin password');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen premium-gradient py-20 px-4 flex justify-center items-center">
        <div className="bg-[var(--color-navy-mid)] p-8 rounded-2xl border border-[var(--color-gold-primary)]/30 card-shadow max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[var(--color-navy-primary)] rounded-full flex justify-center items-center mx-auto mb-6 border border-[var(--color-gold-primary)]/50">
            <Lock className="w-8 h-8 text-[var(--color-gold-primary)]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-6">Admin Access Required</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Enter Admin Password"
              className="w-full bg-[var(--color-navy-primary)] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold-primary)] mb-4"
            />
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <button type="submit" className="w-full bg-[var(--color-gold-primary)] hover:bg-[var(--color-gold-light)] text-[var(--color-navy-primary)] font-bold py-3 rounded-lg transition-colors">
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen premium-gradient py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10 border-b border-[var(--color-gold-primary)]/20 pb-5">
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Lock className="w-8 h-8 text-[var(--color-gold-primary)]" />
            Hackfest Admin Dashboard
          </h1>
          <button onClick={() => setIsAuthenticated(false)} className="text-gray-400 hover:text-white px-4 py-2 bg-white/5 rounded-lg text-sm transition-colors border border-white/10">
            Logout
          </button>
        </div>

        <p className="text-gray-400 text-sm mb-8">
          Each section supports both <span className="text-[var(--color-gold-light)] font-semibold">Manual Entry</span> and <span className="text-[var(--color-gold-light)] font-semibold">Excel Import</span>. Use the tabs on each card to switch.
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <ParticipantsSection />
          <JudgesSection />
          <ResultsSection />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
