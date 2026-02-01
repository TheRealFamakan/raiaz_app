
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

  const filteredMembers = allMembers.filter(m => 
    m.name.toLowerCase().includes(filter.toLowerCase()) || 
    m.email.toLowerCase().includes(filter.toLowerCase())
  );

  const toggleMemberStatus = (member: User | Hairdresser) => {
    onUpdateMember({ ...member, isActive: !member.isActive });
  };

  const handleDeleteClick = (id: string) => {
    // Confirmation supplémentaire pour l'admin
    if (confirm("Êtes-vous certain de vouloir supprimer définitivement cet utilisateur et toutes ses données ?")) {
      onDeleteMember(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Supervision Plateforme</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Espace Administrateur MyHairCut</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="glass p-8 rounded-[2.5rem] border-white/60 shadow-xl">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Membres</p>
          <p className="text-3xl font-black text-slate-900">{stats.totalMembers}</p>
        </div>
        <div className="glass p-8 rounded-[2.5rem] border-white/60 shadow-xl">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total RDV</p>
          <p className="text-3xl font-black text-slate-900">{stats.totalBookings}</p>
        </div>
        <div className="glass p-8 rounded-[2.5rem] border-white/60 shadow-xl">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Volume Affaires</p>
          <p className="text-3xl font-black text-slate-900">{stats.totalRevenue.toFixed(0)} DH</p>
        </div>
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
          <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">Net Plateforme</p>
          <p className="text-3xl font-black">{stats.mhcEarnings.toFixed(0)} DH</p>
        </div>
      </div>

      <div className="flex glass bg-white/40 p-1.5 rounded-2xl shadow-lg border-white/60 inline-flex mb-8">
        <button onClick={() => setActiveTab('MEMBERS')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'MEMBERS' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400'}`}>Utilisateurs</button>
        <button onClick={() => setActiveTab('BOOKINGS')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'BOOKINGS' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400'}`}>Réservations</button>
      </div>

      {activeTab === 'MEMBERS' ? (
        <div className="glass rounded-[3rem] border-white/60 shadow-2xl overflow-hidden animate-fadeIn">
          <div className="p-8 border-b border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-black text-slate-900 uppercase">Communauté</h2>
            <input 
              type="text" 
              placeholder="Chercher un membre..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full md:w-64 glass bg-white/50 border border-white/60 rounded-xl px-4 py-2 font-bold text-sm outline-none"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">Membre</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">Rôle</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">Statut</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-white/40 transition">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}`} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <p className="font-black text-slate-900 text-sm">{member.name}</p>
                          <p className="text-[10px] text-slate-400">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase ${member.role === UserRole.BARBER ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-600'}`}>{member.role}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase ${member.isActive !== false ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{member.isActive !== false ? 'Actif' : 'Suspendu'}</span>
                    </td>
                    <td className="px-8 py-6 text-right space-x-2">
                      <button title="Changer statut" onClick={() => toggleMemberStatus(member)} className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 hover:scale-110 transition"><i className={`fas ${member.isActive !== false ? 'fa-user-slash' : 'fa-user-check'}`}></i></button>
                      <button title="Supprimer définitivement" onClick={() => handleDeleteClick(member.id)} className="w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:scale-110 transition"><i className="fas fa-trash-alt"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass rounded-[3rem] border-white/60 shadow-2xl overflow-hidden animate-fadeIn">
          <div className="p-8 border-b border-white/20">
            <h2 className="text-xl font-black text-slate-900 uppercase">Historique complet des RDV</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">Date & Heure</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">Client</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">Expert</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">Service</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Montant</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {bookings.slice().reverse().map((bk) => {
                  const client = allMembers.find(m => m.id === bk.clientId);
                  const barber = allMembers.find(m => m.id === bk.barberId);
                  return (
                    <tr key={bk.id} className="hover:bg-white/40 transition">
                      <td className="px-8 py-6 text-xs font-bold text-slate-500">{new Date(bk.date).toLocaleString('fr-FR')}</td>
                      <td className="px-8 py-6">
                        <p className="font-black text-slate-900 text-sm">{bk.clientName || client?.name || 'Visiteur'}</p>
                        <p className="text-[9px] text-slate-400 uppercase">{client?.email || 'N/A'}</p>
                      </td>
                      <td className="px-8 py-6 font-bold text-violet-600 text-sm">{barber?.name || 'Inconnu'}</td>
                      <td className="px-8 py-6"><span className="bg-slate-100 px-3 py-1 rounded-lg text-[10px] font-black uppercase text-slate-600">{bk.serviceName}</span></td>
                      <td className="px-8 py-6 text-right font-black text-slate-900">{bk.totalPrice} DH</td>
                      <td className="px-8 py-6 text-center">
                        <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase ${
                          bk.status === BookingStatus.COMPLETED ? 'bg-green-100 text-green-600' :
                          bk.status === BookingStatus.CANCELLED ? 'bg-red-100 text-red-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>{bk.status}</span>
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
