
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
  const [activeTab, setActiveTab] = useState<'PROFIL' | 'RESA'>('PROFIL');
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [editForm, setEditForm] = useState({
    name: user.name,
    phone: (user as any).phone || '',
    address: (user as any).location?.address || '',
  });

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      onUpdateProfile({ ...user, avatar: reader.result as string });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onUpdateProfile({ ...user, ...editForm });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-8 text-center relative">
          <div className="relative inline-block group">
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} 
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover" 
            />
            <button 
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-violet-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-violet-700 transition"
            >
              {isUploading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-camera"></i>}
            </button>
            <input type="file" ref={avatarInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
          </div>
          <h2 className="text-2xl font-bold text-white mt-4">{user.name}</h2>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{user.role}</p>
        </div>

        <div className="flex border-b border-slate-100">
          <button onClick={() => setActiveTab('PROFIL')} className={`flex-1 py-4 font-bold text-sm transition ${activeTab === 'PROFIL' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-slate-500'}`}>Mon Profil</button>
          <button onClick={() => setActiveTab('RESA')} className={`flex-1 py-4 font-bold text-sm transition ${activeTab === 'RESA' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-slate-500'}`}>Réservations ({bookings.length})</button>
        </div>

        <div className="p-8">
          {activeTab === 'PROFIL' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900">Informations Personnelles</h3>
                <button 
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition ${isEditing ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-900'}`}
                >
                  {isEditing ? 'Sauvegarder' : 'Modifier'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nom Complet</label>
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    readOnly={!isEditing}
                    className={`w-full p-3 rounded-xl border ${isEditing ? 'border-violet-300' : 'border-slate-100 bg-slate-50'} outline-none focus:ring-2 focus:ring-violet-500 font-medium`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                  <input type="text" value={user.email} readOnly className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none font-medium text-slate-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Téléphone</label>
                  <input 
                    type="text" 
                    value={editForm.phone}
                    onChange={e => setEditForm({...editForm, phone: e.target.value})}
                    readOnly={!isEditing}
                    placeholder="Non renseigné"
                    className={`w-full p-3 rounded-xl border ${isEditing ? 'border-violet-300' : 'border-slate-100 bg-slate-50'} outline-none focus:ring-2 focus:ring-violet-500 font-medium`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ville / Adresse</label>
                  <input 
                    type="text" 
                    value={editForm.address}
                    onChange={e => setEditForm({...editForm, address: e.target.value})}
                    readOnly={!isEditing}
                    placeholder="Non renseigné"
                    className={`w-full p-3 rounded-xl border ${isEditing ? 'border-violet-300' : 'border-slate-100 bg-slate-50'} outline-none focus:ring-2 focus:ring-violet-500 font-medium`}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'RESA' && (
            <div className="space-y-4">
              {bookings.length > 0 ? bookings.slice().reverse().map(bk => (
                <div key={bk.id} className="p-6 border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <p className="text-xs font-bold text-violet-600 uppercase mb-1">{new Date(bk.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    <h4 className="font-bold text-slate-900">{bk.serviceName}</h4>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-2 ${
                      bk.status === BookingStatus.COMPLETED ? 'bg-green-100 text-green-700' : 
                      bk.status === BookingStatus.CANCELLED ? 'bg-red-100 text-red-700' : 
                      'bg-slate-100 text-slate-600'
                    }`}>{bk.status}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900">{bk.totalPrice} DH</p>
                    {bk.status === BookingStatus.PENDING && (
                      <button onClick={() => onCancelBooking(bk.id)} className="text-xs font-bold text-red-500 hover:underline mt-2">Annuler</button>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 text-slate-300 font-bold uppercase tracking-widest text-sm">Aucun historique</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
