import { useState } from 'react';

export interface KYCUser {
  kycLevel: number;
  isVerified: boolean;
  city?: string;
  phoneNumber?: string;
  idNumber?: string;
}

// Mock user data - in real app this would come from auth/database
const mockUser: KYCUser = {
  kycLevel: 0, // Start with unverified user
  isVerified: false,
  city: "תל אביב",
  phoneNumber: "+972-50-123-4567",
  idNumber: "123456789"
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
    setUser({ 
      ...user,
      kycLevel: 1, 
      isVerified: true,
      city: user.city || "תל אביב",
      phoneNumber: user.phoneNumber || "+972-50-123-4567",
      idNumber: user.idNumber || "123456789"
    });
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