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
  
  // Level 1: Required for posting
  if (!profile?.bio || profile.bio.length < 10) {
    missingForPost.push('bio');
  }
  
  if (!profile?.expertise_fields || profile.expertise_fields.length === 0) {
    missingForPost.push('categories');
  }
  
  // Title required for verified users (after completing bio + categories)
  if (profile?.is_verified && 
      profile?.expertise_fields?.length > 0 && 
      profile?.bio?.length >= 10) {
    if (!profile?.title || profile.title.trim() === '') {
      missingForPost.push('title');
    }
  }
  
  // Level 2: Required for wallet (includes Level 1)
  missingForWallet.push(...missingForPost);
  
  if (!profile?.id_number || !/^\d{9}$/.test(profile.id_number)) {
    missingForWallet.push('id_number');
  }
  
  if (!profile?.city || profile.city.trim() === '') {
    missingForWallet.push('city');
  }
  
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
