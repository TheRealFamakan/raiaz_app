
import React from 'react';
import { Hairdresser } from '../types';

interface HairdresserCardProps {
  barber: Hairdresser;
  onClick: (id: string) => void;
}

const HairdresserCard: React.FC<HairdresserCardProps> = ({ barber, onClick }) => {
  return (
    <div 
      className="card-pro overflow-hidden cursor-pointer group shadow-sm"
      onClick={() => onClick(barber.id)}
    >
      <div className="relative h-72 overflow-hidden">
        <img 
          src={barber.avatar} 
          alt={barber.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        {barber.isVerified && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg border border-white">
            <i className="fas fa-check-circle text-violet-600 text-xs"></i> 
            <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-widest">Certifié</span>
          </div>
        )}

        <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-lg text-white text-[10px] font-bold">
           {barber.distance} KM
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-extrabold text-slate-900 text-xl leading-tight group-hover:text-violet-600 transition-colors uppercase tracking-tight">{barber.name}</h3>
          <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg text-amber-700 text-xs font-black">
            <i className="fas fa-star"></i>
            <span>{barber.rating}</span>
          </div>
        </div>
        
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Master Stylist • Casablanca</p>
        
        <div className="flex items-center justify-between pt-5 border-t border-slate-50">
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase block tracking-widest">À partir de</span>
            <span className="text-xl font-black text-slate-900">{Math.min(...barber.services.map(s => s.price))} DH</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
             <i className="fas fa-arrow-right text-xs"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HairdresserCard;
