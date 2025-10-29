import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface TrustUser {
  id: string;
  name: string;
  avatar: string | null;
  username: string;
  bio: string | null;
  trustCount: number;
  kycLevel: number;
  trustDate: string;
  verified: boolean;
}

export const useTrust = () => {
  const [trusters, setTrusters] = useState<TrustUser[]>([]);
  const [trusted, setTrusted] = useState<TrustUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTrusters = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('trusts')
        .select(`
          created_at,
          truster_id,
          profiles!trusts_truster_id_fkey (
            user_id,
            first_name,
            last_name,
            avatar_url
          ),
          user_stats!user_stats_user_id_fkey (
            trust_received
          ),
          kyc_verifications!kyc_verifications_user_id_fkey (
            level
          )
        `)
        .eq('trusted_id', user.id);

      if (error) throw error;

      const formattedTrusters = data?.map((trust: any) => ({
        id: trust.profiles?.user_id || '',
        name: `${trust.profiles?.first_name || ''} ${trust.profiles?.last_name || ''}`.trim() || 'משתמש',
        avatar: trust.profiles?.avatar_url,
        username: `user_${trust.profiles?.user_id?.slice(-8)}`,
        bio: null,
        trustCount: trust.user_stats?.trust_received || 0,
        kycLevel: trust.kyc_verifications?.level || 0,
        trustDate: new Date(trust.created_at).toLocaleDateString('he-IL'),
        verified: true
      })) || [];

      setTrusters(formattedTrusters);
    } catch (error) {
      console.error('Error fetching trusters:', error);
    }
  };

  const fetchTrusted = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('trusts')
        .select(`
          created_at,
          trusted_id,
          profiles!trusts_trusted_id_fkey (
            user_id,
            first_name,
            last_name,
            avatar_url
          ),
          user_stats!user_stats_user_id_fkey (
            trust_received
          ),
          kyc_verifications!kyc_verifications_user_id_fkey (
            level
          )
        `)
        .eq('truster_id', user.id);

      if (error) throw error;

      const formattedTrusted = data?.map((trust: any) => ({
        id: trust.profiles?.user_id || '',
        name: `${trust.profiles?.first_name || ''} ${trust.profiles?.last_name || ''}`.trim() || 'משתמש',
        avatar: trust.profiles?.avatar_url,
        username: `user_${trust.profiles?.user_id?.slice(-8)}`,
        bio: null,
        trustCount: trust.user_stats?.trust_received || 0,
        kycLevel: trust.kyc_verifications?.level || 0,
        trustDate: new Date(trust.created_at).toLocaleDateString('he-IL'),
        verified: true
      })) || [];

      setTrusted(formattedTrusted);
    } catch (error) {
      console.error('Error fetching trusted users:', error);
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchTrusters(), fetchTrusted()]).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  return {
    trusters,
    trusted,
    loading
  };
};