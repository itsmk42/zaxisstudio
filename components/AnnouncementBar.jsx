"use client";
import { useState, useEffect } from 'react';

const ANNOUNCEMENTS = [
  "Free Shipping on Orders Above ₹999",
  "Use Code WELCOME for 15% Off Your First Order",
  "New Collection Available Now!"
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed in localStorage
    const dismissed = localStorage.getItem('announcementDismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Rotate announcements every 4 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('announcementDismissed', 'true');
  };

  if (isDismissed) return null;

  return (
    <div className="announcement-bar">
      <svg className="announcement-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
      </svg>

      <div className="announcement-content">
        <span className="announcement-text">{ANNOUNCEMENTS[currentIndex]}</span>
      </div>

      <button
        className="announcement-close"
        aria-label="Close announcement"
        onClick={handleDismiss}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

