
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

  // Calculate high-level platform statistics
  const stats = useMemo(() => {
    const completedBookings = bookings.filter(b => b.status === BookingStatus.COMPLETED);
    const totalRevenue = completedBookings.reduce((acc, b) => acc + b.totalPrice, 0);
    const mhcEarnings = totalRevenue * 0.15; // 15% platform commission
    return {
      totalMembers: allMembers.length,
      totalBookings: bookings.length,
      totalRevenue,
      mhcEarnings
    };
  }, [allMembers, bookings]);

  // Filter members based on search input
  const filteredMembers = allMembers.filter(m => 
    m.name.toLowerCase().includes(filter.toLowerCase()) || 
    m.email.toLowerCase().includes(filter.toLowerCase())
  );

  // Toggle activation status of a member
  const toggleMemberStatus = (member: User | Hairdresser) => {
    onUpdateMember({ ...member, isActive: !member.isActive });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-2">Tableau de Bord Admin</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Gestion de la plateforme MyHairCut</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="glass p-8 rounded-[2.5rem] border-white/60 shadow-xl">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Membres</p>
          <p className="text-3xl font-black text-slate-900">{stats.totalMembers}</p>
        </div>
        <div className="glass p-8 rounded-[2.5rem] border-white/60 shadow-xl">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Réservations</p>
          <p className="text-3xl font-black text-slate-900">{stats.totalBookings}</p>
        </div>
        <div className="glass p-8 rounded-[2.5rem] border-white/60 shadow-xl">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">CA Total</p>
          <p className="text-3xl font-black text-slate-900">{stats.totalRevenue.toFixed(0)} DH</p>
        </div>
        <div className="bg-violet-600 p-8 rounded-[2.5rem] shadow-xl text-white">
          <p className="text-[10px] font-black text-violet-200 uppercase tracking-widest mb-1">Commissions (15%)</p>
          <p className="text-3xl font-black">{stats.mhcEarnings.toFixed(0)} DH</p>
        </div>
      </div>

      {/* User Management Table */}
      <div className="glass rounded-[3rem] border-white/60 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Gestion des Utilisateurs</h2>
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-2 font-bold text-sm outline-none focus:ring-2 focus:ring-violet-200 transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Utilisateur</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rôle</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-white/40 transition">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}`} className="w-10 h-10 rounded-xl object-cover" alt="" />
                      <div>
                        <p className="font-black text-slate-900 text-sm">{member.name}</p>
                        <p className="text-[10px] font-medium text-slate-400">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase ${member.role === UserRole.BARBER ? 'bg-violet-100 text-violet-600' : member.role === UserRole.ADMIN ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase ${member.isActive !== false ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {member.isActive !== false ? 'Actif' : 'Suspendu'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => toggleMemberStatus(member)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${member.isActive !== false ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
                        title={member.isActive !== false ? 'Suspendre' : 'Activer'}
                      >
                        <i className={`fas ${member.isActive !== false ? 'fa-user-slash' : 'fa-user-check'}`}></i>
                      </button>
                      <button 
                        onClick={() => onDeleteMember(member.id)}
                        className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-200 transition"
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
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-black uppercase text-[10px] tracking-widest">
                    Aucun membre trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
