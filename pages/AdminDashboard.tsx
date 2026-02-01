
import React, { useState, useMemo } from 'react';
import { User, Hairdresser, Booking, UserRole, BookingStatus } from '../types';

interface AdminDashboardProps {
  allMembers: (User | Hairdresser)[];
  bookings: Booking[];
  onDeleteMember: (id: string) => void;
  onUpdateMember: (member: any) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ allMembers, bookings, onDeleteMember, onUpdateMember }) => {
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'MEMBERS' | 'BOOKINGS'>('MEMBERS');

  const stats = useMemo(() => {
    const completed = bookings.filter(b => b.status === BookingStatus.COMPLETED);
    const rev = completed.reduce((acc, b) => acc + b.totalPrice, 0);
    return {
      members: allMembers.length,
      bookings: bookings.length,
      revenue: rev,
      earnings: rev * 0.15
    };
  }, [allMembers, bookings]);

  const filteredMembers = useMemo(() => {
    return allMembers.filter(m => 
      (m.name?.toLowerCase() || '').includes(filter.toLowerCase()) || 
      (m.email?.toLowerCase() || '').includes(filter.toLowerCase())
    );
  }, [allMembers, filter]);

  const toggleStatus = (m: User | Hairdresser) => {
    onUpdateMember({ ...m, isActive: m.isActive === false });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <h1 className="text-3xl font-bold text-slate-900">Administration Système</h1>
        <div className="relative w-full md:w-80">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Filtrer par nom ou email..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-violet-500 outline-none transition"
          />
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium mb-1">Membres inscrits</p>
          <p className="text-2xl font-bold text-slate-900">{stats.members}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium mb-1">Rendez-vous totaux</p>
          <p className="text-2xl font-bold text-slate-900">{stats.bookings}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium mb-1">Volume d'affaires</p>
          <p className="text-2xl font-bold text-slate-900">{stats.revenue} DH</p>
        </div>
        <div className="bg-violet-600 p-6 rounded-2xl shadow-sm text-white">
          <p className="text-violet-100 text-sm font-medium mb-1">Commission (15%)</p>
          <p className="text-2xl font-bold">{stats.earnings.toFixed(0)} DH</p>
        </div>
      </div>

      <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex mb-4">
        <button onClick={() => setActiveTab('MEMBERS')} className={`px-6 py-2 rounded-lg font-bold text-sm transition ${activeTab === 'MEMBERS' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>Membres</button>
        <button onClick={() => setActiveTab('BOOKINGS')} className={`px-6 py-2 rounded-lg font-bold text-sm transition ${activeTab === 'BOOKINGS' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>Réservations</button>
      </div>

      {activeTab === 'MEMBERS' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Membre</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">État</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={m.avatar || `https://ui-avatars.com/api/?name=${m.name}`} className="w-10 h-10 rounded-full object-cover border" />
                      <div>
                        <p className="font-bold text-slate-900">{m.name}</p>
                        <p className="text-xs text-slate-500">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      m.role === UserRole.BARBER ? 'bg-violet-100 text-violet-700' : 
                      m.role === UserRole.ADMIN ? 'bg-slate-900 text-white' : 
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {m.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-lg font-bold text-[10px] uppercase ${m.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {m.isActive !== false ? 'Actif' : 'Suspendu'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => toggleStatus(m)}
                        className={`p-2 rounded-lg border transition ${m.isActive !== false ? 'text-amber-600 border-amber-200 hover:bg-amber-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`}
                        title={m.isActive !== false ? "Suspendre" : "Activer"}
                      >
                        <i className={`fas ${m.isActive !== false ? 'fa-user-slash' : 'fa-user-check'}`}></i>
                      </button>
                      <button 
                        onClick={() => { if(confirm("Supprimer ce compte définitivement ?")) onDeleteMember(m.id) }}
                        className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                        title="Supprimer"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">Aucun utilisateur trouvé</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'BOOKINGS' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Client / Expert</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Prestation</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {bookings.slice().reverse().map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">{new Date(b.date).toLocaleString('fr-FR')}</td>
                  <td className="px-6 py-4">
                     <p className="text-sm font-bold text-slate-900">{b.clientName || 'Visiteur'}</p>
                     <p className="text-[10px] text-violet-600 font-medium uppercase">Expert: {b.barberId.substring(0,8)}</p>
                  </td>
                  <td className="px-6 py-4 text-sm">{b.serviceName}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">{b.totalPrice} DH</td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">Aucune réservation pour le moment</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
