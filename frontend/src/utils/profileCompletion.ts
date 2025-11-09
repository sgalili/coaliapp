/**
 * Profile Completion Checker
 * Validates profile completeness for different actions
 */

export interface ProfileCompletionStatus {
  canPost: boolean;
  canUseWallet: boolean;
  missingForPost: string[];
  missingForWallet: string[];
}

export const checkProfileCompletion = (profile: any): ProfileCompletionStatus => {
  const missingForPost: string[] = [];
  const missingForWallet: string[] = [];
  
  // REQUIRED FOR POSTING IN COALI CHANNEL:
  // 1. Bio (min 10 chars)
  if (!profile?.bio || profile.bio.length < 10) {
    missingForPost.push('bio');
  }
  
  // 2. Categories (min 1)
  if (!profile?.expertise_fields || profile.expertise_fields.length === 0) {
    missingForPost.push('categories');
  }
  
  // 3. Job Title (mandatory)
  if (!profile?.title || profile.title.trim() === '') {
    missingForPost.push('title');
  }
  
  // 4. City
  if (!profile?.city || profile.city.trim() === '') {
    missingForPost.push('city');
  }
  
  // 5. ID Number (mandatory for Coali - 9 digits)
  if (!profile?.id_number || !/^\d{9}$/.test(profile.id_number)) {
    missingForPost.push('id_number');
  }
  
  // Level 2: Wallet (same as posting for Coali)
  missingForWallet.push(...missingForPost);
  
  return {
    canPost: missingForPost.length === 0,
    canUseWallet: missingForWallet.length === 0,
    missingForPost,
    missingForWallet
  };
};

export const getMissingFieldsText = (fields: string[]): string => {
  const fieldNames: Record<string, string> = {
    bio: 'ביוגרפיה',
    categories: 'קטגוריות',
    title: 'תואר',
    id_number: 'מספר תעודת זהות',
    city: 'עיר מגורים'
  };
  
  return fields.map(f => fieldNames[f] || f).join(', ');
};
