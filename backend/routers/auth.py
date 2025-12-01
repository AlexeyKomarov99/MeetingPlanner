# routers/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import bcrypt

from database.database import get_db
from models.user import User
from schemas.auth import LoginSchema, LoginResponse
from core.security import create_tokens
from schemas.user import UserCreate

router = APIRouter()

@router.post("/login", response_model=LoginResponse)
async def login(credentials: LoginSchema, db: AsyncSession = Depends(get_db)):
    # Ищем пользователя
    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=401, detail="Неверный email или пароль")
    
    # Проверяем пароль
    if not bcrypt.checkpw(credentials.password.encode(), user.hashed_password.encode()):
        raise HTTPException(status_code=401, detail="Неверный email или пароль")
    
    # Генерируем токены
    tokens = create_tokens(user.user_id)
    
    return {
        "user": {
            "user_id": user.user_id,
            "name": user.name,
            "surname": user.surname,
            "email": user.email,
            "user_photo": user.user_photo,
            "created_meetings": [],
            "participating_meetings": []
        },
        "tokens": tokens
    }

@router.post("/register", response_model=LoginResponse)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    
    print(user_data)
    # Проверяем нет ли пользователя с таким email
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Пользователь с таким email уже существует")
    
    # Хешируем пароль
    hashed_password = bcrypt.hashpw(user_data.password.encode(), bcrypt.gensalt()).decode()
    
    # Создаем пользователя
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
    tokens = create_tokens(new_user.user_id)
    
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