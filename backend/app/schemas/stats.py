from pydantic import BaseModel


class LiveStats(BaseModel):
    total_asteroids: int
    hazardous_count: int
    hazardous_pct: float
    closest_approach_km: float
    closest_approach_name: str
    avg_velocity_kph: float
    largest_diameter_km: float


class DistanceDataPoint(BaseModel):
    date: str
    name: str
    miss_distance_km: float
    is_hazardous: bool
    danger_score: float


class SizeDataPoint(BaseModel):
    bucket: str
    count: int


class VelocityDataPoint(BaseModel):
    bucket: str
    count: int


class StatsResponse(BaseModel):
    live_stats: LiveStats
    distance_timeline: list[DistanceDataPoint]
    size_distribution: list[SizeDataPoint]
    hazard_ratio: dict[str, int]
    velocity_distribution: list[VelocityDataPoint]
