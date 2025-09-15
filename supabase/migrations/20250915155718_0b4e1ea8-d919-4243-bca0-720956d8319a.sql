-- Insert/update environment candidates with complete data
INSERT INTO public.environment_candidates (name, avatar_url, experience, party, expertise, wikipedia_url, bio) VALUES
('אלון טל', '/candidates/alon-tal.jpg', 'איש אקדמיה ואקטיביזם סביבתי, פרופ׳ מדיניות ציבורית', 'ללא מפלגה', ARRAY['מדיניות סביבתית', 'אקטיביזם סביבתי'], 'https://en.wikipedia.org/wiki/Alon_Tal', 'פרופסור למדיניות ציבורית ופעיל סביבתי מוביל בישראל'),
('גידון ברומברג', '/candidates/gidon-bromberg.jpg', 'עו״ד ואקטיביסט סביבתי, מנהל EcoPeace', 'ללא מפלגה', ARRAY['משפט סביבתי', 'שלום סביבתי'], 'https://en.wikipedia.org/wiki/Gidon_Bromberg', 'מנהל ארגון EcoPeace Middle East העוסק בשיתוף פעולה סביבתי אזורי'),
('עידית סילמן', '/candidates/idit-silman.jpg', 'שרה להגנת הסביבה לשעבר', 'ליכוד', ARRAY['הגנת הסביבה', 'מדיניות'], 'https://en.wikipedia.org/wiki/Idit_Silman', 'פוליטיקאית ישראלית ששימשה כשרת הגנת הסביבה'),
('נעמי צור', '/candidates/naomi-tsur.jpg', 'אקטיביסטית סביבתית, דיפלומטית עירונית', 'ללא מפלגה', ARRAY['אקטיביזם סביבתי', 'דיפלומטיה עירונית'], 'https://en.wikipedia.org/wiki/Naomi_Tsur', 'פעילת סביבה ודיפלומטית עירונית, מומחית לפיתוח עירוני בר קיימא'),
('תמר זנדברג', '/candidates/tamar-zandberg.jpg', 'שרה להגנת הסביבה לשעבר, חוקרת מדיניות אקלים', 'מרצ', ARRAY['הגנת הסביבה', 'מדיניות אקלים'], 'https://en.wikipedia.org/wiki/Tamar_Zandberg', 'פוליטיקאית ישראלית ושרת הגנת הסביבה לשעבר, מומחית במדיניות אקלים')
ON CONFLICT (name) DO UPDATE SET
  avatar_url = EXCLUDED.avatar_url,
  experience = EXCLUDED.experience,
  party = EXCLUDED.party,
  expertise = EXCLUDED.expertise,
  wikipedia_url = EXCLUDED.wikipedia_url,
  bio = EXCLUDED.bio;