# Smart Campus Navigation System

React (Leaflet) client + Express/Mongo geospatial backend.

## Prereqs
- Node.js installed
- MongoDB running locally (or use a hosted MongoDB URI)

## Setup

### 1) Server

```bash
cd server
npm install
cp .env.example .env
npm run seed
npm run dev
```

Server runs on `http://localhost:3001` and exposes:
- `GET /api/health`
- `GET /api/locations?query=&category=&limit=`
- `GET /api/locations/near?lat=&lng=&radiusMeters=&category=&limit=`
- `GET /api/locations/:id`
- `POST /api/routes` body `{ "fromId": "...", "toId": "..." }`

### 2) Client

```bash
cd client
npm install
npm run dev
```

Client runs on `http://localhost:8080` and proxies `/api/*` to the server via `vite.config.ts`.
