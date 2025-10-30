import os
import logging
from typing import List, Optional
from datetime import datetime
from openai import OpenAI
from models.news import NewsArticle, NewsCategory, NewsSearchResponse

logger = logging.getLogger(__name__)

class NewsService:
    """Service for fetching Hebrew news using Perplexity API via OpenAI SDK."""
    
    CATEGORY_QUERIES = {
        NewsCategory.POLITICS: "חדשות פוליטיקה ישראל אחרונות היום",
        NewsCategory.TECHNOLOGY: "חדשות טכנולוגיה וחדשנות ישראל",
        NewsCategory.ECONOMY: "חדשות כלכלה וביזנס ישראל",
        NewsCategory.SOCIETY: "חדשות חברה וקהילה ישראל",
        NewsCategory.HEALTH: "חדשות בריאות ורפואה ישראל",
        NewsCategory.CULTURE: "חדשות תרבות ואומנות ישראל",
    }
    
    def __init__(self, api_key: str):
        """Initialize news service with Perplexity API key."""
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://api.perplexity.ai"
        )
        self.logger = logger
    
    async def fetch_news_by_category(
        self,
        category: NewsCategory,
        max_results: int = 5
    ) -> NewsSearchResponse:
        """
        Fetch news articles for a specific category using Perplexity.
        
        Args:
            category: News category
            max_results: Maximum number of results (1-10)
        
        Returns:
            NewsSearchResponse with articles
        """
        try:
            search_query = self.CATEGORY_QUERIES.get(category)
            if not search_query:
                raise ValueError(f"Unsupported category: {category}")
            
            self.logger.info(f"Fetching news for {category}: {search_query}")
            
            # Call Perplexity API using OpenAI SDK
            response = self.client.chat.completions.create(
                model="sonar",
                messages=[
                    {
                        "role": "system",
                        "content": "אתה עוזר חדשות שמחזיר חדשות מפורטות בפורמט JSON. החזר רק JSON תקין ללא טקסט נוסף."
                    },
                    {
                        "role": "user",
                        "content": f"""מצא את {max_results} החדשות החשובות והפופולריות ביותר בנושא: {search_query}

לכל חדשה, כלול:
- כותרת מלאה בעברית
- תקציר של 2-3 משפטים
- תוכן המאמר המלא (5-8 פסקאות)
- מקור החדשה
- תיאור לתמונה מתאימה

החזר בפורמט JSON הבא בלבד:
{{
    "articles": [
        {{
            "title": "כותרת מלאה בעברית",
            "summary": "תקציר קצר של החדשה",
            "full_content": "תוכן מלא של המאמר עם כל הפרטים...",
            "source": "שם המקור",
            "image_description": "תיאור התמונה המתאימה"
        }}
    ]
}}"""
                    }
                ],
                max_tokens=3000,
                temperature=0.2
            )
            
            # Parse response
            articles = self._parse_perplexity_response(
                response.choices[0].message.content,
                category
            )
            
            return NewsSearchResponse(
                category=category.value,
                articles=articles[:max_results],
                total_count=len(articles),
                search_query=search_query
            )
            
        except Exception as e:
            self.logger.error(f"Error fetching news: {str(e)}")
            raise
    
    def _parse_perplexity_response(self, content: str, category: NewsCategory) -> List[NewsArticle]:
        """Parse Perplexity response into NewsArticle objects."""
        import json
        
        articles = []
        try:
            # Extract JSON from response
            content = content.strip()
            if content.startswith('```json'):
                content = content[7:]
            if content.endswith('```'):
                content = content[:-3]
            content = content.strip()
            
            data = json.loads(content)
            
            for idx, item in enumerate(data.get('articles', [])):
                article = NewsArticle(
                    id=f"{category.value}_{idx}_{int(datetime.now().timestamp())}",
                    title=item.get('title', ''),
                    content=item.get('content', ''),
                    url=item.get('url', '#'),
                    category=category.value,
                    source=item.get('source', 'Unknown'),
                    published_at=datetime.now(),
                    expert_opinions=[],
                    poll_options=self._generate_poll_options(item.get('title', ''))
                )
                articles.append(article)
        except Exception as e:
            self.logger.error(f"Error parsing response: {str(e)}")
            # Return empty list if parsing fails
            
        return articles
    
    def _generate_poll_options(self, title: str) -> List[dict]:
        """Generate poll options based on news title."""
        # Default poll options in Hebrew
        return [
            {"id": "1", "label": "תומך", "value": 0},
            {"id": "2", "label": "מתנגד", "value": 0},
            {"id": "3", "label": "צריך שינויים", "value": 0},
            {"id": "4", "label": "לא בטוח", "value": 0},
        ]
