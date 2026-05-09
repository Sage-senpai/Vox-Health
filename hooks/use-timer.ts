'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UseTimerReturn {
  time: number;
  isActive: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
  formattedTime: string;
}

export function useTimer(initialSeconds = 0): UseTimerReturn {
  const [time, setTime] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && time >= 0) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback(() => {
    setTime(initialSeconds);
    setIsActive(false);
  }, [initialSeconds]);

  const formattedTime = `${Math.floor(time / 60)
    .toString()
    .padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`;

  return {
    time,
    isActive,
    start,
    stop,
    reset,
    formattedTime,
  };
}
