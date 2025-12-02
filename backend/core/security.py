from datetime import datetime, timedelta
from jose import jwt, JWTError, ExpiredSignatureError
from typing import Optional
from .config import settings

def create_tokens(user_id: str):
    access_expires = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    access_payload = {
        "sub": str(user_id),
        "exp": access_expires, 
        "type": "access"
    }
    access_token = jwt.encode(access_payload, settings.secret_key, algorithm=settings.algorithm)
    
    refresh_expires = datetime.utcnow() + timedelta(days=settings.refresh_token_expire_days)
    refresh_payload = {
        "sub": str(user_id),
        "exp": refresh_expires, 
        "type": "refresh"
    }
    refresh_token = jwt.encode(refresh_payload, settings.refresh_secret_key, algorithm=settings.algorithm)
    
    return {"access": access_token, "refresh": refresh_token}

def verify_token(token: str, is_refresh: bool = False) -> Optional[dict]:
    try:
        secret = settings.refresh_secret_key if is_refresh else settings.secret_key
        payload = jwt.decode(token, secret, algorithms=[settings.algorithm])
        return payload
    except (JWTError, ExpiredSignatureError):
        return None

def create_access_token(user_id: str) -> str:
    """Создает только access токен"""
    access_expires = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    access_payload = {
        "sub": str(user_id),
        "exp": access_expires, 
        "type": "access"
    }
    return jwt.encode(access_payload, settings.secret_key, algorithm=settings.algorithm)

def verify_refresh_token(token: str) -> Optional[str]:
    """Проверяет refresh token и возвращает user_id"""
    payload = verify_token(token, is_refresh=True)
    if payload and payload.get("type") == "refresh":
        return payload.get("sub")
    return None