from pydantic import BaseModel, EmailStr, Field
from uuid import UUID
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    name: str
    surname: str
    email: EmailStr
    user_photo: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

# Одна схема для обновления
class UserUpdate(BaseModel):
    name: Optional[str] = None
    surname: Optional[str] = None
    # email: Optional[EmailStr] = None  # ← УБРАТЬ если email не должен меняться
    user_photo: Optional[str] = None
    password: Optional[str] = Field(None, min_length=6)
    current_password: Optional[str] = None  # ← для проверки при смене пароля

class UserResponse(UserBase):
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class UserDeleteResponse(BaseModel):
    message: str
    deleted_user_id: UUID