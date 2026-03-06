import React from 'react';
import CountdownTimer from './CountdownTimer';

const Hero = ({ phase, nextUnlock }) => {
  const isPreEvent = phase === 'pre-event';
  
  const getPhaseText = () => {
    switch(phase) {
      case 'day1': return 'Day 1 is LIVE! Level 1 Unlocked.';
      case 'day2': return 'Day 2 is LIVE! Level 2 Unlocked.';
      case 'day3': return 'Day 3 is LIVE! All Levels Unlocked.';
      case 'results': return 'Hackathon Concluded! View Results.';
      default: return null;
    }
  };

  return (
    <div className="relative overflow-hidden premium-gradient py-20 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C9A84C" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>
      
      {/* Glow Effects */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-navy-soft)] rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="animate-float mb-6">
          <span className="inline-block py-1 px-3 rounded-full bg-[var(--color-gold-primary)]/10 border border-[var(--color-gold-primary)]/30 text-[var(--color-gold-light)] text-sm font-semibold tracking-wide uppercase">
            In Partnership with GeeksforGeeks
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
          <span className="block text-white">IAR UDAAN</span>
          <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-gold-light)] via-[var(--color-gold-primary)] to-[#1b5e20]">
            HACKFEST 2026
          </span>
        </h1>
        
        <p className="mt-4 max-w-2xl mx-auto text-2xl font-bold text-white uppercase tracking-wider">
          Theme: AI · Gen-AI · RAG
        </p>
        
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
          23–25 March 2026
        </p>
        
        <p className="mt-6 text-[var(--color-gold-light)] font-medium text-sm md:text-base">
          🏆 Win <span className="font-bold text-white">College Cash Prizes</span> + Official <span className="font-bold text-white">GeeksforGeeks Certificates & Goodies!</span>
        </p>

        {/* Stats Chips */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {(['3 Days', '3 Levels', '3 Problem Statements'] || []).map((stat, i) => (
            <div key={i} className="bg-[var(--color-navy-soft)]/50 backdrop-blur-sm border border-[var(--color-gold-primary)]/20 px-6 py-2 rounded-full text-[var(--color-gold-pale)] font-medium text-sm sm:text-base card-shadow gold-glow transition-all">
              {stat}
            </div>
          ))}
        </div>

        {/* Countdown Timer or Live Status */}
        <div className="mt-16">
          {isPreEvent && nextUnlock ? (
            <div>
              <p className="text-sm uppercase tracking-widest text-[var(--color-gold-primary)] mb-4 font-semibold">Hackathon begins in</p>
              <CountdownTimer targetDate={nextUnlock} />
            </div>
          ) : (
            <div>
                <span className="text-2xl font-bold text-white">{getPhaseText()}</span>
              {nextUnlock && (
                <div className="mt-6">
                  <p className="text-sm uppercase text-gray-400 mb-3 text-center">Next Level unlocks in</p>
                  <CountdownTimer targetDate={nextUnlock} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
