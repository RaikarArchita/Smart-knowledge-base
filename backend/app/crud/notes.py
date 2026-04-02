from fastapi import APIRouter,status,Depends,HTTPException
from app.schemas.notes import NoteReponse,NoteCreate,NoteEdit
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.user import User
from app.models.notes import Note
from app.core.dependencies import get_current_user
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

router = APIRouter()

@router.post("/create-note",status_code=status.HTTP_201_CREATED,
             response_model=NoteReponse)
async def createNote(note_in:NoteCreate,
                     db:AsyncSession=Depends(get_db),
                     current_user:User=Depends(get_current_user)):
    
    note = Note(
        title = note_in.title,
        content = note_in.content,
        folder_id = note_in.folder_id,
        user_id = current_user.id
    )

    db.add(note)
    await db.commit()
    await db.refresh(note)

    return note


@router.patch('/edit-note',status_code=status.HTTP_200_OK,
              response_model=NoteReponse)
async def editNote(note_in:NoteEdit,
                   db:AsyncSession=Depends(get_db)):
    
    stmt = (
        select(Note)
        .where(Note.id == note_in.note_id)
    )

    result = await db.execute(stmt)
    note = result.scalar_one_or_none()

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note does not exist"
        )
    
    if note_in:
        note.id = note_in.note_id
        note.title = note_in.title
        note.content = note_in.content
    
    try:
        await db.commit()
        await db.refresh(note)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Folder with this name already exists in this location"
        )

    return note


@router.delete('/delete-note/{note_id}',status_code=status.HTTP_200_OK)
async def deleteNote(note_id:str,db:AsyncSession=Depends(get_db)):

    stmt = (
        select(Note)
        .where(Note.id == note_id)
    )
    
    result = await db.execute(stmt)
    note = result.scalar_one_or_none()

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note does not exist"
        )
    
    await db.delete(note)
    await db.commit()

    return {"message":f"Note for Id : '{note_id}' deleted successfully"}
