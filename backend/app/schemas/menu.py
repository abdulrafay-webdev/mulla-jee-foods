from pydantic import BaseModel
from typing import Optional, List, Any

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None

class CategoryOut(CategoryBase):
    id: int

# MenuItem Schemas
class MenuItemBase(BaseModel):
    category_id: int
    name: str
    description: Optional[str] = None
    price: float
    discount_price: Optional[float] = None
    image_url: Optional[str] = None
    is_available: bool = True
    is_featured: bool = False
    customization_options: Optional[str] = None # JSON string format

class MenuItemCreate(MenuItemBase):
    pass

class MenuItemUpdate(BaseModel):
    category_id: Optional[int] = None
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    discount_price: Optional[float] = None
    image_url: Optional[str] = None
    is_available: Optional[bool] = None
    is_featured: Optional[bool] = None
    customization_options: Optional[str] = None

class MenuItemOut(MenuItemBase):
    id: int
    category_name: Optional[str] = None
