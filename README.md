# Smart Campus Navigation System (MERN)

This repo is structured as:
- `client/` — React (Vite + Leaflet) frontend
- `server/` — Node/Express + MongoDB (geospatial) backend

## Run locally

### 1) Start MongoDB
Use local MongoDB or MongoDB Atlas. The server reads `MONGODB_URI`.

### 2) Server

```bash
cd server
npm install
cp .env.example .env
npm run seed
npm run dev
```

APIs:
- `GET /api/health`
- `GET /api/locations?query=&category=&limit=`
- `GET /api/locations/near?lat=&lng=&radiusMeters=&category=&limit=`
- `GET /api/locations/:id`
- `POST /api/routes` body `{ "fromId": "...", "toId": "..." }`

### 3) Client

```bash
cd client
npm install
npm run dev
```

Client runs on `http://127.0.0.1:8080` and proxies `/api/*` to `http://localhost:3001`.

