import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useInvitation = () => {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get user's referral code
  const fetchReferralCode = async () => {
    try {
      const { data, error } = await supabase.rpc('get_my_referral_code');
      if (error) throw error;
      setReferralCode(data);
      return data;
    } catch (error) {
      console.error('Error fetching referral code:', error);
      return null;
    }
  };

  // Validate invitation code
  const validateInvitationCode = async (code: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('validate_invitation_code', {
        invitation_code: code
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error validating invitation code:', error);
      return false;
    }
  };

  // Check if phone has trust intent
  const checkTrustIntent = async (phone: string): Promise<boolean> => {
    try {
      const { data: phoneHash, error: hashError } = await supabase.rpc('hash_phone', {
        phone_number: phone
      });
      if (hashError) throw hashError;

      const { data, error } = await supabase.rpc('has_trust_for_phone_hash', {
        phone_hash: phoneHash
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking trust intent:', error);
      return false;
    }
  };

  // Create trust intent for unregistered user
  const createTrustIntent = async (targetPhone: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data: phoneHash, error: hashError } = await supabase.rpc('hash_phone', {
        phone_number: targetPhone
      });
      if (hashError) throw hashError;

      const { data, error } = await supabase.rpc('create_trust_intent', {
        target_phone_hash: phoneHash
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating trust intent:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Consume invitation after successful registration
  const consumeInvitation = async (code: string, userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('consume_invitation', {
        invitation_code: code,
        new_user_id: userId
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error consuming invitation:', error);
      return false;
    }
  };

  // Consume trust intent after successful registration
  const consumeTrustIntent = async (phone: string, userId: string): Promise<string | null> => {
    try {
      const { data: phoneHash, error: hashError } = await supabase.rpc('hash_phone', {
        phone_number: phone
      });
      if (hashError) throw hashError;

      const { data, error } = await supabase.rpc('consume_trust', {
        phone_hash: phoneHash,
        new_user_id: userId
      });
      if (error) throw error;
      return data; // Returns the referral code that was used
    } catch (error) {
      console.error('Error consuming trust intent:', error);
      return null;
    }
  };

  // Generate invitation link
  const generateInvitationLink = (code?: string): string => {
    const baseUrl = window.location.origin;
    const inviteCode = code || referralCode;
    return `${baseUrl}/auth?ref=${inviteCode}`;
  };

  return {
    referralCode,
    isLoading,
    fetchReferralCode,
    validateInvitationCode,
    checkTrustIntent,
    createTrustIntent,
    consumeInvitation,
    consumeTrustIntent,
    generateInvitationLink
  };
};