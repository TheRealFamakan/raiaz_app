
import React, { useState } from 'react';
import { getStyleAdvice } from '../services/geminiService';

const AIAdvisor: React.FC = () => {
  const [faceShape, setFaceShape] = useState('Ovale');
  const [hairType, setHairType] = useState('Bouclé');
  const [occasion, setOccasion] = useState('Mariage');
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await getStyleAdvice(faceShape, hairType, occasion);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <span className="glass px-4 py-2 rounded-full text-[10px] font-black uppercase text-violet-600 tracking-widest border-white/40 shadow-sm inline-block mb-4">
          <i className="fas fa-brain mr-2"></i> Intelligence Artificielle
        </span>
        <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Conseiller en Style</h1>
        <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">Trouvez le look qui vous ressemble grâce à l'analyse experte de notre IA.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5 glass p-10 rounded-[3rem] shadow-sm border border-white/60">
          <form onSubmit={handleSubmit} className="space-y-8">
            <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest mb-4">Profil de Visage</h3>
            
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Forme</label>
              <select 
                value={faceShape}
                onChange={(e) => setFaceShape(e.target.value)}
                className="w-full glass bg-white/40 border-white/60 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:ring-4 focus:ring-violet-200 outline-none transition appearance-none"
              >
                {['Ovale', 'Rond', 'Carré', 'Coeur', 'Allongé'].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Texture Capillaire</label>
              <select 
                value={hairType}
                onChange={(e) => setHairType(e.target.value)}
                className="w-full glass bg-white/40 border-white/60 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:ring-4 focus:ring-violet-200 outline-none transition appearance-none"
              >
                {['Lisse', 'Ondulé', 'Bouclé', 'Frisé', 'Fin'].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Contexte</label>
              <select 
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full glass bg-white/40 border-white/60 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:ring-4 focus:ring-violet-200 outline-none transition appearance-none"
              >
                {['Mariage', 'Travail', 'Vie Quotidienne', 'Soirée', 'Sport'].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-violet-700 transition disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
              Analyse du Profil
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 glass-dark rounded-[3rem] p-12 min-h-[500px] flex flex-col relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-10 opacity-5">
            <i className="fas fa-robot text-9xl text-white"></i>
          </div>
          
          <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-4">
            <div className="w-10 h-10 bg-violet-500 rounded-xl flex items-center justify-center">
              <i className="fas fa-lightbulb text-sm"></i>
            </div>
            Recommendations MyHairCut
          </h3>

          {advice ? (
            <div className="animate-fadeIn space-y-6">
              <div className="bg-white/10 border border-white/10 rounded-[2rem] p-8">
                <p className="text-slate-100 text-lg leading-relaxed font-medium whitespace-pre-line">
                  {advice}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
                <p className="text-sm font-black uppercase tracking-widest text-violet-400">Prêt pour le changement ?</p>
                <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-violet-100 transition shadow-xl">Prendre RDV</button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <i className="fas fa-fingerprint text-3xl text-violet-400"></i>
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm max-w-[300px]">En attente de vos paramètres pour générer votre look unique.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;
