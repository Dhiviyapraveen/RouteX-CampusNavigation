import { useEffect, useMemo, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

// Leaflet Routing Machine registers itself onto L.Routing
import "leaflet-routing-machine";

type LatLngTuple = [number, number];

export default function RoutingMachine(props: {
  waypoints?: LatLngTuple[];
  onRouteFound?: (m: { distanceMeters: number; durationMinutes: number }) => void;
}) {
  const map = useMap();
  const controlRef = useRef<L.Routing.Control | null>(null);
  const onRouteFoundRef = useRef<typeof props.onRouteFound>(props.onRouteFound);

  useEffect(() => {
    onRouteFoundRef.current = props.onRouteFound;
  }, [props.onRouteFound]);

  const waypoints = useMemo(() => {
    if (!props.waypoints || props.waypoints.length < 2) return null;
    return props.waypoints.map(([lat, lng]) => L.latLng(lat, lng));
  }, [props.waypoints]);

  useEffect(() => {
    if (controlRef.current) return;

    // Use OSRM demo server (driving) for reliability.
    const router = L.Routing.osrmv1({
      serviceUrl: "https://router.project-osrm.org/route/v1",
      profile: "driving",
      timeout: 10_000,
    });

    const control = L.Routing.control({
      waypoints: [],
      router,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      show: false, // hide the instructions panel
      routeWhileDragging: false,
      createMarker: () => null,
      lineOptions: {
        styles: [
          { color: "rgba(0,0,0,0.25)", weight: 10, opacity: 0.55 },
          {
            color: "#6366f1",
            weight: 6,
            opacity: 0.9,
            dashArray: "2 10",
            lineCap: "round",
          },
        ],
      },
    });

    const onRoutesFound = (e: { routes: Array<{ summary: { totalDistance: number; totalTime: number } }> }) => {
      const s = e?.routes?.[0]?.summary;
      if (!s) return;
      onRouteFoundRef.current?.({
        distanceMeters: Number(s.totalDistance) || 0,
        durationMinutes: (Number(s.totalTime) || 0) / 60,
      });
    };

    const onRoutingError = () => {};

    control.on("routesfound", onRoutesFound);
    control.on("routingerror", onRoutingError as never);
    control.addTo(map);
    controlRef.current = control;

    return () => {
      // Best-effort cleanup: during in-flight requests LRM can throw if removed.
      // Guarded to avoid crashing React.
      try {
        control.off("routesfound", onRoutesFound);
        control.off("routingerror", onRoutingError as never);
        control.remove();
      } catch {
        // ignore
      } finally {
        controlRef.current = null;
      }
    };
  }, [map]);

  useEffect(() => {
    const control = controlRef.current;
    if (!control) return;

    if (!waypoints) {
      // Clear line + metrics
      try {
        control.setWaypoints([]);
      } catch {
        // ignore
      }
      return;
    }

    try {
      control.setWaypoints(waypoints);
    } catch {
      // ignore
    }
  }, [waypoints]);

  return null;
}

