
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
    <nav className="glass sticky top-4 mx-4 md:mx-auto max-w-7xl z-50 rounded-2xl border border-white/40 shadow-lg mt-4">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <span className="text-violet-600 font-extrabold text-2xl flex items-center gap-2">
              <i className="fas fa-scissors transform -rotate-45"></i>
              MyHairCut
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => onNavigate('home')} className="text-slate-700 hover:text-violet-600 transition font-semibold text-sm">Accueil</button>
            <button onClick={() => onNavigate('search')} className="text-slate-700 hover:text-violet-600 transition font-semibold text-sm">Rechercher</button>
            <button onClick={() => onNavigate('ai-advisor')} className="bg-violet-100/50 text-violet-600 px-4 py-2 rounded-xl transition font-bold text-sm border border-violet-200/50 hover:bg-violet-100">
              <i className="fas fa-magic mr-2"></i>IA Style
            </button>
            
            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-violet-600 transition shadow-lg"
                >
                  <i className="fas fa-user-circle"></i>
                  Menu
                  <i className={`fas fa-chevron-down text-[10px] transition-transform ${showDropdown ? 'rotate-180' : ''}`}></i>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-56 glass border border-white/40 rounded-2xl shadow-2xl py-3 z-[60] animate-fadeIn">
                    <button 
                      onClick={() => { onNavigate('mon-compte'); setShowDropdown(false); }}
                      className="w-full text-left px-5 py-3 text-slate-700 font-bold text-xs hover:bg-violet-50 hover:text-violet-600 transition flex items-center gap-3"
                    >
                      <i className="fas fa-cog text-violet-600"></i> Mon Profil
                    </button>
                    {(userRole === UserRole.ADMIN || userRole === UserRole.BARBER) && (
                      <button 
                        onClick={() => { onNavigate(getDashboardPage()); setShowDropdown(false); }}
                        className="w-full text-left px-5 py-3 text-slate-700 font-bold text-xs hover:bg-violet-50 hover:text-violet-600 transition flex items-center gap-3"
                      >
                        <i className="fas fa-chart-line text-violet-600"></i> Dashboard {userRole === UserRole.ADMIN ? 'Admin' : 'Expert'}
                      </button>
                    )}
                    <div className="h-px bg-slate-100 my-2 mx-4"></div>
                    <button 
                      onClick={() => { onLogout(); setShowDropdown(false); }}
                      className="w-full text-left px-5 py-3 text-red-500 font-bold text-xs hover:bg-red-50 transition flex items-center gap-3"
                    >
                      <i className="fas fa-power-off"></i> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => onNavigate('login')}
                className="bg-violet-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-violet-700 transition shadow-lg"
              >
                Connexion
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-2">
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass border-t border-white/20 px-4 py-6 space-y-4 rounded-b-2xl animate-fadeIn">
          <button onClick={() => { onNavigate('home'); setIsOpen(false); }} className="block w-full text-left text-slate-700 font-semibold py-2">Accueil</button>
          <button onClick={() => { onNavigate('search'); setIsOpen(false); }} className="block w-full text-left text-slate-700 font-semibold py-2">Rechercher</button>
          <button onClick={() => { onNavigate('ai-advisor'); setIsOpen(false); }} className="block w-full text-left text-violet-600 font-bold py-2">Conseils IA</button>
          {isLoggedIn ? (
            <>
              <button onClick={() => { onNavigate('mon-compte'); setIsOpen(false); }} className="block w-full text-left text-violet-600 font-bold py-2">Mon Profil</button>
              {(userRole === UserRole.ADMIN || userRole === UserRole.BARBER) && (
                <button onClick={() => { onNavigate(getDashboardPage()); setIsOpen(false); }} className="block w-full text-left text-slate-700 font-bold py-2">Tableau de bord</button>
              )}
              <button onClick={() => { onLogout(); setIsOpen(false); }} className="block w-full text-left text-red-500 font-bold py-2">Déconnexion</button>
            </>
          ) : (
            <button onClick={() => { onNavigate('login'); setIsOpen(false); }} className="block w-full text-center bg-violet-600 text-white py-3 rounded-xl font-bold shadow-lg">Connexion</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
