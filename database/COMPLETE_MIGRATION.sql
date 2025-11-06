-- =====================================================
-- COMPLETE COALI DATABASE SCHEMA
-- Run this entire file in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  phone TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  title TEXT, -- ד"ר, פרופ', עו"ד, etc.
  avatar_url TEXT,
  bio TEXT,
  city TEXT,
  date_of_birth DATE,
  id_number TEXT, -- 9 digit Israeli ID (private)
  expertise_fields TEXT[], -- Array of expertise fields
  zooz_balance INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_demo BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS IF NOT EXISTS idx_profiles_phone ON profiles(phone);
CREATE INDEX IF NOT EXISTS IF NOT EXISTS idx_profiles_is_demo ON profiles(is_demo);

-- =====================================================
-- 2. TRUST RELATIONSHIPS
-- =====================================================
CREATE TABLE IF NOT EXISTS trust_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  truster_user_id TEXT NOT NULL, -- User giving trust
  trusted_user_id TEXT NOT NULL, -- User receiving trust
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
  bookmark_user_id TEXT NOT NULL, -- User who bookmarked
  post_id TEXT NOT NULL, -- Post being bookmarked
  user_id TEXT NOT NULL, -- Original post owner
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
  subscriber_id TEXT NOT NULL, -- User subscribing
  creator_id TEXT NOT NULL, -- Creator being followed
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
  vote_value TEXT NOT NULL, -- 'yes', 'no', 'abstain'
  is_delegated BOOLEAN DEFAULT false,
  delegated_by TEXT,
  can_withdraw BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  withdrawn_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, decision_id)
);

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
-- 8. VOTE DELEGATIONS LOG
-- =====================================================
CREATE TABLE IF NOT EXISTS vote_delegations_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id TEXT NOT NULL,
  expert_id TEXT NOT NULL,
  expert_vote_value TEXT NOT NULL,
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  affected_users_count INTEGER DEFAULT 0,
  votes_triggered JSONB
);

CREATE INDEX IF NOT EXISTS idx_vote_log_decision ON vote_delegations_log(decision_id);
CREATE INDEX IF NOT EXISTS idx_vote_log_expert ON vote_delegations_log(expert_id);

-- =====================================================
-- 9. VOTE WITHDRAWALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS vote_withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vote_id UUID NOT NULL,
  user_id TEXT NOT NULL,
  decision_id TEXT NOT NULL,
  original_vote TEXT NOT NULL,
  new_vote TEXT,
  action TEXT NOT NULL,
  withdrawn_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_withdrawals_user ON vote_withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_decision ON vote_withdrawals(decision_id);

-- =====================================================
-- 10. DELEGATION NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS delegation_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  decision_id TEXT NOT NULL,
  expert_id TEXT NOT NULL,
  expert_vote TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  is_read BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON delegation_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_decision ON delegation_notifications(decision_id);

-- =====================================================
-- 11. ADMIN USER NOTES
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  notes TEXT,
  alerts TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_notes_user ON admin_user_notes(user_id);

-- =====================================================
-- 12. ZOOZ TRANSACTIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS zooz_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id TEXT NOT NULL,
  to_user_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_zooz_tx_from ON zooz_transactions(from_user_id);
CREATE INDEX IF NOT EXISTS idx_zooz_tx_to ON zooz_transactions(to_user_id);

-- =====================================================
-- 13. ADMIN ACTIVITY LOG
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id TEXT NOT NULL,
  target_user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_log_admin ON admin_activity_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_log_target ON admin_activity_log(target_user_id);

-- =====================================================
-- 14. EXPERTISE CATEGORIES
-- =====================================================
CREATE TABLE IF NOT EXISTS expertise_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL UNIQUE,
  name_he TEXT NOT NULL UNIQUE,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed expertise categories
INSERT INTO expertise_categories (name_en, name_he, icon) VALUES
('Politics', 'פוליטיקה', '🏛️'),
('Economy', 'כלכלה', '💰'),
('Healthcare', 'בריאות', '🏥'),
('Technology', 'טכנולוגיה', '💻'),
('Education', 'חינוך', '📚'),
('Environment', 'סביבה', '🌍'),
('Security', 'ביטחון', '🛡️'),
('Society', 'חברה', '👥'),
('Law', 'משפט', '⚖️'),
('General', 'כללי', '📋')
ON CONFLICT (name_en) DO NOTHING;

-- =====================================================
-- 15. UPDATE EXISTING TABLES
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
-- 16. FUNCTIONS
-- =====================================================

-- Function to check if withdrawal is allowed
CREATE OR REPLACE FUNCTION can_withdraw_vote(decision_id_param TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  decision_deadline TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT withdrawal_deadline INTO decision_deadline
  FROM demo_decisions
  WHERE id = decision_id_param;
  
  RETURN (NOW() < decision_deadline);
END;
$$ LANGUAGE plpgsql;

-- Auto-calculate withdrawal deadline trigger
CREATE OR REPLACE FUNCTION calculate_withdrawal_deadline()
RETURNS TRIGGER AS $$
BEGIN
  NEW.withdrawal_deadline := NEW.end_date - INTERVAL '3 hours';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_withdrawal_deadline ON demo_decisions;
CREATE TRIGGER set_withdrawal_deadline
BEFORE INSERT OR UPDATE OF end_date ON demo_decisions
FOR EACH ROW
EXECUTE FUNCTION calculate_withdrawal_deadline();

-- =====================================================
-- 17. GRANT PERMISSIONS
-- =====================================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated, anon;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- All tables created and ready for use!
