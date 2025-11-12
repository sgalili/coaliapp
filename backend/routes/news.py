from fastapi import APIRouter, HTTPException, Query, Body
from typing import List
import logging
from datetime import datetime
from models.news import NewsCategory, NewsSearchResponse, VoteRequest, CommentRequest
from services.news_service import NewsService
import os

router = APIRouter()
logger = logging.getLogger(__name__)

# Initialize news service
news_service = NewsService(api_key=os.getenv("PERPLEXITY_API_KEY", ""))

@router.get(
    "/by-category/{category}",
    response_model=NewsSearchResponse,
    summary="Fetch news by category"
)
async def get_news_by_category(
    category: NewsCategory,
    max_results: int = Query(5, ge=1, le=10)
):
    """Fetch Hebrew news articles for a specific category."""
    try:
        return await news_service.fetch_news_by_category(
            category=category,
            max_results=max_results
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error fetching news: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch news")

@router.get(
    "/all-categories",
    summary="Get news from all categories"
)
async def get_all_categories_news(
    max_per_category: int = Query(5, ge=1, le=10)
):
    """Fetch news from all categories."""
    try:
        results = {}
        for category in NewsCategory:
            try:
                response = await news_service.fetch_news_by_category(
                    category=category,
                    max_results=max_per_category
                )
                results[category.value] = response.dict()
            except Exception as e:
                logger.error(f"Error fetching {category}: {str(e)}")
                results[category.value] = {"error": str(e), "articles": []}
        
        return {
            "categories": results,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error aggregating news: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to aggregate news")

@router.get("/categories")
async def get_categories():
    """Get list of supported categories."""
    return {
        "categories": [
            {"id": cat.value, "label": cat.value}
            for cat in NewsCategory
        ]
    }

@router.post("/vote")
async def vote_on_news(vote: VoteRequest = Body(...)):
    """Vote on a news poll option."""
    try:
        result = await news_service.add_vote(
            news_id=vote.news_id,
            option_id=vote.option_id,
            user_id=vote.user_id
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error voting: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to record vote")

@router.post("/comment")
async def add_expert_comment(comment: CommentRequest = Body(...)):
    """Add expert video comment to news."""
    try:
        result = await news_service.add_expert_comment(
            news_id=comment.news_id,
            user_id=comment.user_id,
            user_name=comment.user_name,
            user_avatar=comment.user_avatar,
            video_url=comment.video_url,
            trust_score=comment.trust_score
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error adding comment: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to add comment")

@router.get("/{news_id}")
async def get_news_by_id(news_id: str):
    """Get a single news article by ID."""
    try:
        article = await news_service.get_news_by_id(news_id)
        if not article:
            raise HTTPException(status_code=404, detail="News not found")
        return article
    except Exception as e:
        logger.error(f"Error fetching news by ID: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch news")
