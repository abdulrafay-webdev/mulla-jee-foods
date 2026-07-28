from sqlmodel import SQLModel, create_engine, Session, text
from app.core.config import settings

# Fix Neon Postgres URL prefix if needed (postgres:// -> postgresql://)
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(db_url, echo=False, connect_args=connect_args)

def init_db():
    SQLModel.metadata.create_all(engine)
    # Ensure newly added columns like order_note exist on Neon Postgres tables
    try:
        with engine.connect() as conn:
            conn.execute(text('ALTER TABLE "order" ADD COLUMN IF NOT EXISTS order_note VARCHAR;'))
            conn.commit()
            print("--> Verified database migrations (order_note column).")
    except Exception as e:
        print("--> Table column check note:", e)

def get_session():
    with Session(engine) as session:
        yield session
