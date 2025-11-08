/**
 * Demo Data Filter Utility
 * Removes ALL demo content for real authenticated users
 */

/**
 * Check if current user is a real authenticated user (not demo)
 */
export const isRealUser = (): boolean => {
  const authUserId = localStorage.getItem('authenticated_user_id');
  return !!(authUserId && authUserId !== 'demo-user');
};

/**
 * Filter out demo content from posts
 */
export const filterDemoPosts = (posts: any[]): any[] => {
  if (!isRealUser()) return posts;
  
  // Real user - exclude ALL demo posts
  return posts.filter(post => {
    const isDemoPost = post.user_id === 'demo-user' || 
                       post.is_demo === true ||
                       post.user_id?.includes('demo');
    return !isDemoPost;
  });
};

/**
 * Filter out demo content from decisions
 */
export const filterDemoDecisions = (decisions: any[]): any[] => {
  if (!isRealUser()) return decisions;
  
  // Real user - exclude ALL demo decisions
  return decisions.filter(decision => {
    const isDemoDecision = decision.is_demo === true ||
                           decision.created_by === 'demo-user' ||
                           decision.id?.includes('demo');
    return !isDemoDecision;
  });
};

/**
 * Filter out demo content from users/profiles
 */
export const filterDemoUsers = (users: any[]): any[] => {
  if (!isRealUser()) return users;
  
  // Real user - exclude ALL demo users
  return users.filter(user => {
    const isDemoUser = user.user_id === 'demo-user' ||
                       user.is_demo === true ||
                       user.id?.includes('demo') ||
                       user.id?.includes('user-'); // user-1, user-2, etc. from demoUsers.ts
    return !isDemoUser;
  });
};

/**
 * Filter out demo content from comments
 */
export const filterDemoComments = (comments: any[]): any[] => {
  if (!isRealUser()) return comments;
  
  // Real user - exclude ALL demo comments
  return comments.filter(comment => {
    const isDemoComment = comment.user_id === 'demo-user' ||
                          comment.is_demo === true ||
                          comment.author_id?.includes('demo');
    return !isDemoComment;
  });
};

/**
 * Filter out demo content from notifications
 */
export const filterDemoNotifications = (notifications: any[]): any[] => {
  if (!isRealUser()) return notifications;
  
  // Real user - exclude ALL demo notifications
  return notifications.filter(notif => {
    const isDemoNotif = notif.is_demo === true ||
                        notif.from_user === 'demo-user';
    return !isDemoNotif;
  });
};

/**
 * Get current user display name
 */
export const getCurrentUserName = (): string => {
  return localStorage.getItem('authenticated_user_name') || 'משתמש';
};

/**
 * Get current user ID
 */
export const getCurrentUserId = (): string => {
  const authUserId = localStorage.getItem('authenticated_user_id');
  return authUserId && authUserId !== 'demo-user' ? authUserId : 'demo-user';
};
