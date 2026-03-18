import React from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Location } from '../../types';
import { renderToStaticMarkup } from 'react-dom/server';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AnimatedMarkerProps {
  location: Location;
  isSelected?: boolean;
  onSelect: (location: Location) => void;
}

const getCategoryConfig = (category: string) => {
  switch (category) {
    case 'Academic': return { bg: '#8b5cf6', ring: 'rgba(139,92,246,0.45)', glow: 'rgba(139,92,246,0.6)' };
    case 'Food': return { bg: '#f97316', ring: 'rgba(249,115,22,0.45)', glow: 'rgba(249,115,22,0.6)' };
    case 'Residence': return { bg: '#10b981', ring: 'rgba(16,185,129,0.45)', glow: 'rgba(16,185,129,0.6)' };
    case 'Administration': return { bg: '#ec4899', ring: 'rgba(236,72,153,0.45)', glow: 'rgba(236,72,153,0.6)' };
    case 'Entrance': return { bg: '#06b6d4', ring: 'rgba(6,182,212,0.45)', glow: 'rgba(6,182,212,0.6)' };
    case 'Recreation': return { bg: '#eab308', ring: 'rgba(234,179,8,0.45)', glow: 'rgba(234,179,8,0.6)' };
    case 'Health': return { bg: '#ef4444', ring: 'rgba(239,68,68,0.40)', glow: 'rgba(239,68,68,0.55)' };
    default: return { bg: '#6366f1', ring: 'rgba(99,102,241,0.45)', glow: 'rgba(99,102,241,0.6)' };
  }
};

const AnimatedMarker: React.FC<AnimatedMarkerProps> = ({
  location,
  isSelected,
  onSelect,
}) => {
  const { bg, ring, glow } = getCategoryConfig(location.category);
  const size = 40;

  const iconMarkup = renderToStaticMarkup(
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: bg,
        border: "3px solid rgba(255,255,255,0.95)",
        boxShadow: `0 0 0 2px ${ring}, 0 10px 20px rgba(2,6,23,0.35), 0 0 14px ${glow}`,
        display: "grid",
        placeItems: "center",
      }}
      aria-label={location.name}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    </div>
  );

  const customIcon = L.divIcon({
    html: iconMarkup,
    className: 'custom-div-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });

  return (
    <Marker
      position={[location.latitude, location.longitude]}
      icon={customIcon}
      eventHandlers={{
        click: () => onSelect(location)
      }}
    >
      <Tooltip
        direction="top"
        offset={[0, -18]}
        opacity={1}
        className="custom-marker-tooltip"
      >
        {location.name}
      </Tooltip>
      <Popup className="custom-popup" closeButton={false} maxWidth={260}>
        <div
          className={cn(
            "glass-card relative min-w-[240px] rounded-2xl px-5 py-4",
            "shadow-[0_24px_80px_rgba(2,6,23,0.55),0_0_0_1px_rgba(99,102,241,0.05)]",
          )}
          style={
            {
              borderColor: `${bg}35`,
              boxShadow: `0 24px 80px rgba(2,6,23,0.55), 0 0 0 1px ${bg}18, 0 0 40px ${bg}18`,
              animation: "scale-in 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards",
            } as React.CSSProperties
          }
        >
          <div className="flex justify-center">
            <div
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1"
              style={{ background: `${bg}18`, borderColor: `${bg}35` }}
            >
              <div className="size-1.5 rounded-full" style={{ background: bg, boxShadow: `0 0 8px ${bg}` }} />
              <span className="text-[9px] font-black uppercase tracking-[0.22em]" style={{ color: bg }}>
                {location.category}
              </span>
            </div>
          </div>

          <h3 className="mt-2 text-center text-[15px] font-extrabold tracking-tight text-foreground">
            {location.name}
          </h3>

          <div className="mt-4">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(location);
              }}
              className="h-10 w-full rounded-xl text-xs font-extrabold tracking-tight text-white shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${bg}cc, ${bg}99)`,
                border: `1px solid ${bg}50`,
                boxShadow: `0 6px 18px ${bg}30`,
              }}
            >
              Details
            </Button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default AnimatedMarker;
