-- =====================================================
-- IMPACT EVENTS TABLE - Track expert influence & decisions
-- =====================================================

-- Create impact_events table
CREATE TABLE IF NOT EXISTS impact_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('decision', 'trust', 'vote', 'achievement')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  expert_id TEXT NOT NULL,
  category TEXT NOT NULL,
  impact_value INTEGER NOT NULL DEFAULT 0,
  delegated_votes INTEGER,
  total_votes INTEGER,
  outcome TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_impact_events_expert ON impact_events(expert_id);
CREATE INDEX IF NOT EXISTS idx_impact_events_category ON impact_events(category);
CREATE INDEX IF NOT EXISTS idx_impact_events_created ON impact_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_impact_events_type ON impact_events(type);

-- Add impact_score to profiles table if not exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS impact_score INTEGER DEFAULT 0;

-- Create function to update impact score
CREATE OR REPLACE FUNCTION update_user_impact_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET impact_score = COALESCE(impact_score, 0) + NEW.impact_value
  WHERE user_id = NEW.expert_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic impact score updates
DROP TRIGGER IF EXISTS trigger_update_impact_score ON impact_events;
CREATE TRIGGER trigger_update_impact_score
  AFTER INSERT ON impact_events
  FOR EACH ROW
  EXECUTE FUNCTION update_user_impact_score();

-- Insert demo impact events
INSERT INTO impact_events (type, title, description, expert_id, category, impact_value, delegated_votes, total_votes, outcome, created_at)
VALUES
  ('decision', 'תמך בהצעת תקציב', 'עזר ל-234 אנשים להחליט בנושא תקציב החינוך', 'demo-user', 'פוליטיקה', 2340, 234, 1500, 'אושרה', NOW() - INTERVAL '2 hours'),
  ('trust', 'קיבל אמון מ-45 משתמשים', 'הפך למומחה מהימן בתחום הכלכלה', 'demo-user', 'כלכלה', 2250, NULL, NULL, NULL, NOW() - INTERVAL '5 hours'),
  ('vote', 'השפיע על 120 קולות', 'דעתו שינתה את תוצאות ההצבעה על מיסוי הייטק', 'demo-user', 'טכנולוגיה', 600, 120, 450, 'השפעה גבוהה', NOW() - INTERVAL '1 day'),
  ('achievement', 'הגיע ל-1000 עוקבים', 'הפך למומחה בעל השפעה בתחום הבריאות', 'demo-user', 'בריאות', 500, NULL, NULL, 'הישג חדש', NOW() - INTERVAL '2 days'),
  ('decision', 'תמך ברפורמת תחבורה', 'עזר ל-180 אנשים להחליט על תחבורה ציבורית', 'demo-user', 'תחבורה', 1800, 180, 890, 'נדחתה', NOW() - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

-- Update demo user's impact score
UPDATE profiles SET impact_score = 7490 WHERE user_id = 'demo-user';

-- Grant permissions
GRANT ALL ON impact_events TO authenticated;
GRANT ALL ON impact_events TO anon;
