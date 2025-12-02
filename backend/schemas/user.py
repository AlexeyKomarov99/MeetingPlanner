from pydantic import BaseModel, EmailStr, Field
from uuid import UUID
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    name: str
    surname: str
    email: EmailStr
    user_photo: str | None = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Пароль должен быть не менее 6 символов")

class UserUpdate(BaseModel):
    name: Optional[str] = None
    surname: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=6, description="Пароль должен быть не менее 6 символов")
    user_photo: Optional[str] = None

# Для PATCH можно использовать ту же схему что и для PUT (все поля Optional)
UserPatch = UserUpdate  # Алиас для ясности кода

class UserResponse(UserBase):
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class UserListResponse(BaseModel):
    users: list[UserResponse]
    total: int

class UserDeleteResponse(BaseModel):
    message: str
    deleted_user_id: UUID