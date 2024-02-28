'use client';

import dayjs from "dayjs";
import { useEffect, useState } from "react";

export function Timer({ startTime } : { startTime: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const diff = dayjs().diff(dayjs(startTime), 'second');

      const timeLeft = 30 * 60 - diff;
      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft - mins * 60;
      const formattedTime = `${mins}:${secs}`;

      if (timeLeft <= 0) {
        clearInterval(intervalId);
        setTime('00:00');
        return;
      }

      setTime(formattedTime);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <span className="inline-block w-10">{time}</span>
  );
}