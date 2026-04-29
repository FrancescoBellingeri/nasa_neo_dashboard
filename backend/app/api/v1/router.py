from fastapi import APIRouter

from app.api.v1.endpoints import feed, neo, stats

v1_router = APIRouter()

v1_router.include_router(feed.router, tags=["feed"])
v1_router.include_router(neo.router, tags=["neo"])
v1_router.include_router(stats.router, tags=["stats"])
