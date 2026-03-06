import React, { useState } from 'react';
import { Users, User, Hash, Mail, Phone, CheckCircle, ChevronRight, AlertCircle, X, Trophy, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SuccessModal = ({ teamName, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    {/* Backdrop */}
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
    
    {/* Modal */}
    <div className="relative bg-[var(--color-navy-mid)] rounded-3xl border border-[var(--color-gold-primary)]/40 p-8 max-w-md w-full text-center shadow-2xl z-10 animate-in zoom-in-95">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
        <X className="w-5 h-5" />
      </button>

      {/* Animated check */}
      <div className="relative mb-6 flex items-center justify-center">
        <div className="absolute w-24 h-24 bg-green-500/10 rounded-full animate-ping"></div>
        <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
          <CheckCircle className="w-10 h-10 text-white fill-white" />
        </div>
      </div>

      <h2 className="text-2xl font-extrabold text-white mb-2">Registration Successful!</h2>
      <p className="text-gray-400 mb-4">
        Your team <span className="text-[var(--color-gold-light)] font-bold">"{teamName}"</span> has been registered for <span className="text-white font-semibold">IAR UDAAN Hackfest 2026</span>.
      </p>
      
      <div className="bg-[var(--color-navy-primary)] rounded-xl p-4 mb-6 text-left space-y-2 border border-gray-800">
        <p className="text-sm text-gray-400 flex items-start gap-2"><Trophy className="w-4 h-4 text-[var(--color-gold-primary)] shrink-0 mt-0.5" /> Look out for Problem Statements — disclosed 24 hrs before each day!</p>
        <p className="text-sm text-gray-400 flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" /> Team size: 4 members with 1 female participant required.</p>
        <p className="text-sm text-gray-400 flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" /> Bring your own laptop and hardware.</p>
      </div>

      <button onClick={onClose} className="w-full bg-[var(--color-gold-primary)] hover:bg-[var(--color-gold-light)] text-[var(--color-navy-primary)] font-bold py-3 rounded-xl transition-colors mb-3">
        Got it!
      </button>
      <Link to="/" className="block text-center text-gray-400 hover:text-white text-sm transition-colors">
        ← Back to Main Site
      </Link>
    </div>
  </div>
);

const Input = ({ label, icon: Icon, required, ...props }) => (
  <div>
    {label && (
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
    )}
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />}
      <input
        {...props}
        className={`w-full bg-[var(--color-navy-primary)] border border-gray-700 focus:border-[var(--color-gold-primary)] rounded-xl ${Icon ? 'pl-9' : 'pl-4'} pr-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600`}
      />
    </div>
  </div>
);

const RegistrationForm = () => {
  const [form, setForm] = useState({
    teamName: '', year: '1', leaderName: '', iarNumber: '', leaderEmail: '', leaderPhone: ''
  });
  const [members, setMembers] = useState(['', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successTeam, setSuccessTeam] = useState('');

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setMember = (i, v) => setMembers(m => m.map((x, j) => j === i ? v : x));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate 4 members
    const filledMembers = members.filter(m => m.trim());
    if (filledMembers.length < 4) {
      setError('Please fill in all 4 team member names.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, year: +form.year, members: filledMembers })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessTeam(form.teamName);
        setForm({ teamName: '', year: '1', leaderName: '', iarNumber: '', leaderEmail: '', leaderPhone: '' });
        setMembers(['', '', '', '']);
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch {
      setError('Cannot connect to the server. Please make sure the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {successTeam && <SuccessModal teamName={successTeam} onClose={() => setSuccessTeam('')} />}

      <div className="min-h-screen bg-[var(--color-navy-primary)]">
        {/* Simple Header */}
        <div className="bg-[var(--color-navy-mid)]/90 backdrop-blur-md border-b border-[var(--color-gold-primary)]/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Main Site
            </Link>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-gold-primary)] to-[var(--color-gold-light)]">
              IAR UDAAN HACKFEST 2026
            </span>
          </div>
        </div>

        <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-gold-primary)]/5 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-white mb-4 relative inline-block">
              Team Registration
              <div className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-[var(--color-gold-primary)] to-transparent"></div>
            </h2>
            <p className="mt-4 text-gray-400">Register your team for IAR UDAAN Hackfest 2026</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-[var(--color-navy-primary)] border border-gray-800 rounded-3xl p-8 card-shadow space-y-8">
            
            {/* Team Info */}
            <div>
              <h3 className="text-[var(--color-gold-primary)] font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" /> Team Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input label="Team Name" icon={Users} required value={form.teamName} onChange={e => setField('teamName', e.target.value)} placeholder="e.g. ByteBuilders" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Participating Year <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.year}
                    onChange={e => setField('year', e.target.value)}
                    className="w-full bg-[var(--color-navy-mid)] border border-gray-700 focus:border-[var(--color-gold-primary)] rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
                    required
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Leader Info */}
            <div className="border-t border-gray-800 pt-8">
              <h3 className="text-[var(--color-gold-primary)] font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                <User className="w-4 h-4" /> Team Leader Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input label="Leader Full Name" icon={User} required value={form.leaderName} onChange={e => setField('leaderName', e.target.value)} placeholder="Full name" />
                </div>
                <Input label="IAR University Number" icon={Hash} required value={form.iarNumber} onChange={e => setField('iarNumber', e.target.value)} placeholder="e.g. IAR2023001" />
                <Input label="Email Address" icon={Mail} required type="email" value={form.leaderEmail} onChange={e => setField('leaderEmail', e.target.value)} placeholder="email@iar.ac.in" />
                <Input label="Phone Number" icon={Phone} type="tel" value={form.leaderPhone} onChange={e => setField('leaderPhone', e.target.value)} placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>

            {/* Team Members */}
            <div className="border-t border-gray-800 pt-8">
              <h3 className="text-[var(--color-gold-primary)] font-bold uppercase tracking-widest text-xs mb-1 flex items-center gap-2">
                <Users className="w-4 h-4" /> All 4 Team Members
              </h3>
              <p className="text-xs text-gray-500 mb-4">Include the leader as one of the 4 members. <span className="text-amber-400">At least 1 female participant mandatory.</span></p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(members || []).map((m, i) => (
                  <Input
                    key={i}
                    label={`Member ${i + 1}${i === 0 ? ' (Leader)' : ''}`}
                    icon={User}
                    value={m}
                    onChange={e => setMember(i, e.target.value)}
                    placeholder={`Member ${i + 1} full name`}
                  />
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[var(--color-gold-primary)] hover:bg-[var(--color-gold-light)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-navy-primary)] font-extrabold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-base tracking-wide"
            >
              {isSubmitting ? (
                <><span className="w-5 h-5 border-2 border-[var(--color-navy-primary)] border-t-transparent rounded-full animate-spin"></span> Registering...</>
              ) : (
                <><ChevronRight className="w-5 h-5" /> Register Team</>
              )}
            </button>
          </form>
        </div>
        </section>
      </div>
    </>
  );
};

export default RegistrationForm;
