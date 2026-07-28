from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from app.core.config import settings
from app.core.database import init_db, engine
from app.core.security import get_password_hash
from app.models import User, Category, MenuItem, RestaurantSettings, DeliveryArea
from app.routers import auth, menu, orders, customers, reports, imagekit, settings as settings_router, delivery_area

app = FastAPI(
    title="Mulla Jee Foods API",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs"
)

# Global CORS middleware for all endpoints
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler to ensure CORS headers on 500 errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print("--> Global Exception caught:", exc)
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )

# Include routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(menu.router, prefix=settings.API_V1_STR)
app.include_router(orders.router, prefix=settings.API_V1_STR)
app.include_router(customers.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(imagekit.router, prefix=settings.API_V1_STR)
app.include_router(settings_router.router, prefix=settings.API_V1_STR)
app.include_router(delivery_area.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def on_startup():
    init_db()
    seed_initial_data()

def seed_initial_data():
    with Session(engine) as session:
        # Seed default admin if missing
        admin = session.exec(select(User).where(User.username == "admin")).first()
        if not admin:
            admin = User(
                username="admin",
                email="admin@mullajeefoods.com",
                full_name="Restaurant Admin",
                hashed_password=get_password_hash("admin123"),
                is_admin=True,
                is_active=True
            )
            session.add(admin)
            session.commit()
            print("--> Seeded default admin user (admin / admin123)")

        # Seed initial restaurant settings
        rest_settings = session.exec(select(RestaurantSettings)).first()
        if not rest_settings:
            rest_settings = RestaurantSettings(
                name="Mulla Jee Foods",
                tagline="Delicious Fast Food, Flame-Grilled Burgers & Crispy Delights",
                phone="+1 (800) 555-MULLA",
                email="orders@mullajeefoods.com",
                address="Main Commercial Avenue, Food City",
                opening_hours="11:00 AM - 11:30 PM",
                delivery_fee=150.0,
                tax_rate=5.0,
                currency_symbol="Rs. ",
                is_open=True
            )
            session.add(rest_settings)
            session.commit()
        else:
            rest_settings.name = "Mulla Jee Foods"
            rest_settings.email = "orders@mullajeefoods.com"
            session.add(rest_settings)
            session.commit()

        # Seed default delivery areas if empty
        if not session.exec(select(DeliveryArea)).first():
            areas_data = [
                {"name": "Gulshan-e-Iqbal", "delivery_charge": 150.0, "estimated_time_minutes": 30},
                {"name": "DHA Phase 5 & 6", "delivery_charge": 180.0, "estimated_time_minutes": 35},
                {"name": "Clifton Block 2 to 9", "delivery_charge": 180.0, "estimated_time_minutes": 35},
                {"name": "PECHS Block 2 & 6", "delivery_charge": 150.0, "estimated_time_minutes": 25},
                {"name": "North Nazimabad", "delivery_charge": 160.0, "estimated_time_minutes": 35},
                {"name": "Gulistan-e-Johar", "delivery_charge": 150.0, "estimated_time_minutes": 30},
                {"name": "Bahria Town Phase 1", "delivery_charge": 250.0, "estimated_time_minutes": 45},
            ]
            for a_data in areas_data:
                area = DeliveryArea(**a_data)
                session.add(area)
            session.commit()

        # Seed default categories & items if empty
        if not session.exec(select(Category)).first():
            categories_data = [
                {"name": "Burgers", "slug": "burgers", "description": "Juicy flame-grilled beef and crispy chicken burgers", "sort_order": 1, "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"},
                {"name": "Pizza", "slug": "pizza", "description": "Hand-crafted pizzas loaded with fresh mozzarella and toppings", "sort_order": 2, "image_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"},
                {"name": "Deals & Combos", "slug": "deals", "description": "Unbeatable value meals and mega saver family boxes", "sort_order": 3, "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"},
                {"name": "Sides & Fries", "slug": "sides", "description": "Golden fries, onion rings, nuggets & loaded nachos", "sort_order": 4, "image_url": "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80"},
                {"name": "Beverages", "slug": "beverages", "description": "Ice-cold sodas, thick milkshakes, and fresh juices", "sort_order": 5, "image_url": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80"},
                {"name": "Desserts", "slug": "desserts", "description": "Decadent chocolate lava cakes, sundaes, and donuts", "sort_order": 6, "image_url": "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80"}
            ]
            
            created_categories = {}
            for c_data in categories_data:
                cat = Category(**c_data)
                session.add(cat)
                session.commit()
                session.refresh(cat)
                created_categories[cat.slug] = cat.id

            # Seed Menu Items
            menu_items_data = [
                {
                    "category_id": created_categories["burgers"],
                    "name": "Smokey BBQ Monster Burger",
                    "description": "Double beef patty, crispy bacon, melted cheddar, caramelized onions, and signature BBQ sauce on a brioche bun.",
                    "price": 890.0,
                    "discount_price": 790.0,
                    "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
                    "is_available": True,
                    "is_featured": True
                },
                {
                    "category_id": created_categories["burgers"],
                    "name": "Crunchy Zinger Supreme",
                    "description": "Golden fried spicy chicken fillet, jalapenos, fresh lettuce, melted cheese & garlic mayo.",
                    "price": 650.0,
                    "image_url": "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80",
                    "is_available": True,
                    "is_featured": True
                },
                {
                    "category_id": created_categories["pizza"],
                    "name": "Supreme Meat Lovers Pizza",
                    "description": "Loaded with pepperoni, Italian sausage, smoked ham, beef, mozzarella, and house red sauce.",
                    "price": 1450.0,
                    "discount_price": 1290.0,
                    "image_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
                    "is_available": True,
                    "is_featured": True
                },
                {
                    "category_id": created_categories["deals"],
                    "name": "Mega Saver Feast Deal",
                    "description": "2 Monster Burgers, 1 Large Pepperoni Pizza, 2 Large Seasoned Fries & 1.5L Soft Drink.",
                    "price": 2990.0,
                    "discount_price": 2490.0,
                    "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
                    "is_available": True,
                    "is_featured": True
                },
                {
                    "category_id": created_categories["sides"],
                    "name": "Loaded Peri-Peri Fries",
                    "description": "Crispy golden fries tossed in fiery peri-peri seasoning and topped with warm cheese sauce & jalapenos.",
                    "price": 380.0,
                    "image_url": "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80",
                    "is_available": True,
                    "is_featured": False
                },
                {
                    "category_id": created_categories["beverages"],
                    "name": "Thick Belgian Chocolate Shake",
                    "description": "Rich dark chocolate ice cream blended with fresh milk, topped with whipped cream and cocoa powder.",
                    "price": 450.0,
                    "image_url": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
                    "is_available": True,
                    "is_featured": False
                }
            ]

            for item_data in menu_items_data:
                item = MenuItem(**item_data)
                session.add(item)
            session.commit()

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Mulla Jee Foods API",
        "docs": "/api/v1/docs"
    }
