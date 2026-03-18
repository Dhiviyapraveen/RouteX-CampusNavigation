import express from "express";
import { Location } from "../models/Location.js";

export const locationsRouter = express.Router();

function parseLimit(val, fallback) {
  const n = Number(val);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.min(200, Math.floor(n)));
}

locationsRouter.get("/", async (req, res, next) => {
  try {
    const query = String(req.query.query ?? "").trim();
    const category = String(req.query.category ?? "").trim();
    const limit = parseLimit(req.query.limit, 100);

    const filter = {};
    if (category && category !== "All") filter.category = category;

    let cursor;
    if (query) {
      cursor = Location.find(
        { ...filter, $text: { $search: query } },
        { score: { $meta: "textScore" } },
      ).sort({ score: { $meta: "textScore" } });
    } else {
      cursor = Location.find(filter).sort({ name: 1 });
    }

    const locations = await cursor.limit(limit);
    res.json({ locations });
  } catch (err) {
    next(err);
  }
});

locationsRouter.get("/near", async (req, res, next) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radiusMeters = Number(req.query.radiusMeters ?? 500);
    const category = String(req.query.category ?? "").trim();
    const limit = parseLimit(req.query.limit, 20);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      res.status(400).json({ error: "lat_lng_required" });
      return;
    }

    const filter = {};
    if (category && category !== "All") filter.category = category;

    const locations = await Location.find({
      ...filter,
      geo: {
        $nearSphere: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: Math.max(1, radiusMeters),
        },
      },
    }).limit(limit);

    res.json({ locations });
  } catch (err) {
    next(err);
  }
});

locationsRouter.get("/:id", async (req, res, next) => {
  try {
    const loc = await Location.findById(req.params.id);
    if (!loc) {
      res.status(404).json({ error: "not_found" });
      return;
    }
    res.json({ location: loc });
  } catch (err) {
    next(err);
  }
});

