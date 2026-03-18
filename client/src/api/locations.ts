import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type { Location } from "../types";

export type ServerLocation = {
  id: string;
  name: string;
  category: Location["category"] | string;
  description?: string;
  image?: string;
  facilities?: string[];
  geo: { type: "Point"; coordinates: [number, number] }; // [lng, lat]
};

export function serverLocationToLocation(l: ServerLocation): Location {
  return {
    id: l.id,
    name: l.name,
    category: l.category as Location["category"],
    latitude: l.geo.coordinates[1],
    longitude: l.geo.coordinates[0],
    description: l.description,
    image: l.image,
    facilities: l.facilities,
  };
}

export function useLocations(params: {
  query?: string;
  category?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["locations", params],
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (params.query) qs.set("query", params.query);
      if (params.category) qs.set("category", params.category);
      if (params.limit) qs.set("limit", String(params.limit));

      const data = await apiFetch<{ locations: ServerLocation[] }>(
        `/api/locations?${qs.toString()}`,
      );
      return data.locations.map(serverLocationToLocation);
    },
  });
}

export function useNearLocations(params: {
  lat?: number;
  lng?: number;
  radiusMeters?: number;
  category?: string;
  limit?: number;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ["locationsNear", params],
    enabled:
      params.enabled === true &&
      Number.isFinite(params.lat) &&
      Number.isFinite(params.lng),
    queryFn: async () => {
      const qs = new URLSearchParams();
      qs.set("lat", String(params.lat));
      qs.set("lng", String(params.lng));
      if (params.radiusMeters) qs.set("radiusMeters", String(params.radiusMeters));
      if (params.category) qs.set("category", params.category);
      if (params.limit) qs.set("limit", String(params.limit));
      const data = await apiFetch<{ locations: ServerLocation[] }>(
        `/api/locations/near?${qs.toString()}`,
      );
      return data.locations.map(serverLocationToLocation);
    },
  });
}

