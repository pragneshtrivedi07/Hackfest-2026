import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';

const Judges = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [allJudges, setAllJudges] = useState({ 1: [], 2: [], 3: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllJudges = async () => {
      setLoading(true);
      try {
        const fetchYear = async (year) => {
          const response = await fetch(`/api/judges?year=${year}`);
          if (!response.ok) return [];
          return response.json();
        };

        const [y1, y2, y3] = await Promise.all([fetchYear(1), fetchYear(2), fetchYear(3)]);
        setAllJudges({ 1: y1, 2: y2, 3: y3 });
      } catch (error) {
        console.error('Failed to fetch judges', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllJudges();
  }, []);

  const judges = allJudges[activeTab];

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || '?';
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <section id="judges" className="py-20 bg-[var(--color-navy-primary)] relative items-center justify-center scroll-mt-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--color-gold-primary)]/5 rounded-full filter blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-white mb-4 relative inline-block">
            Evaluation Panel
            <div className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-[var(--color-gold-primary)] rounded-full"></div>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-2 bg-[var(--color-navy-mid)] p-1 rounded-xl border border-[var(--color-gold-primary)]/20 shadow-lg">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 tracking-widest text-[#FFF]">Loading...</div>
          ) : !Array.isArray(judges) || judges.length === 0 ? (
            <div className="text-center py-20 bg-[var(--color-navy-mid)] rounded-2xl border border-dashed border-gray-700">
              <Award className="w-16 h-16 text-gray-600 mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-medium text-gray-400 mb-2">Judges will be announced soon</h3>
              <p className="text-sm text-gray-500">The evaluation panel is being finalized.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {judges.map((judge, idx) => (
                <div key={idx} className="bg-[var(--color-navy-mid)] rounded-2xl p-6 text-center border border-[var(--color-gold-primary)]/10 hover:border-[var(--color-gold-primary)] transition-all duration-300 hover:-translate-y-1 card-shadow group premium-gradient">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[var(--color-gold-light)] to-[#A67F24] p-1 mb-4 shadow-lg group-hover:scale-105 transition-transform">
                    <div className="flex w-full h-full bg-[var(--color-navy-primary)] rounded-full items-center justify-center border-2 border-[var(--color-gold-primary)]/20">
                      <span className="text-xl font-bold text-[var(--color-gold-pale)]">{getInitials(judge.name)}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-1">{judge.name}</h3>
                  <p className="text-sm italic text-[var(--color-gold-primary)] mb-3 h-10 overflow-hidden line-clamp-2">{judge.designation}</p>
                  
                  <div className="pt-3 border-t border-[var(--color-gold-primary)]/10 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {judge.institute}
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

export default Judges;
