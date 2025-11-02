import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VideoResult {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  source: string;
  publishedAt: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category } = await req.json();
    console.log('Fetching videos for category:', category);

    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');
    if (!PERPLEXITY_API_KEY) {
      throw new Error('PERPLEXITY_API_KEY not configured');
    }

    // Map categories to search queries
    const categoryQueries: Record<string, string> = {
      'politics': 'most popular political video news Israel politics פוליטיקה',
      'economy': 'most popular economy finance video news Israel כלכלה',
      'technology': 'most popular technology tech video news Israel טכנולוגיה',
      'health': 'most popular health medical video news Israel בריאות',
      'business': 'most popular business entrepreneurship video news Israel עסקים',
      'culture': 'most popular culture entertainment video news Israel תרבות',
      'society': 'most popular social society community video news Israel חברה'
    };

    const searchQuery = categoryQueries[category] || categoryQueries['politics'];

    console.log('Searching Perplexity with query:', searchQuery);

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that finds popular video news. Return ONLY a JSON array of exactly 5 video news items with id, title, description, url, thumbnail, source, and publishedAt fields. Make sure urls are valid video links from reputable news sources.'
          },
          {
            role: 'user',
            content: `Find 5 most popular recent video news about: ${searchQuery}. Return as JSON array with fields: id, title, description, url (must be actual video link), thumbnail (image url), source, publishedAt (ISO date string). Only include real, recent video news from the last 7 days.`
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 2000,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'week',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', response.status, errorText);
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Perplexity response:', JSON.stringify(data, null, 2));

    let videos: VideoResult[] = [];
    
    try {
      const content = data.choices[0].message.content;
      // Try to parse JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        videos = JSON.parse(jsonMatch[0]);
      } else {
        console.warn('Could not extract JSON array from response, using fallback data');
        videos = generateFallbackVideos(category);
      }
    } catch (parseError) {
      console.error('Error parsing Perplexity response:', parseError);
      videos = generateFallbackVideos(category);
    }

    // Ensure we have exactly 5 videos
    if (videos.length < 5) {
      videos = [...videos, ...generateFallbackVideos(category)].slice(0, 5);
    }

    console.log(`Returning ${videos.length} videos for category ${category}`);

    return new Response(JSON.stringify({ videos }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-category-videos function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        videos: generateFallbackVideos('politics')
      }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateFallbackVideos(category: string): VideoResult[] {
  const baseVideos = [
    {
      id: `${category}-1`,
      title: `Breaking News in ${category}`,
      description: 'Latest developments and analysis',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=400&fit=crop',
      source: 'News Network',
      publishedAt: new Date().toISOString()
    },
    {
      id: `${category}-2`,
      title: `${category} Update: Key Insights`,
      description: 'Expert analysis and commentary',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop',
      source: 'Global News',
      publishedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: `${category}-3`,
      title: `In-Depth: ${category} Trends`,
      description: 'Comprehensive coverage of recent events',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop',
      source: 'Daily Report',
      publishedAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: `${category}-4`,
      title: `${category} Weekly Roundup`,
      description: 'All the important stories from this week',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
      source: 'Week in Review',
      publishedAt: new Date(Date.now() - 259200000).toISOString()
    },
    {
      id: `${category}-5`,
      title: `${category} Special Report`,
      description: 'Investigation and exclusive footage',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop',
      source: 'Investigative Team',
      publishedAt: new Date(Date.now() - 345600000).toISOString()
    }
  ];

  return baseVideos;
}