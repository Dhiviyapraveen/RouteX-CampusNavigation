import React from 'react';
import { Navigation, X, Clock, Ruler } from 'lucide-react';
import { Location } from '../types';

interface RoutingPanelProps {
  locations: Location[];
  source: Location | null;
  destination: Location | null;
  onSourceChange: (location: Location | null) => void;
  onDestinationChange: (location: Location | null) => void;
  onClose: () => void;
  distance?: number;
  duration?: number;
}

const selectWrapStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  height: 46,
  padding: '0 18px',
  background: 'hsl(var(--background) / 0.45)',
  border: '1px solid hsl(var(--border) / 0.75)',
  borderRadius: 16,
  color: 'hsl(var(--foreground))',
  fontSize: 13,
  fontWeight: 700,
  appearance: 'none',
  cursor: 'pointer',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const RoutingPanel: React.FC<RoutingPanelProps> = ({
  locations,
  source,
  destination,
  onSourceChange,
  onDestinationChange,
  onClose,
  distance,
  duration,
}) => {
  return (
    <div
      style={{
        background: 'hsl(var(--popover) / 0.86)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        border: '1px solid rgba(99,102,241,0.22)',
        borderRadius: 24,
        padding: '20px 22px 22px',
        width: 310,
        boxShadow: '0 32px 96px rgba(2,6,23,0.55), 0 0 0 1px rgba(99,102,241,0.08), 0 0 40px rgba(99,102,241,0.1)',
        animation: 'slide-in-left 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-[14px] flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2))',
              border: '1px solid rgba(99,102,241,0.35)',
              boxShadow: '0 4px 16px rgba(99,102,241,0.2)',
            }}
          >
            <Navigation className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-black text-foreground tracking-tight text-[15px] leading-none">Get Directions</h3>
            <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">Campus Navigation</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-white/10 active:scale-90"
          style={{ border: '1px solid hsl(var(--border) / 0.75)' }}
        >
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      <div className="relative">
        <div
          className="absolute"
          style={{
            left: 11,
            top: 40,
            bottom: 40,
            width: 2,
            background: 'linear-gradient(to bottom, #6366f1, #10b981)',
            borderRadius: 2,
          }}
        />

        <div className="relative pl-9 mb-4">
          <div
            className="absolute left-[6px] top-[42px] -translate-y-1/2 w-3.5 h-3.5 rounded-full"
            style={{
              background: '#6366f1',
              boxShadow: '0 0 12px rgba(99,102,241,0.7)',
              border: '2.5px solid rgba(8,14,30,1)',
            }}
          />
          <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.22em] mb-1.5 block">
            Start Location
          </label>
          <div style={selectWrapStyle}>
            <select
              style={selectStyle}
              value={source?.name || ''}
              onChange={(e) => {
                const loc = locations.find(l => l.name === e.target.value);
                onSourceChange(loc || null);
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'hsl(var(--border) / 0.75)'; e.target.style.boxShadow = 'none'; }}
            >
              <option value="" style={{ background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>Select location...</option>
              {locations.map(loc => (
                <option key={`src-${loc.name}`} value={loc.name} style={{ background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative pl-9">
          <div
            className="absolute left-[5px] top-[42px] -translate-y-1/2 w-3.5 h-3.5 rotate-45"
            style={{
              background: '#10b981',
              boxShadow: '0 0 12px rgba(16,185,129,0.7)',
              borderRadius: 3,
              border: '2.5px solid rgba(8,14,30,1)',
            }}
          />
          <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.22em] mb-1.5 block">
            Destination
          </label>
          <div style={selectWrapStyle}>
            <select
              style={{
                ...selectStyle,
                borderColor: destination ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.09)',
              }}
              value={destination?.name || ''}
              onChange={(e) => {
                const loc = locations.find(l => l.name === e.target.value);
                onDestinationChange(loc || null);
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(16,185,129,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}
              onBlur={(e) => { e.target.style.borderColor = destination ? 'rgba(16,185,129,0.35)' : 'hsl(var(--border) / 0.75)'; e.target.style.boxShadow = 'none'; }}
            >
              <option value="" style={{ background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>Select destination...</option>
              {locations.map(loc => (
                <option key={`dest-${loc.name}`} value={loc.name} style={{ background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {source && destination && distance !== undefined && duration !== undefined && (
        <div
          className="mt-5 rounded-2xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, #4f46e5, #6366f1, #7c3aed)',
            boxShadow: '0 12px 40px rgba(99,102,241,0.5), 0 0 0 1px rgba(99,102,241,0.4)',
            animation: 'scale-in 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)',
              animation: 'shimmer-slide 2.5s linear infinite',
            }}
          />
          <div className="flex items-stretch relative z-10">
            <div className="flex-1 p-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Clock className="w-3 h-3 text-indigo-200/60" />
                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-indigo-200/60">Walk Time</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">{Math.ceil(duration)}</span>
                <span className="text-xs font-bold text-indigo-200/60">mins</span>
              </div>
            </div>
            <div className="w-px bg-white/10 my-4" />
            <div className="flex-1 p-4 text-right">
              <div className="flex items-center gap-1.5 justify-end mb-1.5">
                <Ruler className="w-3 h-3 text-indigo-200/60" />
                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-indigo-200/60">Distance</p>
              </div>
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-3xl font-black text-white">{(distance / 1000).toFixed(2)}</span>
                <span className="text-xs font-bold text-indigo-200/60">km</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutingPanel;
