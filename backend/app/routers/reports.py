from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select, func
from typing import Optional
from datetime import datetime, date, timedelta

from app.core.database import get_session
from app.models.order import Order, OrderItem
from app.models.user import User
from app.routers.auth import get_current_user

router = APIRouter(prefix="/reports", tags=["Reports & Analytics"])

@router.get("/dashboard")
def get_dashboard_summary(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Today's orders
    today_orders_stmt = select(Order).where(Order.created_at >= today_start)
    today_orders = session.exec(today_orders_stmt).all()
    
    today_orders_count = len(today_orders)
    today_sales_total = sum(o.total_price for o in today_orders if o.status != "Cancelled")
    pending_orders_count = len([o for o in today_orders if o.status == "Pending"])
    
    # Popular items (Top 5)
    items_stmt = select(OrderItem.item_name, func.sum(OrderItem.quantity).label("total_qty"))\
        .group_by(OrderItem.item_name)\
        .order_by(func.sum(OrderItem.quantity).desc())\
        .limit(5)
    
    popular_items_raw = session.exec(items_stmt).all()
    popular_items = [{"name": item[0], "quantity": item[1]} for item in popular_items_raw]

    return {
        "today_orders_count": today_orders_count,
        "today_sales_total": round(today_sales_total, 2),
        "pending_orders_count": pending_orders_count,
        "popular_items": popular_items
    }

@router.get("/finance")
def get_finance_report(
    start_date: Optional[str] = Query(None, description="YYYY-MM-DD"),
    end_date: Optional[str] = Query(None, description="YYYY-MM-DD"),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(Order)
    
    if start_date:
        s_dt = datetime.strptime(start_date, "%Y-%m-%d")
        statement = statement.where(Order.created_at >= s_dt)
    if end_date:
        e_dt = datetime.strptime(end_date, "%Y-%m-%d") + timedelta(days=1)
        statement = statement.where(Order.created_at < e_dt)
        
    orders = session.exec(statement).all()
    
    valid_orders = [o for o in orders if o.status != "Cancelled"]
    
    total_orders_count = len(valid_orders)
    total_sales_amount = sum(o.total_price for o in valid_orders)
    
    delivery_orders = [o for o in valid_orders if o.order_type == "delivery"]
    pickup_orders = [o for o in valid_orders if o.order_type == "pickup"]
    
    cash_orders = [o for o in valid_orders if o.payment_method == "cash"]
    online_orders = [o for o in valid_orders if o.payment_method == "online"]
    
    return {
        "total_orders": total_orders_count,
        "total_sales": round(total_sales_amount, 2),
        "delivery_count": len(delivery_orders),
        "delivery_sales": round(sum(o.total_price for o in delivery_orders), 2),
        "pickup_count": len(pickup_orders),
        "pickup_sales": round(sum(o.total_price for o in pickup_orders), 2),
        "cash_count": len(cash_orders),
        "cash_sales": round(sum(o.total_price for o in cash_orders), 2),
        "online_count": len(online_orders),
        "online_sales": round(sum(o.total_price for o in online_orders), 2)
    }
