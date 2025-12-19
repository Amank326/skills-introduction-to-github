# Quantum Travel AI Configuration

import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    APP_NAME: str = "Quantum Travel AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALLOWED_ORIGINS: list = ["*"]
    
    # AI Models (Add your API keys)
    OPENAI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    
    # Database (Optional)
    DATABASE_URL: Optional[str] = None
    REDIS_URL: Optional[str] = None
    
    # Features
    MAX_MESSAGE_LENGTH: int = 4000
    MAX_HISTORY_LENGTH: int = 100
    DEFAULT_MODEL: str = "quantum-ai"
    ENABLE_FILE_UPLOAD: bool = True
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
