# 🚀 NASA Near-Earth Objects Dashboard

A full-stack dashboard to explore near-Earth asteroids using real NASA data.
This project transforms raw data into clear, interactive, and meaningful visualizations.

**🌐 Live Demo:** [https://nasa-neo-dashboard.vercel.app/](https://nasa-neo-dashboard.vercel.app/)

---

## 📌 Overview

This application allows users to:

* Explore asteroids within a custom date range
* Filter and sort results
* Visualize data through interactive charts
* Inspect detailed information for each asteroid

The system follows a **client-server architecture**:

* **FastAPI backend** handles data fetching, caching, and business logic
* **Next.js frontend** manages UI, routing, and data visualization

---

## 🧱 Tech Stack

### Backend

* FastAPI
* HTTPX (async HTTP client)
* Redis (caching layer)
* FastAPI Cache
* Pydantic Settings (configuration management)
* Python Dateutil

### Frontend

* Next.js (App Router)
* Shadcn UI
* Recharts

### Deployment

* Backend: Railway / Render / Fly.io
* Frontend: Vercel

---

## ⚙️ Features

### 1. Backend Proxy with Caching

* The frontend **never calls the NASA API directly**
* The backend:

  * Manages the API key
  * Caches responses
  * Parses and normalizes data
* Reduces API calls and prevents rate limit issues

---

### 2. Advanced Date Range Handling

* NASA API supports a maximum of **7 days per request**
* The backend:

  * Splits large ranges into chunks
  * Executes multiple requests
  * Aggregates results into a single response

---

### 3. Asteroid List

Each asteroid includes:

* Name
* Minimum distance from Earth
* Estimated diameter (min/max)
* Relative velocity
* Potential hazard classification

Features:

* Filtering (hazardous / non-hazardous)
* Sorting (distance, size)

---

### 4. Data Visualization

Interactive charts:

* 📈 Distance over time
* 📊 Size distribution

---

### 5. Asteroid Detail View

Dedicated page with:

* Full asteroid data
* Close approach history
* Orbital data
* Official NASA JPL link

---

### 6. Robust UX

* Skeleton loaders
* Clear error handling (rate limits, invalid input)
* Empty state handling
* Responsive and user-friendly interface

---

## 📁 Project Structure

### Backend

```
backend/
├── app/
│   ├── main.py
│   ├── api/
│   │   └── v1/
│   │       ├── router.py
│   │       └── endpoints/
│   │           ├── feed.py     # GET /api/v1/feed
│   │           ├── neo.py      # GET /api/v1/neo/{id}
│   │           └── stats.py    # GET /api/v1/stats
│   ├── core/
│   │   ├── config.py           # pydantic-settings (API key, Redis URL, TTLs)
│   │   └── cache.py            # Redis client + cache-aside helpers
│   ├── schemas/
│   │   ├── neo.py              # Asteroid, CloseApproach, FeedResponse
│   │   └── stats.py            # StatsResponse, chart data models
│   └── services/
│       ├── nasa_client.py      # HTTPX async client, custom exceptions
│       ├── chunker.py          # splits date range into 7-day chunks
│       └── transformer.py      # raw NASA JSON → schemas + danger_score
├── Dockerfile
├── render.yaml
├── requirements.txt
└── .env
```

---

### Frontend

```
frontend/
├── app/
│   ├── layout.tsx              # dark theme, parallel route slot {modal}
│   ├── page.tsx                # Server Component, initial 7-day fetch
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── globals.css
│   ├── @modal/
│   │   ├── default.tsx
│   │   └── (.)asteroids/[id]/
│   │       └── page.tsx        # intercepting route → modal overlay
│   └── asteroids/[id]/
│       ├── page.tsx            # full asteroid detail page
│       └── loading.tsx
├── components/
│   ├── ui/                     # shadcn: badge, button, dialog, input,
│   │                           #         select, skeleton, table, tooltip
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── LiveStatsBar.tsx
│   ├── dashboard/
│   │   ├── DashboardClient.tsx
│   │   ├── DateRangePicker.tsx
│   │   ├── FilterPanel.tsx     # search, sort, hazardous toggle, CSV export
│   │   ├── AsteroidTable.tsx
│   │   ├── AsteroidRow.tsx
│   │   ├── DangerBadge.tsx     # SVG ring colored by danger_score
│   │   └── ThreatPanel.tsx     # top hazardous with live countdown
│   ├── charts/
│   │   ├── ChartCard.tsx
│   │   ├── DistanceTimeline.tsx
│   │   ├── SizeHistogram.tsx
│   │   ├── HazardDonut.tsx
│   │   └── VelocityChart.tsx
│   └── asteroid/
│       ├── AsteroidDetailCard.tsx
│       ├── AsteroidModal.tsx
│       ├── CloseApproachTable.tsx
│       └── OrbitalDataPanel.tsx  # canvas orbit simulator
├── hooks/
│   ├── useFeed.ts              # date range, filters, sort, pagination state
│   └── useDebounce.ts
├── lib/
│   ├── api.ts                  # typed fetch wrappers for all endpoints
│   ├── types.ts                # all TS interfaces
│   ├── formatters.ts           # formatKm, formatKph, formatDate, etc.
│   └── utils.ts
└── .env.local
```

---

## 🔑 Configuration

Create a `.env` file in the backend directory:

```
NASA_API_KEY=your_api_key_here
REDIS_URL=redis://localhost:6379
```

You can obtain a free API key from the official NASA API portal.

---

## ▶️ Running the Project

### Backend

```
cd backend
python -m venv venv
source venv/bin/activate          # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API will be available at:

```
http://localhost:8000
```

Docs:

```
http://localhost:8000/docs
```

---

### Frontend

```
cd frontend
npm install
npm run dev
```

App will run at:

```
http://localhost:3000
```

---

## 🚀 Deployment

### Backend → Render

1. Push repo to GitHub
2. [render.com](https://render.com) → New → Blueprint → connect repo → point to `backend/render.yaml`
3. Render creates web service + Redis automatically
4. Add env vars in the Render dashboard:
   - `NASA_API_KEY` — get free key at [api.nasa.gov](https://api.nasa.gov)
   - `FRONTEND_URL` — your Vercel URL (add after frontend deploy)
5. Copy the Render service URL (e.g. `https://nasa-neo-backend.onrender.com`)

### Frontend → Vercel

1. [vercel.com](https://vercel.com) → New Project → import repo
2. Set **Root Directory** → `frontend`
3. Add env var:
   - `NEXT_PUBLIC_BACKEND_URL` = your Render backend URL
4. Deploy

---

## 🧠 Design Considerations

* Avoid direct client calls to external APIs
* Respect API rate limits via caching
* Normalize inconsistent external data
* Keep business logic separate from API routes
* Build reusable and maintainable components

---

## 📈 Future Improvements

* Authentication system
* Persistent database (PostgreSQL)
* Advanced filtering and search
* Real-time updates
* Improved data analytics

---

## 📜 License

This project is for educational and portfolio purposes.

---

## ✨ Acknowledgments

Data provided by NASA Near-Earth Object Web Service (NeoWs).
