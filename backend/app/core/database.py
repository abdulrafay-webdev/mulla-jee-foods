from sqlmodel import SQLModel, create_engine, Session, text
from app.core.config import settings

# Fix Neon Postgres URL prefix for Vercel Serverless Python (use pure-python pg8000 driver)
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+pg8000://", 1)
elif db_url.startswith("postgresql://") and not db_url.startswith("postgresql+"):
    db_url = db_url.replace("postgresql://", "postgresql+pg8000://", 1)

connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(db_url, echo=False, connect_args=connect_args)

def init_db():
    try:
        SQLModel.metadata.create_all(engine)
        with engine.connect() as conn:
            conn.execute(text('ALTER TABLE "order" ADD COLUMN IF NOT EXISTS order_note VARCHAR;'))
            conn.commit()
    except Exception as e:
        print("--> DB init note:", e)

def get_session():
    with Session(engine) as session:
        yield session
