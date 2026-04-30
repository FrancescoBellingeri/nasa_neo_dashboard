from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    nasa_api_key: str = "DEMO_KEY"
    redis_url: str = "redis://localhost:6379"
    nasa_base_url: str = "https://api.nasa.gov/neo/rest/v1"
    allowed_origins: str = "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000"

    cache_ttl_feed: int = 3600
    cache_ttl_neo: int = 86400
    cache_ttl_stats: int = 1800

    log_level: str = "INFO"
    max_date_range_days: int = 90


settings = Settings()
