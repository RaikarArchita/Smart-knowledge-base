from fastapi import APIRouter,status,Depends, HTTPException, Response, Request
from app.schemas.user import TokenResponse,UserCreate,UserLogin
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.user import User
from sqlalchemy import select
from app.utils.util import hash_password,create_access_token,verify_password,create_refresh_token,generate_csrf_token
from app.core.dependencies import get_current_user
from jose import jwt
from app.core.config import get_settings

router = APIRouter()
settings = get_settings()

# Register the new user
@router.post("/register",
             status_code=status.HTTP_201_CREATED)
async def register(user_in:UserCreate,response: Response,db: AsyncSession = Depends(get_db)):

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

    access_token = create_access_token({"sub": user.username})
    refresh_token = create_refresh_token({"sub": user.username})
    csrf_token = generate_csrf_token()

    response.set_cookie("access_token", access_token, httponly=True, samesite="Strict",secure=True)
    response.set_cookie("refresh_token", refresh_token, httponly=True, samesite="Strict",secure=True)
    response.set_cookie("csrf_token", csrf_token, httponly=False, samesite="Strict",secure=True)

    return {"message": "Logged in"}

# Login the user
@router.post('/login',
             status_code=status.HTTP_200_OK)
async def login(user_in:UserLogin,response: Response,db: AsyncSession = Depends(get_db)):

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
    
    access_token = create_access_token({"sub": user.username})
    refresh_token = create_refresh_token({"sub": user.username})
    csrf_token = generate_csrf_token()

    response.set_cookie("access_token", access_token, httponly=True, samesite="Strict",secure=True)
    response.set_cookie("refresh_token", refresh_token, httponly=True, samesite="Strict",secure=True)
    response.set_cookie("csrf_token", csrf_token, httponly=False, samesite="Strict",secure=True)

    return {"message": "Logged in"}


@router.post("/refresh")
async def refresh(request: Request, response: Response):
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(status_code=401)

    try:
        payload = jwt.decode(
            refresh_token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        username = payload.get("sub")

        new_access_token = create_access_token({"sub": username})
        new_csrf_token = generate_csrf_token()

        response.set_cookie("access_token", new_access_token, httponly=True)
        response.set_cookie("csrf_token", new_csrf_token, httponly=False)

        return {"message": "refreshed"}

    except:
        raise HTTPException(status_code=401)


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    response.delete_cookie("csrf_token")
    return {"message": "Logged out"}

# Get User Details
@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "full_name": current_user.full_name,
    }