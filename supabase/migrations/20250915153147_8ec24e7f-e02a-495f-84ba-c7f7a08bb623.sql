-- Create economics candidates table
CREATE TABLE public.economics_candidates (
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
ALTER TABLE public.economics_candidates ENABLE ROW LEVEL SECURITY;

-- Create policies for economics candidates
CREATE POLICY "Economics candidates are viewable by everyone" 
ON public.economics_candidates 
FOR SELECT 
USING (true);

CREATE POLICY "Only service role can insert economics candidates" 
ON public.economics_candidates 
FOR INSERT 
WITH CHECK (false);

CREATE POLICY "Only service role can update economics candidates" 
ON public.economics_candidates 
FOR UPDATE 
USING (false);

CREATE POLICY "Only service role can delete economics candidates" 
ON public.economics_candidates 
FOR DELETE 
USING (false);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_economics_candidates_updated_at
BEFORE UPDATE ON public.economics_candidates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert economics candidates data
INSERT INTO public.economics_candidates (name, avatar_url, experience, party, expertise, wikipedia_url) VALUES
('ירון זליכה', '/candidates/yaron-zelekha.jpg', 'חשב כללי לשעבר, פרופ'' לכלכלה', 'מפלגת הצדק החברתי (לשעבר)', ARRAY['כלכלה', 'מדיניות פיסקלית'], 'https://en.wikipedia.org/wiki/Yaron_Zelekha'),
('אלחנן הלפמן', '/candidates/elhanan-helpman.jpg', 'פרופ'' לכלכלה, אוניברסיטת הרווארד', 'ללא מפלגה', ARRAY['כלכלה בינלאומית', 'מחקר'], 'https://en.wikipedia.org/wiki/Elhanan_Helpman'),
('ענת אדמתי', '/candidates/anat-admati.jpg', 'פרופ'' לכלכלה, אוניברסיטת סטנפורד', 'ללא מפלגה', ARRAY['כלכלה פיננסית', 'רגולציה'], 'https://en.wikipedia.org/wiki/Anat_Admati'),
('אבי שמחון', '/candidates/avi-simhon.jpg', 'יועץ כלכלי לראש הממשלה לשעבר', 'ליכוד (מקורב)', ARRAY['מדיניות כלכלית', 'ייעוץ'], 'https://en.wikipedia.org/wiki/Avi_Simhon'),
('אשר טישלר', '/candidates/asher-tishler.jpg', 'דיקן הפקולטה לניהול, אונ'' תל אביב', 'ללא מפלגה', ARRAY['ניהול', 'כלכלה'], 'https://en.wikipedia.org/wiki/Asher_Tishler'),
('צבי אקשטיין', '/candidates/zvi-eckstein.jpg', 'משנה לנגיד בנק ישראל לשעבר', 'ללא מפלגה', ARRAY['בנקאות', 'מדיניות מוניטרית'], 'https://en.wikipedia.org/wiki/Zvi_Eckstein'),
('מנואל טרכטנברג', '/candidates/manuel-trajtenberg.jpg', 'יו״ר ועדת טרכטנברג, פרופ'' לכלכלה', 'העבודה (לשעבר)', ARRAY['צדק חברתי', 'מדיניות כלכלית'], 'https://en.wikipedia.org/wiki/Manuel_Trajtenberg'),
('עומר מואב', '/candidates/omer-moav.jpg', 'פרופ'' לכלכלה, מומחה מדיניות מס', 'ללא מפלגה', ARRAY['מדיניות מס', 'כלכלה'], 'https://en.wikipedia.org/wiki/Omer_Moav'),
('עופר עזר', '/candidates/ofer-azar.jpg', 'פרופ'' לכלכלה, אוניברסיטת אריאל', 'ללא מפלגה', ARRAY['כלכלה', 'מחקר'], 'https://en.wikipedia.org/wiki/Ofer_Azar'),
('דניאל כהנמן', '/candidates/daniel-kahneman.jpg', 'חתן פרס נובל בכלכלה', 'ללא מפלגה', ARRAY['כלכלה התנהגותית', 'פסיכולוגיה'], 'https://en.wikipedia.org/wiki/Daniel_Kahneman');