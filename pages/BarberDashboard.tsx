
import React, { useState } from 'react';
import { Hairdresser, Booking, BookingStatus, Service } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BarberDashboardProps {
  barber: Hairdresser;
  bookings: Booking[];
  onUpdateBarber: (barber: Hairdresser) => void;
  onUpdateBooking: (id: string, status: BookingStatus) => void;
}

const BarberDashboard: React.FC<BarberDashboardProps> = ({ barber, bookings = [], onUpdateBarber, onUpdateBooking }) => {
  const [activeTab, setActiveTab] = useState<'RESA' | 'SERVICES' | 'FINANCES'>('RESA');
  const [newService, setNewService] = useState({ name: '', price: '', duration: '30' });

  const wallet = barber?.walletBalance || 0;
  const isDebt = wallet < 0;
  const revenue = bookings.filter(b => b.status === BookingStatus.COMPLETED).reduce((a, b) => a + b.totalPrice, 0);

  // Données de graphique simulées
  const chartData = bookings.filter(b => b.status === BookingStatus.COMPLETED).slice(-10).map((b, i) => ({
    name: `J-${10-i}`,
    val: b.totalPrice
  }));

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    const service: Service = {
      id: `s_${Date.now()}`,
      name: newService.name,
      price: Number(newService.price),
      duration: Number(newService.duration)
    };
    onUpdateBarber({ ...barber, services: [...(barber.services || []), service] });
    setNewService({ name: '', price: '', duration: '30' });
  };

  const removeService = (id: string) => {
    onUpdateBarber({ ...barber, services: barber.services.filter(s => s.id !== id) });
  };

  if (!barber) return <div className="p-20 text-center font-black uppercase text-slate-400">Initialisation de votre espace...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* STATS & CHARTS */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
           <div className={`p-8 rounded-[2.5rem] border shadow-xl ${isDebt ? 'bg-amber-50 border-amber-200' : 'glass'}`}>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Portefeuille MHC</p>
              <p className={`text-3xl font-black ${isDebt ? 'text-amber-600' : 'text-slate-900'}`}>{wallet.toFixed(2)} DH</p>
              {isDebt && <p className="text-[8px] font-bold text-amber-500 mt-2">Commission de 15% due</p>}
           </div>
           <div className="glass p-8 rounded-[2.5rem] border-white/60 shadow-xl">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Chiffre d'Affaires</p>
              <p className="text-3xl font-black text-slate-900">{revenue} DH</p>
           </div>
           <div className="glass p-8 rounded-[2.5rem] border-white/60 shadow-xl md:col-span-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Performance (Ventes)</p>
              <div className="h-16 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.length > 0 ? chartData : [{name: '0', val: 0}]}>
                       <Area type="monotone" dataKey="val" stroke="#8B5CF6" fill="#C4B5FD" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex glass bg-white/40 p-1.5 rounded-2xl shadow-lg border-white/60 inline-flex">
            {['RESA', 'SERVICES', 'FINANCES'].map(t => (
              <button key={t} onClick={() => setActiveTab(t as any)} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-violet-600 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>
                {t === 'RESA' ? 'Réservations' : t === 'SERVICES' ? 'Mes Tarifs' : 'Finances'}
              </button>
            ))}
          </div>

          {activeTab === 'RESA' && (
            <div className="grid grid-cols-1 gap-6 animate-fadeIn">
              {bookings.slice().reverse().map(bk => (
                <div key={bk.id} className="glass p-8 rounded-[3rem] border-white/60 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 group hover:shadow-xl transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase ${bk.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : bk.status === 'COMPLETED' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>{bk.status}</span>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(bk.date).toLocaleString('fr-FR')}</p>
                    </div>
                    <h4 className="text-xl font-black text-slate-900">{bk.serviceName}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <img src={`https://ui-avatars.com/api/?name=${bk.clientName}&background=random`} className="w-5 h-5 rounded-full" />
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">{bk.clientName || 'Client'}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {bk.status === BookingStatus.PENDING && (
                      <button onClick={() => onUpdateBooking(bk.id, BookingStatus.CONFIRMED)} className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-violet-600 transition">Accepter</button>
                    )}
                    {bk.status === BookingStatus.CONFIRMED && (
                      <button onClick={() => onUpdateBooking(bk.id, BookingStatus.COMPLETED)} className="bg-green-600 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-700 transition shadow-xl">Terminer</button>
                    )}
                    <p className="text-xl font-black text-violet-600 bg-violet-50 px-6 py-4 rounded-2xl border border-violet-100 min-w-[100px] text-center">{bk.totalPrice} DH</p>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && <div className="p-20 text-center glass rounded-[3rem] border-white/60 font-black uppercase text-slate-300 tracking-widest">Aucun rendez-vous pour le moment</div>}
            </div>
          )}

          {activeTab === 'SERVICES' && (
            <div className="space-y-8 animate-fadeIn">
               <form onSubmit={handleAddService} className="glass p-10 rounded-[3rem] border-white/60 shadow-xl grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Nom du service</label>
                    <input required type="text" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} className="w-full glass bg-white border-white/60 rounded-xl px-4 py-3 font-bold" placeholder="Ex: Dégradé Laser" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Prix (DH)</label>
                    <input required type="number" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} className="w-full glass bg-white border-white/60 rounded-xl px-4 py-3 font-bold" />
                  </div>
                  <button type="submit" className="bg-violet-600 text-white py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg">Ajouter</button>
               </form>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {barber.services?.map(s => (
                    <div key={s.id} className="glass p-8 rounded-[2.5rem] border-white/60 shadow-sm flex justify-between items-center group">
                       <div><h4 className="font-black text-slate-900 text-sm uppercase">{s.name}</h4><p className="text-xl font-black text-violet-600 mt-1">{s.price} DH</p></div>
                       <button onClick={() => removeService(s.id)} className="w-10 h-10 rounded-xl glass border-white/80 text-red-500 opacity-0 group-hover:opacity-100 transition hover:bg-red-500 hover:text-white"><i className="fas fa-trash-alt"></i></button>
                    </div>
                  ))}
               </div>
            </div>
          )}
          
          {activeTab === 'FINANCES' && (
            <div className="glass p-10 rounded-[3rem] border-white/60 shadow-xl animate-fadeIn">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Détails des Commissions</h3>
              <div className="space-y-4">
                <div className="flex justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="font-bold text-slate-500 text-xs">Total Ventes</span>
                  <span className="font-black text-slate-900">{revenue} DH</span>
                </div>
                <div className="flex justify-between p-6 bg-violet-50 rounded-2xl border border-violet-100">
                  <span className="font-bold text-violet-600 text-xs">Commissions plateforme (15%)</span>
                  <span className="font-black text-violet-600">{(revenue * 0.15).toFixed(2)} DH</span>
                </div>
                <div className="p-6 text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Le solde est prélevé automatiquement sur vos encaissements futurs.</p>
                  <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">Voir l'historique bancaire</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass p-10 rounded-[3rem] border-white/60 shadow-2xl">
              <h3 className="font-black text-slate-900 uppercase text-xs mb-8 tracking-widest">Avis Clients</h3>
              <div className="space-y-6">
                 <div className="flex items-center gap-4 p-4 bg-violet-50 rounded-2xl border border-violet-100">
                    <div className="text-3xl font-black text-violet-600">{barber.rating || 5.0}</div>
                    <div><p className="text-[10px] font-black text-slate-400 uppercase">Note Moyenne</p><p className="text-[10px] font-bold text-slate-500">{barber.reviewCount || 0} avis vérifiés</p></div>
                 </div>
                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center py-8 opacity-40">Les avis détaillés apparaîtront ici dès réception</p>
                 </div>
              </div>
           </div>
           
           <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white">
              <h3 className="font-black uppercase text-xs mb-6 tracking-widest text-violet-400">Astuce Business</h3>
              <p className="text-sm font-medium leading-relaxed">
                Les experts qui répondent aux réservations en moins de 10 minutes augmentent leur visibilité de 40% sur MyHairCut.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BarberDashboard;
