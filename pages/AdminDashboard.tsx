
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

  // Statistiques calculées
  const stats = useMemo(() => {
    const completedBookings = bookings.filter(b => b.status === BookingStatus.COMPLETED);
    const totalRevenue = completedBookings.reduce((acc, b) => acc + b.totalPrice, 0);
    const mhcEarnings = totalRevenue * 0.15;
    return {
      totalMembers: allMembers.length,
      totalBookings: bookings.length,
      totalRevenue,
      mhcEarnings
    };
  }, [allMembers, bookings]);

  // Filtrage sécurisé des membres
  const filteredMembers = useMemo(() => {
    return allMembers.filter(m => {
      const searchStr = filter.toLowerCase();
      return (
        (m.name?.toLowerCase() || '').includes(searchStr) || 
        (m.email?.toLowerCase() || '').includes(searchStr) ||
        (m.role?.toLowerCase() || '').includes(searchStr)
      );
    });
  }, [allMembers, filter]);

  const toggleMemberStatus = (member: User | Hairdresser) => {
    onUpdateMember({ ...member, isActive: member.isActive === false ? true : false });
  };

  const handleDeleteClick = (id: string) => {
    if (confirm("ATTENTION : Cette action est irréversible. Supprimer définitivement cet utilisateur ?")) {
      onDeleteMember(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Supervision MyHairCut</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Interface de contrôle global</p>
        </div>
        
        {/* Barre de recherche globale */}
        <div className="w-full md:w-80 relative">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Chercher membre, email, rôle..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full glass bg-white/50 border border-white/60 rounded-2xl pl-12 pr-4 py-3 font-bold text-sm outline-none focus:ring-4 focus:ring-violet-100 transition"
          />
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="glass p-8 rounded-[2.5rem] border-white/60 shadow-xl">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Membres</p>
          <p className="text-3xl font-black text-slate-900">{stats.totalMembers}</p>
        </div>
        <div className="glass p-8 rounded-[2.5rem] border-white/60 shadow-xl">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rendez-vous</p>
          <p className="text-3xl font-black text-slate-900">{stats.totalBookings}</p>
        </div>
        <div className="glass p-8 rounded-[2.5rem] border-white/60 shadow-xl">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Chiffre Affaire</p>
          <p className="text-3xl font-black text-slate-900">{stats.totalRevenue.toFixed(0)} DH</p>
        </div>
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
          <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">Commission (15%)</p>
          <p className="text-3xl font-black text-violet-400">{stats.mhcEarnings.toFixed(0)} DH</p>
        </div>
      </div>

      {/* Navigation Onglets */}
      <div className="flex glass bg-white/40 p-1.5 rounded-2xl shadow-lg border-white/60 inline-flex mb-8">
        <button 
          onClick={() => setActiveTab('MEMBERS')} 
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'MEMBERS' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400'}`}
        >
          <i className="fas fa-users mr-2"></i> Utilisateurs
        </button>
        <button 
          onClick={() => setActiveTab('BOOKINGS')} 
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'BOOKINGS' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400'}`}
        >
          <i className="fas fa-calendar-alt mr-2"></i> Réservations
        </button>
      </div>

      {activeTab === 'MEMBERS' ? (
        <div className="glass rounded-[3rem] border-white/60 shadow-2xl overflow-hidden animate-fadeIn bg-white/30">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900/5">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Utilisateur</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Type / Rôle</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">État</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Gestion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-white/40 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img 
                          src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&background=random`} 
                          className="w-12 h-12 rounded-2xl object-cover shadow-md border-2 border-white" 
                        />
                        <div>
                          <p className="font-black text-slate-900 text-sm">{member.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest ${
                        member.role === UserRole.BARBER ? 'bg-violet-100 text-violet-600' : 
                        member.role === UserRole.ADMIN ? 'bg-slate-900 text-white' : 
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${member.isActive !== false ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${member.isActive !== false ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-[9px] font-black uppercase">{member.isActive !== false ? 'Actif' : 'Suspendu'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          title={member.isActive !== false ? "Suspendre" : "Activer"}
                          onClick={() => toggleMemberStatus(member)} 
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition hover:scale-110 ${
                            member.isActive !== false ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                        >
                          <i className={`fas ${member.isActive !== false ? 'fa-user-slash' : 'fa-user-check'}`}></i>
                        </button>
                        <button 
                          title="Supprimer définitivement"
                          onClick={() => handleDeleteClick(member.id)} 
                          className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition hover:scale-110"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <i className="fas fa-users-slash text-4xl text-slate-200 mb-4 block"></i>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aucun membre ne correspond à votre recherche</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass rounded-[3rem] border-white/60 shadow-2xl overflow-hidden animate-fadeIn bg-white/30">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900/5">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Date / Heure</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Client & Expert</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Service</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Montant</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {bookings.slice().reverse().map((bk) => {
                  const client = allMembers.find(m => m.id === bk.clientId);
                  const barber = allMembers.find(m => m.id === bk.barberId);
                  return (
                    <tr key={bk.id} className="hover:bg-white/40 transition-colors">
                      <td className="px-8 py-6 text-xs font-bold text-slate-500">
                        {new Date(bk.date).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">Client: <span className="text-slate-500">{bk.clientName || client?.name || 'Visiteur'}</span></p>
                          <p className="text-[10px] font-black text-violet-600 uppercase tracking-tighter">Expert: <span className="text-slate-500">{barber?.name || 'Inconnu'}</span></p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="bg-white/60 px-3 py-1 rounded-lg text-[9px] font-black uppercase text-slate-600 border border-white">
                          {bk.serviceName}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right font-black text-slate-900">{bk.totalPrice} DH</td>
                      <td className="px-8 py-6 text-center">
                        <span className={`px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${
                          bk.status === BookingStatus.COMPLETED ? 'bg-green-100 text-green-600' :
                          bk.status === BookingStatus.CANCELLED ? 'bg-red-100 text-red-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                          {bk.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
