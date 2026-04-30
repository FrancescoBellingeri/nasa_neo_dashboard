import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import v1_router

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="NASA NEO Dashboard API",
    description="Proxy + cache layer for NASA Near Earth Object data",
    version="1.0.0",
)

# FRONTEND_URL env var lets Render/Vercel deployments set the exact origin
_extra_origin = os.getenv("FRONTEND_URL", "")
_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
]
if _extra_origin:
    _origins.append(_extra_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(v1_router, prefix="/api/v1")


@app.get("/health")
async def health():
    return {"status": "ok"}
