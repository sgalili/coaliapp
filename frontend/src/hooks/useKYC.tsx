import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface KYCUser {
  kycLevel: number;
  isVerified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  documents?: any;
}

export interface KYCData {
  city: string;
  dateOfBirth: string;
  idNumber: string;
}

export const useKYC = () => {
  const [user, setUser] = useState<KYCUser>({ kycLevel: 0, isVerified: false, status: 'pending' });
  const [showKYC, setShowKYC] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user: authUser } = useAuth();

  const fetchKYCStatus = async () => {
    if (!authUser?.id) return;

    try {
      const { data, error } = await supabase
        .from('kyc_verifications')
        .select('*')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setUser({
          kycLevel: data.level || 0,
          isVerified: data.status === 'approved',
          status: (data.status as 'pending' | 'approved' | 'rejected') || 'pending',
          documents: data.documents
        });
      } else {
        setUser({ kycLevel: 0, isVerified: false, status: 'pending' });
      }
    } catch (err: any) {
      console.error('Error fetching KYC status:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitKYC = async (kycData: KYCData) => {
    if (!authUser?.id) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('kyc_verifications')
        .upsert({
          user_id: authUser.id,
          status: 'pending',
          level: 0,
          documents: kycData as any
        })
        .select()
        .single();

      if (error) throw error;

      setUser({
        kycLevel: 0,
        isVerified: false,
        status: 'pending',
        documents: kycData
      });

      // Simulate approval for demo (in real app this would be manual review)
      setTimeout(async () => {
        await approveKYC(data.id);
      }, 2000);

      return data;
    } catch (err: any) {
      console.error('Error submitting KYC:', err);
      throw err;
    }
  };

  const approveKYC = async (kycId: string) => {
    try {
      await supabase
        .from('kyc_verifications')
        .update({
          status: 'approved',
          level: 1,
          verified_at: new Date().toISOString()
        })
        .eq('id', kycId);

      setUser(prev => ({
        ...prev,
        kycLevel: 1,
        isVerified: true,
        status: 'approved'
      }));
    } catch (err: any) {
      console.error('Error approving KYC:', err);
    }
  };

  const isKYCVerified = user.kycLevel >= 1 && user.isVerified;

  const triggerKYCCheck = (callback?: () => void) => {
    if (!isKYCVerified) {
      setShowKYC(true);
    } else {
      callback?.();
    }
  };

  const handleKYCSuccess = (data?: any) => {
    setShowKYC(false);
    if (data) {
      submitKYC(data);
    }
  };

  const handleKYCClose = () => {
    setShowKYC(false);
  };

  useEffect(() => {
    if (authUser?.id) {
      fetchKYCStatus();
    }
  }, [authUser?.id]);

  return {
    user,
    isKYCVerified,
    showKYC,
    loading,
    triggerKYCCheck,
    handleKYCSuccess,
    handleKYCClose,
    submitKYC,
    fetchKYCStatus
  };
};