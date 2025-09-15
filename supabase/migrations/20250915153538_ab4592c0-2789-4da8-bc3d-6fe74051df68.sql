-- Create education candidates table
CREATE TABLE public.education_candidates (
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
ALTER TABLE public.education_candidates ENABLE ROW LEVEL SECURITY;

-- Create policies for education candidates
CREATE POLICY "Education candidates are viewable by everyone" 
ON public.education_candidates 
FOR SELECT 
USING (true);

CREATE POLICY "Only service role can insert education candidates" 
ON public.education_candidates 
FOR INSERT 
WITH CHECK (false);

CREATE POLICY "Only service role can update education candidates" 
ON public.education_candidates 
FOR UPDATE 
USING (false);

CREATE POLICY "Only service role can delete education candidates" 
ON public.education_candidates 
FOR DELETE 
USING (false);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_education_candidates_updated_at
BEFORE UPDATE ON public.education_candidates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert education candidates data
INSERT INTO public.education_candidates (name, avatar_url, experience, party, expertise, wikipedia_url) VALUES
('יולי תמיר', '/candidates/yuli-tamir.jpg', 'שרת החינוך לשעבר, פרופ'' לפילוסופיה', 'מפלגת העבודה', ARRAY['חינוך', 'פילוסופיה'], 'https://en.wikipedia.org/wiki/Yuli_Tamir'),
('שיי פירון', '/candidates/shai-piron.jpg', 'שר חינוך לשעבר, רב ואיש חינוך', 'יש עתיד', ARRAY['חינוך דתי', 'רבנות'], 'https://en.wikipedia.org/wiki/Shai_Piron'),
('אמנון רובינשטיין', '/candidates/amnon-rubinstein.jpg', 'שר חינוך לשעבר, פרופ'' למשפטים', 'שינוי / מרץ', ARRAY['משפטים', 'חינוך'], 'https://en.wikipedia.org/wiki/Amnon_Rubinstein'),
('גידון סער', '/candidates/gideon-saar.jpg', 'שר חינוך לשעבר, פוליטיקאי בכיר', 'המחנה הממלכתי', ARRAY['חינוך', 'פוליטיקה'], 'https://en.wikipedia.org/wiki/Gideon_Sa%27ar'),
('רפי פרץ', '/candidates/rafi-peretz.jpg', 'שר חינוך לשעבר, רב ואלוף', 'הבית היהודי', ARRAY['חינוך דתי', 'צבא'], 'https://en.wikipedia.org/wiki/Rafi_Peretz'),
('זבולון המר', '/candidates/zvulun-hammer.jpg', 'שר חינוך לשעבר, מנהיג ציוני דתי', 'מפד״ל', ARRAY['חינוך דתי', 'ציונות דתית'], 'https://en.wikipedia.org/wiki/Zvulun_Hammer'),
('יוסי שריד', '/candidates/yossi-sarid.jpg', 'שר חינוך לשעבר, מנהיג מרצ', 'מרצ', ARRAY['חינוך', 'זכויות אדם'], 'https://en.wikipedia.org/wiki/Yossi_Sarid'),
('נתן שרנסקי', '/candidates/natan-sharansky.jpg', 'שר בתפקידים חינוכיים, יו״ר הסוכנות', 'ישראל בעליה / ליכוד', ARRAY['קליטה', 'זכויות אדם'], 'https://en.wikipedia.org/wiki/Natan_Sharansky'),
('יוסי יונה', '/candidates/yossi-yona.jpg', 'ח״כ, פרופ'' לחינוך וחברה', 'העבודה', ARRAY['חינוך', 'סוציולוגיה'], 'https://en.wikipedia.org/wiki/Yossi_Yona'),
('מרדכי בר-און', '/candidates/mordechai-bar-on.jpg', 'חוקר חינוך והיסטוריון, ח״כ', 'מפד״ל', ARRAY['היסטוריה', 'חינוך'], 'https://en.wikipedia.org/wiki/Mordechai_Bar-On'),
('יואב קיש', '/candidates/yoav-kish.jpg', 'שר החינוך הנוכחי (מ־2022)', 'הליכוד', ARRAY['חינוך', 'פוליטיקה'], 'https://en.wikipedia.org/wiki/Yoav_Kish'),
('יפעת שאשא-ביטון', '/candidates/yifat-shasha-biton.jpg', 'שרת החינוך (2021–2022)', 'תקווה חדשה', ARRAY['חינוך', 'אקדמיה'], 'https://en.wikipedia.org/wiki/Yifat_Shasha-Biton'),
('יואב גלנט', '/candidates/yoav-gallant.jpg', 'שר החינוך (2020–2021)', 'הליכוד', ARRAY['צבא', 'חינוך'], 'https://en.wikipedia.org/wiki/Yoav_Gallant');