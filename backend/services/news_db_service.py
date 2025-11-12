"""
MongoDB service for news storage and management.
"""
import os
import logging
from typing import List, Optional, Dict
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from models.news import NewsArticle, PollOption, ExpertComment

logger = logging.getLogger(__name__)

class NewsDBService:
    """Service for managing news in MongoDB."""
    
    def __init__(self):
        """Initialize MongoDB connection."""
        mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017")
        self.client = AsyncIOMotorClient(mongo_url)
        self.db = self.client.coali_news
        self.news_collection = self.db.news
        
    async def save_news(self, article: NewsArticle, channel_id: str = "coali") -> str:
        """Save or update news article in MongoDB."""
        try:
            article_dict = article.dict()
            article_dict["channel_id"] = channel_id
            article_dict["updated_at"] = datetime.now()
            
            if article.id:
                # Update existing
                await self.news_collection.update_one(
                    {"id": article.id, "channel_id": channel_id},
                    {"$set": article_dict},
                    upsert=True
                )
                return article.id
            else:
                # Insert new
                result = await self.news_collection.insert_one(article_dict)
                return str(result.inserted_id)
                
        except Exception as e:
            logger.error(f"Error saving news: {str(e)}")
            raise
    
    async def get_news_by_id(self, news_id: str, channel_id: str = "coali") -> Optional[Dict]:
        """Get news article by ID."""
        try:
            result = await self.news_collection.find_one({
                "id": news_id,
                "channel_id": channel_id
            })
            return result
        except Exception as e:
            logger.error(f"Error fetching news: {str(e)}")
            return None
    
    async def get_news_by_category(self, category: str, channel_id: str = "coali", limit: int = 10) -> List[Dict]:
        """Get news articles by category."""
        try:
            cursor = self.news_collection.find({
                "category": category,
                "channel_id": channel_id
            }).sort("published_at", -1).limit(limit)
            
            results = await cursor.to_list(length=limit)
            return results
        except Exception as e:
            logger.error(f"Error fetching news by category: {str(e)}")
            return []
    
    async def add_vote(self, news_id: str, option_id: str, user_id: str, channel_id: str = "coali") -> Dict:
        """Add a vote to a poll option."""
        try:
            # Check if user already voted
            news = await self.get_news_by_id(news_id, channel_id)
            if not news:
                raise ValueError("News not found")
            
            # Find if user already voted
            for option in news.get("poll_options", []):
                if user_id in option.get("voter_ids", []):
                    # User already voted, remove old vote
                    await self.news_collection.update_one(
                        {"id": news_id, "channel_id": channel_id},
                        {
                            "$pull": {f"poll_options.$[opt].voter_ids": user_id},
                            "$inc": {f"poll_options.$[opt].votes": -1, "total_votes": -1}
                        },
                        array_filters=[{"opt.id": option["id"]}]
                    )
            
            # Add new vote
            result = await self.news_collection.update_one(
                {"id": news_id, "channel_id": channel_id},
                {
                    "$addToSet": {f"poll_options.$[opt].voter_ids": user_id},
                    "$inc": {f"poll_options.$[opt].votes": 1, "total_votes": 1}
                },
                array_filters=[{"opt.id": option_id}]
            )
            
            # Get updated news
            updated_news = await self.get_news_by_id(news_id, channel_id)
            return {
                "success": True,
                "poll_options": updated_news.get("poll_options", []),
                "total_votes": updated_news.get("total_votes", 0)
            }
            
        except Exception as e:
            logger.error(f"Error adding vote: {str(e)}")
            raise
    
    async def add_expert_comment(
        self, 
        news_id: str, 
        user_id: str,
        user_name: str,
        user_avatar: str,
        video_url: str,
        trust_score: int = 0,
        channel_id: str = "coali"
    ) -> Dict:
        """Add expert video comment to news."""
        try:
            comment = {
                "user_id": user_id,
                "user_name": user_name,
                "user_avatar": user_avatar,
                "video_url": video_url,
                "trust_score": trust_score,
                "created_at": datetime.now()
            }
            
            result = await self.news_collection.update_one(
                {"id": news_id, "channel_id": channel_id},
                {"$push": {"expert_comments": comment}}
            )
            
            if result.modified_count == 0:
                raise ValueError("News not found or comment not added")
            
            return {
                "success": True,
                "comment": comment
            }
            
        except Exception as e:
            logger.error(f"Error adding comment: {str(e)}")
            raise
    
    async def save_news(self, news_data: dict) -> dict:
        """Save or update a news article."""
        try:
            news_id = news_data.get('id')
            channel_id = news_data.get('channel_id', 'העם')
            
            # Check if news already exists
            existing = await self.news_collection.find_one({
                "id": news_id,
                "channel_id": channel_id
            })
            
            if existing:
                # Update existing news
                logger.info(f"Updating existing news: {news_id}")
                await self.news_collection.update_one(
                    {"id": news_id, "channel_id": channel_id},
                    {"$set": news_data}
                )
            else:
                # Insert new news
                logger.info(f"Inserting new news: {news_id}")
                news_data['published_at'] = news_data.get('published_at', datetime.now().isoformat())
                await self.news_collection.insert_one(news_data)
            
            return news_data
        except Exception as e:
            logger.error(f"Error saving news: {str(e)}")
            raise
    
    async def get_all_news(self, channel_id: str = "coali", limit: int = 50) -> List[Dict]:
        """Get all news for a channel."""
        try:
            cursor = self.news_collection.find({
                "channel_id": channel_id
            }).sort("published_at", -1).limit(limit)
            
            results = await cursor.to_list(length=limit)
            return results
        except Exception as e:
            logger.error(f"Error fetching all news: {str(e)}")
            return []
