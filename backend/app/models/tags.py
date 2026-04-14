from app.core.database import Base
from sqlalchemy.orm import Mapped,mapped_column,relationship
import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import String
from sqlalchemy.ext.associationproxy import association_proxy

class Tag(Base):

    __tablename__ = "tags"

    id:Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    name:Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default='#6366f1',
        unique=True
    )

    note_tags = relationship("NoteTag",back_populates="tag",passive_deletes=True )
    notes = association_proxy("note_tags", "notes")