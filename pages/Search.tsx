
import React, { useState, useEffect } from 'react';
import HairdresserCard from '../components/HairdresserCard';
import { Hairdresser } from '../types';

interface SearchProps {
  onNavigate: (p: string, params?: any) => void;
  barbers: Hairdresser[];
}

// Fonction utilitaire pour calculer la distance (Haversine)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Rayon de la terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Number((R * c).toFixed(1));
};

const Search: React.FC<SearchProps> = ({ onNavigate, barbers }) => {
  const [filter, setFilter] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [geoStatus, setGeoStatus] = useState<'IDLE' | 'LOADING' | 'DENIED' | 'READY'>('IDLE');

  useEffect(() => {
    if ("geolocation" in navigator) {
      setGeoStatus('LOADING');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setGeoStatus('READY');
        },
        () => {
          setGeoStatus('DENIED');
        }
      );
    }
  }, []);

  const processedBarbers = barbers.map(b => {
    // Si on a la position de l'utilisateur et que le coiffeur a une position (mockée ou réelle)
    // On simule une position pour les mocks s'ils n'en ont pas (autour de Casablanca/Marrakech)
    const bLat = b.location?.lat || 33.5731; 
    const bLng = b.location?.lng || -7.5898;
    
    let dist = b.distance || 0;
    if (userLocation) {
      dist = calculateDistance(userLocation.lat, userLocation.lng, bLat, bLng);
    }
    return { ...b, distance: dist };
  }).filter(b => 
    b.name.toLowerCase().includes(filter.toLowerCase()) || 
    b.services.some(s => s.name.toLowerCase().includes(filter.toLowerCase()))
  ).sort((a, b) => (a.distance || 0) - (b.distance || 0));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
        <div className="flex-1 w-full glass p-4 rounded-[2rem] shadow-sm border border-white/60 flex items-center gap-6">
          <div className="w-12 h-12 glass-dark rounded-2xl flex items-center justify-center text-white">
            <i className="fas fa-search text-xs"></i>
          </div>
          <input 
            type="text" 
            placeholder="Où souhaitez-vous votre coupe ?" 
            className="flex-1 bg-transparent focus:outline-none font-bold text-slate-800 placeholder:text-slate-400 text-lg"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-4">
          {geoStatus === 'READY' && (
            <div className="glass px-6 py-4 rounded-2xl border-green-100 flex items-center gap-3 animate-fadeIn">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Localisation Active</span>
            </div>
          )}
          {geoStatus === 'DENIED' && (
            <div className="glass px-6 py-4 rounded-2xl border-red-100 flex items-center gap-3 opacity-60">
               <i className="fas fa-map-marker-alt text-red-500 text-xs"></i>
               <span className="text-[10px] font-black uppercase text-slate-400">Position manuelle</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {processedBarbers.map(barber => (
          <HairdresserCard key={barber.id} barber={barber} onClick={(id) => {
            localStorage.setItem('mhc_selected_barber_id', id);
            onNavigate('profile');
          }} />
        ))}
      </div>
      
      {processedBarbers.length === 0 && (
        <div className="py-32 text-center glass rounded-[3rem] border-dashed border-2 border-slate-200">
           <i className="fas fa-scissors text-5xl text-slate-200 mb-6"></i>
           <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Aucun expert trouvé dans cette zone</p>
        </div>
      )}
    </div>
  );
};

export default Search;
