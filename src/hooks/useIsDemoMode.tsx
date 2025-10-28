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
    console.log('🎭 Enabling demo mode...');
    
    // Flag demo mode first
    localStorage.setItem('is_demo_mode', 'true');
    setIsDemoMode(true);

    try {
      // Ensure demo auth user exists, then sign in
      const email = 'demo@coali.app';
      const password = 'Demo1234!';
      
      console.log('📝 Ensuring demo user exists...');
      await supabase.functions.invoke('ensure-demo-user', { body: { email, password } });

      console.log('🔐 Signing in demo user...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError || !signInData.user) {
        console.error('❌ Sign in error:', signInError);
        throw signInError || new Error('Failed to sign in demo user');
      }

      console.log('✅ Demo user authenticated:', signInData.user.id);
      
      // Seed demo data using the authenticated demo user as the primary profile
      console.log('🌱 Seeding demo data...');
      const { data: seedData, error: seedError } = await supabase.functions.invoke('seed-demo-data', {
        body: { primaryDemoUserId: signInData.user.id }
      });

      if (seedError) {
        console.error('❌ Seed error:', seedError);
        throw seedError;
      }

      console.log('✅ Demo data seeded:', seedData);

      // Store demo user id for UI usage
      const primaryId = seedData?.primaryDemoUserId || signInData.user.id;
      localStorage.setItem('demo_user_id', primaryId);
      localStorage.setItem('primary_demo_user_id', primaryId);
      
      console.log('🎉 Demo mode enabled successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error setting up demo mode:', error);
      // On error, keep demo mode flag but show error to user
      return false;
    }
  };

  const disableDemoMode = async () => {
    console.log('🚪 Exiting demo mode...');
    
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
    
    // Sign out
    await supabase.auth.signOut();
    
    setIsDemoMode(false);
    console.log('✅ Demo mode exited successfully');
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
