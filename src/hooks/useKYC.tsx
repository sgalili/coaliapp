// Temporarily disabled - database schema not yet created
export const useKYC = () => {
  return {
    user: null,
    kycLevel: 0,
    kycStatus: 'unverified' as const,
    isKYCVerified: false,
    showKYC: false,
    loading: false,
    triggerKYCCheck: (_?: any) => {},
    handleKYCSuccess: () => {},
    handleKYCClose: () => {},
    startKYC: async () => ({ error: 'Database not initialized' }),
    completeKYC: async () => ({ error: 'Database not initialized' }),
  };
};
