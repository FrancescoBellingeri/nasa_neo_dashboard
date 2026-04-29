from fastapi import APIRouter, HTTPException

from app.core.cache import cache_get, cache_set, neo_key
from app.core.config import settings
from app.schemas.neo import AsteroidDetail
from app.services.nasa_client import NASANotFoundError, NASARateLimitError, NASAUpstreamError, fetch_neo_detail
from app.services.transformer import transform_neo_detail

router = APIRouter()


@router.get("/neo/{neo_id}", response_model=AsteroidDetail)
async def get_neo(neo_id: str):
    key = neo_key(neo_id)

    cached = await cache_get(key)
    if cached:
        return cached

    try:
        raw = await fetch_neo_detail(neo_id)
    except NASANotFoundError:
        raise HTTPException(status_code=404, detail=f"Asteroid {neo_id} not found")
    except NASARateLimitError:
        raise HTTPException(
            status_code=429,
            detail={"error": "rate_limit", "message": "NASA API rate limit exceeded. Try again later."},
        )
    except NASAUpstreamError as exc:
        raise HTTPException(
            status_code=502,
            detail={"error": "upstream_error", "message": str(exc)},
        )

    result = transform_neo_detail(raw)
    await cache_set(key, result, settings.cache_ttl_neo)
    return result
