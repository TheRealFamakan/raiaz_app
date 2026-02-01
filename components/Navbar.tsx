
import React, { useState } from 'react';
import { UserRole } from '../types';

interface NavbarProps {
  userRole?: UserRole;
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ userRole, onNavigate, isLoggedIn, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const getDashboardPage = () => {
    if (userRole === UserRole.ADMIN) return 'admin-dashboard';
    if (userRole === UserRole.BARBER) return 'barber-dashboard';
    return 'home'; 
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] glass-nav">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('home')}>
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-violet-200 group-hover:scale-105 transition-transform">
             <i className="fas fa-scissors text-white text-sm"></i>
          </div>
          <span className="text-slate-900 font-extrabold text-xl tracking-tight">
            MyHairCut
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-10">
          <button onClick={() => onNavigate('home')} className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition">Accueil</button>
          <button onClick={() => onNavigate('search')} className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition">Trouver un expert</button>
          
          <button 
            onClick={() => onNavigate('ai-advisor')} 
            className="flex items-center gap-2 text-sm font-bold text-violet-600 px-4 py-2 bg-violet-50 rounded-full hover:bg-violet-100 transition"
          >
            <i className="fas fa-sparkles text-xs"></i>
            IA Style Advisor
          </button>
          
          <div className="h-6 w-px bg-slate-200"></div>

          {isLoggedIn ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition shadow-lg"
              >
                Mon Espace
                <i className={`fas fa-chevron-down text-[10px] opacity-70 transition-transform ${showDropdown ? 'rotate-180' : ''}`}></i>
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-4 w-60 bg-white rounded-2xl shadow-2xl py-2 z-[110] border border-slate-100 animate-fadeIn overflow-hidden">
                  <button 
                    onClick={() => { onNavigate('mon-compte'); setShowDropdown(false); }}
                    className="w-full text-left px-5 py-3 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition flex items-center gap-3"
                  >
                    <i className="fas fa-user-circle text-slate-400"></i> Mon Profil
                  </button>
                  {(userRole === UserRole.ADMIN || userRole === UserRole.BARBER) && (
                    <button 
                      onClick={() => { onNavigate(getDashboardPage()); setShowDropdown(false); }}
                      className="w-full text-left px-5 py-3 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition flex items-center gap-3"
                    >
                      <i className="fas fa-chart-pie text-slate-400"></i> Dashboard {userRole}
                    </button>
                  )}
                  <div className="h-px bg-slate-100 my-2"></div>
                  <button 
                    onClick={() => { onLogout(); setShowDropdown(false); }}
                    className="w-full text-left px-5 py-3 text-red-600 text-sm font-bold hover:bg-red-50 transition flex items-center gap-3"
                  >
                    <i className="fas fa-power-off"></i> Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => onNavigate('login')}
              className="btn-primary px-8 py-3 rounded-full text-sm font-bold shadow-md shadow-violet-200"
            >
              Se connecter
            </button>
          )}
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-slate-600 w-10 h-10 flex items-center justify-center">
          <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-6 space-y-5 animate-fadeIn">
          <button onClick={() => { onNavigate('home'); setIsOpen(false); }} className="block w-full text-left font-bold text-slate-700">Accueil</button>
          <button onClick={() => { onNavigate('search'); setIsOpen(false); }} className="block w-full text-left font-bold text-slate-700">Rechercher</button>
          <button onClick={() => { onNavigate('ai-advisor'); setIsOpen(false); }} className="block w-full text-left font-bold text-violet-600">AI Advisor</button>
          <div className="h-px bg-slate-100"></div>
          {isLoggedIn ? (
            <>
              <button onClick={() => { onNavigate('mon-compte'); setIsOpen(false); }} className="block w-full text-left font-bold text-slate-700">Mon Profil</button>
              <button onClick={() => { onLogout(); setIsOpen(false); }} className="block w-full text-left font-bold text-red-600">Déconnexion</button>
            </>
          ) : (
            <button onClick={() => { onNavigate('login'); setIsOpen(false); }} className="w-full btn-primary py-4 rounded-2xl font-bold">Connexion</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
