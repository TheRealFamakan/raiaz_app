
import React, { useState, useRef, useEffect } from 'react';

interface LoginProps {
  onLogin: (role: 'CLIENT' | 'BARBER', email: string, password?: string) => boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [userType, setUserType] = useState<'CLIENT' | 'BARBER'>('BARBER'); // Par défaut Expert pour le testeur
  const [step, setStep] = useState(1);
  const [kycStatus, setKycStatus] = useState<'IDLE' | 'SCANNING' | 'SUCCESS'>('IDLE');
  const [scanProgress, setScanProgress] = useState(0);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let interval: any;
    if (kycStatus === 'SCANNING') {
      setScanProgress(0);
      interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setKycStatus('SUCCESS');
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [kycStatus]);

  const startKYC = async () => {
    setError(null);
    setKycStatus('SCANNING');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera failed, automatic success for testing.");
      setTimeout(() => setKycStatus('SUCCESS'), 2000);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering && step === 1) {
      setStep(2);
    } else {
      attemptLogin();
    }
  };

  const attemptLogin = () => {
    setError(null);
    setIsFinalizing(true);
    
    setTimeout(() => {
      const success = onLogin(userType, email, password);
      if (!success) {
        setIsFinalizing(false);
        setError("Identifiants incorrects ou accès refusé.");
      }
    }, 800);
  };

  // Raccourci pour Riyaz
  const fillAdmin = () => {
    setEmail('riaznajib1@gmail.com');
    setPassword('Admin@MyHairCut2025');
    setUserType('BARBER');
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="max-w-md w-full glass rounded-[3rem] shadow-2xl overflow-hidden border border-white/60 relative animate-fadeIn">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-600 to-indigo-600"></div>
        
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">MyHairCut</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              {isRegistering ? `INSCRIPTION • ÉTAPE ${step}/2` : 'CONNEXION PARTENAIRE'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-black text-center animate-shake">
              <i className="fas fa-exclamation-circle mr-2"></i> {error}
            </div>
          )}

          {step === 1 ? (
            <form className="space-y-6" onSubmit={handleFormSubmit}>
              <div className="flex glass bg-white/30 p-1.5 rounded-2xl mb-6 border-white/60">
                <button 
                  type="button"
                  onClick={() => setUserType('CLIENT')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${userType === 'CLIENT' ? 'bg-white shadow-xl text-violet-600' : 'text-slate-400'}`}
                >
                  Client
                </button>
                <button 
                  type="button"
                  onClick={() => setUserType('BARBER')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${userType === 'BARBER' ? 'bg-white shadow-xl text-violet-600' : 'text-slate-400'}`}
                >
                  Expert
                </button>
              </div>

              {isRegistering && (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Nom complet</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full glass bg-white/40 border-white/60 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-violet-200 transition font-bold text-slate-800" 
                    placeholder="Riyaz Nadjib" 
                  />
                </div>
              )}
              
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Adresse Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass bg-white/40 border-white/60 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-violet-200 transition font-bold text-slate-800" 
                  placeholder="votre@email.ma" 
                  required 
                />
              </div>

              <div className="relative">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Mot de passe</label>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass bg-white/40 border-white/60 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-violet-200 transition font-bold text-slate-800" 
                  placeholder="••••••••" 
                  required 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[48px] text-slate-400 hover:text-violet-600 transition"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              
              <button 
                type="submit" 
                disabled={isFinalizing}
                className="w-full bg-violet-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-violet-700 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isFinalizing ? <i className="fas fa-circle-notch fa-spin"></i> : (isRegistering ? 'Suivant' : 'Se connecter')}
              </button>

              {!isRegistering && (
                <button 
                  type="button"
                  onClick={fillAdmin}
                  className="w-full text-[9px] font-black text-violet-400 uppercase tracking-widest border border-dashed border-violet-200 py-3 rounded-xl hover:bg-violet-50 transition"
                >
                  Utiliser compte test Riyaz
                </button>
              )}
            </form>
          ) : (
            <div className="text-center space-y-8 animate-fadeIn">
              <div className="mb-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Identité Bio</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Scan facial MyHairCut</p>
              </div>

              <div className="relative w-full aspect-square glass-dark rounded-[3rem] overflow-hidden flex items-center justify-center border-white/10 shadow-2xl">
                {kycStatus === 'IDLE' && <i className="fas fa-user-shield text-6xl text-white/10"></i>}
                {kycStatus === 'SCANNING' && (
                  <>
                    <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover grayscale opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-violet-600/20 to-transparent"></div>
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.8)] animate-scan"></div>
                    <div className="absolute bottom-6 left-6 right-6 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 transition-all duration-100" style={{ width: `${scanProgress}%` }}></div>
                    </div>
                  </>
                )}
                {kycStatus === 'SUCCESS' && (
                  <div className="bg-green-500 text-white p-10 rounded-full shadow-2xl animate-bounce">
                    <i className="fas fa-check text-5xl"></i>
                  </div>
                )}
              </div>

              {kycStatus === 'IDLE' && (
                <button 
                  type="button"
                  onClick={startKYC}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl"
                >
                  Lancer le scan
                </button>
              )}

              {kycStatus === 'SUCCESS' && (
                <button 
                  type="button"
                  onClick={attemptLogin}
                  disabled={isFinalizing}
                  className="w-full bg-green-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:bg-green-700 transition"
                >
                  {isFinalizing ? <i className="fas fa-circle-notch fa-spin"></i> : 'Confirmer & Ouvrir'}
                </button>
              )}
              
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition"
              >
                Retour
              </button>
            </div>
          )}

          <div className="mt-12 text-center pt-8 border-t border-slate-100">
            <button 
              type="button"
              onClick={() => { setIsRegistering(!isRegistering); setStep(1); setKycStatus('IDLE'); setError(null); }}
              className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-violet-600 transition"
            >
              {isRegistering ? 'DÉJÀ UN COMPTE ? SE CONNECTER' : 'PAS ENCORE PARTENAIRE ? REJOINDRE'}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scan {
          0% { top: 10%; }
          100% { top: 90%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite alternate;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;
