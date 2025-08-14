import { useState } from 'react';

export interface KYCUser {
  kycLevel: number;
  isVerified: boolean;
}

// Mock user data - in real app this would come from auth/database
const mockUser: KYCUser = {
  kycLevel: 0, // Start with unverified user
  isVerified: false
};

export const useKYC = () => {
  const [user, setUser] = useState<KYCUser>(mockUser);
  const [showKYC, setShowKYC] = useState(false);

  const isKYCVerified = user.kycLevel >= 1;

  const triggerKYCCheck = (callback?: () => void) => {
    if (!isKYCVerified) {
      setShowKYC(true);
    } else {
      callback?.();
    }
  };

  const handleKYCSuccess = (data?: any) => {
    setUser({ kycLevel: 1, isVerified: true });
    setShowKYC(false);
  };

  const handleKYCClose = () => {
    setShowKYC(false);
  };

  return {
    user,
    isKYCVerified,
    showKYC,
    triggerKYCCheck,
    handleKYCSuccess,
    handleKYCClose
  };
};