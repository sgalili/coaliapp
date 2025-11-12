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

class PollOption(BaseModel):
    """Poll option with votes."""
    id: str
    label: str
    votes: int = 0
    voter_ids: List[str] = Field(default_factory=list)

class ExpertComment(BaseModel):
    """Expert video comment on news."""
    user_id: str
    user_name: str
    user_avatar: str
    video_url: str
    trust_score: int = 0
    created_at: datetime = Field(default_factory=datetime.now)

class NewsArticle(BaseModel):
    """Individual news article."""
    id: Optional[str] = None
    title: str = Field(..., description="Article title in Hebrew")
    content: str = Field(..., description="Article content/summary")
    url: Optional[str] = Field(None, description="Source URL")
    category: str = Field(..., description="News category")
    category_label: str = Field(..., description="Category label in Hebrew")
    source: Optional[str] = Field(None, description="News source")
    image: str = Field(..., description="News image URL")
    published_at: Optional[datetime] = Field(None, description="Publication timestamp")
    channel_id: str = Field(default="coali", description="Channel identifier")
    expert_comments: List[ExpertComment] = Field(default_factory=list, description="Expert video comments")
    poll_options: List[PollOption] = Field(default_factory=list, description="Poll options for this news")
    total_votes: int = Field(default=0, description="Total number of votes")
    
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

class VoteRequest(BaseModel):
    """Request to vote on a poll."""
    news_id: str
    option_id: str
    user_id: str

class CommentRequest(BaseModel):
    """Request to add expert comment."""
    news_id: str
    user_id: str
    user_name: str
    user_avatar: str
    video_url: str
    trust_score: int = 0
