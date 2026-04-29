import json
import logging

import redis.asyncio as aioredis

from app.core.config import settings

logger = logging.getLogger(__name__)

_redis: aioredis.Redis | None = None


async def get_redis() -> aioredis.Redis | None:
    global _redis
    if _redis is None:
        try:
            _redis = aioredis.from_url(settings.redis_url, decode_responses=True)
            await _redis.ping()
        except Exception as exc:
            logger.warning("Redis unavailable: %s — caching disabled", exc)
            _redis = None
    return _redis


async def cache_get(key: str) -> dict | list | None:
    r = await get_redis()
    if r is None:
        return None
    try:
        raw = await r.get(key)
        return json.loads(raw) if raw else None
    except Exception as exc:
        logger.warning("Redis GET error: %s", exc)
        return None


async def cache_set(key: str, value: dict | list, ttl: int) -> None:
    r = await get_redis()
    if r is None:
        return
    try:
        await r.set(key, json.dumps(value), ex=ttl)
    except Exception as exc:
        logger.warning("Redis SET error: %s", exc)


def feed_key(start_date: str, end_date: str) -> str:
    return f"neo:feed:v1:{start_date}:{end_date}"


def neo_key(neo_id: str) -> str:
    return f"neo:detail:v1:{neo_id}"


def stats_key(start_date: str, end_date: str) -> str:
    return f"neo:stats:v1:{start_date}:{end_date}"
