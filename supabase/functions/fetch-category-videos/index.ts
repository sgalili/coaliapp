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
    const key = Deno.env.get("NEWS_API_KEY");
    if (!key) throw new Error("Missing NEWS_API_KEY");

    const categoryKeywords: Record<string, string> = {
      politics: "פוליטיקה ישראל",
      economy: "כלכלה ישראל",
      technology: "טכנולוגיה ישראל",
      health: "בריאות ישראל",
      business: "עסקים ישראל",
      culture: "תרבות ישראל",
      society: "חברה ישראל",
    };

    const query = categoryKeywords[category] ?? categoryKeywords.politics;

    // NewsAPI call
    const resp = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=he&sortBy=publishedAt&pageSize=5&apiKey=${key}`
    );

    if (!resp.ok) {
      const t = await resp.text();
      console.error("NewsAPI error:", resp.status, t);
      return new Response(JSON.stringify({ videos: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const json = await resp.json();
    const articles = json.articles || [];

    const videos: VideoItem[] = articles.map((article: any, idx: number) => ({
      id: `${category}-${idx}-${Date.now()}`,
      title: article.title || "ללא כותרת",
      description: article.description || article.content || "",
      url: article.url || "",
      thumbnail: article.urlToImage || "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=400&fit=crop",
      source: article.source?.name || "חדשות",
      publishedAt: article.publishedAt || new Date().toISOString(),
    }));

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
