-- =====================================================
-- COMPLETE CHANNEL MANAGEMENT SYSTEM
-- =====================================================

-- 1. CHANNELS TABLE
CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  created_by TEXT NOT NULL,
  is_private BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CHANNEL MEMBERS TABLE
CREATE TABLE IF NOT EXISTS channel_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT DEFAULT 'member', -- 'owner', 'admin', 'moderator', 'member'
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_by TEXT,
  verification_data JSONB, -- {student_id, id_number, etc.}
  UNIQUE(channel_id, user_id)
);

-- 3. CHANNEL INVITATIONS TABLE
CREATE TABLE IF NOT EXISTS channel_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL,
  phone_number TEXT NOT NULL,
  invitee_name TEXT,
  verification_fields JSONB, -- Custom fields required
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'expired'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days'
);

-- 4. CHANNEL PUBLIC REQUESTS TABLE
CREATE TABLE IF NOT EXISTS channel_public_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL,
  requested_by TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  reviewed_by TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. GRANT PERMISSIONS
GRANT ALL ON channels TO authenticated, anon;
GRANT ALL ON channel_members TO authenticated, anon;
GRANT ALL ON channel_invitations TO authenticated, anon;
GRANT ALL ON channel_public_requests TO authenticated, anon;

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================
