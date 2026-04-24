import bcrypt
from datetime import datetime,timedelta
from jose import jwt
from app.core.config import get_settings
import secrets

settings = get_settings()
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_EXPIRE_MIN = 15
REFRESH_EXPIRE_DAYS = 7

def hash_password(password):
    password_bytes = password.encode('utf-8')
    hashed_password_bytes = bcrypt.hashpw(password_bytes,bcrypt.gensalt())
    hashed_password_str = hashed_password_bytes.decode('utf-8')
    return hashed_password_str

def verify_password(password, hash_from_db):
    password_bytes = password.encode('utf-8')
    hash_bytes = hash_from_db.encode('utf-8')

    is_correct = bcrypt.checkpw(password_bytes,hash_bytes)
    return is_correct

def create_access_token(data: dict):
    return jwt.encode({**data, "exp": datetime.utcnow() + timedelta(minutes=ACCESS_EXPIRE_MIN)}
                      ,SECRET_KEY, 
                      algorithm=ALGORITHM)

def create_refresh_token(data:dict):
    return jwt.encode(
        {**data, "exp": datetime.utcnow() + timedelta(days=REFRESH_EXPIRE_DAYS)},
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )

def generate_csrf_token():
    return secrets.token_urlsafe(32)