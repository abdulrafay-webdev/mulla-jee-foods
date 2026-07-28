from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field

class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    customer_id: Optional[int] = Field(default=None, foreign_key="customer.id", index=True)
    
    customer_name: str
    customer_phone: str
    delivery_address: str
    
    order_type: str = Field(default="delivery") # "delivery" | "pickup"
    payment_method: str = Field(default="cash") # "cash" | "online"
    
    subtotal: float
    delivery_fee: float = Field(default=0.0)
    tax: float = Field(default=0.0)
    total_price: float
    
    status: str = Field(default="Pending", index=True) # Pending, Preparing, Ready, Out for Delivery, Delivered, Cancelled
    order_note: Optional[str] = Field(default=None) # Customer special instructions e.g. "no onions", "extra spicy"
    
    estimated_time_minutes: int = Field(default=30)
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)

class OrderItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id", index=True)
    menu_item_id: int = Field(foreign_key="menuitem.id")
    
    item_name: str
    unit_price: float
    quantity: int
    customizations: Optional[str] = Field(default=None) # Selected sizes / extras in JSON or string format
    total_price: float
