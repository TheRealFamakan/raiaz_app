
import React from 'react';
import HairdresserCard from '../components/HairdresserCard';
import { Hairdresser } from '../types';

interface HomeProps {
  onNavigate: (page: string, params?: any) => void;
  barbers: Hairdresser[];
}

const Home: React.FC<HomeProps> = ({ onNavigate, barbers }) => {
  return (
    <div className="space-y-20 pb-20 mt-8">
      <section className="relative h-[600px] flex items-center justify-center mx-4 md:mx-8 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1600" alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-4xl px-4 text-center">
          <span className="glass px-4 py-2 rounded-full text-[10px] font-black uppercase text-violet-400 tracking-widest border-white/20 shadow-lg inline-block mb-8">
            <i className="fas fa-sparkles mr-2"></i> L'élégance à votre porte
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight">
            Votre salon expert <span className="text-violet-400">partout au Maroc.</span>
          </h1>
          <div className="glass p-3 rounded-[2rem] shadow-2xl flex flex-col md:flex-row gap-3 max-w-3xl mx-auto border-white/20">
            <input type="text" placeholder="Dégradé, Coloration..." className="flex-1 px-6 py-4 bg-white/10 rounded-2xl focus:outline-none text-white font-bold placeholder:text-slate-400 border border-white/10" />
            <button onClick={() => onNavigate('search')} className="bg-violet-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-wider hover:bg-violet-700 transition shadow-xl">Explorer</button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <span className="text-violet-600 font-black uppercase tracking-[0.2em] text-[10px] mb-2 block">Nos Experts de Proximité</span>
            <h2 className="text-4xl font-black text-slate-900 leading-tight">Coiffeurs Disponibles Immédiatement</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {barbers.slice(0, 4).map(barber => (
            <HairdresserCard key={barber.id} barber={barber} onClick={(id) => {
              localStorage.setItem('mhc_selected_barber_id', id);
              onNavigate('profile');
            }} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
