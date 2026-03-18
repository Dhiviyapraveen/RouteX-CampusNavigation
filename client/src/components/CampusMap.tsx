import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Location } from "../types";
import AnimatedMarker from "./ui/AnimatedMarker";
import MapThemeSwitch, { MapThemeId } from "./ui/MapThemeSwitch";
import RoutingMachine from "./ui/RoutingMachine";

interface MapUpdaterProps {
  center: [number, number];
  zoom: number;
}

const MapUpdater: React.FC<MapUpdaterProps> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

const MapResizer: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    // Leaflet often renders partially when the container size changes after mount (grid/sidebar, fonts, etc.)
    const id = window.setTimeout(() => map.invalidateSize({ pan: false }), 0);

    const container = map.getContainer();
    const ro = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    ro.observe(container);

    const onResize = () => map.invalidateSize({ pan: false });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.clearTimeout(id);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [map]);

  return null;
};

interface CampusMapProps {
  locations: Location[];
  center: [number, number];
  zoom: number;
  routeWaypoints?: [number, number][];
  onRouteFound?: (m: { distanceMeters: number; durationMinutes: number }) => void;
  mapTheme: MapThemeId;
  onMapThemeChange: (t: MapThemeId) => void;
  onShowDetails?: (location: Location) => void;
}

const CampusMap: React.FC<CampusMapProps> = ({
  locations,
  center,
  zoom,
  routeWaypoints,
  onRouteFound,
  mapTheme,
  onMapThemeChange,
  onShowDetails,
}) => {
  const tile = (() => {
    switch (mapTheme) {
      case "osm-hot":
        return {
          url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Tiles style by <a href="https://www.hotosm.org/">Humanitarian OpenStreetMap Team</a>',
        };
      case "carto-light":
        return {
          url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            '&copy; <a href="https://carto.com/attributions">CARTO</a>',
        };
      case "carto-dark":
        return {
          url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            '&copy; <a href="https://carto.com/attributions">CARTO</a>',
        };
      case "carto-voyager":
        return {
          url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            '&copy; <a href="https://carto.com/attributions">CARTO</a>',
        };
      case "esri-satellite":
        return {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            "Tiles &copy; Esri",
        };
      case "osm":
      default:
        return {
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        };
    }
  })();

  return (
    <div
      className="w-full h-full relative"
      style={{ borderRadius: "inherit", overflow: "hidden" }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full campus-map"
        zoomControl={true}
      >
        <TileLayer url={tile.url} attribution={tile.attribution} />
        {locations.map((loc) => (
          <AnimatedMarker
            key={loc.name}
            location={loc}
            onSelect={onShowDetails!}
          />
        ))}
        <RoutingMachine waypoints={routeWaypoints} onRouteFound={onRouteFound} />
        <MapResizer />
        <MapUpdater center={center} zoom={zoom} />
      </MapContainer>

      <MapThemeSwitch
        value={mapTheme}
        onChange={onMapThemeChange}
        className="absolute right-4 top-4 z-[1200]"
      />

      <div
        className="glass-panel pointer-events-none absolute bottom-5 left-5 z-[1000] flex items-center gap-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2 shadow-[0_10px_30px_rgba(2,6,23,0.22)]"
        style={{ animation: "fade-up 0.6s ease-out 0.5s both" }}
      >
        <div
          className="w-2 h-2 rounded-full bg-emerald-400"
          style={{
            boxShadow: "0 0 10px #34d399",
            animation: "live-dot 1.8s ease-in-out infinite",
          }}
        />
        <span className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-300">
          Live Campus Intelligence
        </span>
      </div>
    </div>
  );
};

export default CampusMap;
