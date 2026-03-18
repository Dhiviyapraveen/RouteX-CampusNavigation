import React from "react";
import { Layers } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type MapThemeId =
  | "osm"
  | "osm-hot"
  | "carto-light"
  | "carto-dark"
  | "carto-voyager"
  | "esri-satellite";

export const MAP_THEMES: { id: MapThemeId; label: string }[] = [
  { id: "osm", label: "OSM Default" },
  { id: "osm-hot", label: "OSM HOT" },
  { id: "carto-light", label: "CARTO Light" },
  { id: "carto-dark", label: "CARTO Dark" },
  { id: "carto-voyager", label: "CARTO Voyager" },
  { id: "esri-satellite", label: "Esri Satellite" },
];

export default function MapThemeSwitch(props: {
  value: MapThemeId;
  onChange: (v: MapThemeId) => void;
  className?: string;
}) {
  return (
    <div className={cn("glass-panel rounded-2xl p-2 shadow-[0_14px_44px_rgba(2,6,23,0.45)]", props.className)}>
      <Select value={props.value} onValueChange={(v) => props.onChange(v as MapThemeId)}>
        <SelectTrigger
          className={cn(
            "h-10 w-[170px] rounded-xl border-border/60 bg-background/30 text-xs font-extrabold tracking-tight",
            "focus:ring-0 focus:ring-offset-0",
          )}
          aria-label="Map theme"
          title="Map theme"
        >
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-muted-foreground" />
            <SelectValue placeholder="Map theme" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {MAP_THEMES.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

