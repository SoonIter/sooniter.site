import React, { useState, useEffect } from 'react';
import Terminal from './Terminal';
import { useLocation } from '@rspress/core/runtime';

export default function TerminalHome() {
  const [showTerminal, setShowTerminal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMounted(true);
    // Only show on home page ('/' or '/zh/' or '/en/')
    // Normalize path to remove trailing slash for comparison, unless it's root
    const path = location.pathname.replace(/\/$/, '') || '/';
    const isHome = path === '/' || path === '/zh' || path === '/en';

    if (isHome) {
      const pref = localStorage.getItem('site_mode');
      if (pref === 'gui') {
        setShowTerminal(false);
      } else {
        setShowTerminal(true);
      }
    } else {
      setShowTerminal(false);
    }
  }, [location.pathname]);

  const handleSwitchToGui = () => {
    setShowTerminal(false);
    localStorage.setItem('site_mode', 'gui');
  };

  if (!mounted || !showTerminal) return null;

  return <Terminal onSwitchToGui={handleSwitchToGui} />;
}
