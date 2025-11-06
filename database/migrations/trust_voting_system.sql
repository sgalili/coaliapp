-- =====================================================
-- TRUST-BASED DELEGATED VOTING SYSTEM - DATABASE SCHEMA
-- =====================================================

-- 1. USER EXPERTISE TABLE
-- Defines which fields each user is an expert in
CREATE TABLE IF NOT EXISTS user_expertise (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  expertise_field TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, expertise_field)
);

CREATE INDEX idx_user_expertise_user ON user_expertise(user_id);
CREATE INDEX idx_user_expertise_field ON user_expertise(expertise_field);

-- 2. TRUST DELEGATIONS TABLE
-- Records who trusts whom in which expertise fields
CREATE TABLE IF NOT EXISTS trust_delegations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  truster_id TEXT NOT NULL, -- User who is delegating power
  trusted_id TEXT NOT NULL, -- Expert receiving delegation
  expertise_field TEXT NOT NULL, -- Field of expertise for this delegation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(truster_id, trusted_id, expertise_field)
);

CREATE INDEX idx_trust_delegations_truster ON trust_delegations(truster_id);
CREATE INDEX idx_trust_delegations_trusted ON trust_delegations(trusted_id);
CREATE INDEX idx_trust_delegations_field ON trust_delegations(expertise_field);
CREATE INDEX idx_trust_delegations_active ON trust_delegations(is_active) WHERE is_active = true;

-- 3. UPDATE DECISIONS TABLE
-- Add category and end_date for delegation logic
ALTER TABLE demo_decisions 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'כללי',
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days',
ADD COLUMN IF NOT EXISTS withdrawal_deadline TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Auto-calculate withdrawal deadline (3 hours before end)
CREATE OR REPLACE FUNCTION calculate_withdrawal_deadline()
RETURNS TRIGGER AS $$
BEGIN
  NEW.withdrawal_deadline := NEW.end_date - INTERVAL '3 hours';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_withdrawal_deadline
BEFORE INSERT OR UPDATE OF end_date ON demo_decisions
FOR EACH ROW
EXECUTE FUNCTION calculate_withdrawal_deadline();

-- 4. UPDATE VOTES TABLE
-- Add delegation tracking
ALTER TABLE user_votes
ADD COLUMN IF NOT EXISTS is_delegated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS delegated_by TEXT, -- Expert who triggered this vote
ADD COLUMN IF NOT EXISTS can_withdraw BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS withdrawn_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX idx_user_votes_delegated ON user_votes(is_delegated);
CREATE INDEX idx_user_votes_delegated_by ON user_votes(delegated_by);

-- 5. VOTE DELEGATIONS LOG
-- Tracks the history of delegation triggers
CREATE TABLE IF NOT EXISTS vote_delegations_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id TEXT NOT NULL,
  expert_id TEXT NOT NULL,
  expert_vote_value TEXT NOT NULL,
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  affected_users_count INTEGER DEFAULT 0,
  votes_triggered JSONB -- Array of user IDs who got auto-voted
);

CREATE INDEX idx_vote_log_decision ON vote_delegations_log(decision_id);
CREATE INDEX idx_vote_log_expert ON vote_delegations_log(expert_id);

-- 6. VOTE WITHDRAWALS TABLE
-- Tracks when users change/remove delegated votes
CREATE TABLE IF NOT EXISTS vote_withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vote_id UUID NOT NULL,
  user_id TEXT NOT NULL,
  decision_id TEXT NOT NULL,
  original_vote TEXT NOT NULL,
  new_vote TEXT, -- NULL if removed, value if changed
  action TEXT NOT NULL, -- 'changed' or 'removed'
  withdrawn_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_withdrawals_user ON vote_withdrawals(user_id);
CREATE INDEX idx_withdrawals_decision ON vote_withdrawals(decision_id);

-- 7. DELEGATION NOTIFICATIONS TABLE
-- Tracks notifications sent to users about delegated votes
CREATE TABLE IF NOT EXISTS delegation_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  decision_id TEXT NOT NULL,
  expert_id TEXT NOT NULL,
  expert_vote TEXT NOT NULL,
  notification_type TEXT NOT NULL, -- 'vote_triggered', 'deadline_warning', 'vote_counted'
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  is_read BOOLEAN DEFAULT false
);

CREATE INDEX idx_notifications_user ON delegation_notifications(user_id);
CREATE INDEX idx_notifications_decision ON delegation_notifications(decision_id);
CREATE INDEX idx_notifications_read ON delegation_notifications(is_read) WHERE is_read = false;

-- 8. EXPERTISE CATEGORIES (Reference table)
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
ON CONFLICT DO NOTHING;

-- 9. FUNCTIONS FOR VOTE DELEGATION

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

-- Function to get user's trusted experts in a field
CREATE OR REPLACE FUNCTION get_trusted_experts(user_id_param TEXT, field_param TEXT)
RETURNS TABLE(expert_id TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT td.trusted_id
  FROM trust_delegations td
  WHERE td.truster_id = user_id_param
    AND td.expertise_field = field_param
    AND td.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Function to count delegation power (how many people trust this expert)
CREATE OR REPLACE FUNCTION get_delegation_power(expert_id_param TEXT, field_param TEXT)
RETURNS INTEGER AS $$
DECLARE
  power_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO power_count
  FROM trust_delegations
  WHERE trusted_id = expert_id_param
    AND expertise_field = field_param
    AND is_active = true;
    
  RETURN COALESCE(power_count, 0);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- END OF MIGRATION
-- =====================================================

-- Grant permissions (adjust as needed)
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
