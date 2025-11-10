/**
 * Demo Data Filter Utility
 * Keeps demo content visible but clearly labeled for real users
 */

/**
 * Check if current user is a real authenticated user (not demo)
 */
export const isRealUser = (): boolean => {
  const authUserId = localStorage.getItem('authenticated_user_id');
  return !!(authUserId && authUserId !== 'demo-user');
};

/**
 * Check if a post is demo content
 */
export const isDemoPost = (post: any): boolean => {
  return post.user_id === 'demo-user' || 
         post.is_demo === true ||
         post.user_id?.startsWith('user-'); // demoUsers.ts IDs
};

/**
 * Check if a user is demo
 */
export const isDemoUser = (userId: string): boolean => {
  return userId === 'demo-user' || 
         userId?.startsWith('user-'); // user-1, user-2, etc.
};

/**
 * Add demo labels to posts for real users
 * KEEPS demo content but marks it clearly
 */
export const labelDemoPosts = (posts: any[]): any[] => {
  if (!isRealUser()) return posts; // Demo users see posts as-is
  
  // Real users - label demo posts
  return posts.map(post => ({
    ...post,
    _isDemo: isDemoPost(post), // Internal flag for UI
    _demoLabel: isDemoPost(post) ? 'דמו' : null
  }));
};

/**
 * Get current user ID
 */
export const getCurrentUserId = (): string => {
  const authUserId = localStorage.getItem('authenticated_user_id');
  return authUserId && authUserId !== 'demo-user' ? authUserId : 'demo-user';
};

/**
 * Get current user display name
 */
export const getCurrentUserName = (): string => {
  return localStorage.getItem('authenticated_user_name') || 'משתמש';
};

