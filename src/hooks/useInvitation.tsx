// Temporarily disabled - database schema not yet created
export const useInvitation = () => {
  return {
    referralCode: null,
    loading: false,
    isLoading: false,
    fetchReferralCode: async () => {},
    generateInvitationLink: (_?: any) => '',
    validateInvitationCode: async () => ({ isValid: false, error: 'Database not initialized' }),
    hasExistingTrust: async (_: any) => false,
    createTrustIntent: async (_?: any) => ({ success: false, error: 'Database not initialized' }),
    consumeInvitation: async (_: any) => ({ success: false, error: 'Database not initialized' }),
    consumeTrust: async (_: any) => ({ success: false, error: 'Database not initialized' }),
  };
};
