import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.router import v1_router

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="NASA NEO Dashboard API",
    description="Proxy + cache layer for NASA Near Earth Object data",
    version="1.0.0",
)

# Parse allowed origins from settings
_origins = [o.strip() for o in settings.allowed_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(v1_router, prefix="/api/v1")


@app.get("/health")
async def health():
    return {"status": "ok"}
