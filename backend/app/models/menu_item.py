from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class MenuItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    category_id: int = Field(foreign_key="category.id", index=True)
    name: str = Field(index=True)
    description: Optional[str] = None
    price: float
    discount_price: Optional[float] = None
    image_url: Optional[str] = None
    is_available: bool = Field(default=True)
    is_featured: bool = Field(default=False)
    # JSON encoded options, e.g. [{"name": "Size", "options": [{"label": "Small", "price": 0}, {"label": "Large", "price": 200}]}]
    customization_options: Optional[str] = None 
    created_at: datetime = Field(default_factory=datetime.utcnow)
