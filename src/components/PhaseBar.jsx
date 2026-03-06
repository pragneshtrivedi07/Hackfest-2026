import React, { useState, useEffect } from 'react';

const PhaseBar = ({ phase }) => {
  const getPhaseConfig = () => {
    switch(phase) {
      case 'pre-event':
        return { text: 'Pre-Event Phase', color: 'bg-gray-700', dot: 'bg-gray-400' };
      case 'day1':
        return { text: 'Day 1 Live', color: 'bg-[var(--color-day1)]', dot: 'bg-green-400 animate-pulse' };
      case 'day2':
        return { text: 'Day 2 Live', color: 'bg-[var(--color-day2)]', dot: 'bg-blue-400 animate-pulse' };
      case 'day3':
        return { text: 'Day 3 Live', color: 'bg-[var(--color-day3)]', dot: 'bg-purple-400 animate-pulse' };
      case 'results':
        return { text: 'Results Phase', color: 'bg-[var(--color-gold-primary)]', dot: 'bg-[var(--color-gold-pale)] animate-pulse' };
      default:
        return { text: 'Loading...', color: 'bg-gray-700', dot: 'bg-gray-500' };
    }
  };

  const config = getPhaseConfig();

  return (
    <div className={`w-full ${config.color} text-white text-xs font-semibold py-1.5 px-4 flex justify-center items-center gap-1`}>
      <span className="tracking-wider uppercase">{config.text}</span>
    </div>
  );
};

export default PhaseBar;
