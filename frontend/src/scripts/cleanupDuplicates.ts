/**
 * Cleanup Duplicate Demo Data
 * Removes duplicate entries for demo users
 * Run this from browser console: window.cleanupDuplicates()
 */

import { supabase } from '../integrations/supabase/client';

export async function cleanupDuplicates() {
  console.log('🧹 Starting duplicate cleanup...');

  try {
    // 1. Remove duplicate trust relationships
    console.log('1️⃣ Cleaning trust_relationships...');
    const { data: trustData, error: trustError } = await supabase
      .from('trust_relationships')
      .select('id, truster_user_id, trusted_user_id, created_at')
      .or('truster_user_id.like.demo-user,truster_user_id.like.user-%,trusted_user_id.like.demo-user,trusted_user_id.like.user-%');

    if (!trustError && trustData) {
      // Group by truster_user_id and trusted_user_id, keep only the most recent
      const trustMap = new Map<string, any>();
      trustData.forEach(trust => {
        const key = `${trust.truster_user_id}-${trust.trusted_user_id}`;
        const existing = trustMap.get(key);
        if (!existing || new Date(trust.created_at) > new Date(existing.created_at)) {
          trustMap.set(key, trust);
        }
      });

      // Delete duplicates - delete in batches if needed
      const idsToKeep = Array.from(trustMap.values()).map(t => t.id);
      const idsToDelete = trustData.filter(t => !idsToKeep.includes(t.id)).map(t => t.id);
      
      if (idsToDelete.length > 0) {
        // Delete in batches of 100 to avoid query size limits
        const batchSize = 100;
        for (let i = 0; i < idsToDelete.length; i += batchSize) {
          const batch = idsToDelete.slice(i, i + batchSize);
          const { error: deleteError } = await supabase
            .from('trust_relationships')
            .delete()
            .in('id', batch);
          
          if (deleteError) {
            console.error(`❌ Error deleting trust duplicates batch ${i / batchSize + 1}:`, deleteError);
          }
        }
        console.log(`✅ Removed ${idsToDelete.length} duplicate trust relationships`);
      }
    }

    // 2. Remove duplicate subscriptions
    console.log('2️⃣ Cleaning subscriptions...');
    const { data: subsData, error: subsError } = await supabase
      .from('subscriptions')
      .select('id, subscriber_id, creator_id, created_at')
      .or('subscriber_id.like.demo-user,subscriber_id.like.user-%,creator_id.like.demo-user,creator_id.like.user-%');

    if (!subsError && subsData) {
      const subsMap = new Map<string, any>();
      subsData.forEach(sub => {
        const key = `${sub.subscriber_id}-${sub.creator_id}`;
        const existing = subsMap.get(key);
        if (!existing || new Date(sub.created_at) > new Date(existing.created_at)) {
          subsMap.set(key, sub);
        }
      });

      const idsToKeep = Array.from(subsMap.values()).map(s => s.id);
      const idsToDelete = subsData.filter(s => !idsToKeep.includes(s.id)).map(s => s.id);
      
      if (idsToDelete.length > 0) {
        // Delete in batches
        const batchSize = 100;
        for (let i = 0; i < idsToDelete.length; i += batchSize) {
          const batch = idsToDelete.slice(i, i + batchSize);
          const { error: deleteError } = await supabase
            .from('subscriptions')
            .delete()
            .in('id', batch);
          
          if (deleteError) {
            console.error(`❌ Error deleting subscription duplicates batch ${i / batchSize + 1}:`, deleteError);
          }
        }
        console.log(`✅ Removed ${idsToDelete.length} duplicate subscriptions`);
      }
    }

    // 3. Remove duplicate bookmarks
    console.log('3️⃣ Cleaning bookmarks...');
    const { data: bookmarksData, error: bookmarksError } = await supabase
      .from('bookmarks')
      .select('id, bookmark_user_id, post_id, created_at')
      .like('bookmark_user_id', 'demo-user')
      .or('bookmark_user_id.like.user-%');

    if (!bookmarksError && bookmarksData) {
      const bookmarksMap = new Map<string, any>();
      bookmarksData.forEach(bookmark => {
        const key = `${bookmark.bookmark_user_id}-${bookmark.post_id}`;
        const existing = bookmarksMap.get(key);
        if (!existing || new Date(bookmark.created_at) > new Date(existing.created_at)) {
          bookmarksMap.set(key, bookmark);
        }
      });

      const idsToKeep = Array.from(bookmarksMap.values()).map(b => b.id);
      const idsToDelete = bookmarksData.filter(b => !idsToKeep.includes(b.id)).map(b => b.id);
      
      if (idsToDelete.length > 0) {
        // Delete in batches
        const batchSize = 100;
        for (let i = 0; i < idsToDelete.length; i += batchSize) {
          const batch = idsToDelete.slice(i, i + batchSize);
          const { error: deleteError } = await supabase
            .from('bookmarks')
            .delete()
            .in('id', batch);
          
          if (deleteError) {
            console.error(`❌ Error deleting bookmark duplicates batch ${i / batchSize + 1}:`, deleteError);
          }
        }
        console.log(`✅ Removed ${idsToDelete.length} duplicate bookmarks`);
      }
    }

    // 4. Remove duplicate user votes
    console.log('4️⃣ Cleaning user_votes...');
    const { data: votesData, error: votesError } = await supabase
      .from('user_votes')
      .select('id, user_id, decision_id, created_at')
      .or('user_id.like.demo-user,user_id.like.user-%');

    if (!votesError && votesData) {
      const votesMap = new Map<string, any>();
      votesData.forEach(vote => {
        const key = `${vote.user_id}-${vote.decision_id}`;
        const existing = votesMap.get(key);
        if (!existing || new Date(vote.created_at) > new Date(existing.created_at)) {
          votesMap.set(key, vote);
        }
      });

      const idsToKeep = Array.from(votesMap.values()).map(v => v.id);
      const idsToDelete = votesData.filter(v => !idsToKeep.includes(v.id)).map(v => v.id);
      
      if (idsToDelete.length > 0) {
        // Delete in batches
        const batchSize = 100;
        for (let i = 0; i < idsToDelete.length; i += batchSize) {
          const batch = idsToDelete.slice(i, i + batchSize);
          const { error: deleteError } = await supabase
            .from('user_votes')
            .delete()
            .in('id', batch);
          
          if (deleteError) {
            console.error(`❌ Error deleting vote duplicates batch ${i / batchSize + 1}:`, deleteError);
          }
        }
        console.log(`✅ Removed ${idsToDelete.length} duplicate votes`);
      }
    }

    // 5. Remove duplicate demo posts (same user_id, caption, video_url)
    console.log('5️⃣ Cleaning demo_posts...');
    const { data: postsData, error: postsError } = await supabase
      .from('demo_posts')
      .select('id, user_id, caption, video_url, created_at')
      .or('user_id.like.demo-user,user_id.like.user-%');

    if (!postsError && postsData) {
      const postsMap = new Map<string, any>();
      postsData.forEach(post => {
        const key = `${post.user_id}-${post.caption || ''}-${post.video_url || ''}`;
        const existing = postsMap.get(key);
        if (!existing || new Date(post.created_at) > new Date(existing.created_at)) {
          postsMap.set(key, post);
        }
      });

      const idsToKeep = Array.from(postsMap.values()).map(p => p.id);
      const idsToDelete = postsData.filter(p => !idsToKeep.includes(p.id)).map(p => p.id);
      
      if (idsToDelete.length > 0) {
        // Delete in batches
        const batchSize = 100;
        for (let i = 0; i < idsToDelete.length; i += batchSize) {
          const batch = idsToDelete.slice(i, i + batchSize);
          const { error: deleteError } = await supabase
            .from('demo_posts')
            .delete()
            .in('id', batch);
          
          if (deleteError) {
            console.error(`❌ Error deleting post duplicates batch ${i / batchSize + 1}:`, deleteError);
          }
        }
        console.log(`✅ Removed ${idsToDelete.length} duplicate posts`);
      }
    }

    console.log('🎉 Duplicate cleanup completed!');
    return { success: true };
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    return { success: false, error };
  }
}

// Make available in browser console
if (typeof window !== 'undefined') {
  (window as any).cleanupDuplicates = cleanupDuplicates;
  console.log('✅ Cleanup function available as window.cleanupDuplicates()');
}

