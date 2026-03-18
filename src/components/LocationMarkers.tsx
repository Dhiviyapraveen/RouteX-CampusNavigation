import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Location } from '../types';
import { MapPin, GraduationCap, Utensils, Home, Building2 } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

interface LocationMarkersProps {
  locations: Location[];
  onShowDetails?: (location: Location) => void;
}

const getIcon = (category: string) => {
  let Color = '#4f46e5'; // Default indigo-600
  let IconComponent = MapPin;

  switch (category) {
    case 'Academic':
      Color = '#0891b2'; // cyan-600
      IconComponent = GraduationCap;
      break;
    case 'Food':
      Color = '#ea580c'; // orange-600
      IconComponent = Utensils;
      break;
    case 'Residence':
      Color = '#059669'; // emerald-600
      IconComponent = Home;
      break;
    case 'Administration':
      Color = '#7c3aed'; // violet-600
      IconComponent = Building2;
      break;
    case 'Entrance':
      Color = '#2563eb'; // blue-600
      IconComponent = MapPin;
      break;
  }

  const iconMarkup = renderToStaticMarkup(
    <div className="marker-container" style={{
      backgroundColor: Color,
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      border: '3px solid white',
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      <IconComponent size={20} />
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: 'custom-div-icon transition-all duration-300 transform hover:scale-110 hover:-translate-y-2',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

const LocationMarkers: React.FC<LocationMarkersProps> = ({ locations, onShowDetails }) => {
  return (
    <>
      {locations.map((loc, idx) => (
        <Marker
          key={`${loc.name}-${idx}`}
          position={[loc.latitude, loc.longitude]}
          icon={getIcon(loc.category)}
        >
          <Popup className="custom-popup" closeButton={false}>
            <div className="p-3 text-center">
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1 block">
                {loc.category}
              </span>
              <h3 className="font-black text-gray-900 text-xl leading-tight mb-3">
                {loc.name}
              </h3>
              <button 
                onClick={() => onShowDetails?.(loc)}
                className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-colors"
              >
                View Details
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default LocationMarkers;
