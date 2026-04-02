import bcrypt
from datetime import datetime,timedelta
from jose import jwt
from app.core.config import get_settings

settings = get_settings()
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM

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
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
