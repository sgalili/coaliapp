-- Add is_demo field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_demo BOOLEAN DEFAULT false NOT NULL;

-- Create demo_profiles table (identical to profiles)
CREATE TABLE public.demo_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create demo_posts table (identical to posts)
CREATE TABLE public.demo_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT,
  content TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  domain TEXT,
  category TEXT,
  is_live BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  watch_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  trust_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  zooz_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create demo_trusts table (for trust relationships)
CREATE TABLE public.demo_trusts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  truster_id UUID NOT NULL,
  trusted_id UUID NOT NULL,
  post_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create demo_news_articles table (identical to news_articles)
CREATE TABLE public.demo_news_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  source TEXT NOT NULL,
  category TEXT NOT NULL,
  thumbnail_url TEXT,
  view_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create demo_polls table (for poll data)
CREATE TABLE public.demo_polls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  poll_type TEXT NOT NULL,
  options JSONB NOT NULL,
  total_votes INTEGER DEFAULT 0,
  published_date DATE NOT NULL,
  expires_at DATE,
  background_image TEXT,
  background_video TEXT,
  ai_narration TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create demo_poll_votes table
CREATE TABLE public.demo_poll_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID NOT NULL,
  user_id UUID NOT NULL,
  option_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(poll_id, user_id)
);

-- Enable RLS on all demo tables
ALTER TABLE public.demo_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_trusts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_poll_votes ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is demo
CREATE OR REPLACE FUNCTION public.is_demo_user(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_demo FROM public.profiles WHERE user_id = user_uuid),
    false
  );
$$;

-- RLS Policies for demo_profiles
CREATE POLICY "Demo users can view demo profiles"
ON public.demo_profiles FOR SELECT
USING (public.is_demo_user(auth.uid()));

CREATE POLICY "Demo users can insert demo profiles"
ON public.demo_profiles FOR INSERT
WITH CHECK (public.is_demo_user(auth.uid()));

CREATE POLICY "Demo users can update their own demo profile"
ON public.demo_profiles FOR UPDATE
USING (public.is_demo_user(auth.uid()) AND auth.uid() = user_id);

-- RLS Policies for demo_posts
CREATE POLICY "Demo users can view demo posts"
ON public.demo_posts FOR SELECT
USING (public.is_demo_user(auth.uid()));

CREATE POLICY "Demo users can create demo posts"
ON public.demo_posts FOR INSERT
WITH CHECK (public.is_demo_user(auth.uid()) AND auth.uid() = user_id);

CREATE POLICY "Demo users can update their own demo posts"
ON public.demo_posts FOR UPDATE
USING (public.is_demo_user(auth.uid()) AND auth.uid() = user_id);

CREATE POLICY "Demo users can delete their own demo posts"
ON public.demo_posts FOR DELETE
USING (public.is_demo_user(auth.uid()) AND auth.uid() = user_id);

-- RLS Policies for demo_trusts
CREATE POLICY "Demo users can view demo trusts"
ON public.demo_trusts FOR SELECT
USING (public.is_demo_user(auth.uid()));

CREATE POLICY "Demo users can create demo trusts"
ON public.demo_trusts FOR INSERT
WITH CHECK (public.is_demo_user(auth.uid()) AND auth.uid() = truster_id);

CREATE POLICY "Demo users can delete their own demo trusts"
ON public.demo_trusts FOR DELETE
USING (public.is_demo_user(auth.uid()) AND auth.uid() = truster_id);

-- RLS Policies for demo_news_articles
CREATE POLICY "Demo users can view demo news"
ON public.demo_news_articles FOR SELECT
USING (public.is_demo_user(auth.uid()) AND is_published = true);

-- RLS Policies for demo_polls
CREATE POLICY "Demo users can view demo polls"
ON public.demo_polls FOR SELECT
USING (public.is_demo_user(auth.uid()));

-- RLS Policies for demo_poll_votes
CREATE POLICY "Demo users can view demo poll votes"
ON public.demo_poll_votes FOR SELECT
USING (public.is_demo_user(auth.uid()));

CREATE POLICY "Demo users can create demo poll votes"
ON public.demo_poll_votes FOR INSERT
WITH CHECK (public.is_demo_user(auth.uid()) AND auth.uid() = user_id);

-- Update existing profiles RLS to exclude demo users
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Real users can view real profiles"
ON public.profiles FOR SELECT
USING (NOT public.is_demo_user(auth.uid()) OR auth.uid() = user_id);

-- Seed demo profiles
INSERT INTO public.demo_profiles (user_id, first_name, last_name, phone, avatar_url) VALUES
('00000000-0000-0000-0000-000000000001', 'יוסי', 'כהן', '+972501234501', '/candidates/yossi-cohen.jpg'),
('00000000-0000-0000-0000-000000000002', 'שרה', 'לוי', '+972501234502', '/assets/sarah-profile.jpg'),
('00000000-0000-0000-0000-000000000003', 'דוד', 'מזרחי', '+972501234503', '/assets/david-profile.jpg'),
('00000000-0000-0000-0000-000000000004', 'רחל', 'אברהם', '+972501234504', '/assets/rachel-profile.jpg'),
('00000000-0000-0000-0000-000000000005', 'משה', 'ברק', '+972501234505', '/candidates/barak.jpg'),
('00000000-0000-0000-0000-000000000006', 'נעמי', 'שרון', '+972501234506', '/assets/noa-profile.jpg'),
('00000000-0000-0000-0000-000000000007', 'אמיר', 'פרץ', '+972501234507', '/candidates/rafi-peretz.jpg'),
('00000000-0000-0000-0000-000000000008', 'מיכל', 'גולן', '+972501234508', '/assets/maya-profile.jpg'),
('00000000-0000-0000-0000-000000000009', 'אורי', 'שמיר', '+972501234509', '/candidates/avi-simhon.jpg'),
('00000000-0000-0000-0000-000000000010', 'טלי', 'דיין', '+972501234510', '/assets/amit-profile.jpg'),
('00000000-0000-0000-0000-000000000011', 'רון', 'בן-גוריון', '+972501234511', '/candidates/gantz.jpg'),
('00000000-0000-0000-0000-000000000012', 'ענת', 'נתניהו', '+972501234512', '/candidates/netanyahu.jpg'),
('00000000-0000-0000-0000-000000000013', 'גיא', 'ליברמן', '+972501234513', '/candidates/lieberman.jpg'),
('00000000-0000-0000-0000-000000000014', 'מאיה', 'לפיד', '+972501234514', '/assets/maya-profile.jpg'),
('00000000-0000-0000-0000-000000000015', 'עידו', 'בנט', '+972501234515', '/candidates/bennett.jpg');

-- Seed demo posts
INSERT INTO public.demo_posts (user_id, title, content, domain, category, view_count, trust_count, watch_count) VALUES
('00000000-0000-0000-0000-000000000001', 'חדשות הערב', 'הערב בחדשות: מה קורה בעולם הפוליטיקה הישראלית', 'politics', 'news', 1250, 45, 890),
('00000000-0000-0000-0000-000000000002', 'המשבר הכלכלי', 'ניתוח מעמיק של המצב הכלכלי בישראל', 'economics', 'analysis', 2340, 78, 1560),
('00000000-0000-0000-0000-000000000003', 'חינוך לעתיד', 'איך נוכל לשפר את מערכת החינוך?', 'education', 'opinion', 890, 34, 670),
('00000000-0000-0000-0000-000000000004', 'בריאות הציבור', 'מה צריך לדעת על רפורמת הבריאות', 'health', 'news', 1780, 92, 1340),
('00000000-0000-0000-0000-000000000005', 'ביטחון לאומי', 'האתגרים הביטחוניים של ישראל', 'defense', 'analysis', 3240, 156, 2890),
('00000000-0000-0000-0000-000000000006', 'צדק חברתי', 'למען חברה שוויונית יותר', 'justice', 'opinion', 1120, 67, 890),
('00000000-0000-0000-0000-000000000007', 'איכות הסביבה', 'פתרונות ירוקים לישראל', 'environment', 'news', 980, 43, 720),
('00000000-0000-0000-0000-000000000008', 'טכנולוגיה וחדשנות', 'הסטארט-אפ ניישן של ישראל', 'technology', 'analysis', 2450, 134, 1980),
('00000000-0000-0000-0000-000000000009', 'תרבות ואומנות', 'התרבות הישראלית המתפתחת', 'culture', 'opinion', 670, 28, 450),
('00000000-0000-0000-0000-000000000010', 'ספורט ישראלי', 'ההישגים האחרונים של נבחרת ישראל', 'sports', 'news', 1890, 89, 1450),
('00000000-0000-0000-0000-000000000011', 'דיור בישראל', 'משבר הדיור ופתרונות אפשריים', 'economics', 'analysis', 2780, 167, 2340),
('00000000-0000-0000-0000-000000000012', 'יחסי חוץ', 'יחסי ישראל עם העולם', 'politics', 'news', 1560, 78, 1120),
('00000000-0000-0000-0000-000000000013', 'תחבורה ציבורית', 'שיפור התחבורה הציבורית בישראל', 'infrastructure', 'opinion', 890, 45, 670),
('00000000-0000-0000-0000-000000000014', 'מערכת המשפט', 'הרפורמה המשפטית - בעד ונגד', 'justice', 'analysis', 3450, 234, 2890),
('00000000-0000-0000-0000-000000000015', 'קליטת עלייה', 'קליטת עולים חדשים בישראל', 'society', 'news', 1230, 56, 890),
('00000000-0000-0000-0000-000000000001', 'המצב הביטחוני', 'סקירה שבועית של המצב הביטחוני', 'defense', 'news', 2340, 123, 1890),
('00000000-0000-0000-0000-000000000002', 'שוק העבודה', 'מצב שוק העבודה בישראל 2025', 'economics', 'analysis', 1670, 89, 1230),
('00000000-0000-0000-0000-000000000003', 'מערכת הבריאות', 'איך לשפר את שירותי הבריאות', 'health', 'opinion', 1450, 67, 1120),
('00000000-0000-0000-0000-000000000004', 'המגזר השלישי', 'תרומת הארגונים החברתיים', 'society', 'news', 780, 34, 560),
('00000000-0000-0000-0000-000000000005', 'האנרגיה המתחדשת', 'עתיד האנרגיה בישראל', 'environment', 'analysis', 1890, 98, 1450),
('00000000-0000-0000-0000-000000000006', 'זכויות אדם', 'שמירה על זכויות האדם בישראל', 'justice', 'opinion', 1120, 56, 890),
('00000000-0000-0000-0000-000000000007', 'המחקר האקדמי', 'מצב המחקר והפיתוח בישראל', 'education', 'analysis', 890, 45, 670),
('00000000-0000-0000-0000-000000000008', 'תיירות בישראל', 'פיתוח התיירות בישראל', 'economics', 'news', 1450, 67, 1120),
('00000000-0000-0000-0000-000000000009', 'חקלאות מתקדמת', 'חדשנות בחקלאות הישראלית', 'agriculture', 'analysis', 1230, 56, 890),
('00000000-0000-0000-0000-000000000010', 'פערים חברתיים', 'צמצום הפערים בחברה הישראלית', 'society', 'opinion', 2340, 134, 1890);

-- Seed demo trusts
INSERT INTO public.demo_trusts (truster_id, trusted_id) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002'),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000006'),
('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000007'),
('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000008'),
('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000009'),
('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000010'),
('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000012'),
('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000013'),
('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000014');

-- Seed demo news articles
INSERT INTO public.demo_news_articles (title, description, content, source, category, view_count) VALUES
('פריצת דרך טכנולוגית בישראל', 'חברת הייטק ישראלית מפתחת פתרון מהפכני', 'חברת הייטק ישראלית הצליחה לפתח טכנולוגיה חדשנית שעשויה לשנות את עולם הטכנולוגיה...', 'ידיעות אחרונות', 'technology', 3450),
('שיפור במערכת הבריאות', 'משרד הבריאות מכריז על תכנית רפורמה', 'משרד הבריאות הכריז היום על תכנית רחבת היקף לשיפור שירותי הבריאות...', 'הארץ', 'health', 2890),
('ירידה באבטלה', 'שוק העבודה מראה שיפור משמעותי', 'הלשכה המרכזית לסטטיסטיקה מדווחת על ירידה חדה באחוזי האבטלה...', 'כלכליסט', 'economics', 4120),
('הסכם שלום היסטורי', 'ישראל חותמת על הסכם שלום עם מדינה ערבית נוספת', 'בטקס מרשים בירושלים נחתם היום הסכם שלום היסטורי...', 'ידיעות אחרונות', 'politics', 5670),
('מהפכה בחינוך', 'משרד החינוך מציג תכנית לימודים חדשה', 'משרד החינוך הציג היום תכנית לימודים מהפכנית שתיושם החל מהשנה הבאה...', 'הארץ', 'education', 2340),
('הישג ספורטיבי', 'ישראל זוכה במדליית זהב אולימפית', 'ספורטאי ישראלי זכה היום במדליית זהב באולימפיאדה...', 'ספורט 1', 'sports', 3890),
('פתרון למשבר הדיור', 'הממשלה מאשרת תכנית בנייה רחבת היקף', 'הממשלה אישרה היום תכנית לבנייה של עשרות אלפי דירות...', 'כלכליסט', 'economics', 4560),
('חדשנות בתחבורה', 'השקת קו רכבת חדש', 'היום הושק קו רכבת חדש שיקצר את זמני הנסיעה באופן משמעותי...', 'ידיעות אחרונות', 'infrastructure', 2780),
('הגנה על הסביבה', 'ישראל מתחייבת להפחית פליטות פחמן', 'ישראל הכריזה היום על תכנית אמביציוזית להפחתת פליטות גזי חממה...', 'הארץ', 'environment', 3120),
('צדק חברתי', 'תכנית חדשה לצמצום פערים', 'משרד הרווחה מציג תכנית רחבת היקף לצמצום פערים חברתיים...', 'ידיעות אחרונות', 'society', 2670),
('פריצה במחקר רפואי', 'חוקרים ישראלים מפתחים טיפול חדש', 'חוקרים מאוניברסיטה ישראלית הצליחו לפתח טיפול פורץ דרך...', 'הארץ', 'health', 4230),
('אבטחת סייבר', 'ישראל מובילה בתחום אבטחת המידע', 'ישראל ממשיכה להוביל בתחום אבטחת הסייבר העולמית...', 'כלכליסט', 'technology', 3450),
('משבר האקלים', 'מדענים מזהירים מפני השלכות חמורות', 'מדענים ישראלים מצטרפים לאזהרה העולמית בנושא משבר האקלים...', 'הארץ', 'environment', 2890),
('רפורמה במשפט', 'הממשלה מציגה הצעת חוק חדשה', 'הממשלה הציגה היום הצעת חוק לרפורמה במערכת המשפט...', 'ידיעות אחרונות', 'justice', 5120),
('תרבות ישראלית', 'אמן ישראלי זוכה בפרס בינלאומי', 'אמן ישראלי זכה בפרס בינלאומי יקר ערך...', 'הארץ', 'culture', 1890);

-- Seed demo polls
INSERT INTO public.demo_polls (question, poll_type, options, total_votes, published_date, expires_at) VALUES
('מי צריך להיות ראש הממשלה הבא?', 'simple', 
'[{"id": "1", "text": "נתניהו", "votes": 234}, {"id": "2", "text": "לפיד", "votes": 189}, {"id": "3", "text": "גנץ", "votes": 156}, {"id": "4", "text": "בנט", "votes": 98}]'::jsonb, 
677, '2025-01-15', '2025-02-15'),

('מהן הסוגיות החשובות ביותר בבחירות?', 'multiple', 
'[{"id": "1", "text": "ביטחון", "votes": 345}, {"id": "2", "text": "כלכלה", "votes": 312}, {"id": "3", "text": "חינוך", "votes": 234}, {"id": "4", "text": "בריאות", "votes": 198}]'::jsonb, 
1089, '2025-01-14', '2025-02-14'),

('האם אתה תומך ברפורמה המשפטית?', 'simple', 
'[{"id": "1", "text": "כן", "votes": 412}, {"id": "2", "text": "לא", "votes": 456}, {"id": "3", "text": "לא בטוח", "votes": 234}]'::jsonb, 
1102, '2025-01-13', '2025-02-13'),

('מי צריך להיות שר הביטחון?', 'expert', 
'[{"id": "1", "text": "גלנט", "votes": 289}, {"id": "2", "text": "איזנקוט", "votes": 234}, {"id": "3", "text": "אשכנזי", "votes": 178}]'::jsonb, 
701, '2025-01-12', '2025-02-12'),

('האם תומך בהגדלת תקציב החינוך?', 'simple', 
'[{"id": "1", "text": "כן", "votes": 567}, {"id": "2", "text": "לא", "votes": 123}, {"id": "3", "text": "תלוי בפרטים", "votes": 234}]'::jsonb, 
924, '2025-01-11', '2025-02-11'),

('מהי הדרך הטובה ביותר לטפל במשבר הדיור?', 'multiple', 
'[{"id": "1", "text": "בנייה המונית", "votes": 456}, {"id": "2", "text": "הקלות מס", "votes": 345}, {"id": "3", "text": "דיור ציבורי", "votes": 289}, {"id": "4", "text": "רגולציה על המחירים", "votes": 234}]'::jsonb, 
1324, '2025-01-10', '2025-02-10'),

('מי צריך להיות שר הכלכלה?', 'expert', 
'[{"id": "1", "text": "שמחון", "votes": 312}, {"id": "2", "text": "זלכה", "votes": 267}, {"id": "3", "text": "טרכטנברג", "votes": 198}]'::jsonb, 
777, '2025-01-09', '2025-02-09'),

('האם תומך בהקמת רכבת תת-קרקעית בתל אביב?', 'simple', 
'[{"id": "1", "text": "כן", "votes": 623}, {"id": "2", "text": "לא", "votes": 145}, {"id": "3", "text": "רק אם זה משתלם כלכלית", "votes": 287}]'::jsonb, 
1055, '2025-01-08', '2025-02-08'),

('איזה תחום צריך לקבל את התקציב הגבוה ביותר?', 'simple', 
'[{"id": "1", "text": "ביטחון", "votes": 389}, {"id": "2", "text": "חינוך", "votes": 445}, {"id": "3", "text": "בריאות", "votes": 512}, {"id": "4", "text": "תשתיות", "votes": 234}]'::jsonb, 
1580, '2025-01-07', '2025-02-07'),

('מי צריך להיות שר החינוך?', 'expert', 
'[{"id": "1", "text": "פירון", "votes": 298}, {"id": "2", "text": "תמיר", "votes": 267}, {"id": "3", "text": "נבון", "votes": 189}]'::jsonb, 
754, '2025-01-06', '2025-02-06');

-- Create indexes for better performance
CREATE INDEX idx_demo_profiles_user_id ON public.demo_profiles(user_id);
CREATE INDEX idx_demo_posts_user_id ON public.demo_posts(user_id);
CREATE INDEX idx_demo_posts_category ON public.demo_posts(category);
CREATE INDEX idx_demo_trusts_truster ON public.demo_trusts(truster_id);
CREATE INDEX idx_demo_trusts_trusted ON public.demo_trusts(trusted_id);
CREATE INDEX idx_demo_news_category ON public.demo_news_articles(category);
CREATE INDEX idx_demo_polls_published ON public.demo_polls(published_date);
CREATE INDEX idx_demo_poll_votes_poll ON public.demo_poll_votes(poll_id);
CREATE INDEX idx_demo_poll_votes_user ON public.demo_poll_votes(user_id);