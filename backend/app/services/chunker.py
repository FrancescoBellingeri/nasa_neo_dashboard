from datetime import date

import pendulum


def chunk_date_range(start: date, end: date, chunk_size: int = 7) -> list[tuple[date, date]]:
    """Split [start, end] into consecutive chunks of at most chunk_size days."""
    chunks: list[tuple[date, date]] = []
    cursor = pendulum.instance(pendulum.datetime(start.year, start.month, start.day))
    end_dt = pendulum.instance(pendulum.datetime(end.year, end.month, end.day))

    while cursor <= end_dt:
        chunk_end = min(cursor.add(days=chunk_size - 1), end_dt)
        chunks.append((cursor.date(), chunk_end.date()))
        cursor = chunk_end.add(days=1)

    return chunks
