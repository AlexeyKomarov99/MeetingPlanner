from pydantic import BaseModel, EmailStr
from uuid import UUID

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class TokenSchema(BaseModel):
    access: str
    refresh: str

class LoginResponse(BaseModel):
    user: dict  # TODO: заменить на полный UserResponse с meetings
    tokens: TokenSchema