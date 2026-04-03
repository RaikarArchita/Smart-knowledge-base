from sqlalchemy.ext.asyncio import create_async_engine,AsyncSession
from sqlalchemy.orm import sessionmaker,declarative_base
from .config import get_settings

settings = get_settings()

if "localhost" in settings.db_url:
    engine = create_async_engine(settings.db_url,echo=True)
else:
    engine = create_async_engine(
        settings.db_url,
        echo=True,
        connect_args={"ssl": True}
    )

SessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def get_db():
    async with SessionLocal() as session:
        yield session

Base = declarative_base()