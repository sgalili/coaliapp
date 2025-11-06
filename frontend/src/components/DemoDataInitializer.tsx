/**
 * Demo Data Initializer
 * Runs once on app load to seed demo user data
 */

import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const DemoDataInitializer = () => {
  useEffect(() => {
    const hasSeeded = localStorage.getItem('demo_data_v2_seeded');
    
    if (!hasSeeded) {
      seedDemoData();
    }
  }, []);

  const seedDemoData = async () => {
    console.log('🌱 Seeding demo data for demo-user...');

    try {
      // 1. Trust relationships - demo-user trusts these users
      const trustGiven = [
        { truster_user_id: 'demo-user', trusted_user_id: 'user-1', created_at: new Date().toISOString() },
        { truster_user_id: 'demo-user', trusted_user_id: 'user-2', created_at: new Date().toISOString() },
      ];

      for (const trust of trustGiven) {
        await supabase.from('trust_relationships').insert(trust);
      }
      console.log('✅ Trust given:', trustGiven.length);

      // 2. Trust relationships - these users trust demo-user
      const trustReceived = [
        { truster_user_id: 'user-3', trusted_user_id: 'demo-user', created_at: new Date().toISOString() },
        { truster_user_id: 'user-5', trusted_user_id: 'demo-user', created_at: new Date().toISOString() },
        { truster_user_id: 'user-6', trusted_user_id: 'demo-user', created_at: new Date().toISOString() },
      ];

      for (const trust of trustReceived) {
        await supabase.from('trust_relationships').insert(trust);
      }
      console.log('✅ Trust received:', trustReceived.length);

      // 3. Get some posts to bookmark
      const { data: posts } = await supabase
        .from('demo_posts')
        .select('id, user_id')
        .neq('user_id', 'demo-user')
        .limit(3);

      if (posts) {
        for (const post of posts) {
          await supabase.from('bookmarks').insert({
            post_id: post.id,
            user_id: post.user_id,
            bookmark_user_id: 'demo-user',
            created_at: new Date().toISOString()
          });
        }
        console.log('✅ Bookmarks:', posts.length);
      }

      // 4. Get decisions and create votes
      const { data: decisions } = await supabase
        .from('demo_decisions')
        .select('id')
        .limit(3);

      if (decisions) {
        const votes = [
          { user_id: 'demo-user', decision_id: decisions[0]?.id, vote_value: 'yes' },
          { user_id: 'demo-user', decision_id: decisions[1]?.id, vote_value: 'no' },
          { user_id: 'demo-user', decision_id: decisions[2]?.id, vote_value: 'yes' },
        ];

        for (const vote of votes.filter(v => v.decision_id)) {
          await supabase.from('user_votes').insert({
            ...vote,
            created_at: new Date().toISOString()
          });
        }
        console.log('✅ Votes:', votes.length);
      }

      // 5. Subscriptions
      const subs = [
        { subscriber_id: 'demo-user', creator_id: 'user-1', created_at: new Date().toISOString() },
        { subscriber_id: 'demo-user', creator_id: 'user-2', created_at: new Date().toISOString() },
      ];

      for (const sub of subs) {
        await supabase.from('subscriptions').insert(sub);
      }
      console.log('✅ Subscriptions:', subs.length);

      localStorage.setItem('demo_data_v2_seeded', 'true');
      console.log('🎉 Demo data seeding complete!');
      
      // Reload the page to show data
      window.location.reload();
    } catch (error) {
      console.error('❌ Seeding error:', error);
    }
  };

  return null; // This component doesn't render anything
};
