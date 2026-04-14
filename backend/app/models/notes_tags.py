from app.core.database import Base
from sqlalchemy.orm import Mapped,mapped_column,relationship
import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import ForeignKey,func,DateTime
from datetime import datetime

class NoteTag(Base):
    __tablename__ = "note_tags"

    note_id :Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("notes.id", ondelete="CASCADE"),
        primary_key=True
    )

    tag_id :Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("tags.id", ondelete="CASCADE"),
        primary_key=True
    )

    created_at :Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # relationships
    notes = relationship("Note", back_populates="note_tags")
    tag = relationship("Tag", back_populates="note_tags")