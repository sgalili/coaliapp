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

      // Use upsert to prevent duplicates
      const { error: trustGivenError } = await supabase
        .from('trust_relationships')
        .upsert(trustGiven, { onConflict: 'truster_user_id,trusted_user_id' });
      
      if (trustGivenError) {
        console.error('❌ Error seeding trust given:', trustGivenError);
      } else {
        console.log('✅ Trust given:', trustGiven.length);
      }

      // 2. Trust relationships - these users trust demo-user
      const trustReceived = [
        { truster_user_id: 'user-3', trusted_user_id: 'demo-user', created_at: new Date().toISOString() },
        { truster_user_id: 'user-5', trusted_user_id: 'demo-user', created_at: new Date().toISOString() },
        { truster_user_id: 'user-6', trusted_user_id: 'demo-user', created_at: new Date().toISOString() },
      ];

      // Use upsert to prevent duplicates
      const { error: trustReceivedError } = await supabase
        .from('trust_relationships')
        .upsert(trustReceived, { onConflict: 'truster_user_id,trusted_user_id' });
      
      if (trustReceivedError) {
        console.error('❌ Error seeding trust received:', trustReceivedError);
      } else {
        console.log('✅ Trust received:', trustReceived.length);
      }

      // 3. Get some posts to bookmark
      const { data: posts } = await supabase
        .from('demo_posts')
        .select('id, user_id')
        .neq('user_id', 'demo-user')
        .limit(3);

      if (posts) {
        const bookmarksData = posts.map(post => ({
          post_id: post.id,
          user_id: post.user_id,
          bookmark_user_id: 'demo-user',
          created_at: new Date().toISOString()
        }));
        
        // Use upsert to prevent duplicates
        const { error: bookmarksError } = await supabase
          .from('bookmarks')
          .upsert(bookmarksData, { onConflict: 'bookmark_user_id,post_id' });
        
        if (bookmarksError) {
          console.error('❌ Error seeding bookmarks:', bookmarksError);
        } else {
          console.log('✅ Bookmarks:', posts.length);
        }
      }

      // 4. Get decisions and create votes
      const { data: decisions } = await supabase
        .from('demo_decisions')
        .select('id')
        .limit(3);

      if (decisions) {
        const votes = [
          { user_id: 'demo-user', decision_id: decisions[0]?.id, vote_value: 'yes', created_at: new Date().toISOString() },
          { user_id: 'demo-user', decision_id: decisions[1]?.id, vote_value: 'no', created_at: new Date().toISOString() },
          { user_id: 'demo-user', decision_id: decisions[2]?.id, vote_value: 'yes', created_at: new Date().toISOString() },
        ].filter(v => v.decision_id);

        // Use upsert to prevent duplicates
        const { error: votesError } = await supabase
          .from('user_votes')
          .upsert(votes, { onConflict: 'user_id,decision_id' });
        
        if (votesError) {
          console.error('❌ Error seeding votes:', votesError);
        } else {
          console.log('✅ Votes:', votes.length);
        }
      }

      // 5. Subscriptions
      const subs = [
        { subscriber_id: 'demo-user', creator_id: 'user-1', created_at: new Date().toISOString() },
        { subscriber_id: 'demo-user', creator_id: 'user-2', created_at: new Date().toISOString() },
      ];

      // Use upsert to prevent duplicates
      const { error: subsError } = await supabase
        .from('subscriptions')
        .upsert(subs, { onConflict: 'subscriber_id,creator_id' });
      
      if (subsError) {
        console.error('❌ Error seeding subscriptions:', subsError);
      } else {
        console.log('✅ Subscriptions:', subs.length);
      }

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
