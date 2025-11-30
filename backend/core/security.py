from datetime import datetime, timedelta
from .config import settings
from jose import jwt

def create_tokens(user_id: str):
    # Access token
    access_expires = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    access_payload = {
        "user_id": str(user_id), 
        "exp": access_expires, 
        "type": "access"
    }
    access_token = jwt.encode(access_payload, settings.secret_key, algorithm=settings.algorithm)
    
    # Refresh token  
    refresh_expires = datetime.utcnow() + timedelta(days=settings.refresh_token_expire_days)
    refresh_payload = {
        "user_id": str(user_id), 
        "exp": refresh_expires, 
        "type": "refresh"
    }
    refresh_token = jwt.encode(refresh_payload, settings.refresh_secret_key, algorithm=settings.algorithm)
    
    return {"access": access_token, "refresh": refresh_token}

def verify_token(token: str, is_refresh: bool = False):
    try:
        secret = settings.refresh_secret_key if is_refresh else settings.secret_key
        payload = jwt.decode(token, secret, algorithms=[settings.algorithm])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None