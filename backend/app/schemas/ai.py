from pydantic import BaseModel

class TagSuggestionRequest(BaseModel):
    content: str

class TagSuggestionResponse(BaseModel):
    suggested_tags: list[str]