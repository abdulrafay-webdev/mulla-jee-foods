import sys
import os

# Add directory paths to sys.path for Vercel Serverless environment compatibility
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

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
    try:
        init_db()
        seed_initial_data()
    except Exception as e:
        print("--> Startup init note:", e)

def seed_initial_data():
    try:
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
    except Exception as e:
        print("--> Seed data note:", e)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Mulla Jee Foods API",
        "docs": "/api/v1/docs"
    }
