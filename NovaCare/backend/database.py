from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base
import os

# For hackathon purposes, we can use SQLite if Postgres isn't running, but we configure for Postgres.
# Set DATABASE_URL as environment variable, default to sqlite.
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./novacare.db")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
