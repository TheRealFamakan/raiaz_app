
import React from 'react';
import HairdresserCard from '../components/HairdresserCard';
import { Hairdresser } from '../types';

interface HomeProps {
  onNavigate: (page: string, params?: any) => void;
  barbers: Hairdresser[];
}

const Home: React.FC<HomeProps> = ({ onNavigate, barbers }) => {
  return (
    <div className="space-y-32 pb-24">
      {/* HERO SECTION */}
      <section className="pt-40 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-3 bg-violet-100/50 border border-violet-100 px-5 py-2 rounded-full mb-10">
             <div className="w-2 h-2 bg-violet-600 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-extrabold text-violet-700 uppercase tracking-widest">Le N°1 de la coiffure à domicile au Maroc</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter max-w-5xl leading-[1.1]">
            L'excellence d'un salon, <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">le confort de votre intérieur.</span>
          </h1>

          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mb-14 leading-relaxed">
            Réservez les meilleurs stylistes et barbiers certifiés en quelques secondes. Une expérience premium, sans compromis.
          </p>

          <div className="w-full max-w-3xl bg-white p-3 rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center px-6 gap-4">
              <i className="fas fa-map-marker-alt text-violet-500 text-lg"></i>
              <input 
                type="text" 
                placeholder="Votre ville (Casablanca, Rabat, Marrakech...)" 
                className="w-full bg-transparent outline-none font-semibold text-slate-800 py-4 placeholder:text-slate-400" 
              />
            </div>
            <button 
              onClick={() => onNavigate('search')} 
              className="btn-primary px-12 py-4 rounded-2xl font-bold shadow-lg shadow-violet-200 text-lg"
            >
              Trouver un expert
            </button>
          </div>
          
          <div className="mt-16 flex items-center gap-10 opacity-40 grayscale hover:grayscale-0 transition-all">
             <span className="text-xs font-bold uppercase tracking-widest">Disponible à :</span>
             <span className="font-bold">Casablanca</span>
             <span className="font-bold">Rabat</span>
             <span className="font-bold">Marrakech</span>
             <span className="font-bold">Tanger</span>
          </div>
        </div>
      </section>

      {/* FEATURED SECTION */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Les Maîtres du Style</h2>
            <div className="h-1.5 w-24 bg-violet-600 rounded-full mt-4"></div>
            <p className="text-slate-500 text-lg mt-6 font-medium">Découvrez notre sélection exclusive d'experts notés 4.8+ par la communauté.</p>
          </div>
          <button 
            onClick={() => onNavigate('search')}
            className="flex items-center gap-3 text-violet-600 font-bold hover:gap-5 transition-all"
          >
            Voir tous les experts <i className="fas fa-arrow-right text-xs"></i>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {barbers.slice(0, 4).map((barber) => (
            <HairdresserCard key={barber.id} barber={barber} onClick={(id) => {
              localStorage.setItem('mhc_selected_barber_id', id);
              onNavigate('profile');
            }} />
          ))}
        </div>
      </section>

      {/* CTA SECTION - PARTNERSHIP */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-16 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
           
           <div className="max-w-2xl relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight uppercase">
                Développez votre <span className="text-violet-400">Empire</span> de la coiffure.
              </h2>
              <p className="text-slate-400 text-xl mb-12 font-medium">
                Rejoignez MyHairCut et accédez à une clientèle premium. Gérez vos rendez-vous, vos revenus et votre réputation depuis un seul endroit.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => onNavigate('login')}
                  className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-extrabold hover:bg-violet-50 transition-colors shadow-xl"
                >
                  Devenir Expert Partenaire
                </button>
                <button className="px-10 py-5 rounded-2xl border-2 border-white/10 text-white font-extrabold hover:bg-white/5 transition">
                  En savoir plus
                </button>
              </div>
           </div>
           
           <div className="hidden lg:block w-1/3 relative">
              <div className="absolute -inset-4 bg-violet-600/20 rounded-[3rem] blur-xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1512690196222-7c7d4745303f?auto=format&fit=crop&q=80&w=600" 
                className="rounded-[2.5rem] shadow-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-700" 
                alt="Expert at work"
              />
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
