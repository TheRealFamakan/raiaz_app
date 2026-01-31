
import React, { useState } from 'react';
import { Hairdresser, Booking, User, BookingStatus } from '../types';
import { PAYMENT_METHODS } from '../constants';

interface ProfileProps {
  barber: Hairdresser;
  reviews: any[];
  onAddBooking: (booking: Booking) => void;
  currentUser: User | null;
}

const Profile: React.FC<ProfileProps> = ({ barber, reviews = [], onAddBooking, currentUser }) => {
  const [activeTab, setActiveTab] = useState('services');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [bookingStatus, setBookingStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');

  const currentService = barber.services?.find(s => s.id === selectedService);

  const handleBooking = () => {
    if (!selectedService) return;
    setBookingStatus('PROCESSING');
    setTimeout(() => {
      onAddBooking({
        id: `bk_${Date.now()}`,
        clientId: currentUser?.id || 'guest',
        clientName: currentUser?.name || 'Visiteur',
        barberId: barber.id,
        serviceId: selectedService,
        serviceName: currentService?.name,
        date: new Date().toISOString(),
        status: BookingStatus.PENDING,
        paymentMethod: paymentMethod === 'cash' ? 'Espèces' : 'Mobile Money',
        totalPrice: currentService?.price || 0
      });
      setBookingStatus('SUCCESS');
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 relative animate-fadeIn">
      {bookingStatus === 'SUCCESS' && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="glass max-w-sm w-full p-10 rounded-[3rem] text-center shadow-2xl border-white/40">
            <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce"><i className="fas fa-check text-3xl"></i></div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Demande envoyée !</h3>
            <p className="text-slate-500 font-medium mb-8 text-sm">L'expert va valider votre créneau d'un instant à l'autre.</p>
            <button onClick={() => setBookingStatus('IDLE')} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl">Génial</button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-10">
          {/* BARBER HEADER */}
          <div className="glass rounded-[3rem] p-10 shadow-xl border border-white/50 flex flex-col md:flex-row gap-10 bg-white/30">
            <div className="relative">
              <img src={barber.avatar} alt={barber.name} className="w-48 h-48 rounded-[2.5rem] object-cover shadow-2xl ring-4 ring-white" />
              <div className="absolute -bottom-4 -right-4 glass px-4 py-2 rounded-2xl border-white/80 shadow-lg flex items-center gap-2">
                <i className="fas fa-star text-amber-500"></i><span className="font-black text-slate-800">{barber.rating}</span>
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">{barber.name} {barber.isVerified && <i className="fas fa-check-circle text-violet-600"></i>}</h1>
              <p className="text-violet-600 font-black uppercase tracking-widest text-[10px] mt-2 bg-violet-50 inline-block px-4 py-1.5 rounded-full">Expert Partenaire MyHairCut</p>
              <p className="text-slate-600 font-medium leading-relaxed mt-8 text-lg">{barber.bio}</p>
            </div>
          </div>

          {/* TABS CONTENT */}
          <div className="glass rounded-[3rem] shadow-xl border border-white/50 overflow-hidden bg-white/20">
            <div className="flex border-b border-white/20">
              {['services', 'gallery', 'reviews'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'text-violet-600 bg-white/40 border-b-4 border-violet-600' : 'text-slate-400'}`}>
                  {t === 'services' ? 'Prestations' : t === 'gallery' ? 'Réalisations' : 'Avis'}
                </button>
              ))}
            </div>
            <div className="p-10">
              {activeTab === 'services' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {barber.services?.map(s => (
                    <div key={s.id} onClick={() => setSelectedService(s.id)} className={`glass p-8 rounded-[2rem] cursor-pointer border-2 transition-all flex items-center justify-between group ${selectedService === s.id ? 'border-violet-600 bg-violet-600/5' : 'border-white/40 hover:border-violet-200'}`}>
                      <div><h4 className="font-black text-slate-900 text-sm uppercase group-hover:text-violet-600 transition">{s.name}</h4><p className="text-[10px] font-black text-slate-400 mt-1">{s.duration} MIN</p></div>
                      <p className="font-black text-2xl text-violet-600">{s.price} DH</p>
                    </div>
                  ))}
                  {(!barber.services || barber.services.length === 0) && <p className="col-span-2 text-center text-slate-400 font-black uppercase text-[10px] py-10">Aucune prestation configurée</p>}
                </div>
              )}
              {activeTab === 'gallery' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                   {barber.gallery?.map((img, i) => <img key={i} src={img} className="w-full aspect-square object-cover rounded-[2rem] shadow-lg border-2 border-white hover:scale-105 transition" />)}
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                   {reviews.map(r => (
                     <div key={r.id} className="glass p-8 rounded-[2.5rem] border-white/60 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                           <div className="flex items-center gap-3">
                              <img src={`https://ui-avatars.com/api/?name=${r.clientName}`} className="w-10 h-10 rounded-xl" />
                              <p className="font-black text-slate-900 text-sm">{r.clientName}</p>
                           </div>
                           <div className="flex text-amber-500 text-xs">{[...Array(r.rating)].map((_, i) => <i key={i} className="fas fa-star"></i>)}</div>
                        </div>
                        <p className="text-slate-600 font-medium italic">"{r.comment}"</p>
                     </div>
                   ))}
                   {reviews.length === 0 && <p className="text-center text-slate-400 font-black uppercase text-[10px] py-10">Aucun avis pour le moment</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOOKING WIDGET */}
        <div className="lg:w-[400px]">
          <div className="glass rounded-[3rem] p-10 shadow-2xl border border-white/60 sticky top-28 space-y-8 bg-white/50 backdrop-blur-2xl">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Réserver</h3>
            {selectedService ? (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
                   <p className="text-[10px] font-black uppercase opacity-60 mb-1">Service sélectionné</p>
                   <div className="flex justify-between items-center"><span className="text-sm font-black">{currentService?.name}</span><span className="text-xl font-black text-violet-400">{currentService?.price} DH</span></div>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mode de règlement</p>
                  {PAYMENT_METHODS.map(method => (
                    <button key={method.id} onClick={() => setPaymentMethod(method.id)} className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${paymentMethod === method.id ? 'border-violet-600 bg-violet-600/5 text-violet-600' : 'border-white text-slate-400'}`}>
                      <div className="flex items-center gap-4"><i className={`fas ${method.icon}`}></i><span className="text-[10px] font-black uppercase">{method.name}</span></div>
                      {paymentMethod === method.id && <i className="fas fa-check-circle"></i>}
                    </button>
                  ))}
                </div>
                <button onClick={handleBooking} className="w-full bg-violet-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:bg-violet-700 transition active:scale-95 flex items-center justify-center gap-3">
                  {bookingStatus === 'PROCESSING' ? <i className="fas fa-circle-notch fa-spin"></i> : <><i className="fas fa-calendar-check"></i> Confirmer RDV</>}
                </button>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 font-black text-[10px] uppercase tracking-widest">Sélectionnez un service</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
