import React, { useState, useEffect } from 'react';
import { Users, Crown, Hash, Mail, Phone } from 'lucide-react';

const Teams = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [allTeams, setAllTeams] = useState({ 1: [], 2: [], 3: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllTeams = async () => {
      setLoading(true);
      try {
        const fetchYear = async (year) => {
          const response = await fetch(`/api/teams?year=${year}`);
          return response.json();
        };

        const [y1, y2, y3] = await Promise.all([fetchYear(1), fetchYear(2), fetchYear(3)]);
        setAllTeams({ 1: y1, 2: y2, 3: y3 });
      } catch (error) {
        console.error('Failed to fetch teams', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTeams();
  }, []);

  const teams = allTeams[activeTab];

  return (
    <section id="teams" className="py-20 bg-[var(--color-navy-mid)] border-t border-[var(--color-gold-primary)]/10 scroll-mt-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-white mb-4 relative inline-block">
            Participating Teams
            <div className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-[var(--color-gold-primary)] rounded-full"></div>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-2 bg-[var(--color-navy-primary)] p-1 rounded-xl border border-[var(--color-gold-primary)]/20 shadow-lg">
            {[1, 2, 3].map(year => (
              <button
                key={year}
                onClick={() => setActiveTab(year)}
                className={`px-8 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeTab === year 
                    ? 'bg-[var(--color-gold-primary)] text-[var(--color-navy-primary)] shadow-[0_0_15px_rgba(47,141,70,0.3)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {year}{year === 1 ? 'st' : year === 2 ? 'nd' : 'rd'} Year
              </button>
            ))}
          </div>
        </div>

        {/* Content Container with Animation Key */}
        <div key={activeTab} className="animate-fade-in">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[var(--color-navy-primary)] rounded-xl p-6 border border-gray-800 animate-pulse h-64">
                  <div className="h-6 bg-gray-700 w-1/2 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-700 w-3/4 rounded"></div>
                    <div className="h-4 bg-gray-700 w-2/3 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : !Array.isArray(teams) || teams.length === 0 ? (
            <div className="text-center py-20 bg-[var(--color-navy-primary)] rounded-2xl border border-dashed border-gray-700">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4 animate-float" />
              <h3 className="text-xl font-medium text-gray-400 mb-2">Teams will be announced soon</h3>
              <p className="text-sm text-gray-500">Participant registration data is currently being processed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team, idx) => (
                <div key={idx} className="bg-gradient-to-br from-[var(--color-navy-primary)] to-[#101010] rounded-xl border border-[var(--color-gold-primary)]/10 hover:border-[var(--color-gold-primary)]/40 transition-all duration-300 hover:-translate-y-1 card-shadow group overflow-hidden">
                  
                  {/* Card Header */}
                  <div className="p-5 border-b border-[var(--color-gold-primary)]/10 bg-[var(--color-gold-primary)]/5">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-[var(--color-gold-light)] group-hover:text-[var(--color-gold-primary)] transition-colors leading-tight pr-2">{team.teamName}</h3>
                      <span className="bg-[var(--color-gold-primary)]/10 text-[var(--color-gold-primary)] text-xs font-bold px-2 py-1 rounded-md border border-[var(--color-gold-primary)]/20 shrink-0">
                        Year {team.year}
                      </span>
                    </div>
                  </div>

                  {/* Leader Details */}
                  {(team.leaderName || team.iarNumber || team.leaderEmail) && (
                    <div className="p-4 border-b border-gray-800 bg-white/2">
                      <p className="text-xs uppercase tracking-widest text-[var(--color-gold-primary)] font-bold mb-3 flex items-center gap-2">
                        <Crown className="w-3 h-3" /> Team Leader
                      </p>
                      <div className="space-y-2">
                        {team.leaderName && (
                          <p className="text-white font-semibold text-sm">{team.leaderName}</p>
                        )}
                        {team.iarNumber && (
                          <div className="flex items-center gap-2 text-gray-400 text-xs">
                            <Hash className="w-3 h-3 shrink-0 text-[var(--color-gold-primary)]" />
                            <span className="font-mono">{team.iarNumber}</span>
                          </div>
                        )}
                        {team.leaderEmail && (
                          <div className="flex items-center gap-2 text-gray-400 text-xs">
                            <Mail className="w-3 h-3 shrink-0 text-[var(--color-gold-primary)]" />
                            <span className="truncate">{team.leaderEmail}</span>
                          </div>
                        )}
                        {team.leaderPhone && (
                          <div className="flex items-center gap-2 text-gray-400 text-xs">
                            <Phone className="w-3 h-3 shrink-0 text-[var(--color-gold-primary)]" />
                            <span className="font-mono">{team.leaderPhone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Participants List */}
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-3 flex items-center gap-2">
                      <Users className="w-3 h-3" /> Members
                    </p>
                    <div className="space-y-2">
                      {team.participants.map((participant, pIdx) => (
                        <div key={pIdx} className="flex items-center text-gray-300 text-sm">
                          <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center mr-3 border border-white/10 shrink-0 text-[10px] font-bold text-gray-500">
                            {pIdx + 1}
                          </div>
                          <span className="truncate">{participant}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Teams;
