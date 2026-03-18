import React, { useMemo } from 'react';
import { Polyline } from 'react-leaflet';
import { Location } from '../../types';

interface RouteAnimatorProps {
  points: [number, number][];
  isAnimating?: boolean;
}

const RouteAnimator: React.FC<RouteAnimatorProps> = ({ points, isAnimating = true }) => {
  if (points.length < 2) return null;

  return (
    <>
      {/* Background Shadow Line */}
      <Polyline
        positions={points}
        pathOptions={{
          color: 'rgba(0,0,0,0.3)',
          weight: 10,
          opacity: 0.5,
          lineJoin: 'round',
          lineCap: 'round',
        }}
      />
      
      {/* Main Gradient-like Route Line */}
      <Polyline
        positions={points}
        pathOptions={{
          color: '#6366f1', // indigo-500
          weight: 6,
          opacity: 0.8,
          lineJoin: 'round',
          lineCap: 'round',
          className: isAnimating ? 'route-path-animate' : '',
        }}
      />

      <style>{`
        .route-path-animate {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw 2s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default RouteAnimator;
