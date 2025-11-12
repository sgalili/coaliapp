import { useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const navigate = useNavigate();

  console.log('useAuth called');

  // CRITICAL: Check localStorage BEFORE any render (synchronous)
  const checkLocalStorageAuth = () => {
    const storedUserId = localStorage.getItem('authenticated_user_id');
    const storedProfile = localStorage.getItem('authenticated_user_profile');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (storedUserId && isAuthenticated && storedUserId !== 'demo-user') {
      console.log('✅ REAL USER found in localStorage (sync):', storedUserId);
      
      // Create a mock user object for compatibility
      const mockUser = {
        id: storedUserId,
        email: `${storedUserId}@coali.app`,
        phone: localStorage.getItem('authenticated_user_phone'),
        user_metadata: {},
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };
      
      setUser(mockUser as any);
      
      // Load profile synchronously if available
      if (storedProfile) {
        try {
          const profileData = JSON.parse(storedProfile);
          setProfile(profileData);
          console.log('✅ Profile loaded from localStorage (sync)');
        } catch (e) {
          console.error('Error parsing stored profile:', e);
        }
      }
      
      setLoading(false);
      setInitializing(false);
      return true;
    }
    return false;
  };
  
  // Run IMMEDIATELY on mount (before useEffect)
  const [hasRealUser] = React.useState(() => checkLocalStorageAuth());

  useEffect(() => {
    console.log('useAuth useEffect running');
    
    // If we already found a real user in localStorage, skip Supabase auth
    if (hasRealUser) {
      console.log('⏭️ Skipping Supabase auth check - real user already loaded');
      return;
    }
    
    // SECOND: Set up Supabase auth state listener for other auth methods
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event === 'SIGNED_IN') {
          // Initialize user data when signed in
          setTimeout(async () => {
            await initializeUserData(session.user.id);
            await fetchProfile(session.user.id);
          }, 0);
        }
        
        if (session?.user) {
          // Always fetch profile for existing sessions
          fetchProfile(session.user.id);
        }
        
        setInitializing(false);
        setLoading(false);
      }
    );

    // THIRD: Check for existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
      setInitializing(false);
    });

    return () => subscription.unsubscribe();
  }, []); // Remove initializing dependency

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }
      
      setProfile(data);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  const initializeUserData = async (userId: string) => {
    try {
      // Initialize user balance if not exists
      const { error: balanceError } = await supabase.rpc('init_user_balance', {
        p_user: userId
      });
      
      if (balanceError) {
        console.error('Error initializing balance:', balanceError);
      }
    } catch (error) {
      console.error('Error in initializeUserData:', error);
    }
  };

  const signInWithPhone = async (phone: string): Promise<{ error: AuthError | null }> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          channel: 'sms', // Can be 'sms' or 'whatsapp'
        },
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (phone: string, token: string): Promise<{ error: AuthError | null }> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (firstName: string, lastName: string, avatarUrl?: string): Promise<{ error: Error | null }> => {
    if (!user) return { error: new Error('No authenticated user') };

    setLoading(true);
    try {
      // Update or create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          first_name: firstName,
          last_name: lastName,
          avatar_url: avatarUrl,
          phone: user.phone || '',
        });

      if (profileError) throw profileError;

      // Refetch profile after update
      await fetchProfile(user.id);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/auth');
    }
    return { error };
  };

  return {
    user,
    session,
    profile,
    loading,
    initializing,
    signInWithPhone,
    verifyOTP,
    updateProfile,
    signOut,
  };
};