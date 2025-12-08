from datetime import datetime, timedelta
import secrets
from typing import Optional

# Временное хранилище в памяти (заменить на Redis в продакшене)
_password_reset_tokens = {}

def generate_reset_token() -> str:
    return secrets.token_urlsafe(32)

def store_reset_token(user_id: str, token: str, expires_in: int = 3600):
    expires_at = datetime.now() + timedelta(seconds=expires_in)
    _password_reset_tokens[token] = {
        'user_id': user_id,
        'expires_at': expires_at
    }
    # Очистка просроченных токенов
    cleanup_expired_tokens()

def get_reset_token(token: str) -> Optional[str]:
    data = _password_reset_tokens.get(token)
    if not data:
        return None
    
    if datetime.now() > data['expires_at']:
        del _password_reset_tokens[token]
        return None
    
    return data['user_id']

def delete_reset_token(token: str):
    _password_reset_tokens.pop(token, None)

def cleanup_expired_tokens():
    now = datetime.now()
    expired = [token for token, data in _password_reset_tokens.items() 
               if now > data['expires_at']]
    for token in expired:
        del _password_reset_tokens[token]