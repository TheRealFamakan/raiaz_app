
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
  const [activeTab, setActiveTab] = useState<'PROFIL' | 'RESA' | 'SERVICES' | 'GALLERY'>('PROFIL');
  const [ratingModal, setRatingModal] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [editForm, setEditForm] = useState({
    name: user.name,
    bio: (user as Hairdresser).bio || '',
    phone: (user as any).phone || '',
    address: (user as any).location?.address || '',
    newService: { name: '', price: '' },
    newImage: ''
  });

  const handleSaveProfile = () => {
    onUpdateProfile({ 
      ...user, 
      name: editForm.name, 
      bio: editForm.bio,
      phone: editForm.phone,
      location: { ...user.location, address: editForm.address }
    });
    setIsEditing(false);
    alert("Profil mis à jour avec succès !");
  };

  // Gestion du changement de l'avatar (photo de profil)
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onUpdateProfile({
        ...user,
        avatar: base64String
      });
      setIsUploadingAvatar(false);
    };
    reader.readAsDataURL(file);
  };

  // Gestion de l'ajout à la galerie
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const currentGallery = (user as Hairdresser).gallery || [];
      onUpdateProfile({
        ...user,
        gallery: [...currentGallery, base64String]
      });
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* SIDEBAR */}
        <div className="lg:w-80">
          <div className="glass p-8 rounded-[3rem] border-white/60 shadow-xl text-center sticky top-28">
            <div className="relative inline-block group mb-6">
              <img 
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} 
                className="w-32 h-32 rounded-[2.5rem] mx-auto object-cover shadow-2xl ring-4 ring-white transition-all group-hover:brightness-75" 
              />
              <button 
                onClick={() => avatarInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Changer la photo de profil"
              >
                <div className="bg-white/90 p-3 rounded-full shadow-lg">
                  {isUploadingAvatar ? <i className="fas fa-spinner fa-spin text-violet-600"></i> : <i className="fas fa-camera text-violet-600"></i>}
                </div>
              </button>
              <input type="file" ref={avatarInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
            </div>
            
            <h2 className="text-xl font-black text-slate-900 truncate">{user.name}</h2>
            <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest mt-2">{user.role}</p>
            
            <div className="mt-8 space-y-2">
               <button onClick={() => setActiveTab('PROFIL')} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'PROFIL' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-white/50'}`}>Mon Profil</button>
               <button onClick={() => setActiveTab('RESA')} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'RESA' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-white/50'}`}>Mes RDV</button>
               {user.role === UserRole.BARBER && (
                 <>
                   <button onClick={() => setActiveTab('SERVICES')} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'SERVICES' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-white/50'}`}>Prestations</button>
                   <button onClick={() => setActiveTab('GALLERY')} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'GALLERY' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-white/50'}`}>Portfolio</button>
                 </>
               )}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          {activeTab === 'PROFIL' && (
            <div className="glass p-10 rounded-[3rem] border-white/60 shadow-xl animate-fadeIn bg-white/40">
               <div className="flex justify-between items-center mb-10">
                 <h2 className="text-2xl font-black text-slate-900 uppercase">Informations personnelles</h2>
                 {!isEditing ? (
                   <button onClick={() => setIsEditing(true)} className="bg-slate-900 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase shadow-xl hover:scale-105 transition">Modifier</button>
                 ) : (
                   <div className="flex gap-3">
                     <button onClick={() => setIsEditing(false)} className="bg-slate-200 text-slate-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase">Annuler</button>
                     <button onClick={handleSaveProfile} className="bg-violet-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase shadow-xl">Sauvegarder</button>
                   </div>
                 )}
               </div>
               
               <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Nom complet</label>
                      <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className={`w-full glass bg-white rounded-2xl px-6 py-4 font-bold border-2 transition ${isEditing ? 'border-violet-100 ring-4 ring-violet-50' : 'border-transparent'}`} readOnly={!isEditing} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Email</label>
                      <input type="text" value={user.email} className="w-full glass bg-slate-50/50 rounded-2xl px-6 py-4 font-bold opacity-50" readOnly />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Téléphone de contact</label>
                      <input type="text" placeholder="+212 ..." value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className={`w-full glass bg-white rounded-2xl px-6 py-4 font-bold border-2 transition ${isEditing ? 'border-violet-100 ring-4 ring-violet-50' : 'border-transparent'}`} readOnly={!isEditing} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Ville / Secteur</label>
                      <input type="text" placeholder="Ex: Casablanca, Maarif" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} className={`w-full glass bg-white rounded-2xl px-6 py-4 font-bold border-2 transition ${isEditing ? 'border-violet-100 ring-4 ring-violet-50' : 'border-transparent'}`} readOnly={!isEditing} />
                    </div>
                  </div>
                  
                  {user.role === UserRole.BARBER && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Ma Bio Professionnelle</label>
                      <textarea placeholder="Décrivez votre expertise, vos années d'expérience..." value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} className={`w-full glass bg-white rounded-2xl p-6 font-bold min-h-[150px] border-2 transition ${isEditing ? 'border-violet-100 ring-4 ring-violet-50' : 'border-transparent'}`} readOnly={!isEditing}></textarea>
                    </div>
                  )}
               </div>
            </div>
          )}

          {activeTab === 'RESA' && (
            <div className="space-y-6 animate-fadeIn">
               <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Mes Rendez-vous</h1>
               {bookings.length > 0 ? bookings.slice().reverse().map(bk => (
                 <div key={bk.id} className="glass p-8 rounded-[3rem] border-white/60 shadow-sm flex flex-col sm:flex-row justify-between items-center group bg-white/30">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{new Date(bk.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                      <h4 className="text-lg font-black text-slate-900 uppercase">{bk.serviceName}</h4>
                      <span className={`px-3 py-1 rounded-md text-[8px] font-black uppercase inline-block mt-2 ${bk.status === BookingStatus.COMPLETED ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>{bk.status}</span>
                    </div>
                    <div className="flex items-center gap-6 mt-4 sm:mt-0">
                       <p className="text-2xl font-black text-slate-900">{bk.totalPrice} DH</p>
                       {bk.status === BookingStatus.COMPLETED && <button onClick={() => setRatingModal(bk)} className="bg-amber-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg hover:bg-amber-600">Noter l'expert</button>}
                    </div>
                 </div>
               )) : (
                 <div className="text-center py-24 glass rounded-[3rem] text-slate-300 font-black uppercase text-[10px] tracking-widest">Aucune activité enregistrée</div>
               )}
            </div>
          )}

          {activeTab === 'GALLERY' && user.role === UserRole.BARBER && (
            <div className="glass p-10 rounded-[3rem] border-white/60 shadow-xl animate-fadeIn bg-white/40">
               <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-black text-slate-900 uppercase">Ma Vitrine Photos</h2>
                 <button 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={isUploading}
                  className="bg-violet-600 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] shadow-xl hover:scale-105 transition disabled:opacity-50"
                 >
                   {isUploading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-camera mr-2"></i>}
                   Ajouter une photo
                 </button>
                 <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
               </div>
               
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                 {(user as Hairdresser).gallery?.map((img, i) => (
                   <div key={i} className="relative group aspect-square">
                     <img src={img} className="w-full h-full object-cover rounded-[2rem] shadow-md border-2 border-white" />
                     <button onClick={() => {
                        const gallery = (user as Hairdresser).gallery.filter((_, idx) => idx !== i);
                        onUpdateProfile({...user, gallery});
                     }} className="absolute top-4 right-4 bg-red-500 text-white w-10 h-10 rounded-xl opacity-0 group-hover:opacity-100 transition shadow-xl flex items-center justify-center"><i className="fas fa-trash-alt"></i></button>
                   </div>
                 ))}
                 {(!(user as Hairdresser).gallery || (user as Hairdresser).gallery.length === 0) && (
                   <div className="col-span-full py-20 text-center border-2 border-dashed border-white/60 rounded-[2rem]">
                      <i className="fas fa-images text-4xl text-white/40 mb-4"></i>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Votre galerie est vide. Ajoutez vos plus belles coupes !</p>
                   </div>
                 )}
               </div>
            </div>
          )}
          
          {activeTab === 'SERVICES' && user.role === UserRole.BARBER && (
            <div className="glass p-10 rounded-[3rem] border-white/60 shadow-xl animate-fadeIn bg-white/40">
               <h2 className="text-2xl font-black text-slate-900 uppercase mb-8">Mes Prestations</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 bg-white/50 p-6 rounded-[2rem]">
                 <input type="text" placeholder="Nom (ex: Barbe + Soin)" value={editForm.newService.name} onChange={e => setEditForm({...editForm, newService: {...editForm.newService, name: e.target.value}})} className="glass bg-white px-6 py-4 rounded-2xl font-bold outline-none" />
                 <div className="flex gap-2">
                   <input type="number" placeholder="DH" value={editForm.newService.price} onChange={e => setEditForm({...editForm, newService: {...editForm.newService, price: e.target.value}})} className="glass bg-white px-6 py-4 rounded-2xl font-bold w-full outline-none" />
                   <button onClick={addService} className="bg-violet-600 text-white px-8 rounded-2xl font-black shadow-lg hover:bg-violet-700 transition"><i className="fas fa-plus"></i></button>
                 </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {(user as Hairdresser).services?.map(s => (
                   <div key={s.id} className="flex justify-between items-center p-6 bg-white/60 rounded-2xl border border-white/80 group">
                     <div>
                        <span className="font-black text-slate-900 uppercase text-xs">{s.name}</span>
                        <p className="font-black text-violet-600 text-lg">{s.price} DH</p>
                     </div>
                     <button onClick={() => {
                        const services = (user as Hairdresser).services.filter(x => x.id !== s.id);
                        onUpdateProfile({...user, services});
                     }} className="text-red-400 hover:text-red-600 transition p-2 opacity-0 group-hover:opacity-100"><i className="fas fa-trash-alt"></i></button>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      </div>

      {/* RATING MODAL */}
      {ratingModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="glass max-w-sm w-full p-10 rounded-[3rem] shadow-2xl border-white/60 text-center animate-fadeIn bg-white">
            <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase">Laisser un avis</h3>
            <div className="flex justify-center gap-3 mb-8">
               {[1,2,3,4,5].map(star => <button key={star} onClick={() => setRating(star)} className={`text-3xl transition ${rating >= star ? 'text-amber-500' : 'text-slate-200'}`}><i className="fas fa-star"></i></button>)}
            </div>
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Un petit mot sur l'expert..." className="w-full glass bg-slate-50 rounded-2xl p-6 font-bold text-sm mb-8 min-h-[120px] outline-none border-2 border-transparent focus:border-violet-200"></textarea>
            <button onClick={() => {
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
            }} className="w-full bg-violet-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl">Publier mon avis</button>
            <button onClick={() => setRatingModal(null)} className="mt-6 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccount;
