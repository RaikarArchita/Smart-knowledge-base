from pydantic import BaseModel
from typing import Optional,List,Text
from uuid import UUID
from datetime import datetime

# Create a new note
class NoteCreate(BaseModel):
    title : str
    folder_id : Optional[UUID] = None
    content : str

# Note Response
class NoteReponse(BaseModel):
    id:UUID
    title : str
    folder_id : Optional[UUID] = None
    content : str
    created_at:datetime
    updated_at:datetime

    class Config:
        orm_mode = True

# Edit a note
class NoteEdit(BaseModel):
    note_id : UUID
    title : str
    content : str