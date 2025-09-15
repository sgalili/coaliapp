import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PMCandidateData {
  name: string;
  avatar_url: string;
  party: string;
  expertise: string[];
  experience: string;
  bio: string;
  wikipedia_url: string;
}

const candidates: PMCandidateData[] = [
  {
    name: "בנימין נתניהו",
    avatar_url: "/candidates/netanyahu.jpg",
    party: "ליכוד",
    expertise: ["כלכלה", "ביטחון לאומי", "יחסים חוץ"],
    experience: "רה״מ הכי ותיק בתולדות ישראל, שגריר לאו״ם",
    bio: "מוביל הימין בישראל למעלה מ-30 שנה",
    wikipedia_url: "https://en.wikipedia.org/wiki/Benjamin_Netanyahu"
  },
  {
    name: "יאיר לפיד",
    avatar_url: "/candidates/lapid.jpg",
    party: "יש עתיד",
    expertise: ["תקשורת", "כלכלה", "חברה"],
    experience: "רה״מ לשעבר, שר האוצר לשעבר, עיתונאי",
    bio: "מוביל המרכז הישראלי, נציג הציבור החילוני",
    wikipedia_url: "https://en.wikipedia.org/wiki/Yair_Lapid"
  },
  {
    name: "נפתלי בנט",
    avatar_url: "/candidates/bennett.jpg",
    party: "ימינה",
    expertise: ["טכנולוגיה", "יזמות", "ביטחון"],
    experience: "רה״מ לשעבר, יזם טק, קצין יחידה מובחרת",
    bio: "מייצג את הימין החדש והטכנולוגי",
    wikipedia_url: "https://en.wikipedia.org/wiki/Naftali_Bennett"
  },
  {
    name: "בני גנץ",
    avatar_url: "/candidates/gantz.jpg",
    party: "כחול לבן",
    expertise: ["ביטחון", "הגנה", "מנהיגות צבאית"],
    experience: "רמטכ״ל לשעבר, שר הביטחון לשעבר",
    bio: "גנרל מוערך, מוביל המחנה הביטחוני המתון",
    wikipedia_url: "https://en.wikipedia.org/wiki/Benny_Gantz"
  },
  {
    name: "גדעון סער",
    avatar_url: "/candidates/saar.jpg",
    party: "תקווה חדשה",
    expertise: ["חינוך", "חקיקה", "מדיניות ציבורית"],
    experience: "שר החינוך לשעבר, יו״ר הכנסת לשעבר",
    bio: "פוליטיקאי ותיק עם ניסיון בתחומי חברה וחינוך",
    wikipedia_url: "https://en.wikipedia.org/wiki/Gideon_Sa%27ar"
  },
  {
    name: "אביגדור ליברמן",
    avatar_url: "/candidates/lieberman.jpg",
    party: "ישראל ביתנו",
    expertise: ["ביטחון", "מדיניות חוץ", "כלכלה"],
    experience: "שר הביטחון לשעבר, שר החוץ לשעבר",
    bio: "מייצג את הציבור הרוסי, ידוע בעמדות חד משמעיות",
    wikipedia_url: "https://en.wikipedia.org/wiki/Avigdor_Lieberman"
  },
  {
    name: "איתמר בן-גביר",
    avatar_url: "/candidates/ben-gvir.jpg",
    party: "עוצמה יהודית",
    expertise: ["משפט", "ביטחון פנים", "מדיניות לאומית"],
    experience: "שר הביטחון הלאומי, עורך דין",
    bio: "מוביל הימין הלאומי, פעיל למען יהודי יו״ש",
    wikipedia_url: "https://en.wikipedia.org/wiki/Itamar_Ben-Gvir"
  },
  {
    name: "ציפי לבני",
    avatar_url: "/candidates/livni.jpg",
    party: "התנועה",
    expertise: ["משפט", "דיפלומטיה", "שלום"],
    experience: "שרת החוץ לשעבר, עורכת דין, מתווכת שלום",
    bio: "מובילת השמאל המתון, חסידת תהליכי השלום",
    wikipedia_url: "https://en.wikipedia.org/wiki/Tzipi_Livni"
  },
  {
    name: "אהוד ברק",
    avatar_url: "/candidates/barak.jpg",
    party: "העבודה",
    expertise: ["ביטחון", "מנהיגות", "אסטרטגיה"],
    experience: "רה״מ לשעבר, רמטכ״ל לשעבר, החייל המעוטר ביותר",
    bio: "מנהיג ביטחוני מנוסה עם ניסיון ממשלתי עשיר",
    wikipedia_url: "https://en.wikipedia.org/wiki/Ehud_Barak"
  },
  {
    name: "איילת שקד",
    avatar_url: "/candidates/shaked.jpg",
    party: "ימינה",
    expertise: ["משפט", "חקיקה", "זכויות אדם"],
    experience: "שרת המשפטים לשעבר, שרת הפנים לשעבר",
    bio: "יוריסטית מובילה, חלוצת הרפורמה במערכת המשפט",
    wikipedia_url: "https://en.wikipedia.org/wiki/Ayelet_Shaked"
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Clear existing data
    await supabaseClient
      .from('prime_minister_candidates')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert new candidates
    const { error } = await supabaseClient
      .from('prime_minister_candidates')
      .insert(candidates);

    if (error) {
      console.error('Error inserting candidates:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: 'Successfully populated PM candidates',
        count: candidates.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});