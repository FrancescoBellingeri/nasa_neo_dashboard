from app.schemas.neo import Asteroid, AsteroidDetail, CloseApproach, EstimatedDiameter
from app.schemas.stats import (
    DistanceDataPoint,
    LiveStats,
    SizeDataPoint,
    StatsResponse,
    VelocityDataPoint,
)


def _compute_danger_score(miss_distance_km: float, diameter_max_km: float) -> float:
    dist_factor = max(0.0, 1.0 - miss_distance_km / 1_000_000) * 70
    size_factor = min(diameter_max_km / 5.0, 1.0) * 30
    return round(min(dist_factor + size_factor, 100.0), 1)


def _parse_close_approach(raw: dict) -> CloseApproach:
    return CloseApproach(
        close_approach_date=raw["close_approach_date"],
        relative_velocity_kph=float(raw["relative_velocity"]["kilometers_per_hour"]),
        miss_distance_km=float(raw["miss_distance"]["kilometers"]),
        orbiting_body=raw["orbiting_body"],
    )


def _transform_raw_asteroid(raw: dict) -> Asteroid:
    diameter = raw["estimated_diameter"]["kilometers"]
    min_km = float(diameter["estimated_diameter_min"])
    max_km = float(diameter["estimated_diameter_max"])

    approaches = raw.get("close_approach_data", [])
    parsed_approaches = [_parse_close_approach(a) for a in approaches]

    best = min(parsed_approaches, key=lambda a: a.miss_distance_km) if parsed_approaches else None

    if best is None:
        best = CloseApproach(
            close_approach_date="N/A",
            relative_velocity_kph=0.0,
            miss_distance_km=0.0,
            orbiting_body="N/A",
        )

    danger = _compute_danger_score(best.miss_distance_km, max_km)

    return Asteroid(
        id=raw["id"],
        name=raw["name"],
        nasa_jpl_url=raw["nasa_jpl_url"],
        is_potentially_hazardous=raw["is_potentially_hazardous_asteroid"],
        estimated_diameter=EstimatedDiameter(min_km=min_km, max_km=max_km),
        close_approach=best,
        danger_score=danger,
    )


def transform_feed_chunks(chunks: list[dict], start_date: str, end_date: str) -> dict:
    seen: set[str] = set()
    asteroids: list[Asteroid] = []

    for chunk in chunks:
        for _date, day_list in chunk.get("near_earth_objects", {}).items():
            for raw in day_list:
                if raw["id"] in seen:
                    continue
                seen.add(raw["id"])
                asteroids.append(_transform_raw_asteroid(raw))

    asteroids.sort(key=lambda a: a.close_approach.miss_distance_km)

    return {
        "asteroids": [a.model_dump() for a in asteroids],
        "total_count": len(asteroids),
        "date_range_start": start_date,
        "date_range_end": end_date,
    }


def transform_neo_detail(raw: dict) -> dict:
    base = _transform_raw_asteroid(raw)
    all_approaches = [_parse_close_approach(a) for a in raw.get("close_approach_data", [])]
    all_approaches.sort(key=lambda a: a.close_approach_date, reverse=True)

    orbital_raw = raw.get("orbital_data")
    orbital: dict | None = None
    if orbital_raw:
        orbital = {
            "orbit_id": orbital_raw.get("orbit_id"),
            "orbit_determination_date": orbital_raw.get("orbit_determination_date"),
            "first_observation_date": orbital_raw.get("first_observation_date"),
            "last_observation_date": orbital_raw.get("last_observation_date"),
            "semi_major_axis": orbital_raw.get("semi_major_axis"),
            "eccentricity": orbital_raw.get("eccentricity"),
            "inclination": orbital_raw.get("inclination"),
            "ascending_node_longitude": orbital_raw.get("ascending_node_longitude"),
            "orbital_period": orbital_raw.get("orbital_period"),
            "perihelion_distance": orbital_raw.get("perihelion_distance"),
            "aphelion_distance": orbital_raw.get("aphelion_distance"),
            "orbit_class": orbital_raw.get("orbit_class", {}).get("orbit_class_type"),
            "orbit_class_description": orbital_raw.get("orbit_class", {}).get("orbit_class_description"),
        }

    detail = AsteroidDetail(
        **base.model_dump(),
        absolute_magnitude_h=raw.get("absolute_magnitude_h"),
        orbital_data=orbital,
        all_close_approaches=all_approaches,
    )
    return detail.model_dump()


def build_stats(asteroids_raw: list[dict]) -> dict:
    if not asteroids_raw:
        return StatsResponse(
            live_stats=LiveStats(
                total_asteroids=0,
                hazardous_count=0,
                hazardous_pct=0.0,
                closest_approach_km=0.0,
                closest_approach_name="N/A",
                avg_velocity_kph=0.0,
                largest_diameter_km=0.0,
            ),
            distance_timeline=[],
            size_distribution=[],
            hazard_ratio={"hazardous": 0, "safe": 0},
            velocity_distribution=[],
        ).model_dump()

    total = len(asteroids_raw)
    hazardous = sum(1 for a in asteroids_raw if a["is_potentially_hazardous"])
    closest = min(asteroids_raw, key=lambda a: a["close_approach"]["miss_distance_km"])
    largest = max(asteroids_raw, key=lambda a: a["estimated_diameter"]["max_km"])
    avg_vel = sum(a["close_approach"]["relative_velocity_kph"] for a in asteroids_raw) / total

    # Distance timeline
    timeline = [
        DistanceDataPoint(
            date=a["close_approach"]["close_approach_date"],
            name=a["name"],
            miss_distance_km=a["close_approach"]["miss_distance_km"],
            is_hazardous=a["is_potentially_hazardous"],
            danger_score=a["danger_score"],
        )
        for a in asteroids_raw
    ]
    timeline.sort(key=lambda p: p.date)

    # Size distribution
    size_buckets = [
        ("< 0.1 km", 0, 0.1),
        ("0.1–0.5 km", 0.1, 0.5),
        ("0.5–1 km", 0.5, 1.0),
        ("1–2 km", 1.0, 2.0),
        ("> 2 km", 2.0, float("inf")),
    ]
    size_dist: list[SizeDataPoint] = []
    for label, lo, hi in size_buckets:
        count = sum(1 for a in asteroids_raw if lo <= a["estimated_diameter"]["max_km"] < hi)
        size_dist.append(SizeDataPoint(bucket=label, count=count))

    # Velocity distribution
    vel_buckets = [
        ("< 20k km/h", 0, 20_000),
        ("20k–50k", 20_000, 50_000),
        ("50k–100k", 50_000, 100_000),
        ("100k–200k", 100_000, 200_000),
        ("> 200k km/h", 200_000, float("inf")),
    ]
    vel_dist: list[VelocityDataPoint] = []
    for label, lo, hi in vel_buckets:
        count = sum(1 for a in asteroids_raw if lo <= a["close_approach"]["relative_velocity_kph"] < hi)
        vel_dist.append(VelocityDataPoint(bucket=label, count=count))

    return StatsResponse(
        live_stats=LiveStats(
            total_asteroids=total,
            hazardous_count=hazardous,
            hazardous_pct=round(hazardous / total * 100, 1),
            closest_approach_km=closest["close_approach"]["miss_distance_km"],
            closest_approach_name=closest["name"],
            avg_velocity_kph=round(avg_vel, 1),
            largest_diameter_km=round(largest["estimated_diameter"]["max_km"], 4),
        ),
        distance_timeline=timeline,
        size_distribution=size_dist,
        hazard_ratio={"hazardous": hazardous, "safe": total - hazardous},
        velocity_distribution=vel_dist,
    ).model_dump()
