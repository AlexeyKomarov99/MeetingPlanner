from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import bcrypt
from uuid import UUID

from database.database import get_db
from models.user import User
from models.meeting import Meeting
from models.participant import Participant
from schemas.auth import LoginSchema, LoginResponse, RefreshTokenSchema, RefreshResponse, UserWithMeetings
from core.security import create_tokens, verify_refresh_token, create_access_token, verify_token
from schemas.user import UserCreate

router = APIRouter()
security = HTTPBearer()

async def get_user_with_meetings(user_id: UUID, db: AsyncSession):
    """Получаем пользователя с его встречами"""
    # Получаем пользователя
    result = await db.execute(select(User).where(User.user_id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        return None
    
    # Получаем созданные встречи пользователя
    result = await db.execute(
        select(Meeting).where(Meeting.creator_id == user_id)
    )
    created_meetings = result.scalars().all()
    
    # Получаем встречи, в которых пользователь участвует
    result = await db.execute(
        select(Meeting)
        .join(Participant, Participant.meeting_id == Meeting.id)
        .where(Participant.user_id == user_id)
    )
    participating_meetings = result.scalars().all()
    
    return {
        "user": user,
        "created_meetings": created_meetings,
        "participating_meetings": participating_meetings
    }

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    token = credentials.credentials
    payload = verify_token(token, is_refresh=False)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user_id = payload.get("sub")
    
    result = await db.execute(select(User).where(User.user_id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user

# POST /api/auth/login - вход пользователя
@router.post("/login", response_model=LoginResponse)
async def login(credentials: LoginSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль"
        )
    
    if not bcrypt.checkpw(credentials.password.encode(), user.hashed_password.encode()):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль"
        )
    
    # Получаем пользователя с встречами
    user_data = await get_user_with_meetings(user.user_id, db)
    
    # Генерируем токены
    tokens = create_tokens(str(user.user_id))
    
    return {
        "user": {
            "user_id": user.user_id,
            "name": user.name,
            "surname": user.surname,
            "email": user.email,
            "user_photo": user.user_photo,
            "created_meetings": user_data["created_meetings"] if user_data else [],
            "participating_meetings": user_data["participating_meetings"] if user_data else []
        },
        "tokens": tokens
    }

# POST /api/auth/register - регистрация нового пользователя
@router.post("/register", response_model=LoginResponse)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким email уже существует"
        )
    
    hashed_password = bcrypt.hashpw(user_data.password.encode(), bcrypt.gensalt()).decode()
    
    new_user = User(
        name=user_data.name,
        surname=user_data.surname,
        email=user_data.email,
        hashed_password=hashed_password,
        user_photo=user_data.user_photo
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # Генерируем токены
    tokens = create_tokens(str(new_user.user_id))
    
    return {
        "user": {
            "user_id": new_user.user_id,
            "name": new_user.name,
            "surname": new_user.surname,
            "email": new_user.email,
            "user_photo": new_user.user_photo,
            "created_meetings": [],
            "participating_meetings": []
        },
        "tokens": tokens
    }

# POST /api/auth/refresh - обновление access токена
@router.post("/refresh", response_model=RefreshResponse)
async def refresh_token(token_data: RefreshTokenSchema):
    user_id = verify_refresh_token(token_data.refresh)
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Недействительный refresh токен"
        )
    
    new_access_token = create_access_token(user_id)
    
    return {"access": new_access_token}

# Маршрут /me
@router.get("/me", response_model=UserWithMeetings)
async def get_me(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    user_data = await get_user_with_meetings(current_user.user_id, db)
    
    return {
        "user_id": current_user.user_id,
        "name": current_user.name,
        "surname": current_user.surname,
        "email": current_user.email,
        "user_photo": current_user.user_photo,
        "created_meetings": user_data["created_meetings"] if user_data else [],
        "participating_meetings": user_data["participating_meetings"] if user_data else []
    }