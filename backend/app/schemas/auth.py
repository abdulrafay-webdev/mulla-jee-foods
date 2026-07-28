from pydantic import BaseModel, EmailStr
from typing import Optional

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    password: str
    is_admin: bool = True

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str]
    is_admin: bool
