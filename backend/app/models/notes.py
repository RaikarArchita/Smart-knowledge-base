from app.core.database import Base
from sqlalchemy.orm import Mapped,mapped_column,relationship
import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import ForeignKey,String,Text,func,DateTime,Boolean,false
from datetime import datetime

class Note(Base):
    __tablename__ = "notes"

    id:Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user_id : Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id",ondelete="CASCADE"),
        nullable=False,
    )

    folder_id : Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("folders.id",ondelete="CASCADE"),
        nullable=True,
    )

    title : Mapped[str] = mapped_column(
        String(500),
        nullable=False,
        default="Untitled"
    )

    content : Mapped[str] = mapped_column(
        Text,
        nullable=False,
        server_default=""
    )

    is_pinned : Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        server_default=false()
    )

    is_archived : Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        server_default=false()
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now()
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now()
    )

    user = relationship("User",back_populates="notes")
    folders = relationship("Folders",back_populates="notes")