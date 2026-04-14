from fastapi import APIRouter,status,Depends,HTTPException
from app.schemas.notes import NoteResponse,NoteCreate,NoteEdit
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.user import User
from app.models.notes import Note
from app.models.tags import Tag
from app.models.notes_tags import NoteTag
from app.core.dependencies import get_current_user
from sqlalchemy import select,delete
from sqlalchemy.exc import IntegrityError
from typing import List
from sqlalchemy.orm import selectinload

router = APIRouter()

@router.get("/get-notes/{folder_id}",status_code=status.HTTP_200_OK,
            response_model=List[NoteResponse])
async def getAllNotes(folder_id:str,
                         db:AsyncSession=Depends(get_db),
                     current_user:User=Depends(get_current_user)):
        stmt = (
                select(Note)
                .options(selectinload(Note.note_tags).selectinload(NoteTag.tag))
                .where(Note.folder_id == folder_id,
                    Note.user_id == current_user.id)
            )
        
        result = await db.execute(stmt)
        notes = result.scalars().all()

        response = []

        for note in notes:
            response.append({
                "id": note.id,
                "title": note.title,
                "content": note.content,
                "folder_id":note.folder_id,
                "created_at":note.created_at,
                "updated_at":note.updated_at,
                "tags": [tag.name for tag in note.tags]
            })

        return response

@router.post("/create-note",status_code=status.HTTP_201_CREATED,
             response_model=NoteResponse)
async def createNote(note_in:NoteCreate,
                     db:AsyncSession=Depends(get_db),
                     current_user:User=Depends(get_current_user)):
    
    stmt = select(Tag).where(Tag.name.in_(note_in.tags))

    result = await db.execute(stmt)
    existing_tags = result.scalars().all()

    existing_names = {tag.name for tag in existing_tags}

    missing_names = set(note_in.tags) - existing_names
    new_tag = [
        Tag(name = name)
        for name in missing_names
    ]
    
    if new_tag:
        db.add_all(new_tag)
        await db.flush()

    note = Note(
        title = note_in.title,
        content = note_in.content,
        folder_id = note_in.folder_id,
        user_id = current_user.id
    )

    db.add(note)
    await db.flush()

    note_tags = [
        NoteTag(note_id=note.id, tag_id=tag.id)
        for tag in existing_tags + new_tag
    ]

    if note_tags:
        db.add_all(note_tags)
        
    await db.commit()
    await db.refresh(note)

    return {
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "folder_id": note.folder_id,
        "created_at": note.created_at,
        "updated_at": note.updated_at,
        "tags": [tag.name for tag in existing_tags + new_tag]
    }


@router.patch('/edit-note',status_code=status.HTTP_200_OK,
              response_model=NoteResponse)
async def editNote(note_in:NoteEdit,
                   db:AsyncSession=Depends(get_db)):

    stmt = select(Tag).where(Tag.name.in_(note_in.tags))

    result = await db.execute(stmt)
    existing_tags = result.scalars().all()

    existing_names = {tag.name for tag in existing_tags}

    missing_names = set(note_in.tags) - existing_names
    new_tag = [
        Tag(name = name)
        for name in missing_names
    ]
    
    if new_tag:
        db.add_all(new_tag)
        await db.flush()
    
    all_tags = existing_tags + new_tag

    stmt = (
        select(Note)
        .options(selectinload(Note.note_tags).selectinload(NoteTag.tag))
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
        note.title = note_in.title
        note.content = note_in.content
    
    existing_tags_ids = {nt.tag_id for nt in note.note_tags}
    incoming_tag_ids = {tag.id for tag in all_tags}

    new_mappings = [
        NoteTag(note_id = note.id, tag_id = tag.id)
        for tag in all_tags
        if tag.id not in existing_tags_ids
    ]
    if new_mappings:
        db.add_all(new_mappings)
    
    to_remove = existing_tags_ids - incoming_tag_ids
    if to_remove:
        await db.execute(
             delete(NoteTag).where(
                NoteTag.note_id == note.id,
                NoteTag.tag_id.in_(to_remove)
            )
        )

    await db.commit()
    await db.refresh(note)

    return {
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "folder_id": note.folder_id,
        "created_at": note.created_at,
        "updated_at": note.updated_at,
        "tags": [nt.tag.name for nt in note.note_tags]
    }

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
