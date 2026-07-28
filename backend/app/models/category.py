from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    slug: str = Field(index=True, unique=True)
    description: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: int = Field(default=0)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
