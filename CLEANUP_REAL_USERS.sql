-- =====================================================
-- COMPLETE CLEANUP FOR REAL USERS
-- Deletes ALL demo interactions and demo data
-- =====================================================

-- 1. Delete ALL user votes (decisions)
DELETE FROM user_votes;

-- 2. Delete ALL bookmarks
DELETE FROM bookmarks;

-- 3. Delete ALL trust relationships
DELETE FROM trust_relationships;

-- 4. Delete ALL subscriptions
DELETE FROM subscriptions;

-- 5. Verify tables are empty
SELECT 'user_votes' as table_name, COUNT(*) as count FROM user_votes;
SELECT 'bookmarks' as table_name, COUNT(*) as count FROM bookmarks;
SELECT 'trust_relationships' as table_name, COUNT(*) as count FROM trust_relationships;
SELECT 'subscriptions' as table_name, COUNT(*) as count FROM subscriptions;

-- =====================================================
-- ALL REAL USER DATA CLEANED
-- Users start with fresh empty accounts
-- =====================================================
