import React, { useCallback, useEffect, useState } from "react";
import { Navigation } from "lucide-react";

import Navbar from "@/components/Navbar";
import FloatingSearch from "@/components/ui/FloatingSearch";
import FilterChips from "@/components/ui/FilterChips";
import CampusMap from "@/components/CampusMap";
import RoutingPanel from "@/components/RoutingPanel";
import DetailsModal from "@/components/DetailsModal";
import MobileDetailsDrawer from "@/components/ui/MobileDetailsDrawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useLocations } from "@/api/locations";
import { Category, Location } from "@/types";
import type { MapThemeId } from "@/components/ui/MapThemeSwitch";

const CAMPUS_CENTER: [number, number] = [10.8275607252157, 77.06050227059016];

export default function Index() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [mapTheme, setMapTheme] = useState<MapThemeId>("osm");
  const [showRouting, setShowRouting] = useState(false);
  const [source, setSource] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [routeMetrics, setRouteMetrics] = useState<{ distanceMeters: number; durationMinutes: number } | null>(null);

  const [mapState, setMapState] = useState<{ center: [number, number]; zoom: number }>({
    center: CAMPUS_CENTER,
    zoom: 25,
  });

  const allLocationsQuery = useLocations({ limit: 200 });
  const displayedLocationsQuery = useLocations({
    query: searchQuery || undefined,
    category: selectedCategory === "All" ? undefined : selectedCategory,
    limit: 200,
  });
  const allLocations = allLocationsQuery.data ?? [];
  const filteredLocations = displayedLocationsQuery.data ?? [];

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q) {
      const match = allLocations.find((l) => l.name.toLowerCase().includes(q.toLowerCase()));
      if (match) setMapState({ center: [match.latitude, match.longitude], zoom: 19 });
    } else {
      setMapState({ center: CAMPUS_CENTER, zoom: 17 });
    }
  };

  const handleCategoryChange = (cat: Category | "All") => {
    setSelectedCategory(cat);
    setMapState({ center: CAMPUS_CENTER, zoom: 17 });
  };

  useEffect(() => {
    if (!source || !destination) {
      setRouteMetrics(null);
    }
  }, [destination, source]);

  const handleRouteFound = useCallback((m: { distanceMeters: number; durationMinutes: number }) => {
    setRouteMetrics({ distanceMeters: m.distanceMeters, durationMinutes: m.durationMinutes });
  }, []);

  return (
    <div className="app-bg relative h-svh w-full overflow-hidden">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute animate-pulse-slow"
          style={{
            top: "-20%",
            left: "-15%",
            width: "55%",
            height: "55%",
            background: "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          className="absolute animate-float"
          style={{
            bottom: "-20%",
            right: "-15%",
            width: "50%",
            height: "50%",
            background: "radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid h-svh max-w-[1600px] grid-cols-1 gap-4 px-4 pb-4 pt-20 sm:px-6 sm:pb-5 lg:grid-cols-[420px_1fr]">
        {/* Sidebar */}
        <aside className={cn("min-h-0", isDesktop ? "block" : "hidden")}>
          <div className="glass-panel h-full rounded-[28px] p-5 shadow-[0_32px_80px_-20px_rgba(2,6,23,0.55)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-pretty text-2xl font-black tracking-tight text-foreground">Campus Navigator</h2>
                <p className="mt-1 text-sm font-medium leading-relaxed text-muted-foreground">
                  Smart search, filters, and precise routing.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowRouting((v) => !v)}
                  className={cn(
                    "h-10 rounded-xl px-4 font-extrabold tracking-tight transition active:scale-[0.98]",
                    showRouting
                      ? "bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_12px_30px_rgba(99,102,241,0.25)] hover:opacity-95"
                      : "bg-background/30 text-foreground backdrop-blur hover:bg-accent/60",
                  )}
                  variant={showRouting ? "default" : "outline"}
                >
                  <Navigation className={cn("size-4 transition-transform", showRouting && "rotate-12")} />
                  Route
                </Button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <FloatingSearch
                locations={allLocations}
                onSearch={handleSearch}
                onSelect={(loc) => {
                  setSelectedLocation(loc);
                  setMapState({ center: [loc.latitude, loc.longitude], zoom: 19 });
                }}
              />

              <FilterChips selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />

              {showRouting && (
                <div className="pt-1">
                  <RoutingPanel
                    locations={allLocations}
                    source={source}
                    destination={destination}
                    onSourceChange={setSource}
                    onDestinationChange={setDestination}
                    onClose={() => setShowRouting(false)}
                    distance={routeMetrics?.distanceMeters}
                    duration={routeMetrics?.durationMinutes}
                  />
                </div>
              )}
            </div>

            <div className="mt-5 border-t border-border/60 pt-4 text-xs font-semibold text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>&copy; {new Date().getFullYear()} Sri Eshwar College</span>
                <span className="font-black text-indigo-500">RouteX</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Map canvas */}
        <main className="min-h-0">
          <div
            className={cn(
              "relative h-full w-full overflow-hidden rounded-[28px] border border-border/60",
              "shadow-[0_32px_80px_-20px_rgba(2,6,23,0.65),inset_0_1px_0_rgba(255,255,255,0.05)]",
            )}
          >
            {!isDesktop && (
              <div className="absolute left-4 right-4 top-4 z-[1200] space-y-3">
                <FloatingSearch
                  locations={allLocations}
                  onSearch={handleSearch}
                  onSelect={(loc) => {
                    setSelectedLocation(loc);
                    setMapState({ center: [loc.latitude, loc.longitude], zoom: 19 });
                  }}
                />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <FilterChips selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
                  </div>
                  <Button
                    onClick={() => setShowRouting((v) => !v)}
                    size="icon"
                    className={cn(
                      "h-[52px] w-[52px] rounded-2xl",
                      showRouting
                        ? "bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_12px_30px_rgba(99,102,241,0.25)] hover:opacity-95"
                        : "bg-background/30 text-foreground backdrop-blur hover:bg-accent/60",
                    )}
                    variant={showRouting ? "default" : "outline"}
                    aria-label="Toggle routing panel"
                    title="Route"
                  >
                    <Navigation className={cn("size-4 transition-transform", showRouting && "rotate-12")} />
                  </Button>
                </div>
              </div>
            )}

            {showRouting && !isDesktop && (
              <div className="absolute left-4 top-[148px] z-[1200]" style={{ animation: "fade-up 0.25s ease-out forwards" }}>
                <RoutingPanel
                  locations={allLocations}
                  source={source}
                  destination={destination}
                  onSourceChange={setSource}
                  onDestinationChange={setDestination}
                  onClose={() => setShowRouting(false)}
                  distance={routeMetrics?.distanceMeters}
                  duration={routeMetrics?.durationMinutes}
                />
              </div>
            )}

            <CampusMap
              locations={filteredLocations}
              center={mapState.center}
              zoom={mapState.zoom}
              routeWaypoints={
                source && destination
                  ? [
                      [source.latitude, source.longitude],
                      [destination.latitude, destination.longitude],
                    ]
                  : undefined
              }
              onRouteFound={handleRouteFound}
              mapTheme={mapTheme}
              onMapThemeChange={setMapTheme}
              onShowDetails={(loc) => setSelectedLocation(loc)}
            />
          </div>
        </main>
      </div>

      {isMobile ? (
        <MobileDetailsDrawer location={selectedLocation} onClose={() => setSelectedLocation(null)} />
      ) : (
        <DetailsModal location={selectedLocation} onClose={() => setSelectedLocation(null)} />
      )}
    </div>
  );
}
