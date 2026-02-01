
import React, { useState } from 'react';
import { Hairdresser, Booking, BookingStatus, Service } from '../types';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

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

  if (!barber) return <div className="p-32 text-center font-bold text-slate-400 animate-pulse">Chargement de votre cockpit...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tight">Espace Expert</h1>
           <p className="text-slate-500 font-medium mt-1">Gérez votre activité et suivez vos performances en temps réel.</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {['RESA', 'SERVICES', 'FINANCES'].map(t => (
            <button 
              key={t} 
              onClick={() => setActiveTab(t as any)} 
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {t === 'RESA' ? 'Réservations' : t === 'SERVICES' ? 'Prestations' : 'Finances'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* SIDEBAR STATS */}
        <div className="lg:col-span-4 space-y-6">
           <div className={`p-8 rounded-[2rem] border-2 shadow-sm ${isDebt ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portefeuille MHC</span>
                <i className={`fas fa-wallet ${isDebt ? 'text-amber-400' : 'text-slate-200'}`}></i>
              </div>
              <p className={`text-4xl font-black ${isDebt ? 'text-amber-600' : 'text-slate-900'}`}>{wallet.toFixed(0)} <span className="text-xl">DH</span></p>
              {isDebt && <p className="text-[10px] font-bold text-amber-500 mt-4 bg-white/50 p-3 rounded-xl border border-amber-100">Solde à régulariser (Commissions 15%)</p>}
           </div>

           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-6">Performance mensuelle</span>
              <div className="h-24 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.length > 0 ? chartData : [{val: 0}]}>
                       <Area type="monotone" dataKey="val" stroke="#8B5CF6" fill="#EDE9FE" strokeWidth={3} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
              <div className="mt-6 flex justify-between items-end">
                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Chiffre d'Affaires</p>
                   <p className="text-2xl font-black text-slate-900">{revenue} DH</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-slate-400 uppercase">RDV Complétés</p>
                   <p className="text-2xl font-black text-violet-600">{bookings.filter(b => b.status === BookingStatus.COMPLETED).length}</p>
                </div>
              </div>
           </div>
        </div>

        {/* MAIN AREA */}
        <div className="lg:col-span-8 space-y-8">
          {activeTab === 'RESA' && (
            <div className="space-y-6 animate-fadeIn">
              {bookings.length > 0 ? bookings.slice().reverse().map(bk => (
                <div key={bk.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-violet-200 transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${
                        bk.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                        bk.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {bk.status}
                      </span>
                      <p className="text-xs font-bold text-slate-400">{new Date(bk.date).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{bk.serviceName}</h4>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">
                        {bk.clientName?.[0]}
                      </div>
                      <p className="text-sm font-bold text-slate-500">{bk.clientName || 'Client anonyme'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    {bk.status === BookingStatus.PENDING && (
                      <button 
                        onClick={() => onUpdateBooking(bk.id, BookingStatus.CONFIRMED)} 
                        className="flex-1 md:flex-none bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-violet-600 transition shadow-lg"
                      >
                        Accepter
                      </button>
                    )}
                    {bk.status === BookingStatus.CONFIRMED && (
                      <button 
                        onClick={() => onUpdateBooking(bk.id, BookingStatus.COMPLETED)} 
                        className="flex-1 md:flex-none bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-green-700 transition shadow-lg"
                      >
                        Terminer
                      </button>
                    )}
                    <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 min-w-[120px] text-center">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Recette</p>
                       <p className="text-lg font-black text-slate-900">{bk.totalPrice} DH</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-300">
                   <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-calendar-alt text-slate-300"></i>
                   </div>
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aucun rendez-vous planifié</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'SERVICES' && (
            <div className="space-y-8 animate-fadeIn">
               <form onSubmit={handleAddService} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-8">Ajouter une prestation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block">Nom du service</label>
                      <input 
                        required 
                        type="text" 
                        value={newService.name} 
                        onChange={e => setNewService({...newService, name: e.target.value})} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 font-bold outline-none focus:border-violet-400 transition" 
                        placeholder="Ex: Dégradé Homme + Barbe" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block">Tarif (DH)</label>
                      <input 
                        required 
                        type="number" 
                        value={newService.price} 
                        onChange={e => setNewService({...newService, price: e.target.value})} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 font-bold outline-none focus:border-violet-400 transition" 
                      />
                    </div>
                  </div>
                  <button type="submit" className="mt-8 bg-violet-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-violet-100 hover:bg-violet-700 transition">
                    Enregistrer la prestation
                  </button>
               </form>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {barber.services?.map(s => (
                    <div key={s.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-center group hover:border-violet-200 transition-all">
                       <div>
                          <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-tight">{s.name}</h4>
                          <p className="text-2xl font-black text-violet-600 mt-2">{s.price} <span className="text-sm font-bold">DH</span></p>
                       </div>
                       <button onClick={() => removeService(s.id)} className="w-10 h-10 rounded-xl border border-slate-100 text-slate-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all">
                          <i className="fas fa-trash-alt text-sm"></i>
                       </button>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarberDashboard;
