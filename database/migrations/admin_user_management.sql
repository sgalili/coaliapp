-- =====================================================
-- ADMIN USER MANAGEMENT TABLES
-- =====================================================

-- 1. ADMIN USER NOTES
-- Store admin notes and alerts for users
CREATE TABLE IF NOT EXISTS admin_user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  notes TEXT,
  alerts TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_admin_notes_user ON admin_user_notes(user_id);

-- 2. ZOOZ TRANSACTIONS
-- Track all ZOOZ coin transfers
CREATE TABLE IF NOT EXISTS zooz_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id TEXT NOT NULL,
  to_user_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'transfer', 'admin_grant', 'reward', 'purchase'
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_zooz_tx_from ON zooz_transactions(from_user_id);
CREATE INDEX idx_zooz_tx_to ON zooz_transactions(to_user_id);
CREATE INDEX idx_zooz_tx_created ON zooz_transactions(created_at DESC);

-- 3. ADMIN ACTIVITY LOG
-- Track admin actions on user accounts
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id TEXT NOT NULL,
  target_user_id TEXT NOT NULL,
  action TEXT NOT NULL, -- 'edit', 'login_as', 'add_zooz', 'delete_post', etc.
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_admin_log_admin ON admin_activity_log(admin_user_id);
CREATE INDEX idx_admin_log_target ON admin_activity_log(target_user_id);
CREATE INDEX idx_admin_log_created ON admin_activity_log(created_at DESC);

-- 4. UPDATE PROFILES TABLE
-- Add admin-manageable fields
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS id_number TEXT,
ADD COLUMN IF NOT EXISTS zooz_balance INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS expertise_fields TEXT[];

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
