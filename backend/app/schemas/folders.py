from pydantic import BaseModel
from typing import Optional,List
from uuid import UUID
from datetime import datetime

# Create a new folder
class FolderCreate(BaseModel):
    name : str
    parent_id : Optional[UUID] = None

# Folder Response
class FolderResponse(BaseModel):
    id:UUID
    name:str
    parent_id:Optional[UUID]
    position:int
    created_at:datetime

    class Config:
        from_attributes = True

# Folder tree with children
class FolderTree(BaseModel):
    id: UUID
    name: str
    parent_id: Optional[UUID]
    position: int
    created_at: datetime
    children: List[FolderResponse] = []

    class Config:
        from_attributes = True

class FolderNameEdit(BaseModel):
    new_folder_name : str
    folder_id : UUID