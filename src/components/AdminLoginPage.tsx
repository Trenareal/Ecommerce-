import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, Mail, Lock, LogIn, ShieldCheck, ArrowLeft, 
  Sparkles, Info, RefreshCw, UserCheck, ShieldAlert,
  Eye, EyeOff, Check, ArrowRight
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export const AdminLoginPage: React.FC = () => {
  const {
    isAdminLoginOpen,
    setIsAdminLoginOpen,
    setIsSellerOpen,
    loginAdmin,
    registerAdmin,
    currentAdmin,
    setCurrentAdmin,
    showToast
  } = useStore();

  const [mode, setMode] = useState<'login' | 'register' | 'verify-otp'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  // Password requirements checklist
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const isPasswordStrong = hasMinLength && hasUpper && hasLower && hasNumber && hasSymbol;

  if (!isAdminLoginOpen) return null;

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please fill out all login fields.', 'warning');
      return;
    }

    setIsLoading(true);

    if (!isSupabaseConfigured) {
      // Mock Sandbox fallback
      setTimeout(() => {
        const success = loginAdmin(email, password);
        setIsLoading(false);
        if (success) {
          setIsAdminLoginOpen(false);
          setIsSellerOpen(true);
        }
      }, 1000);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          showToast('Please verify your email with the verification code sent to your inbox.', 'info');
          setMode('verify-otp');
          setIsLoading(false);
          return;
        }
        showToast(error.message, 'warning');
        setIsLoading(false);
        return;
      }

      // Check role in profiles
      let userRole = 'customer';
      if (data.user?.user_metadata?.role) {
        userRole = data.user.user_metadata.role;
      }

      // Query profiles table to fetch the true role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', data.user?.id)
        .single();

      if (profile && profile.role) {
        userRole = profile.role;
      }

      if (userRole !== 'admin' && userRole !== 'seller') {
        showToast('This email is registered as a Customer. Customers cannot log into Admin accounts.', 'warning');
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }

      // Valid admin
      const adminName = profile?.full_name || data.user?.user_metadata?.full_name || email.split('@')[0];
      setCurrentAdmin({ name: adminName, email: data.user?.email || email });
      showToast(`Welcome back, Administrator ${adminName}!`, 'success');
      setIsAdminLoginOpen(false);
      setIsSellerOpen(true);
    } catch (err: any) {
      showToast(err.message || 'An unexpected error occurred.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      showToast('Please fill out all registration fields.', 'warning');
      return;
    }

    if (!isPasswordStrong) {
      showToast('Please make sure your password meets all strength requirements.', 'warning');
      return;
    }

    setIsLoading(true);

    if (!isSupabaseConfigured) {
      // Mock Sandbox fallback
      setTimeout(() => {
        const success = registerAdmin(name, email, password);
        setIsLoading(false);
        if (success) {
          setIsAdminLoginOpen(false);
          setIsSellerOpen(true);
        }
      }, 1000);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: 'admin',
          }
        }
      });

      if (error) {
        showToast(error.message, 'warning');
        setIsLoading(false);
        return;
      }

      const user = data.user;
      if (user) {
        showToast('Admin onboarding successful! A secure verification code has been sent to your email.', 'success');
        setMode('verify-otp');
      }
    } catch (err: any) {
      showToast(err.message || 'An unexpected error occurred.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      showToast('Please enter a valid 6-digit verification code.', 'warning');
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup'
      });

      if (error) {
        showToast(error.message, 'warning');
        setIsLoading(false);
        return;
      }

      // Successfully verified! Let's do local sync and session setup
      registerAdmin(name, email, password);
      showToast('Administrator account verified and activated!', 'success');
      setIsAdminLoginOpen(false);
      setIsSellerOpen(true);
    } catch (err: any) {
      showToast(err.message || 'Failed to verify OTP code.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendSignUpOtp = async () => {
    if (!email) {
      showToast('Email address is missing.', 'warning');
      return;
    }
    setIsResendingOtp(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        showToast(error.message, 'warning');
        return;
      }

      showToast('A new verification code has been sent to your email.', 'success');
    } catch (err: any) {
      showToast('Failed to resend code. Please try again.', 'warning');
    } finally {
      setIsResendingOtp(false);
    }
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
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-md w-full overflow-hidden animate-fade-in flex flex-col my-8 animate-scale-in">
          <div className="h-1.5 bg-[#16A34A]" />
          
          {/* Subtle Config Notice - Clean, non-disruptive, for developers only */}
          {!isSupabaseConfigured && (
            <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-[11px] p-3.5 space-y-1 leading-relaxed">
              <div className="font-bold text-amber-900 flex items-center space-x-1">
                <span>⚠️ Configuration Notice</span>
              </div>
              <p>
                Please configure <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in environment settings to enable live cloud administrator authentication.
              </p>
            </div>
          )}

          {mode === 'verify-otp' ? (
            <div className="p-6 sm:p-8 space-y-5">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600 border border-green-100 shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-[#16A34A]" />
                </div>
                <h3 className="text-base font-black text-gray-900 uppercase tracking-wider">Verify Admin Code</h3>
                <p className="text-[11px] text-gray-500 leading-normal max-w-xs mx-auto">
                  We sent a secure 6-digit confirmation code to <strong className="text-gray-700 font-mono text-[10.5px]">{email}</strong>. Enter it below to activate your administrative portal session.
                </p>
              </div>

              <form onSubmit={handleVerifyOtpSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider text-center">6-Digit Admin Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full bg-gray-50 border border-gray-200 rounded py-3 text-lg text-center tracking-[1em] pl-[1em] focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white transition-all font-mono font-bold text-gray-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length < 6}
                  className="w-full bg-gray-900 hover:bg-black text-white font-extrabold py-2.5 rounded shadow transition-all cursor-pointer border-none flex items-center justify-center space-x-2 text-[11px] disabled:opacity-50 uppercase tracking-wide"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#16A34A]" />
                      <span>Verifying Admin Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Activate Portal</span>
                      <ArrowRight className="w-4 h-4 text-[#16A34A]" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-gray-100 flex flex-col space-y-2">
                <p className="text-[11px] text-gray-500 font-medium">
                  Didn't receive the email code?{' '}
                  <button
                    type="button"
                    disabled={isResendingOtp}
                    onClick={handleResendSignUpOtp}
                    className="text-[#16A34A] font-extrabold hover:underline disabled:opacity-50 bg-transparent border-none cursor-pointer"
                  >
                    {isResendingOtp ? 'Sending...' : 'Resend Code'}
                  </button>
                </p>
                
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-[10px] text-gray-500 hover:text-[#16A34A] font-bold underline bg-transparent border-none cursor-pointer"
                >
                  ← Back to onboarding
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Header section */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto text-[#16A34A] border border-green-100 shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider font-sans">
                  {mode === 'register' ? 'Administrator Onboarding' : 'Secure Admin Sign In'}
                </h3>
                <p className="text-[11px] text-gray-500 leading-normal max-w-xs mx-auto font-medium">
                  {mode === 'register' 
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
              <form onSubmit={mode === 'register' ? handleAdminRegisterSubmit : handleAdminLoginSubmit} className="space-y-4 text-xs">
                
                {mode === 'register' && (
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
                  <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Password / Passcode</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      disabled={isLoading}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter security passcode"
                      className="w-full bg-gray-50 border border-gray-200 rounded pl-10 pr-10 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white transition-all font-mono font-medium text-gray-800"
                    />
                    <Lock className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Checklist for Registration */}
                  {mode === 'register' && password.length > 0 && (
                    <div className="mt-2 bg-gray-50 p-2.5 rounded border border-gray-150 space-y-1 text-[10px]">
                      <p className="font-bold text-gray-600 uppercase tracking-wider mb-1">Passcode Requirements:</p>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                        <div className="flex items-center space-x-1.5">
                          <span className={`p-0.5 rounded-full ${hasMinLength ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-500'}`}>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                          <span className={hasMinLength ? 'text-emerald-700 font-semibold' : 'text-gray-500'}>Min 8 characters</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className={`p-0.5 rounded-full ${hasUpper ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-500'}`}>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                          <span className={hasUpper ? 'text-emerald-700 font-semibold' : 'text-gray-500'}>One uppercase letter</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className={`p-0.5 rounded-full ${hasLower ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-500'}`}>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                          <span className={hasLower ? 'text-emerald-700 font-semibold' : 'text-gray-500'}>One lowercase letter</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className={`p-0.5 rounded-full ${hasNumber ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-500'}`}>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                          <span className={hasNumber ? 'text-emerald-700 font-semibold' : 'text-gray-500'}>One number (0-9)</span>
                        </div>
                        <div className="flex items-center space-x-1.5 col-span-2 mt-0.5">
                          <span className={`p-0.5 rounded-full ${hasSymbol ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-500'}`}>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                          <span className={hasSymbol ? 'text-emerald-700 font-semibold' : 'text-gray-500'}>One symbol (e.g. @, #, $, !, %, *, ?)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || (mode === 'register' && password.length > 0 && !isPasswordStrong)}
                  className="w-full bg-gray-900 hover:bg-black text-white font-extrabold py-2.5 rounded shadow transition-all cursor-pointer border-none flex items-center justify-center space-x-2 text-[11px] uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#16A34A]" />
                      <span>Processing Secure Gateway...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 text-[#16A34A]" />
                      <span>{mode === 'register' ? 'Complete Onboarding' : 'Secure Sign In'}</span>
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
                  onClick={() => {
                    setMode(mode === 'register' ? 'login' : 'register');
                    setPassword('');
                  }}
                  className="text-[11px] text-[#16A34A] hover:underline font-bold transition-all bg-transparent border-none cursor-pointer"
                >
                  {mode === 'register' 
                    ? 'Already have an Admin/Seller account? Log In' 
                    : 'Onboard as a new Admin / Certified Seller'}
                </button>
              </div>

            </div>
          )}
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
