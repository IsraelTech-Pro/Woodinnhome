import { useState, useEffect } from 'react';

interface CountdownResult {
  timeLeft: string;
  isExpired: boolean;
}

// Simple countdown that doesn't rely on complex dependencies
export function useCountdown(targetDate: Date): CountdownResult {
  const [timeLeft, setTimeLeft] = useState<string>('00:00:00');
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    // Reset state when target changes
    setIsExpired(false);
    
    // Store target timestamp to avoid recalculation during renders
    const targetTime = targetDate.getTime();
    
    const updateCountdown = () => {
      const now = Date.now();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft('00:00:00');
        setIsExpired(true);
        return false; // Stop interval
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const formattedTime = [
        String(hours).padStart(2, '0'),
        String(minutes).padStart(2, '0'),
        String(seconds).padStart(2, '0')
      ].join(':');

      setTimeLeft(formattedTime);
      setIsExpired(false);
      return true; // Continue interval
    };

    // Initial calculation
    const shouldContinue = updateCountdown();
    
    if (!shouldContinue) {
      return;
    }

    // Set up interval
    const interval = setInterval(() => {
      const shouldContinue = updateCountdown();
      if (!shouldContinue) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate.getTime()]); // React to target date changes

  return { timeLeft, isExpired };
}