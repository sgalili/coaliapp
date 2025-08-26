import { useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event === 'SIGNED_IN') {
          // Initialize user data when signed in
          setTimeout(async () => {
            await initializeUserData(session.user.id);
          }, 0);
        }
        
        if (initializing) {
          setInitializing(false);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      setInitializing(false);
    });

    return () => subscription.unsubscribe();
  }, [initializing]);

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
    loading,
    initializing,
    signInWithPhone,
    verifyOTP,
    updateProfile,
    signOut,
  };
};