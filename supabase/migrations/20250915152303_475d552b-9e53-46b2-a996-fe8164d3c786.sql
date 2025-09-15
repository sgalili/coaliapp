-- Create defense candidates table
CREATE TABLE public.defense_candidates (
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
ALTER TABLE public.defense_candidates ENABLE ROW LEVEL SECURITY;

-- Create policies for defense candidates
CREATE POLICY "Defense candidates are viewable by everyone" 
ON public.defense_candidates 
FOR SELECT 
USING (true);

CREATE POLICY "Only service role can insert defense candidates" 
ON public.defense_candidates 
FOR INSERT 
WITH CHECK (false);

CREATE POLICY "Only service role can update defense candidates" 
ON public.defense_candidates 
FOR UPDATE 
USING (false);

CREATE POLICY "Only service role can delete defense candidates" 
ON public.defense_candidates 
FOR DELETE 
USING (false);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_defense_candidates_updated_at
BEFORE UPDATE ON public.defense_candidates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert defense candidates data
INSERT INTO public.defense_candidates (name, avatar_url, experience, party, expertise, wikipedia_url) VALUES
('יוסי כהן', '/candidates/yossi-cohen.jpg', 'ראש המוסד לשעבר', 'ליכוד (מקורב)', ARRAY['מודיעין', 'ביטחון לאומי'], 'https://en.wikipedia.org/wiki/Yossi_Cohen'),
('עופר וינטר', '/candidates/ofer-winter.jpg', 'תא״ל בצה״ל, מפקד גבעתי לשעבר', 'ללא מפלגה', ARRAY['צבא', 'לוחמה'], 'https://en.wikipedia.org/wiki/Ofer_Winter'),
('גדי איזנקוט', '/candidates/gadi-eisenkot.jpg', 'רמטכ״ל לשעבר', 'המחנה הממלכתי', ARRAY['צבא', 'אסטרטגיה'], 'https://en.wikipedia.org/wiki/Gadi_Eisenkot'),
('בני גנץ', '/candidates/benny-gantz.jpg', 'רמטכ״ל לשעבר, שר ביטחון', 'המחנה הממלכתי', ARRAY['צבא', 'ביטחון'], 'https://en.wikipedia.org/wiki/Benny_Gantz'),
('גבי אשכנזי', '/candidates/gabi-ashkenazi.jpg', 'רמטכ״ל לשעבר, שר חוץ', 'כחול לבן (לשעבר)', ARRAY['צבא', 'דיפלומטיה'], 'https://en.wikipedia.org/wiki/Gabi_Ashkenazi'),
('משה יעלון', '/candidates/moshe-yaalon.jpg', 'רמטכ״ל לשעבר, שר ביטחון', 'ליכוד (לשעבר), תל״ם', ARRAY['צבא', 'ביטחון'], 'https://en.wikipedia.org/wiki/Moshe_Ya%27alon'),
('דן חלוץ', '/candidates/dan-halutz.jpg', 'רמטכ״ל לשעבר, מפקד חיל האוויר', 'ללא מפלגה', ARRAY['חיל אוויר', 'צבא'], 'https://en.wikipedia.org/wiki/Dan_Halutz'),
('שאול מופז', '/candidates/shaul-mofaz.jpg', 'רמטכ״ל לשעבר, שר ביטחון', 'קדימה (לשעבר)', ARRAY['צבא', 'ביטחון'], 'https://en.wikipedia.org/wiki/Shaul_Mofaz'),
('אהוד ברק', '/candidates/ehud-barak.jpg', 'רמטכ״ל לשעבר, ראש ממשלה', 'העבודה (לשעבר)', ARRAY['צבא', 'פוליטיקה'], 'https://en.wikipedia.org/wiki/Ehud_Barak'),
('תמיר פרדו', '/candidates/tamir-pardo.jpg', 'ראש המוסד לשעבר', 'ללא מפלגה', ARRAY['מודיעין', 'ביטחון לאומי'], 'https://en.wikipedia.org/wiki/Tamir_Pardo');