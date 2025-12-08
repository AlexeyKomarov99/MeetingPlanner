from pydantic import BaseModel, EmailStr, Field
from uuid import UUID
from typing import Optional, List
from schemas.user import UserResponse
from schemas.meeting import MeetingResponse

class LoginSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)

class TokenSchema(BaseModel):
    access: str
    refresh: str

class RefreshTokenSchema(BaseModel):
    refresh: str

class UserWithMeetings(BaseModel):
    user_id: UUID
    name: str
    surname: str
    email: EmailStr
    user_photo: Optional[str] = None
    created_meetings: List[MeetingResponse] = []
    participating_meetings: List[MeetingResponse] = []

class LoginResponse(BaseModel):
    user: UserWithMeetings
    tokens: TokenSchema

class RefreshResponse(BaseModel):
    access: str

class ForgotPasswordSchema(BaseModel):
    email: EmailStr

class ResetPasswordSchema(BaseModel):
    token: str
    new_password: str
    confirm_password: str