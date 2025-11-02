import { supabase } from '@/integrations/supabase/client';

// Posts Services
export const saveDemoPost = async (post: any) => {
  const { data, error } = await supabase
    .from('demo_posts')
    .insert([post])
    .select()
    .single();
  
  if (error) {
    console.error('Error saving post:', error);
    throw error;
  }
  return data;
};

export const fetchDemoPosts = async (channelId?: string | null, category?: string) => {
  let query = supabase
    .from('demo_posts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (channelId !== undefined) {
    query = channelId === null 
      ? query.is('channel_id', null)
      : query.eq('channel_id', channelId);
  }
  
  if (category && category !== 'הכל') {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
  return data || [];
};

export const updatePostEngagement = async (postId: string, field: string, value: number) => {
  const { error } = await supabase
    .from('demo_posts')
    .update({ [field]: value })
    .eq('id', postId);
  
  if (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// Decisions Services
export const saveDemoDecision = async (decision: any) => {
  const { data, error } = await supabase
    .from('demo_decisions')
    .insert([decision])
    .select()
    .single();
  
  if (error) {
    console.error('Error saving decision:', error);
    throw error;
  }
  return data;
};

export const fetchDemoDecisions = async (channelId?: string | null) => {
  let query = supabase
    .from('demo_decisions')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (channelId !== undefined) {
    query = channelId === null 
      ? query.is('channel_id', null)
      : query.eq('channel_id', channelId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching decisions:', error);
    throw error;
  }
  return data || [];
};

export const voteDemoDecision = async (decisionId: string, optionId: string, userId: string) => {
  const { error } = await supabase.rpc('vote_on_decision', {
    decision_id: decisionId,
    option_id: optionId,
    user_id: userId
  });
  
  if (error) {
    console.error('Error voting:', error);
    throw error;
  }
};

// Comments Services
export const saveDemoComment = async (comment: any) => {
  const { data, error } = await supabase
    .from('demo_comments')
    .insert([comment])
    .select()
    .single();
  
  if (error) {
    console.error('Error saving comment:', error);
    throw error;
  }
  return data;
};

export const fetchDemoComments = async (postId: string) => {
  const { data, error } = await supabase
    .from('demo_comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
  return data || [];
};

export const likeDemoComment = async (commentId: string, likeCount: number) => {
  const { error } = await supabase
    .from('demo_comments')
    .update({ like_count: likeCount })
    .eq('id', commentId);
  
  if (error) {
    console.error('Error liking comment:', error);
    throw error;
  }
};

// Users Services
export const saveDemoUser = async (user: any) => {
  const { data, error } = await supabase
    .from('demo_users')
    .insert([user])
    .select()
    .single();
  
  if (error) {
    console.error('Error saving user:', error);
    throw error;
  }
  return data;
};

export const fetchDemoUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('demo_users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
  return data;
};
