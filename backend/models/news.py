from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class NewsCategory(str, Enum):
    """Supported Hebrew news categories."""
    POLITICS = "politics"
    TECHNOLOGY = "technology"
    ECONOMY = "economy"
    SOCIETY = "society"
    HEALTH = "health"
    CULTURE = "culture"

class NewsArticle(BaseModel):
    """Individual news article."""
    id: Optional[str] = None
    title: str = Field(..., description="Article title in Hebrew")
    content: str = Field(..., description="Article content/summary")
    url: Optional[str] = Field(None, description="Source URL")
    category: str = Field(..., description="News category")
    source: Optional[str] = Field(None, description="News source")
    published_at: Optional[datetime] = Field(None, description="Publication timestamp")
    expert_opinions: List[dict] = Field(default_factory=list, description="Expert opinions on this article")
    poll_options: List[dict] = Field(default_factory=list, description="Poll options for this news")
    
class NewsSearchRequest(BaseModel):
    """Request model for news search."""
    category: NewsCategory = Field(..., description="News category")
    max_results: int = Field(5, ge=1, le=10, description="Maximum results")
    
class NewsSearchResponse(BaseModel):
    """Response model for news search."""
    category: str
    articles: List[NewsArticle]
    total_count: int
    search_query: str
