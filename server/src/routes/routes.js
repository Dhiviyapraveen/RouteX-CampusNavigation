import express from "express";
import { Location } from "../models/Location.js";
import { haversineDistanceMeters } from "../utils/haversine.js";

export const routesRouter = express.Router();

function osrmBaseUrl() {
  const raw = process.env.OSRM_BASE_URL?.trim();
  return raw ? raw.replace(/\/+$/, "") : "https://router.project-osrm.org";
}

function osrmProfile() {
  // `router.project-osrm.org` reliably supports `driving`.
  // If you run your own OSRM with other profiles (e.g. `foot`), set OSRM_PROFILE.
  return (process.env.OSRM_PROFILE ?? "driving").trim() || "driving";
}

async function fetchOsrmRoute(params) {
  const { fromLat, fromLng, toLat, toLng, timeoutMs = 8000 } = params;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const url =
      `${osrmBaseUrl()}/route/v1/${encodeURIComponent(osrmProfile())}/` +
      `${fromLng},${fromLat};${toLng},${toLat}` +
      `?overview=full&geometries=geojson&steps=false`;

    const resp = await fetch(url, { signal: controller.signal });
    if (!resp.ok) throw new Error(`OSRM route failed: ${resp.status}`);
    const data = await resp.json();

    const route = data?.routes?.[0];
    const coords = route?.geometry?.coordinates;
    if (!route || !Array.isArray(coords) || coords.length < 2) {
      throw new Error("OSRM route missing geometry");
    }

    return {
      distanceMeters: Number(route.distance) || 0,
      durationMinutes: (Number(route.duration) || 0) / 60,
      geometry: coords.map((c) => [c[1], c[0]]), // [lat,lng]
    };
  } finally {
    clearTimeout(t);
  }
}

routesRouter.post("/", async (req, res, next) => {
  try {
    const { fromId, toId, walkingSpeedMps } = req.body ?? {};
    if (!fromId || !toId) {
      res.status(400).json({ error: "fromId_toId_required" });
      return;
    }

    const [from, to] = await Promise.all([
      Location.findById(fromId),
      Location.findById(toId),
    ]);

    if (!from || !to) {
      res.status(404).json({ error: "location_not_found" });
      return;
    }

    const fromLat = from.geo.coordinates[1];
    const fromLng = from.geo.coordinates[0];
    const toLat = to.geo.coordinates[1];
    const toLng = to.geo.coordinates[0];

    let distanceMeters;
    let durationMinutes;
    let geometry;
    try {
      const osrm = await fetchOsrmRoute({ fromLat, fromLng, toLat, toLng });
      distanceMeters = osrm.distanceMeters;
      durationMinutes = osrm.durationMinutes;
      geometry = osrm.geometry;
    } catch {
      distanceMeters = haversineDistanceMeters(
        { lat: fromLat, lng: fromLng },
        { lat: toLat, lng: toLng },
      );

      const speed = Number.isFinite(Number(walkingSpeedMps))
        ? Math.max(0.5, Math.min(3, Number(walkingSpeedMps)))
        : 1.4;
      durationMinutes = distanceMeters / speed / 60;
      geometry = [
        [fromLat, fromLng],
        [toLat, toLng],
      ];
    }

    res.json({
      fromId: String(from.id),
      toId: String(to.id),
      distanceMeters,
      durationMinutes,
      geometry,
    });
  } catch (err) {
    next(err);
  }
});

