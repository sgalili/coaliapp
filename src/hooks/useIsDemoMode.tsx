import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

  const enableDemoMode = async () => {
    localStorage.setItem('is_demo_mode', 'true');
    
    // Generate and store demo user ID
    const demoUserId = crypto.randomUUID();
    localStorage.setItem('demo_user_id', demoUserId);
    
    setIsDemoMode(true);

    // Trigger demo data seeding
    try {
      const { data, error } = await supabase.functions.invoke('seed-demo-data');
      if (!error && data?.primaryDemoUserId) {
        localStorage.setItem('demo_user_id', data.primaryDemoUserId);
        localStorage.setItem('primary_demo_user_id', data.primaryDemoUserId);
      }
    } catch (error) {
      console.error('Error seeding demo data:', error);
    }
  };

  const disableDemoMode = () => {
    // Clear all demo-related data
    localStorage.removeItem('is_demo_mode');
    localStorage.removeItem('demo_user_id');
    localStorage.removeItem('primary_demo_user_id');
    // Clear any other potential demo data
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('demo_')) {
        localStorage.removeItem(key);
      }
    });
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
