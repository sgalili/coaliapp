// NewsAPI Integration for fetching Israeli news
// Get your API key from: https://newsapi.org/register

// TODO: Replace with your actual NewsAPI key
const NEWSAPI_KEY = 'PASTE_YOUR_NEWSAPI_KEY_HERE';
const NEWSAPI_BASE_URL = 'https://newsapi.org/v2';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    id: string;
    name: string;
  };
  category: string;
  categoryLabel: string;
}

// Map Hebrew categories to NewsAPI English categories
const categoryMap: Record<string, string> = {
  'הכל': 'general',
  'פוליטיקה': 'politics',
  'טכנולוגיה': 'technology',
  'כלכלה': 'business',
  'בריאות': 'health',
  'חברה': 'general',
  'בטחון': 'general',
  'תרבות': 'entertainment',
};

export const fetchNewsFromAPI = async (
  category: string = 'הכל',
  page: number = 1,
  pageSize: number = 5
): Promise<NewsArticle[]> => {
  try {
    if (!NEWSAPI_KEY || NEWSAPI_KEY === 'PASTE_YOUR_NEWSAPI_KEY_HERE') {
      console.warn('NewsAPI key not configured. Using demo data.');
      return [];
    }

    const englishCategory = categoryMap[category] || 'general';
    
    // Fetch Israeli news from NewsAPI
    const url = `${NEWSAPI_BASE_URL}/top-headlines?country=il&category=${englishCategory}&page=${page}&pageSize=${pageSize}&apiKey=${NEWSAPI_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error(data.message || 'Failed to fetch news');
    }
    
    // Transform NewsAPI response to our format
    return data.articles.map((article: any, index: number) => ({
      id: `newsapi-${Date.now()}-${index}`,
      title: article.title,
      description: article.description || article.content || '',
      url: article.url,
      urlToImage: article.urlToImage || `https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=400&fit=crop`,
      publishedAt: article.publishedAt,
      source: article.source,
      category: category,
      categoryLabel: category,
      content: article.description || article.content || '',
      experts: [], // Will be populated separately
      poll_options: [
        { id: "1", label: "תומך", value: 0 },
        { id: "2", label: "מתנגד", value: 0 },
        { id: "3", label: "צריך שינויים", value: 0 },
        { id: "4", label: "לא בטוח", value: 0 },
      ],
    }));
  } catch (error) {
    console.error('NewsAPI Error:', error);
    return [];
  }
};

// Function to combine NewsAPI with Perplexity news
export const fetchCombinedNews = async (
  category: string,
  useNewsAPI: boolean = false
): Promise<NewsArticle[]> => {
  if (useNewsAPI && NEWSAPI_KEY && NEWSAPI_KEY !== 'PASTE_YOUR_NEWSAPI_KEY_HERE') {
    return fetchNewsFromAPI(category, 1, 5);
  }
  
  // Fallback to Perplexity or demo data
  return [];
};
