import { useState, useEffect } from 'react';

export const useIsDemoMode = () => {
  const [isDemoMode, setIsDemoMode] = useState(() => {
    const stored = localStorage.getItem('is_demo_mode');
    return stored === 'true';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('is_demo_mode');
      setIsDemoMode(stored === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const enableDemoMode = () => {
    localStorage.setItem('is_demo_mode', 'true');
    // Set a default demo user ID
    localStorage.setItem('demo_user_id', crypto.randomUUID());
    setIsDemoMode(true);
  };

  const disableDemoMode = () => {
    localStorage.removeItem('is_demo_mode');
    localStorage.removeItem('demo_user_id');
    setIsDemoMode(false);
  };

  const getDemoUserId = () => {
    return localStorage.getItem('demo_user_id') || null;
  };

  return {
    isDemoMode,
    enableDemoMode,
    disableDemoMode,
    getDemoUserId,
  };
};
