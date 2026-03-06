import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Lock } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

const Results = ({ phase }) => {
  const [resultsData, setResultsData] = useState({ year1: [], year2: [], year3: [] });
  const [loading, setLoading] = useState(true);

  const resultsUnlockDate = "2026-03-25T18:30:00.000Z"; // 26 Mar 2026 00:00 IST

  useEffect(() => {
    if (phase !== 'results') return;
    
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/results');
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        if (!data.locked) {
          setResultsData(data);
        }
      } catch (error) {
        console.error('Failed to fetch results', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [phase]);

  const getMedalIcon = (position) => {
    switch(position) {
      case 1: return <Medal className="w-8 h-8 text-yellow-400" />;
      case 2: return <Medal className="w-8 h-8 text-gray-300" />;
      case 3: return <Medal className="w-8 h-8 text-amber-600" />;
      default: return null;
    }
  };

  if (phase !== 'results') {
    return (
      <section id="results" className="py-20 bg-[var(--color-navy-mid)] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-[var(--color-navy-primary)] rounded-3xl p-10 sm:p-16 border-2 border-dashed border-[var(--color-gold-primary)]/30 card-shadow relative">
            <Lock className="w-16 h-16 text-[var(--color-gold-primary)] opacity-50 mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
              🏆 Results Locked
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              The final results will be announced on <span className="text-[var(--color-gold-light)] font-bold">26th March 2026</span>
            </p>
            <CountdownTimer targetDate={resultsUnlockDate} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="results" className="py-20 premium-gradient border-t-2 border-[var(--color-gold-primary)] relative">
      {/* Confetti-like decoration could go here */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Trophy className="w-16 h-16 text-[var(--color-gold-light)] mx-auto mb-4 animate-float" />
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-gold-pale)] via-[var(--color-gold-light)] to-[var(--color-gold-primary)] mb-4 inline-block">
            Final Results
          </h2>
          <p className="text-xl text-gray-300 mb-2">Congratulations to all the winners of IAR UDAAN Hackfest 2026!</p>
          <p className="text-md text-[var(--color-gold-primary)] font-medium max-w-2xl mx-auto bg-[var(--color-gold-primary)]/10 rounded-lg p-2 border border-[var(--color-gold-primary)]/20">
            Winners will receive Cash Prizes from the College, and exclusive Certificates & Goodies provided by GeeksforGeeks.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-white p-10">Loading results...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { year: 1, title: '1st Year Results', data: resultsData.year1 },
              { year: 2, title: '2nd Year Results', data: resultsData.year2 },
              { year: 3, title: '3rd Year Results', data: resultsData.year3 }
            ].map(column => (
              <div key={column.year} className="bg-[var(--color-navy-mid)] rounded-2xl border border-[var(--color-gold-primary)]/30 overflow-hidden card-shadow">
                <div className="bg-[var(--color-navy-primary)] text-[var(--color-gold-primary)] text-center py-4 font-bold text-xl border-b border-[var(--color-gold-primary)]/20 uppercase tracking-widest">
                  {column.title}
                </div>
                
                <div className="p-6 space-y-4">
                  {!column.data || !Array.isArray(column.data) || column.data.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Results pending...</p>
                  ) : (
                    column.data.map((result, idx) => (
                      <div key={idx} className={`relative flex items-center p-4 rounded-xl border ${result.position === 1 ? 'bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/50' : result.position === 2 ? 'bg-gradient-to-r from-gray-300/10 to-transparent border-gray-400/30' : 'bg-gradient-to-r from-amber-600/10 to-transparent border-amber-600/30'}`}>
                        <div className="mr-4 drop-shadow-lg">
                          {getMedalIcon(result.position)}
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">{result.position === 1 ? '1st Place' : result.position === 2 ? '2nd Place' : '3rd Place'}</p>
                          <h4 className="text-xl font-bold text-white leading-tight">{result.teamName}</h4>
                          <p className="text-sm font-bold text-green-400 mt-1">{result.prize}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Results;
