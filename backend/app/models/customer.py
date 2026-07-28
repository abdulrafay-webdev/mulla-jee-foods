from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class Customer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    phone: str = Field(index=True)
    address: str
    email: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
