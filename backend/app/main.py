from fastapi import FastAPI
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware
from .router import api_router
from .core.database import SessionLocal
import os
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Knowledge Base API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.on_event("startup")
async def test_db_connection():
    try:
        async with SessionLocal() as session:
                await session.execute(text("SELECT 1"))
        print("✅ Database connection successful!")
    except Exception as e:
          print("❌ Database connection failed!")
          print(e)

if os.path.isdir("static"):
    app.mount("/", StaticFiles(directory="static", html=True), name="static")
