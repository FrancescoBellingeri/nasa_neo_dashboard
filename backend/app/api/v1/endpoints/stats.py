from datetime import date

from fastapi import APIRouter, HTTPException, Query

from app.core.cache import cache_get, cache_set, feed_key, stats_key
from app.core.config import settings
from app.schemas.stats import StatsResponse
from app.services.chunker import chunk_date_range
from app.services.nasa_client import NASARateLimitError, NASAUpstreamError, fetch_feed_chunk
from app.services.transformer import build_stats, transform_feed_chunks

router = APIRouter()


@router.get("/stats", response_model=StatsResponse)
async def get_stats(
    start_date: date = Query(...),
    end_date: date = Query(...),
):
    if end_date < start_date:
        raise HTTPException(status_code=422, detail="end_date must be >= start_date")

    delta = (end_date - start_date).days
    if delta > settings.max_date_range_days:
        raise HTTPException(
            status_code=422,
            detail=f"Date range too large. Maximum {settings.max_date_range_days} days.",
        )

    start_str = start_date.isoformat()
    end_str = end_date.isoformat()

    s_key = stats_key(start_str, end_str)
    cached = await cache_get(s_key)
    if cached:
        return cached

    # Reuse feed cache if available
    f_key = feed_key(start_str, end_str)
    feed_data = await cache_get(f_key)

    if feed_data is None:
        chunks = chunk_date_range(start_date, end_date)
        raw_chunks: list[dict] = []
        try:
            for chunk_start, chunk_end in chunks:
                raw = await fetch_feed_chunk(chunk_start, chunk_end)
                raw_chunks.append(raw)
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
        feed_data = transform_feed_chunks(raw_chunks, start_str, end_str)
        await cache_set(f_key, feed_data, settings.cache_ttl_feed)

    result = build_stats(feed_data["asteroids"])
    await cache_set(s_key, result, settings.cache_ttl_stats)
    return result
