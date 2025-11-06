-- =====================================================
-- COALI DATABASE - SAFEST VERSION
-- Only adds missing columns to existing tables
-- =====================================================

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
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

-- Trust relationships
CREATE TABLE IF NOT EXISTS trust_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  truster_user_id TEXT NOT NULL,
  trusted_user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bookmark_user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id TEXT NOT NULL,
  creator_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User votes
CREATE TABLE IF NOT EXISTS user_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  decision_id TEXT NOT NULL,
  vote_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_votes
ADD COLUMN IF NOT EXISTS is_delegated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS delegated_by TEXT,
ADD COLUMN IF NOT EXISTS can_withdraw BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS withdrawn_at TIMESTAMP WITH TIME ZONE;

-- User expertise
CREATE TABLE IF NOT EXISTS user_expertise (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  expertise_field TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin notes
CREATE TABLE IF NOT EXISTS admin_user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  notes TEXT,
  alerts TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ZOOZ transactions
CREATE TABLE IF NOT EXISTS zooz_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id TEXT NOT NULL,
  to_user_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update demo_decisions
ALTER TABLE demo_decisions 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'כללי',
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS votes_yes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS votes_no INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS votes_abstain INTEGER DEFAULT 0;

-- Update demo_posts
ALTER TABLE demo_posts
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published',
ADD COLUMN IF NOT EXISTS bookmark_count INTEGER DEFAULT 0;

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, anon;
