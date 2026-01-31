
import React, { useState, useRef } from 'react';
import { User, Booking, BookingStatus, UserRole, Hairdresser } from '../types';

interface MyAccountProps {
  user: User | Hairdresser;
  bookings: Booking[];
  onUpdateProfile: (user: any) => void;
  onAddReview: (review: any) => void;
  onCancelBooking: (id: string) => void;
}

const MyAccount: React.FC<MyAccountProps> = ({ user, bookings, onUpdateProfile, onAddReview, onCancelBooking }) => {
  const [activeTab, setActiveTab] = useState<'PROFIL' | 'RESA'>('RESA');
  const [ratingModal, setRatingModal] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    bio: (user as Hairdresser).bio || ''
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
    setRating(5);
    setComment('');
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile({ ...user, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    onUpdateProfile({ ...user, ...editForm });
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* INPUT FICHIER CACHÉ */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />

      {/* MODAL NOTATION */}
      {ratingModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="glass max-w-sm w-full p-10 rounded-[3rem] shadow-2xl border-white/60 text-center animate-fadeIn">
            <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">Noter le service</h3>
            <div className="flex justify-center gap-3 mb-8">
               {[1,2,3,4,5].map(star => (
                 <button key={star} onClick={() => setRating(star)} className={`text-3xl transition ${rating >= star ? 'text-amber-500 scale-125' : 'text-slate-200'}`}><i className="fas fa-star"></i></button>
               ))}
            </div>
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Un petit mot sur l'expert..." className="w-full glass bg-white rounded-2xl p-4 font-bold text-sm mb-8 min-h-[100px] outline-none border-white/60"></textarea>
            <button onClick={handleReviewSubmit} className="w-full bg-violet-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl">Envoyer l'avis</button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12">
        {/* SIDEBAR PROFIL */}
        <div className="lg:w-80">
          <div className="glass p-8 rounded-[3rem] border-white/60 shadow-xl text-center sticky top-28">
            <div className="relative group mx-auto mb-6 w-32 h-32">
              <img 
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} 
                className="w-full h-full rounded-[2.5rem] object-cover ring-4 ring-white shadow-2xl transition group-hover:brightness-75 cursor-pointer"
                onClick={handlePhotoClick}
              />
              <button 
                onClick={handlePhotoClick}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white text-xl"
              >
                <i className="fas fa-camera"></i>
              </button>
            </div>
            
            <h2 className="text-xl font-black text-slate-900 truncate px-2">{user.name}</h2>
            <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest mt-2">{user.role}</p>
            
            <div className="mt-8 space-y-2">
               <button onClick={() => setActiveTab('RESA')} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'RESA' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-white/50'}`}>Mes Réservations</button>
               <button onClick={() => setActiveTab('PROFIL')} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'PROFIL' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-white/50'}`}>Mon Profil</button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1">
          {activeTab === 'RESA' && (
            <div className="space-y-6 animate-fadeIn">
               <div className="flex justify-between items-end mb-8">
                 <div>
                   <h1 className="text-3xl font-black text-slate-900 tracking-tight">Suivi d'activité</h1>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Vos rendez-vous MyHairCut</p>
                 </div>
               </div>
               
               {bookings.slice().reverse().map(bk => (
                 <div key={bk.id} className="glass p-8 rounded-[3rem] border-white/60 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 group hover:shadow-lg transition">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-violet-100 rounded-[1.5rem] flex items-center justify-center text-violet-600"><i className="fas fa-calendar-check text-xl"></i></div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{new Date(bk.date).toLocaleDateString()}</p>
                          <h4 className="text-lg font-black text-slate-900">{bk.serviceName}</h4>
                          <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase ${bk.status === BookingStatus.COMPLETED ? 'bg-green-100 text-green-600' : bk.status === BookingStatus.CANCELLED ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>{bk.status}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <p className="text-xl font-black text-slate-900">{bk.totalPrice} DH</p>
                       {bk.status === BookingStatus.COMPLETED && (
                         <button onClick={() => setRatingModal(bk)} className="bg-amber-500 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-amber-600 transition">Noter</button>
                       )}
                       {bk.status === BookingStatus.PENDING && (
                         <button onClick={() => onCancelBooking(bk.id)} className="text-red-500 font-black uppercase text-[10px] hover:underline">Annuler</button>
                       )}
                    </div>
                 </div>
               ))}
               {bookings.length === 0 && <div className="p-20 text-center glass rounded-[3rem] border-white/60 font-black uppercase text-slate-300 tracking-widest">Aucun historique de réservation</div>}
            </div>
          )}

          {activeTab === 'PROFIL' && (
            <div className="glass p-10 rounded-[3rem] border-white/60 shadow-xl animate-fadeIn">
               <div className="flex justify-between items-center mb-10">
                 <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Paramètres du compte</h1>
                 {!isEditing ? (
                   <button onClick={() => setIsEditing(true)} className="bg-slate-900 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Modifier</button>
                 ) : (
                   <div className="flex gap-2">
                     <button onClick={() => setIsEditing(false)} className="bg-slate-100 text-slate-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Annuler</button>
                     <button onClick={handleSaveProfile} className="bg-violet-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Sauvegarder</button>
                   </div>
                 )}
               </div>

               <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Nom complet</label>
                      <input 
                        type="text" 
                        value={editForm.name} 
                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                        className={`w-full glass bg-white rounded-xl px-4 py-3 font-bold ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`} 
                        readOnly={!isEditing} 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Email (Identifiant)</label>
                      <input 
                        type="text" 
                        value={user.email} 
                        className="w-full glass bg-white/40 rounded-xl px-4 py-3 font-bold opacity-60 cursor-not-allowed" 
                        readOnly 
                      />
                    </div>
                  </div>
                  
                  {user.role === UserRole.BARBER && (
                    <div className="animate-fadeIn">
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Biographie Professionnelle</label>
                      <textarea 
                        value={editForm.bio} 
                        onChange={e => setEditForm({...editForm, bio: e.target.value})}
                        className={`w-full glass bg-white rounded-xl p-4 font-bold min-h-[120px] ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                        readOnly={!isEditing}
                        placeholder="Parlez de votre expertise..."
                      ></textarea>
                    </div>
                  )}

                  <div className="pt-10 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-slate-400">
                      <i className="fas fa-shield-alt text-xl"></i>
                      <p className="text-[10px] font-bold">Votre compte est protégé par MyHairCut Security. Pour changer d'email, contactez le support.</p>
                    </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
