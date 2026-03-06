import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    const difference = new Date(targetDate).getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }

  useEffect(() => {
    if (!targetDate) return;

    const difference = new Date(targetDate).getTime() - new Date().getTime();
    if (difference <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        clearInterval(timer);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  return (
    <div className="flex gap-4 justify-center items-center mt-6">
      <TimeUnit value={timeLeft.days} label="Days" />
      <span className="text-[var(--color-gold-primary)] text-3xl font-bold mb-6">:</span>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <span className="text-[var(--color-gold-primary)] text-3xl font-bold mb-6">:</span>
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <span className="text-[var(--color-gold-primary)] text-3xl font-bold mb-6">:</span>
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
};

const TimeUnit = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="bg-[var(--color-navy-mid)] border border-[var(--color-gold-primary)]/30 rounded-lg w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center card-shadow premium-gradient">
      <span className="text-2xl sm:text-4xl font-bold text-[var(--color-gold-primary)] font-mono">
        {value.toString().padStart(2, '0')}
      </span>
    </div>
    <span className="text-gray-400 text-xs sm:text-sm mt-2 uppercase tracking-wide">{label}</span>
  </div>
);

export default CountdownTimer;
