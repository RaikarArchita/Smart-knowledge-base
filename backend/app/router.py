from fastapi import APIRouter,Depends
from app.crud import user,folders,notes
from app.core.dependencies import get_current_user

api_router = APIRouter()
api_router.include_router(user.router, prefix="/user",tags=["Users"])
api_router.include_router(folders.router, prefix="/folders",tags=["Folders"],dependencies=[Depends(get_current_user)])
api_router.include_router(notes.router, prefix="/notes",tags=["Notes"],dependencies=[Depends(get_current_user)])