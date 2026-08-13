from fastapi import APIRouter,Depends
from app.crud import user,folders,notes,dashboard
from app.core.dependencies import get_current_user
from app.schemas.ai import TagSuggestionRequest
from app.services.ai_service import AIService

api_router = APIRouter()
api_router.include_router(user.router, prefix="/user",tags=["Users"])
api_router.include_router(dashboard.router, prefix="/dashboard",tags=["Dashboard"])
api_router.include_router(folders.router, prefix="/folders",tags=["Folders"],dependencies=[Depends(get_current_user)])
api_router.include_router(notes.router, prefix="/notes",tags=["Notes"],dependencies=[Depends(get_current_user)])

ai_service = AIService()

@api_router.post("/ai/suggest-tags",tags=["AI Services"])
def suggest_tags(request: TagSuggestionRequest):
    return ai_service._suggest_tags(request.content)