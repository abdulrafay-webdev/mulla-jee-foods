from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime

from app.core.database import get_session
from app.models.order import Order, OrderItem
from app.models.customer import Customer
from app.models.menu_item import MenuItem
from app.models.restaurant_settings import RestaurantSettings
from app.models.user import User
from app.schemas.order import OrderCreate, OrderOut, OrderItemOut, OrderStatusUpdate
from app.routers.auth import get_current_user

router = APIRouter(prefix="/orders", tags=["Orders"])

def format_order_out(order: Order, session: Session) -> OrderOut:
    statement = select(OrderItem).where(OrderItem.order_id == order.id)
    items = session.exec(statement).all()
    items_out = [
        OrderItemOut(
            id=i.id,
            menu_item_id=i.menu_item_id,
            item_name=i.item_name,
            unit_price=i.unit_price,
            quantity=i.quantity,
            customizations=i.customizations,
            total_price=i.total_price
        )
        for i in items
    ]
    return OrderOut(
        id=order.id,
        customer_id=order.customer_id,
        customer_name=order.customer_name,
        customer_phone=order.customer_phone,
        delivery_address=order.delivery_address,
        order_type=order.order_type,
        payment_method=order.payment_method,
        subtotal=order.subtotal,
        delivery_fee=order.delivery_fee,
        tax=order.tax,
        total_price=order.total_price,
        status=order.status,
        order_note=order.order_note,
        estimated_time_minutes=order.estimated_time_minutes,
        created_at=order.created_at,
        items=items_out
    )

@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(order_in: OrderCreate, session: Session = Depends(get_session)):
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")
        
    # Get settings for delivery fee and tax
    settings = session.exec(select(RestaurantSettings)).first()
    delivery_fee = settings.delivery_fee if settings and order_in.order_type == "delivery" else 0.0
    tax_rate = (settings.tax_rate / 100.0) if settings else 0.05
    
    # Check or create customer
    statement = select(Customer).where(Customer.phone == order_in.customer_phone)
    customer = session.exec(statement).first()
    if not customer:
        customer = Customer(
            name=order_in.customer_name,
            phone=order_in.customer_phone,
            address=order_in.delivery_address,
            email=order_in.customer_email
        )
        session.add(customer)
        session.commit()
        session.refresh(customer)
    else:
        # Update address
        customer.name = order_in.customer_name
        customer.address = order_in.delivery_address
        session.add(customer)
        session.commit()

    # Calculate item totals
    subtotal = 0.0
    order_items_to_create = []
    
    for item_data in order_in.items:
        menu_item = session.get(MenuItem, item_data.menu_item_id)
        if not menu_item or not menu_item.is_available:
            raise HTTPException(
                status_code=400,
                detail=f"Menu item ID {item_data.menu_item_id} is unavailable or does not exist"
            )
            
        price = menu_item.discount_price if menu_item.discount_price else menu_item.price
        line_total = round(price * item_data.quantity, 2)
        subtotal += line_total
        
        order_items_to_create.append({
            "menu_item_id": menu_item.id,
            "item_name": menu_item.name,
            "unit_price": price,
            "quantity": item_data.quantity,
            "customizations": item_data.customizations,
            "total_price": line_total
        })

    tax_amount = round(subtotal * tax_rate, 2)
    total_price = round(subtotal + delivery_fee + tax_amount, 2)

    order = Order(
        customer_id=customer.id,
        customer_name=order_in.customer_name,
        customer_phone=order_in.customer_phone,
        delivery_address=order_in.delivery_address,
        order_type=order_in.order_type,
        payment_method=order_in.payment_method,
        subtotal=subtotal,
        delivery_fee=delivery_fee,
        tax=tax_amount,
        total_price=total_price,
        status="Pending",
        order_note=order_in.order_note,
        estimated_time_minutes=35 if order_in.order_type == "delivery" else 20
    )
    session.add(order)
    session.commit()
    session.refresh(order)

    # Save order items
    for item_dict in order_items_to_create:
        item = OrderItem(order_id=order.id, **item_dict)
        session.add(item)
    session.commit()

    return format_order_out(order, session)

@router.get("/{order_id}", response_model=OrderOut)
def get_order_by_id(order_id: int, session: Session = Depends(get_session)):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    return format_order_out(order, session)

@router.get("", response_model=List[OrderOut])
def get_all_orders(
    status_filter: Optional[str] = None,
    order_type: Optional[str] = None,
    limit: int = 100,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(Order).order_by(Order.created_at.desc())
    if status_filter:
        statement = statement.where(Order.status == status_filter)
    if order_type:
        statement = statement.where(Order.order_type == order_type)
        
    orders = session.exec(statement.limit(limit)).all()
    return [format_order_out(o, session) for o in orders]

@router.patch("/{order_id}/status", response_model=OrderOut)
def update_order_status(
    order_id: int,
    status_in: OrderStatusUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    valid_statuses = ["Pending", "Preparing", "Ready", "Out for Delivery", "Delivered", "Cancelled"]
    if status_in.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid_statuses}")
        
    order.status = status_in.status
    session.add(order)
    session.commit()
    session.refresh(order)
    
    return format_order_out(order, session)
