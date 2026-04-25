from fastapi import FastAPI,Request,HTTPException
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware
from .router import api_router
from .core.database import SessionLocal
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

app = FastAPI(title="Knowledge Base API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.exception_handler(HTTPException)
async def http_exception_handler(request:Request,exc:HTTPException):
     return JSONResponse(
          status_code=exc.status_code,
          content={
            "message": exc.detail
        }
     )

@app.middleware("http")
async def csrf_protect(request: Request, call_next):

    # ✅ Skip safe methods
    if request.method in ("GET", "HEAD", "OPTIONS"):
        return await call_next(request)

    # ✅ Skip login & refresh
    if any(path in request.url.path for path in ["/login", "/refresh"]):
        return await call_next(request)

    csrf_cookie = request.cookies.get("csrf_token")
    csrf_header = request.headers.get("X-CSRF-Token")

    if not csrf_cookie or not csrf_header:
        raise HTTPException(status_code=403, detail="CSRF missing")

    if csrf_cookie != csrf_header:
        raise HTTPException(status_code=403, detail="CSRF invalid")

    return await call_next(request)

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
