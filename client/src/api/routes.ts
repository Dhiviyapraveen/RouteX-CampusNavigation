import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "./client";

export type RouteResponse = {
  fromId: string;
  toId: string;
  distanceMeters: number;
  durationMinutes: number;
  geometry: [number, number][]; // [lat,lng]
};

export function useRoute() {
  return useMutation({
    mutationFn: async (input: { fromId: string; toId: string }) => {
      return apiFetch<RouteResponse>("/api/routes", {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
  });
}

