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
    const key = Deno.env.get("PERPLEXITY_API_KEY");
    if (!key) throw new Error("Missing PERPLEXITY_API_KEY");

    const queryByCategory: Record<string, string> = {
      politics: "Israel politics most popular recent video news from last 7 days",
      economy: "Israel economy finance most popular recent video news from last 7 days",
      technology: "Israel technology startups most popular recent video news from last 7 days",
      health: "Israel health medical most popular recent video news from last 7 days",
      business: "Israel business entrepreneurship most popular recent video news from last 7 days",
      culture: "Israel culture entertainment most popular recent video news from last 7 days",
      society: "Israel society social community most popular recent video news from last 7 days",
    };

    const search = queryByCategory[category] ?? queryByCategory.politics;

    const resp = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          {
            role: "system",
            content:
              "Return ONLY a valid JSON array (no prose) with 3-5 items. Each item: id, title, description, url, thumbnail, source, publishedAt (ISO). The 'url' MUST be a direct playable video file (mp4, webm, m3u8) and not a webpage or YouTube link. Prefer reputable news CDNs.",
          },
          {
            role: "user",
            content: `${search}. Output strictly as JSON array with direct mp4/webm/m3u8 links.`,
          },
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 1200,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: "week",
        // Prefer domains that often host direct video assets
        search_domain_filter: [
          "akamaihd.net",
          "akamaized.net",
          "cdn-",
          "nyt.com",
          "nytimes.com",
          "washingtonpost.com",
          "guardian.co.uk",
          "haaretz.co.il",
          "ynet.co.il",
          "bbc.co.uk",
          "bbc.com",
          "reuters.com",
          "apnews.com"
        ]
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("Perplexity error:", resp.status, t);
      throw new Error(`Perplexity ${resp.status}`);
    }

    const json = await resp.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "";

    let videos: VideoItem[] = [];
    try {
      const match = content.match(/\[[\s\S]*\]/);
      if (match) videos = JSON.parse(match[0]);
    } catch (e) {
      console.error("Parse error", e);
    }

    // If model didn't comply, return empty list (no placeholders)
    if (!Array.isArray(videos) || videos.length === 0) {
      videos = [];
    }

    // Ensure max 5
    videos = videos.slice(0, 5);

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

function fallback(category: string): VideoItem[] {
  const now = Date.now();
  const items: VideoItem[] = [
    {
      id: `${category}-1`,
      title: `${capitalize(category)} Headlines`,
      description: "Latest developments",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnail: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=400&fit=crop",
      source: "Sample News",
      publishedAt: new Date(now).toISOString(),
    },
    {
      id: `${category}-2`,
      title: `${capitalize(category)} Deep Dive`,
      description: "Expert analysis",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnail: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop",
      source: "Sample News",
      publishedAt: new Date(now - 86400000).toISOString(),
    },
    {
      id: `${category}-3`,
      title: `${capitalize(category)} Report`,
      description: "Comprehensive coverage",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop",
      source: "Sample News",
      publishedAt: new Date(now - 2 * 86400000).toISOString(),
    },
    {
      id: `${category}-4`,
      title: `${capitalize(category)} Weekly Roundup`,
      description: "Top stories",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
      source: "Sample News",
      publishedAt: new Date(now - 3 * 86400000).toISOString(),
    },
    {
      id: `${category}-5`,
      title: `${capitalize(category)} Special`,
      description: "Exclusive footage",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop",
      source: "Sample News",
      publishedAt: new Date(now - 4 * 86400000).toISOString(),
    },
  ];
  return items;
}

function capitalize(s: string) {
  return (s ?? "").charAt(0).toUpperCase() + (s ?? "").slice(1);
}
