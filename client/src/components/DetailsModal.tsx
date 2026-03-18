import React, { useRef } from 'react';
import { X, MapPin, ListChecks, ArrowRight, Clock, Route } from 'lucide-react';
import { Location } from '../types';

interface DetailsModalProps {
  location: Location | null;
  onClose: () => void;
  isInline?: boolean;
}

const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'Academic': return '#8b5cf6';
    case 'Food': return '#f97316';
    case 'Residence': return '#10b981';
    case 'Administration': return '#ec4899';
    case 'Entrance': return '#06b6d4';
    case 'Recreation': return '#eab308';
    default: return '#6366f1';
  }
};

const getCategoryLabel = (category: string): string => category.toUpperCase();

const DetailsModal: React.FC<DetailsModalProps> = ({ location, onClose, isInline }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  if (!location) return null;

  const accentColor = getCategoryColor(location.category);
  const hasImage = Boolean(location.image);
  const description =
    location.description && location.description.trim().length > 0
      ? location.description
      : "No description available for this location yet.";

  const content = (
    <div
      className="relative w-full max-w-[480px] flex flex-col overflow-hidden"
      style={{
        background: 'hsl(var(--popover) / 0.86)',
        backdropFilter: 'blur(36px) saturate(180%)',
        WebkitBackdropFilter: 'blur(36px) saturate(180%)',
        border: `1px solid ${accentColor}28`,
        borderRadius: 28,
        boxShadow: `0 48px 140px rgba(2,6,23,0.55), 0 0 0 1px ${accentColor}12, 0 0 80px ${accentColor}0d`,
        maxHeight: '90vh',
        animation: isInline ? 'none' : 'zoom-in-modal 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative h-60 sm:h-72 overflow-hidden flex-shrink-0" style={{ borderRadius: '28px 28px 0 0' }}>
        {hasImage ? (
          <img
            src={location.image}
            alt={location.name}
            className="w-full h-full object-cover"
            style={{ transform: 'scale(1.04)' }}
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `radial-gradient(1200px 380px at 20% 0%, ${accentColor}35, transparent 60%),
                radial-gradient(900px 320px at 80% 10%, rgba(99,102,241,0.25), transparent 55%),
                linear-gradient(180deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%)`,
            }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, rgba(6,10,22,0.15) 0%, rgba(6,10,22,0.35) 40%, rgba(6,10,22,0.97) 100%)`
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 120%, ${accentColor}18 0%, transparent 65%)`,
          }}
        />

        {!isInline && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-[14px] transition-all active:scale-90 hover:bg-white/15"
            style={{
              background: 'hsl(var(--background) / 0.45)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
        )}

        <div className="absolute bottom-5 left-6 right-6">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-3"
            style={{
              background: `${accentColor}22`,
              border: `1px solid ${accentColor}45`,
              backdropFilter: 'blur(12px)',
            }}
          >
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
            <span
              className="text-[9px] font-black uppercase tracking-[0.25em]"
              style={{ color: accentColor }}
            >
              {getCategoryLabel(location.category)}
            </span>
          </div>
          <h2
            className="text-4xl sm:text-[42px] font-black text-white leading-tight tracking-tighter"
            style={{ textShadow: '0 2px 24px rgba(0,0,0,0.9)' }}
          >
            {location.name}
          </h2>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{ padding: '24px 24px 20px' }}
      >
        <div className="space-y-6">
          <section>
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center"
                style={{ background: `${accentColor}16`, border: `1px solid ${accentColor}32` }}
              >
                <MapPin className="w-3.5 h-3.5" style={{ color: accentColor }} />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">About Location</h3>
            </div>
            <p className="text-slate-300 leading-relaxed font-medium text-[14px]">
              {description}
            </p>
          </section>

          {location.facilities && location.facilities.length > 0 && (
            <section>
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)' }}
                >
                  <ListChecks className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Facilities</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {location.facilities.map((fac, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 transition-all duration-200"
                    style={{
                      padding: '6px 14px',
                      borderRadius: 999,
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${accentColor}28`,
                      borderLeft: `3px solid ${accentColor}80`,
                    }}
                  >
                    <span className="text-[12px] font-semibold text-slate-300">{fac}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div
          className="mt-6 pt-5 flex flex-col gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div style={{ display: 'flex', marginLeft: -4 }}>
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400"
                    style={{
                      background: 'linear-gradient(135deg, rgba(30,40,60,1), rgba(15,25,45,1))',
                      border: '2px solid rgba(6,10,22,1)',
                      marginLeft: i > 0 ? -8 : 0,
                    }}
                  >
                    {['A', 'B', 'C'][i]}
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.15em]">+12 Active</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
              <Clock className="w-3 h-3" />
              <span>Open Now</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-black text-white text-sm transition-all active:scale-[0.98] relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
              boxShadow: `0 8px 32px ${accentColor}45`,
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                animation: 'shimmer-slide 3s linear infinite',
              }}
            />
            <Route className="w-4 h-4" />
            <span>Explore on Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (isInline) return content;

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center p-4 sm:p-6"
      style={{
        background: 'hsl(var(--background) / 0.55)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        animation: 'fade-up 0.25s ease-out forwards',
      }}
      onClick={onClose}
    >
      {content}
    </div>
  );
};

export default DetailsModal;
