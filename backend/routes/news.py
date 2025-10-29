from fastapi import APIRouter, HTTPException, Query
from typing import List
import logging
from models.news import NewsCategory, NewsSearchResponse
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
