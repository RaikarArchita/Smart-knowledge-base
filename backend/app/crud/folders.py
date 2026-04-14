from fastapi import APIRouter, status, Depends, HTTPException
from app.schemas.folders import FolderCreate,FolderTree,FolderNameEdit
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.folders import Folders
from app.models.user import User
from sqlalchemy import select
from app.core.dependencies import get_current_user
from typing import List
from sqlalchemy.exc import IntegrityError

router = APIRouter()


#Create new folder
@router.post("/create-folder",
             status_code=status.HTTP_201_CREATED)
async def createFolder(folder_in:FolderCreate,db: AsyncSession = Depends(get_db),
                       current_user: User = Depends(get_current_user)):

    result = await db.execute(select(Folders).where(Folders.name == folder_in.name,
                                                    Folders.user_id == current_user.id))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Folder Name already taken"
        )
    
    folder = Folders(
        name = folder_in.name,
        parent_id = folder_in.parent_id,
        user_id = current_user.id
    )

    db.add(folder)
    await db.commit()
    await db.refresh(folder)

    return folder


# Get the full folders tree
@router.get('/folder-tree',status_code=status.HTTP_200_OK,
            response_model=List[FolderTree])
async def getAllFolders( db: AsyncSession = Depends(get_db),
                            current_user: User = Depends(get_current_user)):
    
    stmt = (
        select(Folders)
        .where(Folders.user_id == current_user.id)
        .order_by(Folders.parent_id)
    )

    result = await db.execute(stmt)
    folders = result.scalars().all()
    
    root_map = {}
    children_map = {}

    # Separate roots and children
    for folder in folders:
        if folder.parent_id is None:
            root_map[folder.id] = folder
        else:
            children_map.setdefault(folder.parent_id, []).append(folder)
    print("CHILDREN MAP:", children_map)
    def build_tree(folder,children_map):
        children = children_map.get(folder.id,[])

        return {
            "id": folder.id,
            "name": folder.name,
            "parent_id": folder.parent_id,
            "position": folder.position,
            "created_at": folder.created_at,
            "children": [
                build_tree(child, children_map) for child in children
            ]
        }

    return [
        build_tree(root,children_map)
        for root in root_map.values()
    ]


# Edit the folder name 
@router.patch("/rename-folder",status_code=status.HTTP_200_OK)
async def updateFolderName(folder_in:FolderNameEdit,
                            db: AsyncSession = Depends(get_db),
                            current_user: User = Depends(get_current_user)):
    
    stmt = (
        select(Folders)
        .where(Folders.id == folder_in.folder_id,
                Folders.user_id == current_user.id)
    )

    result = await db.execute(stmt)
    folder = result.scalar_one_or_none()

    if not folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Folder not found"
        )
    
    if folder_in.new_folder_name is not None:
        folder.name = folder_in.new_folder_name
    
    try:
        await db.commit()
        await db.refresh(folder)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Folder with this name already exists in this location"
        )

    return folder

# Delete the Folder 
@router.delete('/delete-folder/{folder_id}',status_code=status.HTTP_200_OK)
async def delete_folder(folder_id:str,
                        db:AsyncSession=Depends(get_db),
                        current_user:User=Depends(get_current_user)):
    
    stmt = (
        select(Folders)
        .where(Folders.id == folder_id,
                Folders.user_id == current_user.id)
    )

    result = await db.execute(stmt)
    folder = result.scalar_one_or_none()

    if not folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Folder not found"
        )
    
    await db.delete(folder)
    await db.commit()

    return {"message":"Folder deleted successfully"}
