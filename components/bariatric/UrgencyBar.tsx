"use client";

import { useEffect, useState } from "react";
import { BookButton } from "./Shared";

export default function UrgencyBar() {
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="urgency">
      <div className="wrap">
        <span className="ut">Limited slots available. Book before they&apos;re filled -</span>
        <span className="timer">{minutes}:{seconds}</span>
        <BookButton>Reserve My Slot</BookButton>
      </div>
    </div>
  );
}
