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
    // Mark UI as demo mode
    localStorage.setItem('is_demo_mode', 'true');
    setIsDemoMode(true);

    try {
      // 1) Ensure demo auth user exists (service function)
      const DEMO_EMAIL = 'demo@coali.app';
      const DEMO_PASSWORD = 'Demo1234!';
      await supabase.functions.invoke('ensure-demo-user', {
        body: { email: DEMO_EMAIL, password: DEMO_PASSWORD },
      });

      // 2) Sign in as the demo user so RLS policies allow access to demo_* tables
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      });
      if (signInError) {
        console.error('Demo sign-in failed:', signInError);
      }

      // 3) Persist the authenticated demo user id for client-side filters
      const { data: userData } = await supabase.auth.getUser();
      const currentUserId = userData?.user?.id || signInData?.user?.id || null;
      if (currentUserId) {
        localStorage.setItem('demo_user_id', currentUserId);
      }

      // 4) Seed demo data and bind the primary demo content to this auth user
      await supabase.functions.invoke('seed-demo-data', {
        body: { primary_user_id: currentUserId },
      });
    } catch (error) {
      console.error('Error enabling demo mode:', error);
    }
  };

  const disableDemoMode = async () => {
    // Sign out any existing session and clear all demo-related data
    try { await supabase.auth.signOut(); } catch (e) { console.warn('Sign out failed (non-blocking):', e); }
    localStorage.removeItem('is_demo_mode');
    localStorage.removeItem('demo_user_id');
    localStorage.removeItem('primary_demo_user_id');
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
