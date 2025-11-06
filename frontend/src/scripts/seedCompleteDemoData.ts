/**
 * Comprehensive Demo Data Seeding
 * Creates rich demo activity for demo-user based on real demo users from database
 */

import { supabase } from '@/integrations/supabase/client';

export async function seedCompleteDemoData() {
  console.log('🌱 Starting comprehensive demo data seeding...');

  try {
    // 1. Create Trust Relationships - demo-user trusts these experts
    const trustGiven = [
      { truster_user_id: 'demo-user', trusted_user_id: 'user-1' }, // Yaron Zelekha
      { truster_user_id: 'demo-user', trusted_user_id: 'user-2' }, // Noa Rotem
      { truster_user_id: 'demo-user', trusted_user_id: 'user-4' }, // Rachel Cohen
    ];

    for (const trust of trustGiven) {
      await supabase.from('trust_relationships').upsert(trust, {
        onConflict: 'truster_user_id,trusted_user_id',
        ignoreDuplicates: false
      });
    }
    console.log('✅ Trust given created:', trustGiven.length);

    // 2. Create Trust Relationships - these users trust demo-user
    const trustReceived = [
      { truster_user_id: 'user-3', trusted_user_id: 'demo-user' }, // David Levi
      { truster_user_id: 'user-5', trusted_user_id: 'demo-user' }, // Amit Barak
      { truster_user_id: 'user-6', trusted_user_id: 'demo-user' }, // Michal Shamir
    ];

    for (const trust of trustReceived) {
      await supabase.from('trust_relationships').upsert(trust, {
        onConflict: 'truster_user_id,trusted_user_id',
        ignoreDuplicates: false
      });
    }
    console.log('✅ Trust received created:', trustReceived.length);

    // 3. Create Subscriptions - demo-user follows these creators
    const subscriptions = [
      { subscriber_id: 'demo-user', creator_id: 'user-1', created_at: new Date().toISOString() },
      { subscriber_id: 'demo-user', creator_id: 'user-2', created_at: new Date().toISOString() },
    ];

    for (const sub of subscriptions) {
      await supabase.from('subscriptions').upsert(sub, {
        onConflict: 'subscriber_id,creator_id',
        ignoreDuplicates: false
      });
    }
    console.log('✅ Subscriptions created:', subscriptions.length);

    // 4. Get some existing posts to bookmark
    const { data: postsToBookmark } = await supabase
      .from('demo_posts')
      .select('id, user_id')
      .neq('user_id', 'demo-user')
      .limit(5);

    if (postsToBookmark && postsToBookmark.length > 0) {
      for (const post of postsToBookmark.slice(0, 3)) {
        await supabase.from('bookmarks').upsert({
          post_id: post.id,
          user_id: post.user_id,
          bookmark_user_id: 'demo-user',
          created_at: new Date().toISOString()
        }, {
          onConflict: 'bookmark_user_id,post_id',
          ignoreDuplicates: false
        });
      }
      console.log('✅ Bookmarks created:', 3);
    }

    // 5. Get existing decisions and create votes
    const { data: decisions } = await supabase
      .from('demo_decisions')
      .select('id, title')
      .limit(5);

    if (decisions && decisions.length > 0) {
      const votes = [
        { user_id: 'demo-user', decision_id: decisions[0]?.id, vote_value: 'yes' },
        { user_id: 'demo-user', decision_id: decisions[1]?.id, vote_value: 'no' },
        { user_id: 'demo-user', decision_id: decisions[2]?.id, vote_value: 'yes' },
      ];

      for (const vote of votes.filter(v => v.decision_id)) {
        await supabase.from('user_votes').upsert({
          ...vote,
          created_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,decision_id',
          ignoreDuplicates: false
        });
      }
      console.log('✅ Votes created:', votes.length);
    }

    console.log('🎉 Complete demo data seeding finished!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    return { success: false, error };
  }
}

// Auto-run on import
if (typeof window !== 'undefined') {
  (window as any).seedCompleteDemoData = seedCompleteDemoData;
  console.log('📝 Run window.seedCompleteDemoData() to seed demo data');
}
