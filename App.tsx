
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Login from './pages/Login';
import AIAdvisor from './pages/AIAdvisor';
import BarberDashboard from './pages/BarberDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MyAccount from './pages/MyAccount';
import { UserRole, Hairdresser, Booking, User, BookingStatus } from './types';
import { MOCK_HAIRDRESSERS, MOCK_BOOKINGS } from './constants';

const ADMIN_EMAILS = ['camarafamakan2@gmail.com', 'riaznajib1@gmail.com'];
const ADMIN_PASSWORD = 'Admin@MyHairCut2025';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(() => localStorage.getItem('mhc_last_page') || 'home');
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('mhc_isLoggedIn') === 'true');
  const [userRole, setUserRole] = useState<UserRole | undefined>(() => (localStorage.getItem('mhc_userRole') as UserRole) || undefined);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mhc_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [allMembers, setAllMembers] = useState<(User | Hairdresser)[]>(() => {
    const saved = localStorage.getItem('mhc_all_members');
    const mocks = MOCK_HAIRDRESSERS.map(h => ({ ...h, isActive: true, walletBalance: 0 }));
    
    if (saved) {
      const parsed = JSON.parse(saved);
      // On fusionne les mocks (qui sont la base) avec les utilisateurs sauvegardés
      // pour éviter les doublons tout en gardant les nouveaux comptes.
      const combined = [...mocks];
      parsed.forEach((savedUser: any) => {
        if (!combined.find(m => m.id === savedUser.id)) {
          combined.push(savedUser);
        } else {
          // Si l'utilisateur est un mock mais a des données sauvegardées (ex: suspendu), on met à jour
          const idx = combined.findIndex(m => m.id === savedUser.id);
          combined[idx] = { ...combined[idx], ...savedUser };
        }
      });
      return combined;
    }
    return mocks;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('mhc_bookings');
    return saved ? JSON.parse(saved) : MOCK_BOOKINGS;
  });

  const [reviews, setReviews] = useState<any[]>(() => {
    const saved = localStorage.getItem('mhc_reviews');
    return saved ? JSON.parse(saved) : [
      { id: 'rev1', barberId: 'h1', clientId: 'c1', clientName: 'Karim', rating: 5, comment: 'Exceptionnel ! Très pro.', date: new Date().toISOString() }
    ];
  });

  useEffect(() => {
    localStorage.setItem('mhc_last_page', currentPage);
    localStorage.setItem('mhc_all_members', JSON.stringify(allMembers));
    localStorage.setItem('mhc_bookings', JSON.stringify(bookings));
    localStorage.setItem('mhc_reviews', JSON.stringify(reviews));
    localStorage.setItem('mhc_isLoggedIn', isLoggedIn.toString());
    localStorage.setItem('mhc_userRole', userRole || '');
    if (currentUser) {
      localStorage.setItem('mhc_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mhc_currentUser');
    }
  }, [allMembers, bookings, reviews, isLoggedIn, userRole, currentUser, currentPage]);

  const handleUpdateMember = (updated: any) => {
    setAllMembers(prev => {
      const exists = prev.find(m => m.id === updated.id);
      if (exists) {
        return prev.map(m => m.id === updated.id ? { ...m, ...updated } : m);
      }
      return [...prev, updated];
    });
    
    if (currentUser?.id === updated.id) {
      setCurrentUser(prev => prev ? { ...prev, ...updated } : updated);
      if (updated.isActive === false) {
        handleLogout();
        alert("Votre compte a été suspendu par l'administration.");
      }
    }
  };

  const handleDeleteMember = useCallback((id: string) => {
    setAllMembers(prev => prev.filter(m => m.id !== id));
    setBookings(prev => prev.filter(b => b.clientId !== id && b.barberId !== id));
    if (currentUser?.id === id) {
      handleLogout();
    }
  }, [currentUser]);

  const handleUpdateBooking = (bookingId: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        if (status === BookingStatus.COMPLETED && b.status !== BookingStatus.COMPLETED) {
          const commission = b.totalPrice * 0.15;
          setAllMembers(mems => mems.map(m => m.id === b.barberId ? { ...m, walletBalance: (m.walletBalance || 0) - commission } : m));
        }
        return { ...b, status };
      }
      return b;
    }));
  };

  const handleAddReview = (review: any) => {
    setReviews(prev => [...prev, review]);
    const barberReviews = [...reviews, review].filter(r => r.barberId === review.barberId);
    const avg = barberReviews.reduce((acc, curr) => acc + curr.rating, 0) / barberReviews.length;
    setAllMembers(prev => prev.map(m => m.id === review.barberId ? { ...m, rating: Number(avg.toFixed(1)), reviewCount: barberReviews.length } : m));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(undefined);
    setCurrentUser(null);
    setCurrentPage('home');
    localStorage.removeItem('mhc_isLoggedIn');
    localStorage.removeItem('mhc_userRole');
    localStorage.removeItem('mhc_currentUser');
  };

  const handleLogin = (role: 'CLIENT' | 'BARBER', email: string, password?: string): boolean => {
    const lowerEmail = email.toLowerCase();
    
    if (ADMIN_EMAILS.includes(lowerEmail) && password === ADMIN_PASSWORD) {
      const admin = { 
        id: 'admin_riyaz', 
        name: 'Riyaz Nadjib', 
        email: lowerEmail, 
        role: UserRole.ADMIN, 
        isVerified: true, 
        isActive: true, 
        avatar: 'https://ui-avatars.com/api/?name=Riyaz+Nadjib&background=8B5CF6&color=fff' 
      };
      setAllMembers(prev => prev.find(m => m.id === admin.id) ? prev : [...prev, admin]);
      setIsLoggedIn(true);
      setUserRole(UserRole.ADMIN);
      setCurrentUser(admin);
      setCurrentPage('admin-dashboard');
      return true;
    }

    const found = allMembers.find(u => u.email.toLowerCase() === lowerEmail);
    if (found) {
      if (found.isActive === false) {
        alert("Ce compte est suspendu. Contactez le support.");
        return false;
      }
      setIsLoggedIn(true);
      setUserRole(found.role);
      setCurrentUser(found);
      setCurrentPage(found.role === UserRole.BARBER ? 'barber-dashboard' : 'home');
      return true;
    }

    const newUser = { 
      id: `u_${Date.now()}`, 
      name: email.split('@')[0], 
      email: lowerEmail, 
      role: role as UserRole, 
      isVerified: true, 
      isActive: true, 
      walletBalance: 0, 
      services: role === 'BARBER' ? [] : undefined,
      gallery: role === 'BARBER' ? [] : undefined 
    };
    handleUpdateMember(newUser);
    setIsLoggedIn(true);
    setUserRole(newUser.role);
    setCurrentUser(newUser);
    setCurrentPage(role === 'BARBER' ? 'barber-dashboard' : 'home');
    return true;
  };

  const barbers = allMembers.filter(m => m.role === UserRole.BARBER && m.isActive !== false) as Hairdresser[];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onNavigate={setCurrentPage} isLoggedIn={isLoggedIn} userRole={userRole} onLogout={handleLogout} />
      <main className="pt-24 pb-12 min-h-[80vh]">
        {currentPage === 'home' && <Home onNavigate={setCurrentPage} barbers={barbers} />}
        {currentPage === 'search' && <Search onNavigate={setCurrentPage} barbers={barbers} />}
        {currentPage === 'profile' && (
          <Profile 
            barber={barbers.find(x => x.id === localStorage.getItem('mhc_selected_barber_id')) || barbers[0]} 
            reviews={reviews.filter(r => r.barberId === localStorage.getItem('mhc_selected_barber_id'))} 
            onAddBooking={(bk) => setBookings(p => [...p, bk])} 
            currentUser={currentUser} 
          />
        )}
        {currentPage === 'barber-dashboard' && (
          <BarberDashboard 
            barber={allMembers.find(m => m.id === currentUser?.id) as Hairdresser} 
            bookings={bookings.filter(b => b.barberId === currentUser?.id)} 
            onUpdateBarber={handleUpdateMember} 
            onUpdateBooking={handleUpdateBooking} 
          />
        )}
        {currentPage === 'admin-dashboard' && (
          <AdminDashboard 
            allMembers={allMembers} 
            bookings={bookings} 
            onDeleteMember={handleDeleteMember} 
            onUpdateMember={handleUpdateMember} 
          />
        )}
        {currentPage === 'mon-compte' && currentUser && (
          <MyAccount 
            user={allMembers.find(m => m.id === currentUser.id)!} 
            bookings={bookings.filter(b => b.clientId === currentUser.id)} 
            onUpdateProfile={handleUpdateMember} 
            onAddReview={handleAddReview}
            onCancelBooking={(id) => handleUpdateBooking(id, BookingStatus.CANCELLED)}
          />
        )}
        {currentPage === 'ai-advisor' && <AIAdvisor />}
        {currentPage === 'login' && <Login onLogin={handleLogin} />}
      </main>
      <footer className="py-12 text-center text-slate-400 text-sm font-medium">
        &copy; 2025 MyHairCut Morocco • Powered by Riyaz Innovation
      </footer>
    </div>
  );
};

export default App;
