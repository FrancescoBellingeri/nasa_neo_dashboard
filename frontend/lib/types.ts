export interface CloseApproach {
  close_approach_date: string;
  relative_velocity_kph: number;
  miss_distance_km: number;
  orbiting_body: string;
}

export interface EstimatedDiameter {
  min_km: number;
  max_km: number;
}

export interface Asteroid {
  id: string;
  name: string;
  nasa_jpl_url: string;
  is_potentially_hazardous: boolean;
  estimated_diameter: EstimatedDiameter;
  close_approach: CloseApproach;
  danger_score: number;
}

export interface AsteroidDetail extends Asteroid {
  absolute_magnitude_h: number | null;
  orbital_data: OrbitalData | null;
  all_close_approaches: CloseApproach[];
}

export interface OrbitalData {
  orbit_id: string | null;
  orbit_determination_date: string | null;
  first_observation_date: string | null;
  last_observation_date: string | null;
  semi_major_axis: string | null;
  eccentricity: string | null;
  inclination: string | null;
  ascending_node_longitude: string | null;
  orbital_period: string | null;
  perihelion_distance: string | null;
  aphelion_distance: string | null;
  orbit_class: string | null;
  orbit_class_description: string | null;
}

export interface FeedResponse {
  asteroids: Asteroid[];
  total_count: number;
  date_range_start: string;
  date_range_end: string;
}

export interface LiveStats {
  total_asteroids: number;
  hazardous_count: number;
  hazardous_pct: number;
  closest_approach_km: number;
  closest_approach_name: string;
  avg_velocity_kph: number;
  largest_diameter_km: number;
}

export interface DistanceDataPoint {
  date: string;
  name: string;
  miss_distance_km: number;
  is_hazardous: boolean;
  danger_score: number;
}

export interface SizeDataPoint {
  bucket: string;
  count: number;
}

export interface VelocityDataPoint {
  bucket: string;
  count: number;
}

export interface StatsResponse {
  live_stats: LiveStats;
  distance_timeline: DistanceDataPoint[];
  size_distribution: SizeDataPoint[];
  hazard_ratio: { hazardous: number; safe: number };
  velocity_distribution: VelocityDataPoint[];
}

export type SortField =
  | "miss_distance_km"
  | "diameter_max_km"
  | "relative_velocity_kph"
  | "danger_score"
  | "name";

export type SortDirection = "asc" | "desc";

export interface FeedFilters {
  hazardousOnly: boolean | null;
  nameSearch: string;
  distanceMin: number | null;
  distanceMax: number | null;
}

export interface ApiError {
  error: "rate_limit" | "upstream_error" | "unknown";
  message: string;
  status: number;
}
