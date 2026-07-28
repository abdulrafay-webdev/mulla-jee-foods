from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional

from app.core.database import get_session
from app.models.delivery_area import DeliveryArea
from app.models.user import User
from app.routers.auth import get_current_user

router = APIRouter(prefix="/delivery-areas", tags=["Delivery Areas"])

@router.get("", response_model=List[DeliveryArea])
def get_public_delivery_areas(session: Session = Depends(get_session)):
    statement = select(DeliveryArea).where(DeliveryArea.is_active == True).order_by(DeliveryArea.name)
    return session.exec(statement).all()

@router.get("/admin", response_model=List[DeliveryArea])
def get_admin_delivery_areas(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(DeliveryArea).order_by(DeliveryArea.name)
    return session.exec(statement).all()

@router.post("", response_model=DeliveryArea, status_code=status.HTTP_201_CREATED)
def create_delivery_area(
    area_in: dict,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    name = area_in.get("name", "").strip()
    if not name:
        raise HTTPException(status_code=400, detail="Area name is required")
        
    existing = session.exec(select(DeliveryArea).where(DeliveryArea.name == name)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Delivery area already exists")

    area = DeliveryArea(
        name=name,
        delivery_charge=float(area_in.get("delivery_charge", 150.0)),
        estimated_time_minutes=int(area_in.get("estimated_time_minutes", 35)),
        is_active=bool(area_in.get("is_active", True))
    )
    session.add(area)
    session.commit()
    session.refresh(area)
    return area

@router.put("/{area_id}", response_model=DeliveryArea)
def update_delivery_area(
    area_id: int,
    area_in: dict,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    area = session.get(DeliveryArea, area_id)
    if not area:
        raise HTTPException(status_code=404, detail="Delivery area not found")

    for key, value in area_in.items():
        if hasattr(area, key) and key != "id":
            setattr(area, key, value)

    session.add(area)
    session.commit()
    session.refresh(area)
    return area

@router.patch("/{area_id}/toggle", response_model=DeliveryArea)
def toggle_delivery_area(
    area_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    area = session.get(DeliveryArea, area_id)
    if not area:
        raise HTTPException(status_code=404, detail="Delivery area not found")
        
    area.is_active = not area.is_active
    session.add(area)
    session.commit()
    session.refresh(area)
    return area

@router.delete("/{area_id}")
def delete_delivery_area(
    area_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    area = session.get(DeliveryArea, area_id)
    if not area:
        raise HTTPException(status_code=404, detail="Delivery area not found")
    session.delete(area)
    session.commit()
    return {"message": "Delivery area deleted successfully"}
