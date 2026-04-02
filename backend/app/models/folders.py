from app.core.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import ForeignKey, String, func, DateTime
from datetime import datetime

class Folders(Base):

    __tablename__ = "folders"

    id : Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid = True),
        primary_key = True,
        default = uuid.uuid4
    )

    user_id : Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid = True),
        ForeignKey("users.id",ondelete="CASCADE"),
        nullable=False,
        unique=True
    )

    parent_id : Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid = True),
        ForeignKey("folders.id",ondelete="CASCADE"),
        nullable=True,
        unique=True
    )

    name : Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        unique=True
    )

    position : Mapped[int] = mapped_column(
        nullable=False,
        default=0
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now()
    )

    user = relationship("User",back_populates="folders")
    notes    = relationship("Note", back_populates="folders", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Folders id={self.id} username={self.name}>"
