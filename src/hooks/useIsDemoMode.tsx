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

  // Ensure we have a valid demo auth session when demo mode is on
  useEffect(() => {
    const ensureSession = async () => {
      if (!isDemoMode) return;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          await supabase.auth.signInWithPassword({ email: 'demo@coali.app', password: 'Demo1234!' });
        }
      } catch (e) {
        console.error('Error ensuring demo session:', e);
      }
    };
    ensureSession();
  }, [isDemoMode]);

  const enableDemoMode = async () => {
    // Flag demo mode first
    localStorage.setItem('is_demo_mode', 'true');
    setIsDemoMode(true);

    try {
      // Ensure demo auth user exists, then sign in
      const email = 'demo@coali.app';
      const password = 'Demo1234!';
      await supabase.functions.invoke('ensure-demo-user', { body: { email, password } });

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError || !signInData.user) {
        throw signInError || new Error('Failed to sign in demo user');
      }

      // Seed demo data using the authenticated demo user as the primary profile
      const { data: seedData } = await supabase.functions.invoke('seed-demo-data', {
        body: { primaryDemoUserId: signInData.user.id }
      });

      // Store demo user id for UI usage
      const primaryId = seedData?.primaryDemoUserId || signInData.user.id;
      localStorage.setItem('demo_user_id', primaryId);
      localStorage.setItem('primary_demo_user_id', primaryId);
    } catch (error) {
      console.error('Error setting up demo mode:', error);
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
