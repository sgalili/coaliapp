-- Cleanup Duplicate Demo User Data
-- Removes duplicate entries for demo users in various tables
-- Run this script to clean up duplicates

-- 1. Remove duplicate trust relationships
-- Keep only the most recent entry for each trust relationship
DELETE FROM trust_relationships
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY truster_user_id, trusted_user_id 
             ORDER BY created_at DESC
           ) as rn
    FROM trust_relationships
    WHERE truster_user_id LIKE 'demo-user' OR truster_user_id LIKE 'user-%'
       OR trusted_user_id LIKE 'demo-user' OR trusted_user_id LIKE 'user-%'
  ) t
  WHERE rn > 1
);

-- 2. Remove duplicate subscriptions
-- Keep only the most recent entry for each subscription
DELETE FROM subscriptions
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY subscriber_id, creator_id 
             ORDER BY created_at DESC
           ) as rn
    FROM subscriptions
    WHERE subscriber_id LIKE 'demo-user' OR subscriber_id LIKE 'user-%'
       OR creator_id LIKE 'demo-user' OR creator_id LIKE 'user-%'
  ) t
  WHERE rn > 1
);

-- 3. Remove duplicate bookmarks
-- Keep only the most recent entry for each bookmark
DELETE FROM bookmarks
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY bookmark_user_id, post_id 
             ORDER BY created_at DESC
           ) as rn
    FROM bookmarks
    WHERE bookmark_user_id LIKE 'demo-user' OR bookmark_user_id LIKE 'user-%'
  ) t
  WHERE rn > 1
);

-- 4. Remove duplicate user votes
-- Keep only the most recent entry for each vote
DELETE FROM user_votes
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY user_id, decision_id 
             ORDER BY created_at DESC
           ) as rn
    FROM user_votes
    WHERE user_id LIKE 'demo-user' OR user_id LIKE 'user-%'
  ) t
  WHERE rn > 1
);

-- 5. Remove duplicate demo posts
-- Keep only the most recent entry for posts with same user_id, caption, and video_url
DELETE FROM demo_posts
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY user_id, caption, video_url 
             ORDER BY created_at DESC
           ) as rn
    FROM demo_posts
    WHERE user_id LIKE 'demo-user' OR user_id LIKE 'user-%'
  ) t
  WHERE rn > 1
);

-- 6. Summary query to check remaining duplicates
SELECT 
  'trust_relationships' as table_name,
  COUNT(*) as total_rows,
  COUNT(DISTINCT (truster_user_id, trusted_user_id)) as unique_relationships,
  COUNT(*) - COUNT(DISTINCT (truster_user_id, trusted_user_id)) as duplicates
FROM trust_relationships
WHERE truster_user_id LIKE 'demo-user' OR truster_user_id LIKE 'user-%'
   OR trusted_user_id LIKE 'demo-user' OR trusted_user_id LIKE 'user-%'

UNION ALL

SELECT 
  'subscriptions' as table_name,
  COUNT(*) as total_rows,
  COUNT(DISTINCT (subscriber_id, creator_id)) as unique_subscriptions,
  COUNT(*) - COUNT(DISTINCT (subscriber_id, creator_id)) as duplicates
FROM subscriptions
WHERE subscriber_id LIKE 'demo-user' OR subscriber_id LIKE 'user-%'
   OR creator_id LIKE 'demo-user' OR creator_id LIKE 'user-%'

UNION ALL

SELECT 
  'bookmarks' as table_name,
  COUNT(*) as total_rows,
  COUNT(DISTINCT (bookmark_user_id, post_id)) as unique_bookmarks,
  COUNT(*) - COUNT(DISTINCT (bookmark_user_id, post_id)) as duplicates
FROM bookmarks
WHERE bookmark_user_id LIKE 'demo-user' OR bookmark_user_id LIKE 'user-%'

UNION ALL

SELECT 
  'user_votes' as table_name,
  COUNT(*) as total_rows,
  COUNT(DISTINCT (user_id, decision_id)) as unique_votes,
  COUNT(*) - COUNT(DISTINCT (user_id, decision_id)) as duplicates
FROM user_votes
WHERE user_id LIKE 'demo-user' OR user_id LIKE 'user-%'

UNION ALL

SELECT 
  'demo_posts' as table_name,
  COUNT(*) as total_rows,
  COUNT(DISTINCT (user_id, caption, video_url)) as unique_posts,
  COUNT(*) - COUNT(DISTINCT (user_id, caption, video_url)) as duplicates
FROM demo_posts
WHERE user_id LIKE 'demo-user' OR user_id LIKE 'user-%';



