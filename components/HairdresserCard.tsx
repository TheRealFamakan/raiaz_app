
import React from 'react';
import { Hairdresser } from '../types';

interface HairdresserCardProps {
  barber: Hairdresser;
  onClick: (id: string) => void;
}

const HairdresserCard: React.FC<HairdresserCardProps> = ({ barber, onClick }) => {
  return (
    <div 
      className="glass rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-white/50 overflow-hidden cursor-pointer group hover:-translate-y-1"
      onClick={() => onClick(barber.id)}
    >
      <div className="relative h-56 overflow-hidden">
        <img src={barber.avatar} alt={barber.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
        {barber.isVerified && (
          <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border-white/60">
            <i className="fas fa-check-circle text-violet-600 text-xs"></i> 
            <span className="text-[10px] font-black uppercase text-slate-800 tracking-wider">Certifié</span>
          </div>
        )}
        <div className="absolute bottom-4 left-4 glass px-3 py-1.5 rounded-xl flex items-center gap-2 border-white/60">
          <i className="fas fa-location-arrow text-violet-600 text-xs"></i>
          <span className="text-xs font-bold text-slate-800">{barber.distance} km</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-extrabold text-lg text-slate-900 leading-tight">{barber.name}</h3>
          <div className="flex items-center text-amber-500 glass-dark px-2 py-1 rounded-lg">
            <i className="fas fa-star mr-1 text-[10px]"></i> 
            <span className="text-xs font-black text-white">{barber.rating}</span>
          </div>
        </div>
        
        <p className="text-slate-500 text-xs line-clamp-2 mb-5 leading-relaxed font-medium">
          {barber.bio}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {barber.services.slice(0, 2).map(s => (
            <span key={s.id} className="bg-violet-500/10 text-violet-600 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest border border-violet-500/10">
              {s.name}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-5 border-t border-white/30">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">À partir de</p>
            <span className="text-violet-600 font-black text-lg">{Math.min(...barber.services.map(s => s.price))} DH</span>
          </div>
          <button className="bg-slate-900 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-violet-600 transition shadow-lg">
            <i className="fas fa-arrow-right text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HairdresserCard;
