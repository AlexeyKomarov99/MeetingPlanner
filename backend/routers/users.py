from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import bcrypt
from uuid import UUID

from database.database import get_db
from models.user import User
from schemas.user import UserCreate, UserResponse, UserUpdate, UserDeleteResponse

router = APIRouter()

# GET /api/users/ - список всех пользователей
@router.get("/", response_model=list[UserResponse])
async def get_users(db: AsyncSession = Depends(get_db)):
    # Получаем всех пользователей из БД
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users

# GET /api/users/{user_id} - информация о конкретном пользователе
@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: UUID, db: AsyncSession = Depends(get_db)):
    # Ищем пользователя по ID
    result = await db.execute(select(User).where(User.user_id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    return {
        "user_id": user.user_id,
        "name": user.name,
        "surname": user.surname,
        "email": user.email,
        "user_photo": user.user_photo
    }

# POST /api/users/ - создание нового пользователя
@router.post("/", response_model=UserResponse)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    # Проверяем, существует ли пользователь с таким email
    result = await db.execute(select(User).where(User.email == user.email))
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Пользователь с таким email уже существует")
    
    # Хешируем пароль
    hashed_password = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()
    
    # Создаем пользователя
    db_user = User(
        email=user.email, 
        name=user.name,
        surname=user.surname,
        hashed_password=hashed_password,
        user_photo=user.user_photo if hasattr(user, 'user_photo') else None
    )
    
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    
    return {
        "user_id": db_user.user_id,
        "name": db_user.name,
        "surname": db_user.surname,
        "email": db_user.email,
        "user_photo": db_user.user_photo
    }

# PATCH /api/users/{user_id} - частичное обновление пользователя
@router.patch("/{user_id}", response_model=UserResponse)
async def patch_user(
    user_id: UUID,  # ← UUID
    user_update: UserUpdate,  # ← Используем UserUpdate
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).where(User.user_id == user_id))
    db_user = result.scalar_one_or_none()
    
    if not db_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    update_data = user_update.dict(exclude_unset=True, exclude_none=True)
    
    # Проверка текущего пароля если меняется пароль
    if 'password' in update_data:
        if 'current_password' not in update_data:
            raise HTTPException(
                status_code=400, 
                detail="Для смены пароля необходим текущий пароль"
            )
        
        # Проверяем текущий пароль
        if not bcrypt.checkpw(
            update_data['current_password'].encode(), 
            db_user.hashed_password.encode()
        ):
            raise HTTPException(
                status_code=400, 
                detail="Неверный текущий пароль"
            )
        
        # Удаляем current_password из данных
        update_data.pop('current_password')
        # Хешируем новый пароль
        update_data['hashed_password'] = bcrypt.hashpw(
            update_data.pop('password').encode(), 
            bcrypt.gensalt()
        ).decode()
    
    # Удаляем current_password если он был передан без смены пароля
    if 'current_password' in update_data:
        update_data.pop('current_password')
    
    # Не обновляем email (если он не должен меняться)
    if 'email' in update_data:
        update_data.pop('email')  # Игнорируем попытку изменить email
    
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    await db.commit()
    await db.refresh(db_user)
    
    return db_user

# DELETE /api/users/{user_id} - удаление пользователя
@router.delete("/{user_id}", response_model=UserDeleteResponse)
async def delete_user(user_id: UUID, db: AsyncSession = Depends(get_db)):
    # Ищем пользователя
    result = await db.execute(select(User).where(User.user_id == user_id))
    db_user = result.scalar_one_or_none()
    
    if not db_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    # Сохраняем ID перед удалением
    deleted_id = db_user.user_id
    
    # Удаляем пользователя
    await db.delete(db_user)
    await db.commit()
    
    return {
        "message": f"Пользователь с ID {user_id} успешно удален",
        "deleted_user_id": deleted_id
    }