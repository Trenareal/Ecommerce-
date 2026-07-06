import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, Mail, Lock, LogIn, ShieldCheck, ArrowLeft, 
  Sparkles, Info, RefreshCw, UserCheck, ShieldAlert 
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const {
    isAdminLoginOpen,
    setIsAdminLoginOpen,
    setIsSellerOpen,
    loginAdmin,
    registerAdmin,
    currentAdmin,
    showToast
  } = useStore();

  const [isAdminRegister, setIsAdminRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAdminLoginOpen) return null;

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (isAdminRegister) {
        if (!name.trim() || !email.trim() || !password.trim()) {
          showToast('Please fill out all registration fields.', 'warning');
          setIsLoading(false);
          return;
        }
        const success = registerAdmin(name, email, password);
        setIsLoading(false);
        if (success) {
          setIsAdminLoginOpen(false);
          setIsSellerOpen(true); // Auto-redirect to dashboard
        }
      } else {
        if (!email.trim() || !password.trim()) {
          showToast('Please enter both email and security passcode.', 'warning');
          setIsLoading(false);
          return;
        }
        const success = loginAdmin(email, password);
        setIsLoading(false);
        if (success) {
          setIsAdminLoginOpen(false);
          setIsSellerOpen(true); // Auto-redirect to dashboard
        }
      }
    }, 1000);
  };

  const triggerQuickAccess = () => {
    setIsLoading(true);
    setTimeout(() => {
      const success = loginAdmin('admin@julia-agro.com', 'admin123');
      setIsLoading(false);
      if (success) {
        setIsAdminLoginOpen(false);
        setIsSellerOpen(true);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#fafafa] flex flex-col font-sans overflow-y-auto">
      
      {/* Top Navbar */}
      <nav className="bg-[#141414] text-white py-4 px-6 sticky top-0 z-30 flex items-center justify-between border-b border-[#16A34A]">
        <button
          onClick={() => setIsAdminLoginOpen(false)}
          className="flex items-center space-x-1.5 text-xs text-gray-300 hover:text-white font-bold transition-colors cursor-pointer bg-transparent border-none"
        >
          <ArrowLeft className="w-4 h-4 text-[#16A34A]" />
          <span>Back to Storefront</span>
        </button>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm font-black tracking-tighter text-[#16A34A]">
            JULIA<span className="text-white font-normal opacity-90">AGRO</span>
          </span>
          <span className="text-[9px] bg-red-600 text-white font-mono px-2 py-0.5 rounded font-black uppercase tracking-widest">
            ADMIN PORTAL
          </span>
        </div>
      </nav>

      {/* Main Container */}
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6 bg-radial from-white to-gray-50/50">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-md w-full overflow-hidden animate-fade-in flex flex-col my-8">
          <div className="h-1.5 bg-[#16A34A]" />
          
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Header section */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto text-[#16A34A] border border-green-100 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider font-sans">
                {isAdminRegister ? 'Administrator Onboarding' : 'Secure Admin Sign In'}
              </h3>
              <p className="text-[11px] text-gray-500 leading-normal max-w-xs mx-auto font-medium">
                {isAdminRegister 
                  ? 'Create a verified cooperative leader, logistics hub, or regional admin supervisor account.' 
                  : 'Authorized personnel login. Access fair-trade metrics, inventory thresholds, and photo-audits.'}
              </p>
            </div>

            {/* Active session warning */}
            {currentAdmin && (
              <div className="bg-green-50 p-3 rounded border border-green-100 text-[10px] text-green-800 leading-normal flex items-start space-x-2">
                <UserCheck className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>
                  You are currently logged in as Administrator: <strong className="font-bold">{currentAdmin.name}</strong> ({currentAdmin.email}). 
                  Entering another account will sign out your current session.
                </span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-xs">
              
              {isAdminRegister && (
                <div>
                  <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Cooperative / Administrator Name</label>
                  <input
                    type="text"
                    required
                    disabled={isLoading}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Chief Logistics Officer"
                    className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white transition-all font-semibold"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    disabled={isLoading}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. admin@julia-agro.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded pl-10 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white transition-all font-mono font-medium text-gray-800"
                  />
                  <Mail className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Security Passcode</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    disabled={isLoading}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="e.g. ••••••••"
                    className="w-full bg-gray-50 border border-gray-200 rounded pl-10 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white transition-all font-mono font-medium text-gray-800"
                  />
                  <Lock className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 hover:bg-black text-white font-extrabold py-2.5 rounded shadow transition-all cursor-pointer border-none flex items-center justify-center space-x-2 text-[11px] uppercase tracking-wide disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#16A34A]" />
                    <span>Processing Secure Gateway...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-[#16A34A]" />
                    <span>{isAdminRegister ? 'Complete Onboarding' : 'Secure Sign In'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Sandbox Section Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider">Demo Sandbox</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            {/* Quick access */}
            <button
              type="button"
              disabled={isLoading}
              onClick={triggerQuickAccess}
              className="w-full bg-white hover:bg-gray-50 text-[#16A34A] border border-[#16A34A]/30 font-extrabold py-2.5 rounded shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-2 text-[11px] uppercase tracking-wide disabled:opacity-50"
            >
              <span>⚡ Instant Admin Quick-Access</span>
            </button>

            {/* Toggle login vs register */}
            <div className="text-center pt-2 border-t border-gray-100">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setIsAdminRegister(!isAdminRegister)}
                className="text-[11px] text-[#16A34A] hover:underline font-bold transition-all bg-transparent border-none cursor-pointer"
              >
                {isAdminRegister 
                  ? 'Already have an Admin/Seller account? Log In' 
                  : 'Onboard as a new Admin / Certified Seller'}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Info Footnote footer */}
      <footer className="py-6 bg-[#141414] text-gray-500 border-t border-gray-900 text-[10px] text-center space-y-1">
        <p className="font-semibold text-gray-400 flex items-center justify-center space-x-1">
          <ShieldAlert className="w-3.5 h-3.5 text-[#16A34A]" />
          <span>JULIA AGRO SECURE PORTAL</span>
        </p>
        <p>All administrative sessions are securely logged under national fair-trade logistics supervision.</p>
      </footer>

    </div>
  );
};
