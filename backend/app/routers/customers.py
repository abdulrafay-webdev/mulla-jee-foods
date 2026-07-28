from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional

from app.core.database import get_session
from app.models.customer import Customer
from app.models.order import Order, OrderItem
from app.models.user import User
from app.schemas.order import OrderOut, OrderItemOut
from app.routers.auth import get_current_user

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.get("", response_model=List[dict])
def list_customers(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    customers = session.exec(select(Customer).order_by(Customer.created_at.desc())).all()
    results = []
    for c in customers:
        # Calculate total orders & spent
        orders = session.exec(select(Order).where(Order.customer_id == c.id)).all()
        total_orders = len(orders)
        total_spent = sum(o.total_price for o in orders if o.status != "Cancelled")
        
        c_dict = c.model_dump()
        c_dict["total_orders"] = total_orders
        c_dict["total_spent"] = round(total_spent, 2)
        results.append(c_dict)
    return results

@router.get("/{customer_id}/orders", response_model=List[OrderOut])
def get_customer_orders(
    customer_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    customer = session.get(Customer, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
        
    orders = session.exec(select(Order).where(Order.customer_id == customer_id).order_by(Order.created_at.desc())).all()
    results = []
    for order in orders:
        items_stmt = select(OrderItem).where(OrderItem.order_id == order.id)
        items = session.exec(items_stmt).all()
        order_dict = order.model_dump()
        order_dict["items"] = [OrderItemOut(**i.model_dump()) for i in items]
        results.append(OrderOut(**order_dict))
    return results
