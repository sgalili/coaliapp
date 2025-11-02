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

    const categoryKeywords: Record<string, string> = {
      politics: "פוליטיקה ישראל",
      economy: "כלכלה ישראל",
      technology: "טכנולוגיה ישראל",
      health: "בריאות ישראל",
      culture: "תרבות ישראל",
      society: "חברה ישראל",
      all: "ישראל חדשות"
    };

    const query = categoryKeywords[category] ?? categoryKeywords.all;
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=he&gl=IL&ceid=IL:he`;

    const resp = await fetch(url, { headers: { "User-Agent": "CoaliNewsBot/1.0" } });
    if (!resp.ok) {
      const t = await resp.text();
      console.error("Google News RSS error:", resp.status, t.slice(0, 200));
      return new Response(JSON.stringify({ videos: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const xml = await resp.text();

    const decode = (s: string = "") =>
      s
        .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .trim();

    const extract = (block: string, tag: string) => {
      const cdata = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i"));
      if (cdata?.[1]) return decode(cdata[1]);
      const normal = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
      return decode(normal?.[1] ?? "");
    };

    const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)).slice(0, 8);

    const videos: VideoItem[] = items.map((m, idx) => {
      const item = m[1];
      const title = extract(item, "title") || "ללא כותרת";
      const description = extract(item, "description") || "";
      const link = extract(item, "link");
      const pubDate = extract(item, "pubDate") || new Date().toISOString();
      const source = extract(item, "source") || "Google News";

      const mediaMatch = item.match(/<media:content[^>]*url=\"([^\"]+)\"/i);
      let thumbnail = mediaMatch?.[1] || "";
      if (!thumbnail) {
        const imgMatch = description.match(/<img[^>]+src=\"([^\"]+)\"/i);
        if (imgMatch) thumbnail = imgMatch[1];
      }
      if (!thumbnail) thumbnail = "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=400&fit=crop";

      return {
        id: `${category || "all"}-${idx}-${Date.now()}`,
        title,
        description: description.replace(/<[^>]*>/g, "").trim(),
        url: link,
        thumbnail,
        source,
        publishedAt: pubDate,
      };
    });

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
