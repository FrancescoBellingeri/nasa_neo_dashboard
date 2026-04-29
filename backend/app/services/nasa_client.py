import logging
from datetime import date

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)


class NASARateLimitError(Exception):
    pass


class NASANotFoundError(Exception):
    pass


class NASAUpstreamError(Exception):
    pass


_client: httpx.AsyncClient | None = None


async def _get_client() -> httpx.AsyncClient:
    global _client
    if _client is None:
        _client = httpx.AsyncClient(timeout=30.0)
    return _client


async def fetch_feed_chunk(start: date, end: date) -> dict:
    client = await _get_client()
    params = {
        "start_date": start.isoformat(),
        "end_date": end.isoformat(),
        "api_key": settings.nasa_api_key,
    }
    try:
        resp = await client.get(f"{settings.nasa_base_url}/feed", params=params)
    except httpx.TimeoutException as exc:
        raise NASAUpstreamError("NASA API timeout") from exc
    except httpx.RequestError as exc:
        raise NASAUpstreamError(f"NASA API request error: {exc}") from exc

    if resp.status_code == 429:
        raise NASARateLimitError("NASA API rate limit exceeded")
    if not resp.is_success:
        raise NASAUpstreamError(f"NASA API error {resp.status_code}")

    return resp.json()


async def fetch_neo_detail(neo_id: str) -> dict:
    client = await _get_client()
    params = {"api_key": settings.nasa_api_key}
    try:
        resp = await client.get(f"{settings.nasa_base_url}/neo/{neo_id}", params=params)
    except httpx.TimeoutException as exc:
        raise NASAUpstreamError("NASA API timeout") from exc
    except httpx.RequestError as exc:
        raise NASAUpstreamError(f"NASA API request error: {exc}") from exc

    if resp.status_code == 429:
        raise NASARateLimitError("NASA API rate limit exceeded")
    if resp.status_code == 404:
        raise NASANotFoundError(f"NEO {neo_id} not found")
    if not resp.is_success:
        raise NASAUpstreamError(f"NASA API error {resp.status_code}")

    return resp.json()
