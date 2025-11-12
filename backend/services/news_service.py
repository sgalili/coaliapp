import os
import logging
from typing import List, Optional
from datetime import datetime
from openai import OpenAI
from models.news import NewsArticle, NewsCategory, NewsSearchResponse, PollOption, ExpertComment
from services.news_db_service import NewsDBService

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
    
    CATEGORY_LABELS = {
        NewsCategory.POLITICS: "פוליטיקה",
        NewsCategory.TECHNOLOGY: "טכנולוגיה",
        NewsCategory.ECONOMY: "כלכלה",
        NewsCategory.SOCIETY: "חברה",
        NewsCategory.HEALTH: "בריאות",
        NewsCategory.CULTURE: "תרבות",
    }
    
    def __init__(self, api_key: str):
        """Initialize news service with Perplexity API key."""
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://api.perplexity.ai"
        )
        self.logger = logger
        self.db_service = NewsDBService()
    
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
                # Generate image URL based on category and image description
                image_keywords = item.get('image_description', category.value).replace(' ', '-')
                image_url = f"https://images.unsplash.com/photo-{self._get_category_image_id(category)}?w=800&h=400&fit=crop&q=80"
                
                article_id = f"{category.value}_{idx}_{int(datetime.now().timestamp())}"
                article = NewsArticle(
                    id=article_id,
                    title=item.get('title', ''),
                    content=item.get('full_content', item.get('summary', item.get('content', ''))),
                    url=f"#/news/{article_id}",
                    category=category.value,
                    category_label=self.CATEGORY_LABELS.get(category, category.value),
                    source=item.get('source', 'Unknown'),
                    image=image_url,
                    published_at=datetime.now(),
                    expert_comments=[],
                    poll_options=self._generate_poll_options(item.get('title', '')),
                    total_votes=0
                )
                articles.append(article)
                
                # Save to MongoDB
                try:
                    await self.db_service.save_news(article)
                except Exception as e:
                    self.logger.error(f"Error saving news to DB: {str(e)}")
        except Exception as e:
            self.logger.error(f"Error parsing response: {str(e)}")
            # Return empty list if parsing fails
            
        return articles
    
    def _get_category_image_id(self, category: NewsCategory) -> str:
        """Get Unsplash image ID based on category."""
        category_images = {
            NewsCategory.POLITICS: '1495020689067-958852a7765e',
            NewsCategory.TECHNOLOGY: '1639762681485-074b7f938ba0',
            NewsCategory.ECONOMY: '1560518883-ce09059eeffa',
            NewsCategory.SOCIETY: '1529156069898-49953e39b3ac',
            NewsCategory.HEALTH: '1576091160550-2173dba999ef',
            NewsCategory.CULTURE: '1514306191717-452ec28c7814',
        }
        return category_images.get(category, '1495020689067-958852a7765e')
    
    def _generate_poll_options(self, title: str) -> List[dict]:
        """Generate poll options based on news title."""
        # Default poll options in Hebrew
        return [
            {"id": "1", "label": "תומך", "votes": 0, "voter_ids": []},
            {"id": "2", "label": "מתנגד", "votes": 0, "voter_ids": []},
            {"id": "3", "label": "צריך שינויים", "votes": 0, "voter_ids": []},
            {"id": "4", "label": "לא בטוח", "votes": 0, "voter_ids": []},
        ]
    
    async def add_vote(self, news_id: str, option_id: str, user_id: str, channel_id: str = "coali"):
        """Add vote to news poll."""
        return await self.db_service.add_vote(news_id, option_id, user_id, channel_id)
    
    async def add_expert_comment(
        self,
        news_id: str,
        user_id: str,
        user_name: str,
        user_avatar: str,
        video_url: str,
        trust_score: int = 0,
        channel_id: str = "coali"
    ):
        """Add expert comment to news."""
        return await self.db_service.add_expert_comment(
            news_id, user_id, user_name, user_avatar, video_url, trust_score, channel_id
        )
    
    async def get_news_by_id(self, news_id: str, channel_id: str = "coali"):
        """Get news by ID from database."""
        return await self.db_service.get_news_by_id(news_id, channel_id)
