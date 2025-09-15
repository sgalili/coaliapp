-- Create health candidates table
CREATE TABLE public.health_candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_url TEXT,
  expertise TEXT[],
  party TEXT,
  experience TEXT,
  bio TEXT,
  wikipedia_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.health_candidates ENABLE ROW LEVEL SECURITY;

-- Create policies for health candidates
CREATE POLICY "Health candidates are viewable by everyone" 
ON public.health_candidates 
FOR SELECT 
USING (true);

CREATE POLICY "Only service role can insert health candidates" 
ON public.health_candidates 
FOR INSERT 
WITH CHECK (false);

CREATE POLICY "Only service role can update health candidates" 
ON public.health_candidates 
FOR UPDATE 
USING (false);

CREATE POLICY "Only service role can delete health candidates" 
ON public.health_candidates 
FOR DELETE 
USING (false);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_health_candidates_updated_at
BEFORE UPDATE ON public.health_candidates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert health candidates data
INSERT INTO public.health_candidates (name, avatar_url, experience, party, expertise, wikipedia_url) VALUES
('רוני גמזו', '/candidates/roni-gamzu.jpg', 'מנכ״ל משרד הבריאות לשעבר, מנהל איכילוב', 'ללא מפלגה', ARRAY['ניהול רפואי', 'מדיניות בריאות'], 'https://en.wikipedia.org/wiki/Roni_Gamzu'),
('יצחק קרייס', '/candidates/itzhak-kreis.jpg', 'מנהל המרכז הרפואי שיבא (תל השומר)', 'ללא מפלגה', ARRAY['ניהול רפואי', 'חדשנות רפואית'], 'https://en.wikipedia.org/wiki/Itzhak_Kreis'),
('נחמן אש', '/candidates/nachman-ash.jpg', 'מנכ״ל משרד הבריאות לשעבר, פרופ'' לרפואה', 'ללא מפלגה', ARRAY['רפואה', 'מדיניות בריאות'], 'https://en.wikipedia.org/wiki/Nachman_Ash'),
('סיגל סדצקי', '/candidates/sigal-sadatzki.jpg', 'ראש שירותי בריאות הציבור לשעבר', 'ללא מפלגה', ARRAY['בריאות הציבור', 'אפידמיולוגיה'], 'https://en.wikipedia.org/wiki/Sigal_Sadatzki'),
('גבי ברבש', '/candidates/gabi-barbash.jpg', 'מנכ״ל איכילוב לשעבר, פרופ'' לרפואה', 'ללא מפלגה', ARRAY['ניהול רפואי', 'רפואה פנימית'], 'https://en.wikipedia.org/wiki/Gabi_Barbash'),
('חיים נבון', '/candidates/chaim-navon.jpg', 'מנהל מחלקות רפואיות, איש ציבור', 'ללא מפלגה', ARRAY['רפואה', 'שירות ציבורי'], 'https://he.wikipedia.org/wiki/%D7%97%D7%99%D7%99%D7%9D_%D7%A0%D7%91%D7%95%D7%9F'),
('משה בר סימן טוב', '/candidates/moshe-bar-siman-tov.jpg', 'מנכ״ל משרד הבריאות לשעבר', 'ללא מפלגה', ARRAY['מדיניות בריאות', 'ניהול'], 'https://en.wikipedia.org/wiki/Moshe_Bar-Siman-Tov'),
('אלי דפס', '/candidates/eli-dafas.jpg', 'מנכ״ל שירותי בריאות כללית לשעבר', 'ללא מפלגה', ARRAY['קופות חולים', 'ניהול רפואי'], 'https://he.wikipedia.org/wiki/%D7%90%D7%9C%D7%99_%D7%93%D7%A4%D7%A1'),
('שלמה מור-יוסף', '/candidates/shlomo-mor-yosef.jpg', 'מנכ״ל ביטוח לאומי, לשעבר מנהל הדסה', 'ללא מפלגה', ARRAY['ביטוח לאומי', 'ניהול רפואי'], 'https://en.wikipedia.org/wiki/Shlomo_Mor-Yosef'),
('יעקב ליצמן', '/candidates/yaakov-litzman.jpg', 'שר בריאות לשעבר, חבר כנסת', 'יהדות התורה', ARRAY['פוליטיקה', 'בריאות'], 'https://en.wikipedia.org/wiki/Yaakov_Litzman'),
('אורית פרקש-הכהן', '/candidates/orit-farkash-hacohen.jpg', 'שרה ממלאת תפקידים זמניים (2022)', 'כחול לבן', ARRAY['פוליטיקה', 'משפטים'], 'https://he.wikipedia.org/wiki/%D7%90%D7%95%D7%A8%D7%99%D7%AA_%D7%A4%D7%A8%D7%A7%D7%A9-%D7%94%D7%9B%D7%94%D7%9F'),
('ניצן הורוביץ', '/candidates/nitzan-horowitz.jpg', 'שר בריאות (2021–2022)', 'מרצ', ARRAY['פוליטיקה', 'זכויות אדם'], 'https://en.wikipedia.org/wiki/Nitzan_Horowitz'),
('יולי אדלשטיין', '/candidates/yuli-edelstein.jpg', 'שר בריאות (2020–2021)', 'הליכוד', ARRAY['פוליטיקה', 'דיפלומטיה'], 'https://en.wikipedia.org/wiki/Yuli-Yoel_Edelstein');