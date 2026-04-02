import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id : Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key = True,
        default = uuid.uuid4
    )

    username : Mapped[str] = mapped_column(
        String(255),
        nullable = False,
        unique = True,
        index = True
    )

    password : Mapped[str] = mapped_column(
        String(255),
        nullable = False,
    )

    full_name : Mapped[str | None] = mapped_column(
        String(100),
        nullable = True
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True
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

    folders  = relationship("Folders", back_populates="user", cascade="all, delete-orphan")
    notes    = relationship("Note",        back_populates="user", cascade="all, delete-orphan")
    # tags     = relationship("Tag",         back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User id={self.id} username={self.username}>"