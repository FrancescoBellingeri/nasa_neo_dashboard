from typing import Any, Optional

from pydantic import BaseModel


class CloseApproach(BaseModel):
    close_approach_date: str
    relative_velocity_kph: float
    miss_distance_km: float
    orbiting_body: str


class EstimatedDiameter(BaseModel):
    min_km: float
    max_km: float


class Asteroid(BaseModel):
    id: str
    name: str
    nasa_jpl_url: str
    is_potentially_hazardous: bool
    estimated_diameter: EstimatedDiameter
    close_approach: CloseApproach
    danger_score: float


class AsteroidDetail(Asteroid):
    absolute_magnitude_h: Optional[float]
    orbital_data: Optional[dict[str, Any]]
    all_close_approaches: list[CloseApproach]


class FeedResponse(BaseModel):
    asteroids: list[Asteroid]
    total_count: int
    date_range_start: str
    date_range_end: str
