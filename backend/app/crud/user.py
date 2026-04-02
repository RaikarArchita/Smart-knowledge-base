from fastapi import APIRouter,status,Depends, HTTPException
from app.schemas.user import TokenResponse,UserCreate,UserLogin
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.user import User
from sqlalchemy import select
from app.utils.util import hash_password,create_access_token,verify_password
from app.core.dependencies import get_current_user

router = APIRouter()

# Register the new user
@router.post("/register",response_model=TokenResponse,
             status_code=status.HTTP_201_CREATED)
async def register(user_in:UserCreate,db: AsyncSession = Depends(get_db)):

    result = await db.execute(select(User).where(User.username == user_in.username))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    user = User(
        username = user_in.username,
        password = hash_password(user_in.password),
        full_name=user_in.full_name,
    )

    db.add(user)
    await db.commit()
    await db.refresh(user)

    access_token = create_access_token(
        data={"sub": user.username}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

# Login the user
@router.post('/login',response_model=TokenResponse,
             status_code=status.HTTP_200_OK)
async def login(user_in:UserLogin,db: AsyncSession = Depends(get_db)):

    result = await db.execute(select(User).where(User.username == user_in.username))
    
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid username or password"
        )
    
    if not verify_password(user_in.password, user.password):
        raise HTTPException(
            status_code=400,
            detail="Invalid password"
        )
    
    access_token = create_access_token(
        data={"sub": user.username}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# Get User Details
@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "full_name": current_user.full_name,
    }