import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "FastFood API"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./fastfood.db")
    
    # JWT Auth
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "super_secret_default_fastfood_key_change_in_prod")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # ImageKit
    IMAGEKIT_PUBLIC_KEY: str = os.getenv("IMAGEKIT_PUBLIC_KEY", "")
    IMAGEKIT_PRIVATE_KEY: str = os.getenv("IMAGEKIT_PRIVATE_KEY", "")
    IMAGEKIT_URL_ENDPOINT: str = os.getenv("IMAGEKIT_URL_ENDPOINT", "")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
