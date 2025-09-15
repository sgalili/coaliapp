-- Create environment candidates table
CREATE TABLE public.environment_candidates (
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
ALTER TABLE public.environment_candidates ENABLE ROW LEVEL SECURITY;

-- Create policies for environment candidates
CREATE POLICY "Environment candidates are viewable by everyone" 
ON public.environment_candidates 
FOR SELECT 
USING (true);

CREATE POLICY "Only service role can insert environment candidates" 
ON public.environment_candidates 
FOR INSERT 
WITH CHECK (false);

CREATE POLICY "Only service role can update environment candidates" 
ON public.environment_candidates 
FOR UPDATE 
USING (false);

CREATE POLICY "Only service role can delete environment candidates" 
ON public.environment_candidates 
FOR DELETE 
USING (false);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_environment_candidates_updated_at
BEFORE UPDATE ON public.environment_candidates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert environment candidates data
INSERT INTO public.environment_candidates (name, avatar_url, experience, party, expertise, wikipedia_url) VALUES
('אלון טל', '/candidates/alon-tal.jpg', 'איש אקדמיה ואקטיביזם סביבתי, פרופ׳ מדיניות ציבורית', 'ללא מפלגה', ARRAY['מדיניות סביבתית', 'אקטיביזם סביבתי'], 'https://en.wikipedia.org/wiki/Alon_Tal'),
('גידון ברומברג', '/candidates/gidon-bromberg.jpg', 'עו״ד ואקטיביסט סביבתי, מנהל EcoPeace', 'ללא מפלגה', ARRAY['משפט סביבתי', 'שלום סביבתי'], 'https://en.wikipedia.org/wiki/Gidon_Bromberg'),
('עידית סילמן', '/candidates/idit-silman.jpg', 'שרה להגנת הסביבה לשעבר', 'ליכוד', ARRAY['הגנת הסביבה', 'מדיניות'], 'https://en.wikipedia.org/wiki/Idit_Silman'),
('נעמי צור', '/candidates/naomi-tsur.jpg', 'אקטיביסטית סביבתית, דיפלומטית עירונית', 'ללא מפלגה', ARRAY['אקטיביזם סביבתי', 'דיפלומטיה עירונית'], 'https://en.wikipedia.org/wiki/Naomi_Tsur'),
('תמר זנדברג', '/candidates/tamar-zandberg.jpg', 'שרה להגנת הסביבה לשעבר, חוקרת מדיניות אקלים', 'מרצ', ARRAY['הגנת הסביבה', 'מדיניות אקלים'], 'https://en.wikipedia.org/wiki/Tamar_Zandberg');