from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class DeliveryArea(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    delivery_charge: float = Field(default=150.0)
    estimated_time_minutes: int = Field(default=35)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
