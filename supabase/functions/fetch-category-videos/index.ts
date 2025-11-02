import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VideoItem {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  source: string;
  publishedAt: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { category } = await req.json();

    // Mock Israeli news data by category in Hebrew
    const mockNewsByCategory: Record<string, VideoItem[]> = {
      politics: [
        {
          id: `politics-1-${Date.now()}`,
          title: "הכנסת אישרה את חוק השידור החדש בקריאה שלישית",
          description: "הכנסת אישרה את חוק השידור החדש בקריאה שנייה ושלישית. השינויים החדשים צפויים להשפיע על עתיד התקשורת בישראל.",
          url: "https://www.mako.co.il/news",
          thumbnail: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=400&fit=crop",
          source: "חדשות 13",
          publishedAt: new Date().toISOString(),
        },
        {
          id: `politics-2-${Date.now()}`,
          title: "ראש הממשלה מציג תוכנית חדשה לביטחון הלאומי",
          description: "ראש הממשלה הציג היום תוכנית אסטרטגית חדשה לחיזוק הביטחון הלאומי והתמודדות עם איומים אזוריים.",
          url: "https://www.ynet.co.il",
          thumbnail: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&h=400&fit=crop",
          source: "ynet",
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: `politics-3-${Date.now()}`,
          title: "הממשלה מאשרת תקציב חדש לשנת 2026",
          description: "הממשלה אישרה את התקציב החדש לשנת 2026, תוך דגש על השקעות בתשתיות וחינוך.",
          url: "https://www.mako.co.il",
          thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop",
          source: "גלובס",
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
        },
      ],
      technology: [
        {
          id: `technology-1-${Date.now()}`,
          title: "ההייטק הישראלי שבר שיאים בהשקעות ב-2025",
          description: "בשנת 2025 שבר ההייטק הישראלי שיאים בהיקף ההשקעות והאקזיטים, כאשר תחום הסייבר מוביל עם כ-30% מההשקעות.",
          url: "https://www.calcalist.co.il",
          thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
          source: "כלכליסט",
          publishedAt: new Date().toISOString(),
        },
        {
          id: `technology-2-${Date.now()}`,
          title: "חברת AI ישראלית גייסה 100 מיליון דולר",
          description: "סטארט-אפ ישראלי בתחום הבינה המלאכותית הצליח לגייס 100 מיליון דולר בסבב מימון מרשים.",
          url: "https://www.globes.co.il",
          thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
          source: "גלובס",
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ],
      economy: [
        {
          id: `economy-1-${Date.now()}`,
          title: "עליה במחירי הדיור - מה הפתרונות האפשריים?",
          description: "מחירי הדיור בישראל ממשיכים לעלות. המומחים דנים בפתרונות אפשריים למשבר.",
          url: "https://www.globes.co.il",
          thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop",
          source: "גלובס",
          publishedAt: new Date().toISOString(),
        },
        {
          id: `economy-2-${Date.now()}`,
          title: "הבנק המרכזי מעלה את הריבית ב-0.25%",
          description: "בנק ישראל החליט להעלות את הריבית ב-0.25 אחוזים בניסיון לבלום את האינפלציה.",
          url: "https://www.calcalist.co.il",
          thumbnail: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=400&fit=crop",
          source: "כלכליסט",
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ],
      society: [
        {
          id: `society-1-${Date.now()}`,
          title: "מחקר חדש על איכות החיים בישראל",
          description: "מחקר מקיף חדש בוחן את איכות החיים בערים השונות בישראל ומציע ממצאים מפתיעים.",
          url: "https://www.ynet.co.il",
          thumbnail: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=400&fit=crop",
          source: "ynet",
          publishedAt: new Date().toISOString(),
        },
      ],
      health: [
        {
          id: `health-1-${Date.now()}`,
          title: "פריצת דרך בטיפול במחלות כרוניות",
          description: "מחקר חדש שפורסם היום מראה כי שינויים פשוטים בהרגלי התזונה יכולים להוביל לשיפור משמעותי בבריאות.",
          url: "https://www.haaretz.co.il",
          thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop",
          source: "הארץ",
          publishedAt: new Date().toISOString(),
        },
      ],
      culture: [
        {
          id: `culture-1-${Date.now()}`,
          title: "פסטיבל תרבות חדש מושק בתל אביב",
          description: "פסטיבל תרבות חדש ומגוון יתקיים בתל אביב החודש, עם אמנים מכל העולם.",
          url: "https://www.mako.co.il",
          thumbnail: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=400&fit=crop",
          source: "מקו",
          publishedAt: new Date().toISOString(),
        },
      ],
    };

    const videos = mockNewsByCategory[category] || mockNewsByCategory.politics;

    return new Response(JSON.stringify({ videos }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("fetch-category-videos failure:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "error", videos: [] }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
