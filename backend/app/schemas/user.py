from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

#Register User Schema
class UserCreate(BaseModel):
    username:str
    password:str
    full_name:str

# Login User Schema
class UserLogin(BaseModel):
    username:str
    password:str

# Get user details
class UserResponse(BaseModel):
    id:UUID
    username:str
    full_name:str
    is_active:bool
    created_at:datetime

    class Config:
        from_attributes = True

# Response returned after user logs in
class TokenResponse(BaseModel):
    access_token:str
    token_type:str='bearer'