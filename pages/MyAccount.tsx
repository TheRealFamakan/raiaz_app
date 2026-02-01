
import React, { useState, useRef } from 'react';
import { User, Booking, BookingStatus, UserRole, Hairdresser, Service } from '../types';

interface MyAccountProps {
  user: User | Hairdresser;
  bookings: Booking[];
  onUpdateProfile: (user: any) => void;
  onAddReview: (review: any) => void;
  onCancelBooking: (id: string) => void;
}

const MyAccount: React.FC<MyAccountProps> = ({ user, bookings, onUpdateProfile, onAddReview, onCancelBooking }) => {
  const [activeTab, setActiveTab] = useState<'PROFIL' | 'RESA' | 'SERVICES' | 'GALLERY'>('RESA');
  const [ratingModal, setRatingModal] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const [editForm, setEditForm] = useState({
    name: user.name,
    bio: (user as Hairdresser).bio || '',
    phone: (user as any).phone || '',
    address: (user as any).location?.address || '',
    newService: { name: '', price: '' },
    newImage: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReviewSubmit = () => {
    if (!ratingModal) return;
    onAddReview({
      id: `rev_${Date.now()}`,
      barberId: ratingModal.barberId,
      clientId: user.id,
      clientName: user.name,
      rating,
      comment,
      date: new Date().toISOString()
    });
    setRatingModal(null);
  };

  const handleSaveProfile = () => {
    onUpdateProfile({ 
      ...user, 
      name: editForm.name, 
      bio: editForm.bio,
      phone: editForm.phone,
      location: { ...user.location, address: editForm.address }
    });
    setIsEditing(false);
  };

  const addService = () => {
    if (!editForm.newService.name || !editForm.newService.price) return;
    const services = [...((user as Hairdresser).services || [])];
    services.push({
      id: `s_${Date.now()}`,
      name: editForm.newService.name,
      price: Number(editForm.newService.price),
      duration: 30
    });
    onUpdateProfile({ ...user, services });
    setEditForm({ ...editForm, newService: { name: '', price: '' } });
  };

  const addGalleryImage = () => {
    if (!editForm.newImage) return;
    const gallery = [...((user as Hairdresser).gallery || [])];
    gallery.push(editForm.newImage);
    onUpdateProfile({ ...user, gallery });
    setEditForm({ ...editForm, newImage: '' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-80">
          <div className="glass p-8 rounded-[3rem] border-white/60 shadow-xl text-center sticky top-28">
            <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} className="w-32 h-32 rounded-[2.5rem] mx-auto mb-6 object-cover shadow-2xl ring-4 ring-white" />
            <h2 className="text-xl font-black text-slate-900 truncate">{user.name}</h2>
            <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest mt-2">{user.role}</p>
            
            <div className="mt-8 space-y-2">
               <button onClick={() => setActiveTab('RESA')} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'RESA' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-white/50'}`}>Activités</button>
               <button onClick={() => setActiveTab('PROFIL')} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'PROFIL' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-white/50'}`}>Mon Profil</button>
               {user.role === UserRole.BARBER && (
                 <>
                   <button onClick={() => setActiveTab('SERVICES')} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'SERVICES' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-white/50'}`}>Prestations</button>
                   <button onClick={() => setActiveTab('GALLERY')} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'GALLERY' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-white/50'}`}>Galerie Photos</button>
                 </>
               )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          {activeTab === 'RESA' && (
            <div className="space-y-6 animate-fadeIn">
               <h1 className="text-3xl font-black text-slate-900 tracking-tight">Historique</h1>
               {bookings.slice().reverse().map(bk => (
                 <div key={bk.id} className="glass p-8 rounded-[3rem] border-white/60 shadow-sm flex justify-between items-center group">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{new Date(bk.date).toLocaleDateString()}</p>
                      <h4 className="text-lg font-black text-slate-900">{bk.serviceName}</h4>
                      <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${bk.status === BookingStatus.COMPLETED ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>{bk.status}</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <p className="text-xl font-black text-slate-900">{bk.totalPrice} DH</p>
                       {bk.status === BookingStatus.COMPLETED && <button onClick={() => setRatingModal(bk)} className="bg-amber-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Noter</button>}
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'PROFIL' && (
            <div className="glass p-10 rounded-[3rem] border-white/60 shadow-xl animate-fadeIn">
               <div className="flex justify-between items-center mb-10">
                 <h2 className="text-2xl font-black text-slate-900 uppercase">Paramètres</h2>
                 {!isEditing ? <button onClick={() => setIsEditing(true)} className="bg-slate-900 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase">Modifier</button> : <button onClick={handleSaveProfile} className="bg-violet-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase">Enregistrer</button>}
               </div>
               <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Nom</label><input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full glass bg-white rounded-xl px-4 py-3 font-bold" readOnly={!isEditing} /></div>
                    <div><label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Email</label><input type="text" value={user.email} className="w-full glass bg-slate-50 rounded-xl px-4 py-3 font-bold opacity-50" readOnly /></div>
                    <div><label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Téléphone</label><input type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} placeholder="+212 ..." className="w-full glass bg-white rounded-xl px-4 py-3 font-bold" readOnly={!isEditing} /></div>
                    <div><label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Adresse Ville</label><input type="text" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} placeholder="Casablanca, Maroc" className="w-full glass bg-white rounded-xl px-4 py-3 font-bold" readOnly={!isEditing} /></div>
                  </div>
                  {user.role === UserRole.BARBER && (
                    <div><label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Présentation Expert</label><textarea value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} className="w-full glass bg-white rounded-xl p-4 font-bold min-h-[120px]" readOnly={!isEditing}></textarea></div>
                  )}
               </div>
            </div>
          )}

          {activeTab === 'SERVICES' && user.role === UserRole.BARBER && (
            <div className="glass p-10 rounded-[3rem] border-white/60 shadow-xl animate-fadeIn">
               <h2 className="text-2xl font-black text-slate-900 uppercase mb-8">Ma Carte de Tarifs</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                 <input type="text" placeholder="Nom du service" value={editForm.newService.name} onChange={e => setEditForm({...editForm, newService: {...editForm.newService, name: e.target.value}})} className="glass bg-white px-4 py-3 rounded-xl font-bold" />
                 <div className="flex gap-2">
                   <input type="number" placeholder="DH" value={editForm.newService.price} onChange={e => setEditForm({...editForm, newService: {...editForm.newService, price: e.target.value}})} className="glass bg-white px-4 py-3 rounded-xl font-bold w-full" />
                   <button onClick={addService} className="bg-violet-600 text-white px-6 rounded-xl font-black"><i className="fas fa-plus"></i></button>
                 </div>
               </div>
               <div className="space-y-4">
                 {(user as Hairdresser).services?.map(s => (
                   <div key={s.id} className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                     <span className="font-black text-slate-900 uppercase text-xs">{s.name}</span>
                     <span className="font-black text-violet-600">{s.price} DH</span>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {activeTab === 'GALLERY' && user.role === UserRole.BARBER && (
            <div className="glass p-10 rounded-[3rem] border-white/60 shadow-xl animate-fadeIn">
               <h2 className="text-2xl font-black text-slate-900 uppercase mb-8">Portfolio Réalisations</h2>
               <div className="flex gap-4 mb-10">
                 <input type="text" placeholder="URL de l'image (Unsplash ou autre)" value={editForm.newImage} onChange={e => setEditForm({...editForm, newImage: e.target.value})} className="flex-1 glass bg-white px-4 py-3 rounded-xl font-bold" />
                 <button onClick={addGalleryImage} className="bg-violet-600 text-white px-8 rounded-xl font-black uppercase text-[10px]">Ajouter</button>
               </div>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                 {(user as Hairdresser).gallery?.map((img, i) => (
                   <div key={i} className="relative group aspect-square">
                     <img src={img} className="w-full h-full object-cover rounded-2xl" />
                     <button onClick={() => {
                        const gallery = (user as Hairdresser).gallery.filter((_, idx) => idx !== i);
                        onUpdateProfile({...user, gallery});
                     }} className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-lg opacity-0 group-hover:opacity-100 transition"><i className="fas fa-trash"></i></button>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      </div>
      
      {ratingModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="glass max-w-sm w-full p-10 rounded-[3rem] shadow-2xl border-white/60 text-center animate-fadeIn">
            <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase">Noter le service</h3>
            <div className="flex justify-center gap-3 mb-8">
               {[1,2,3,4,5].map(star => <button key={star} onClick={() => setRating(star)} className={`text-3xl transition ${rating >= star ? 'text-amber-500' : 'text-slate-200'}`}><i className="fas fa-star"></i></button>)}
            </div>
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Un petit mot sur l'expert..." className="w-full glass bg-white rounded-2xl p-4 font-bold text-sm mb-8 min-h-[100px] outline-none border-white/60"></textarea>
            <button onClick={handleReviewSubmit} className="w-full bg-violet-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl">Envoyer l'avis</button>
            <button onClick={() => setRatingModal(null)} className="mt-4 text-slate-400 font-bold uppercase text-[10px]">Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccount;
