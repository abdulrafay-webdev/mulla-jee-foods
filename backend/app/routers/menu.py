from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional

from app.core.database import get_session
from app.models.category import Category
from app.models.menu_item import MenuItem
from app.models.user import User
from app.schemas.menu import (
    CategoryCreate, CategoryUpdate, CategoryOut,
    MenuItemCreate, MenuItemUpdate, MenuItemOut
)
from app.routers.auth import get_current_user

router = APIRouter(prefix="/menu", tags=["Menu & Categories"])

# CATEGORIES
@router.get("/categories", response_model=List[CategoryOut])
def get_categories(session: Session = Depends(get_session)):
    statement = select(Category).where(Category.is_active == True).order_by(Category.sort_order)
    return session.exec(statement).all()

@router.get("/admin/categories", response_model=List[CategoryOut])
def get_all_categories_admin(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(Category).order_by(Category.sort_order)
    return session.exec(statement).all()

@router.post("/categories", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
def create_category(
    category_in: CategoryCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    category = Category.model_validate(category_in)
    session.add(category)
    session.commit()
    session.refresh(category)
    return category

@router.put("/categories/{category_id}", response_model=CategoryOut)
def update_category(
    category_id: int,
    category_in: CategoryUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    category = session.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = category_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(category, key, value)
        
    session.add(category)
    session.commit()
    session.refresh(category)
    return category

@router.delete("/categories/{category_id}")
def delete_category(
    category_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    category = session.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    session.delete(category)
    session.commit()
    return {"message": "Category deleted successfully"}


# MENU ITEMS
@router.get("/items", response_model=List[MenuItemOut])
def get_menu_items(
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    featured_only: bool = False,
    session: Session = Depends(get_session)
):
    statement = select(MenuItem).where(MenuItem.is_available == True)
    if category_id:
        statement = statement.where(MenuItem.category_id == category_id)
    if featured_only:
        statement = statement.where(MenuItem.is_featured == True)
    if search:
        statement = statement.where(MenuItem.name.ilike(f"%{search}%"))
        
    items = session.exec(statement).all()
    
    # Attach category_name
    categories = {c.id: c.name for c in session.exec(select(Category)).all()}
    result = []
    for item in items:
        item_dict = item.model_dump()
        item_dict["category_name"] = categories.get(item.category_id, "General")
        result.append(MenuItemOut(**item_dict))
    return result

@router.get("/admin/items", response_model=List[MenuItemOut])
def get_all_items_admin(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(MenuItem)
    items = session.exec(statement).all()
    
    categories = {c.id: c.name for c in session.exec(select(Category)).all()}
    result = []
    for item in items:
        item_dict = item.model_dump()
        item_dict["category_name"] = categories.get(item.category_id, "General")
        result.append(MenuItemOut(**item_dict))
    return result

@router.post("/items", response_model=MenuItemOut, status_code=status.HTTP_201_CREATED)
def create_menu_item(
    item_in: MenuItemCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    category = session.get(Category, item_in.category_id)
    if not category:
        raise HTTPException(status_code=400, detail="Invalid Category ID")
        
    item = MenuItem.model_validate(item_in)
    session.add(item)
    session.commit()
    session.refresh(item)
    
    item_dict = item.model_dump()
    item_dict["category_name"] = category.name
    return MenuItemOut(**item_dict)

@router.put("/items/{item_id}", response_model=MenuItemOut)
def update_menu_item(
    item_id: int,
    item_in: MenuItemUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    item = session.get(MenuItem, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
        
    update_data = item_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)
        
    session.add(item)
    session.commit()
    session.refresh(item)
    
    category = session.get(Category, item.category_id)
    item_dict = item.model_dump()
    item_dict["category_name"] = category.name if category else "General"
    return MenuItemOut(**item_dict)

@router.patch("/items/{item_id}/toggle-availability", response_model=MenuItemOut)
def toggle_item_availability(
    item_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    item = session.get(MenuItem, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    item.is_available = not item.is_available
    session.add(item)
    session.commit()
    session.refresh(item)
    
    category = session.get(Category, item.category_id)
    item_dict = item.model_dump()
    item_dict["category_name"] = category.name if category else "General"
    return MenuItemOut(**item_dict)

@router.delete("/items/{item_id}")
def delete_menu_item(
    item_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    item = session.get(MenuItem, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    session.delete(item)
    session.commit()
    return {"message": "Menu item deleted successfully"}
