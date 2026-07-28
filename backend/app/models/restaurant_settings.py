from typing import Optional
from sqlmodel import SQLModel, Field

class RestaurantSettings(SQLModel, table=True):
    id: Optional[int] = Field(default=1, primary_key=True)
    name: str = Field(default="Fast Bites Fast Food")
    tagline: str = Field(default="Hot, Fresh & Delicious Fast Food")
    phone: str = Field(default="+1 800-555-FOOD")
    email: str = Field(default="info@fastbites.com")
    address: str = Field(default="123 Flavor Street, Foodville")
    opening_hours: str = Field(default="10:00 AM - 11:00 PM")
    delivery_fee: float = Field(default=50.0)
    tax_rate: float = Field(default=5.0) # Percentage (e.g. 5%)
    currency_symbol: str = Field(default="Rs. ")
    is_open: bool = Field(default=True)
