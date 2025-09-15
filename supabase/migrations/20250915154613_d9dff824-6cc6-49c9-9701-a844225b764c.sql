-- Create justice candidates table
CREATE TABLE public.justice_candidates (
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
ALTER TABLE public.justice_candidates ENABLE ROW LEVEL SECURITY;

-- Create policies for justice candidates
CREATE POLICY "Justice candidates are viewable by everyone" 
ON public.justice_candidates 
FOR SELECT 
USING (true);

CREATE POLICY "Only service role can insert justice candidates" 
ON public.justice_candidates 
FOR INSERT 
WITH CHECK (false);

CREATE POLICY "Only service role can update justice candidates" 
ON public.justice_candidates 
FOR UPDATE 
USING (false);

CREATE POLICY "Only service role can delete justice candidates" 
ON public.justice_candidates 
FOR DELETE 
USING (false);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_justice_candidates_updated_at
BEFORE UPDATE ON public.justice_candidates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert justice candidates data
INSERT INTO public.justice_candidates (name, avatar_url, experience, party, expertise, wikipedia_url) VALUES
('יובל שני', '/candidates/yuval-shany.jpg', 'מומחה למשפט בינלאומי וזכויות אדם, פרופ'' באוני׳ העברית', 'ללא מפלגה', ARRAY['משפט בינלאומי', 'זכויות אדם'], 'https://en.wikipedia.org/wiki/Yuval_Shany'),
('אייל בן־וניסתי', '/candidates/eyal-benvenisti.jpg', 'פרופ'' למשפט בינלאומי וחוקה בביה״ס למשפטים בקמברידג׳ / TAU', 'ללא מפלגה', ARRAY['משפט בינלאומי', 'חוקה'], 'https://www.law.cam.ac.uk/people/eyal-benvenisti/76742'),
('דוד קרתזמר', '/candidates/david-kretzmer.jpg', 'פרופ'' בינלאומי / זכויות אדם, פעיל ציבורי', 'ללא מפלגה', ARRAY['זכויות אדם', 'משפט בינלאומי'], 'https://en.wikipedia.org/wiki/David_Kretzmer'),
('ידידיה שטרן', '/candidates/yedidia-stern.jpg', 'פרופ'' לחוק חוקתי, יו״ר Jewish People Policy Institute', 'ללא מפלגה', ARRAY['משפט חוקתי', 'מדיניות'], 'https://en.wikipedia.org/wiki/Yedidia_Stern'),
('עמיחי כהן', '/candidates/amichai-cohen.jpg', 'פרופ'' למשפט בינלאומי, חוקרת מדיניות חוקים', 'ללא מפלגה', ARRAY['משפט בינלאומי', 'מדיניות'], 'https://israeli-legal-studies.law.columbia.edu/content/people'),
('אהרן ברק', '/candidates/aharon-barak.jpg', 'נשיא בית המשפט העליון לשעבר, מומחה למשפט חוקתי', 'ללא מפלגה', ARRAY['משפט חוקתי', 'שפיטה'], 'https://en.wikipedia.org/wiki/Aharon_Barak'),
('אליקים רובינשטיין', '/candidates/elyakim-rubinstein.jpg', 'סגן נשיא בית המשפט העליון לשעבר, יועמ״ש לשעבר', 'ללא מפלגה', ARRAY['משפט ציבורי', 'שפיטה'], 'https://en.wikipedia.org/wiki/Elyakim_Rubinstein'),
('יצחק עמית', '/candidates/isaac-amit.jpg', 'נשיא בית המשפט העליון (2025–)', 'ללא מפלגה', ARRAY['שפיטה', 'משפט פלילי'], 'https://en.wikipedia.org/wiki/Isaac_Amit'),
('דפנה ברק-ארז', '/candidates/daphne-barak-erez.jpg', 'שופטת עליונה, מומחית למשפט ציבורי וחוקתי', 'ללא מפלגה', ARRAY['משפט ציבורי', 'משפט חוקתי'], 'https://en.wikipedia.org/wiki/Daphne_Barak-Erez'),
('נעם סולברג', '/candidates/noam-sohlberg.jpg', 'שופט עליון, מומחה לדין מנהלי וחוקתי', 'ללא מפלגה', ARRAY['דין מנהלי', 'משפט חוקתי'], 'https://en.wikipedia.org/wiki/Noam_Sohlberg');