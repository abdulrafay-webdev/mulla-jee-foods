from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class OrderItemCreate(BaseModel):
    menu_item_id: int
    quantity: int
    customizations: Optional[str] = None # e.g. "Size: Large, Extra Cheese"

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    delivery_address: str
    customer_email: Optional[str] = None
    order_type: str = "delivery" # delivery or pickup
    payment_method: str = "cash" # cash or online
    order_note: Optional[str] = None # Special instructions: "no onions", "extra spicy"
    items: List[OrderItemCreate]

class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    menu_item_id: int
    item_name: str
    unit_price: float
    quantity: int
    customizations: Optional[str] = None
    total_price: float

class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    customer_id: Optional[int] = None
    customer_name: str
    customer_phone: str
    delivery_address: str
    order_type: str
    payment_method: str
    subtotal: float
    delivery_fee: float
    tax: float
    total_price: float
    status: str
    order_note: Optional[str] = None
    estimated_time_minutes: int
    created_at: datetime
    items: List[OrderItemOut] = []

class OrderStatusUpdate(BaseModel):
    status: str # Pending, Preparing, Ready, Out for Delivery, Delivered, Cancelled
