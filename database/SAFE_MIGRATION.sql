-- =====================================================
-- COALI DATABASE SCHEMA - SAFE VERSION
-- Handles existing tables and adds missing columns
-- =====================================================

-- =====================================================
-- 1. PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS id_number TEXT,
ADD COLUMN IF NOT EXISTS expertise_fields TEXT[],
ADD COLUMN IF NOT EXISTS zooz_balance INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_is_demo ON profiles(is_demo);

-- =====================================================
-- 2. TRUST RELATIONSHIPS
-- =====================================================
CREATE TABLE IF NOT EXISTS trust_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  truster_user_id TEXT NOT NULL,
  trusted_user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(truster_user_id, trusted_user_id)
);

CREATE INDEX IF NOT EXISTS idx_trust_truster ON trust_relationships(truster_user_id);
CREATE INDEX IF NOT EXISTS idx_trust_trusted ON trust_relationships(trusted_user_id);

-- =====================================================
-- 3. BOOKMARKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bookmark_user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(bookmark_user_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(bookmark_user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_post ON bookmarks(post_id);

-- =====================================================
-- 4. SUBSCRIPTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id TEXT NOT NULL,
  creator_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(subscriber_id, creator_id)
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_subscriber ON subscriptions(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_creator ON subscriptions(creator_id);

-- =====================================================
-- 5. USER VOTES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  decision_id TEXT NOT NULL,
  vote_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, decision_id)
);

ALTER TABLE user_votes
ADD COLUMN IF NOT EXISTS is_delegated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS delegated_by TEXT,
ADD COLUMN IF NOT EXISTS can_withdraw BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS withdrawn_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_user_votes_user ON user_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_votes_decision ON user_votes(decision_id);
CREATE INDEX IF NOT EXISTS idx_user_votes_delegated ON user_votes(is_delegated);

-- =====================================================
-- 6. USER EXPERTISE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_expertise (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  expertise_field TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, expertise_field)
);

CREATE INDEX IF NOT EXISTS idx_user_expertise_user ON user_expertise(user_id);
CREATE INDEX IF NOT EXISTS idx_user_expertise_field ON user_expertise(expertise_field);

-- =====================================================
-- 7. TRUST DELEGATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS trust_delegations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  truster_id TEXT NOT NULL,
  trusted_id TEXT NOT NULL,
  expertise_field TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(truster_id, trusted_id, expertise_field)
);

CREATE INDEX IF NOT EXISTS idx_trust_delegations_truster ON trust_delegations(truster_id);
CREATE INDEX IF NOT EXISTS idx_trust_delegations_trusted ON trust_delegations(trusted_id);

-- =====================================================
-- 8. ADMIN TABLES
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  notes TEXT,
  alerts TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS zooz_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id TEXT NOT NULL,
  to_user_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id TEXT NOT NULL,
  target_user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. UPDATE EXISTING TABLES
-- =====================================================

-- Update demo_decisions table
ALTER TABLE demo_decisions 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'כללי',
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days',
ADD COLUMN IF NOT EXISTS withdrawal_deadline TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS votes_yes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS votes_no INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS votes_abstain INTEGER DEFAULT 0;

-- Update demo_posts table
ALTER TABLE demo_posts
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published',
ADD COLUMN IF NOT EXISTS bookmark_count INTEGER DEFAULT 0;

-- =====================================================
-- 10. GRANT PERMISSIONS
-- =====================================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon;

-- =====================================================
-- DONE - Tables created successfully!
-- =====================================================
