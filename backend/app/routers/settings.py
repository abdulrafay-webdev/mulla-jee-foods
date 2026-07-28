from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.core.database import get_session
from app.models.restaurant_settings import RestaurantSettings
from app.models.user import User
from app.routers.auth import get_current_user

router = APIRouter(prefix="/settings", tags=["Restaurant Settings"])

@router.get("")
def get_restaurant_settings(session: Session = Depends(get_session)):
    settings = session.exec(select(RestaurantSettings)).first()
    if not settings:
        settings = RestaurantSettings()
        session.add(settings)
        session.commit()
        session.refresh(settings)
    return settings

@router.put("")
def update_restaurant_settings(
    settings_in: dict,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    settings = session.exec(select(RestaurantSettings)).first()
    if not settings:
        settings = RestaurantSettings()
        session.add(settings)
        session.commit()
        session.refresh(settings)

    for key, value in settings_in.items():
        if hasattr(settings, key) and key != "id":
            setattr(settings, key, value)
            
    session.add(settings)
    session.commit()
    session.refresh(settings)
    return settings
