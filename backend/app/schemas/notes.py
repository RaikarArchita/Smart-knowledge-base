from pydantic import BaseModel
from typing import Optional,List
from uuid import UUID
from datetime import datetime

# Create a new note
class NoteCreate(BaseModel):
    title : str
    folder_id : Optional[UUID] = None
    content : str
    tags: List[str] = []

# Note Response
class NoteResponse(BaseModel):
    id:UUID
    title : str
    folder_id : Optional[UUID] = None
    content : str
    created_at:datetime
    updated_at:datetime
    tags:List[str]
    
    class Config:
        orm_mode = True

# Edit a note
class NoteEdit(BaseModel):
    note_id : UUID
    title : str
    content : str
    tags: List[str] = []