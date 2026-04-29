# 🚀 NASA Near-Earth Objects Dashboard

A full-stack dashboard to explore near-Earth asteroids using real NASA data.
This project transforms raw data into clear, interactive, and meaningful visualizations.

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
│   ├── services/
│   │   └── nasa_client.py
│   ├── core/
│   │   └── config.py
│   ├── db/
│   └── schemas/
├── requirements.txt
└── .env
```

---

### Frontend

```
frontend/
├── app/
├── components/
│   ├── ui/
│   └── charts/
├── lib/
├── hooks/
└── styles/
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

* Deploy backend on Railway / Render / Fly.io
* Deploy frontend on Vercel
* Store environment variables securely in platform settings

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
