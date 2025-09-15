-- Update avatar URLs for Prime Minister candidates to use public/candidates/ paths
UPDATE public.prime_minister_candidates 
SET avatar_url = '/candidates/netanyahu.jpg' 
WHERE name = 'בנימין נתניהו';

UPDATE public.prime_minister_candidates 
SET avatar_url = '/candidates/lapid.jpg' 
WHERE name = 'יאיר לפיד';

UPDATE public.prime_minister_candidates 
SET avatar_url = '/candidates/bennett.jpg' 
WHERE name = 'נפתלי בנט';

UPDATE public.prime_minister_candidates 
SET avatar_url = '/candidates/gantz.jpg' 
WHERE name = 'בני גנץ';

UPDATE public.prime_minister_candidates 
SET avatar_url = '/candidates/saar.jpg' 
WHERE name = 'גדעון סער';

UPDATE public.prime_minister_candidates 
SET avatar_url = '/candidates/lieberman.jpg' 
WHERE name = 'אביגדור ליברמן';

UPDATE public.prime_minister_candidates 
SET avatar_url = '/candidates/ben-gvir.jpg' 
WHERE name = 'איתמר בן-גביר';

UPDATE public.prime_minister_candidates 
SET avatar_url = '/candidates/livni.jpg' 
WHERE name = 'ציפי לבני';

UPDATE public.prime_minister_candidates 
SET avatar_url = '/candidates/barak.jpg' 
WHERE name = 'אהוד ברק';

UPDATE public.prime_minister_candidates 
SET avatar_url = '/candidates/shaked.jpg' 
WHERE name = 'איילת שקד';