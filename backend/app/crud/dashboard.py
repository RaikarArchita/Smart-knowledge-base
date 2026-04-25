from fastapi import APIRouter,status,Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.user import User
from app.models.notes import Note
from app.models.folders import Folders
from app.models.tags import Tag
from app.models.notes_tags import NoteTag
from app.core.dependencies import get_current_user
from sqlalchemy import select,func,desc
from datetime import date,datetime, timedelta, UTC

today = date.today()

router = APIRouter()

@router.get('/',status_code=status.HTTP_200_OK)
async def dashboardDetails(db:AsyncSession=Depends(get_db),
                            current_user:User=Depends(get_current_user)):
    
    # count number of notes
    stats_stmt = select(
    func.count(Note.id).label("total_notes"),
    func.avg(func.length(Note.content)).label("avg_length"),
    func.count(Note.id).filter(
        func.date(Note.updated_at) == today,
    ).label("active_today")
        ).where(
                Note.user_id == current_user.id
            )

    data = (await db.execute(stats_stmt)).one()

    # count of number of folders
    folder_count  = (await db.execute(
        select(func.count(Folders.id)).where(Folders.user_id == current_user.id)
    )).scalar()

    # top 4 recent activities
    notes = (await db.execute(
            select(Note)
            .where(Note.user_id == current_user.id)
            .order_by(Note.updated_at.desc()).limit(4)
        )).scalars().all()

    recent_activites = [
        {
            "title": note.title,
            "content": note.content,
            "updated_at": note.updated_at
        }
        for note in notes
    ]

    tags_stmt = (
    select(
        Tag.id,
        Tag.name,
        func.count(NoteTag.tag_id).label("usage_count")
    )
    .join(NoteTag, Tag.id == NoteTag.tag_id)
    .join(Note, Note.id == NoteTag.note_id)
    .where(Note.user_id == current_user.id)
    .group_by(Tag.id, Tag.name)
    .order_by(desc("usage_count"))
    .limit(5)
    )

    top_tags = (await db.execute(tags_stmt)).all()
    
    start_date =  datetime.now(UTC) - timedelta(weeks=4)
    start_of_week = today - timedelta(days=today.weekday())

    weekly_stmt  = (
    select(
        func.date_trunc('week', func.timezone('Asia/Kolkata', Note.created_at)).label("week"),
        func.count(Note.id).label("count")
    )
    .where(
        Note.user_id == current_user.id,
        Note.created_at >= start_date
    )
    .group_by("week")
    .order_by("week")
    )

    rows = (await db.execute(weekly_stmt)).all()

    weeks = [
        (start_of_week - timedelta(weeks=3 - i))
        for i in range(4)
    ]

    # map DB results
    db_map = {row.week.date(): row.count for row in rows}

    week_data  = [
        {
            "week": f"Week {i + 1}",
            "count": db_map.get(week, 0)
        }
        for i,week in enumerate(weeks)
    ]

    return {
            "total_notes": data.total_notes,
            "no_of_folders": folder_count ,
            "avg_note_len" : round(data.avg_length),
            "active_today": data.active_today,
            "recent_activites": recent_activites,
            "top_tags":[ {"id": row.id, "name": row.name, "count": row.usage_count} for row in top_tags],
            "week_data" : week_data 
            }
