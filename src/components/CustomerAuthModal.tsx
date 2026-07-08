import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Mail, ArrowRight, RefreshCw, Key, User, Info, Phone, MapPin, Eye, EyeOff, Check, AlertCircle, Globe, ShieldCheck, Lock } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const COUNTRIES = [
  { code: 'NG', name: 'Nigeria' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'GH', name: 'Ghana' },
  { code: 'KE', name: 'Kenya' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' }
];

const NIGERIAN_STATES = [
  'Lagos', 'Abuja (FCT)', 'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Nasarawa', 
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

export const CustomerAuthModal: React.FC = () => {
  const {
    isCustomerAuthOpen,
    setIsCustomerAuthOpen,
    registerCustomer,
    showToast,
    customers,
    loginUser
  } = useStore();

  const [mode, setMode] = useState<'login' | 'register' | 'verify-otp' | 'verify-login-otp' | 'forgot' | 'update-password'>('login');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [location, setLocation] = useState('Lagos');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP state
  const [otp, setOtp] = useState('');

  // Password requirements checklist
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const isPasswordStrong = hasMinLength && hasUpper && hasLower && hasNumber && hasSymbol;

  // Reset states when modal is closed
  useEffect(() => {
    if (!isCustomerAuthOpen) {
      setMode('login');
      setLoginMethod('password');
      setEmail('');
      setName('');
      setPhone('');
      setCountry('Nigeria');
      setLocation('Lagos');
      setPassword('');
      setShowPassword(false);
      setOtp('');
    }
  }, [isCustomerAuthOpen]);

  // Adjust location default when country changes
  useEffect(() => {
    if (country === 'Nigeria') {
      setLocation('Lagos');
    } else {
      setLocation('');
    }
  }, [country]);

  // Listen for Supabase password recovery events (when user clicks reset password link)
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('update-password');
        setIsCustomerAuthOpen(true);
        if (session?.user?.email) {
          setEmail(session.user.email);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setIsCustomerAuthOpen]);

  if (!isCustomerAuthOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      showToast('Authentication service is currently offline. Please configure environment credentials.', 'warning');
      return;
    }

    if (loginMethod === 'otp') {
      // Handle passwordless OTP sign-in request
      setIsLoading(true);
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { shouldCreateUser: false },
        });

        if (error) {
          showToast(error.message, 'warning');
          setIsLoading(false);
          return;
        }

        showToast('A login code has been sent to your email address.', 'success');
        setMode('verify-login-otp');
      } catch (err: any) {
        showToast(err.message || 'An unexpected error occurred.', 'warning');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Standard password login
    setIsLoading(true);
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

      // Successfully logged in via cloud
      const emailLower = email.toLowerCase();
      const existing = customers.find(c => c.email.toLowerCase() === emailLower);

      let userName = email.split('@')[0];
      let userPhone = 'Not provided';
      let userLocation = 'Lagos';
      
      if (data.user?.user_metadata) {
        if (data.user.user_metadata.full_name) {
          userName = data.user.user_metadata.full_name;
        }
        if (data.user.user_metadata.phone) {
          userPhone = data.user.user_metadata.phone;
        }
        if (data.user.user_metadata.location) {
          userLocation = data.user.user_metadata.location;
        }
      }

      if (!existing) {
        // Auto-register customer locally
        registerCustomer(userName, email, userPhone, userLocation, password || 'UserSessionCloudAuth');
      } else {
        loginUser(existing.name, existing.email, false);
      }

      showToast('Welcome back! Successfully signed in.', 'success');
      setIsCustomerAuthOpen(false);
    } catch (err: any) {
      showToast(err.message || 'An unexpected error occurred.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordStrong) {
      showToast('Please make sure your password meets all strength requirements.', 'warning');
      return;
    }
    if (!isSupabaseConfigured) {
      showToast('Authentication service is currently offline. Please configure environment credentials.', 'warning');
      return;
    }
    setIsLoading(true);
    try {
      const fullLocation = country === 'Nigeria' ? `${location}, Nigeria` : `${location}, ${country}`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone: phone,
            location: fullLocation,
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
        showToast('Registration successful! A secure verification code has been sent to your email.', 'success');
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

      // Successfully verified OTP for registration!
      const fullLocation = country === 'Nigeria' ? `${location}, Nigeria` : `${location}, ${country}`;
      registerCustomer(name, email, phone, fullLocation, password);
      showToast('Account verified and activated! Welcome to your account.', 'success');
      setIsCustomerAuthOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to verify verification code.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyLoginOtpSubmit = async (e: React.FormEvent) => {
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
        type: 'email'
      });

      if (error) {
        showToast(error.message, 'warning');
        setIsLoading(false);
        return;
      }

      // Successfully signed in via OTP!
      const emailLower = email.toLowerCase();
      const existing = customers.find(c => c.email.toLowerCase() === emailLower);

      let userName = email.split('@')[0];
      let userPhone = 'Not provided';
      let userLocation = 'Lagos';
      
      if (data.user?.user_metadata) {
        if (data.user.user_metadata.full_name) {
          userName = data.user.user_metadata.full_name;
        }
        if (data.user.user_metadata.phone) {
          userPhone = data.user.user_metadata.phone;
        }
        if (data.user.user_metadata.location) {
          userLocation = data.user.user_metadata.location;
        }
      }

      if (!existing) {
        registerCustomer(userName, email, userPhone, userLocation, 'UserSessionOtpAuth');
      } else {
        loginUser(existing.name, existing.email, false);
      }

      showToast('Sign in successful! Welcome back.', 'success');
      setIsCustomerAuthOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to verify login code.', 'warning');
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

  const handleResendLoginOtp = async () => {
    if (!email) {
      showToast('Email address is missing.', 'warning');
      return;
    }
    setIsResendingOtp(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });

      if (error) {
        showToast(error.message, 'warning');
        return;
      }

      showToast('A new login code has been sent to your email.', 'success');
    } catch (err: any) {
      showToast('Failed to resend login code.', 'warning');
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      showToast('Authentication service is currently offline. Please configure environment credentials.', 'warning');
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (error) {
        showToast(error.message, 'warning');
        setIsLoading(false);
        return;
      }

      showToast(`Password reset code sent to ${email}!`, 'success');
      setMode('login');
    } catch (err: any) {
      showToast(err.message || 'An unexpected error occurred.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordStrong) {
      showToast('Please make sure your password meets all strength requirements.', 'warning');
      return;
    }
    if (!isSupabaseConfigured) {
      showToast('Authentication service is currently offline. Please configure environment credentials.', 'warning');
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        showToast(error.message, 'warning');
        setIsLoading(false);
        return;
      }

      showToast('Your password has been successfully updated in Supabase! You can now log in with your new password.', 'success');
      
      // Sign out to refresh session cleanly
      await supabase.auth.signOut();
      setMode('login');
      setPassword('');
    } catch (err: any) {
      showToast(err.message || 'Failed to update your password.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in animate-duration-200">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full relative overflow-hidden border border-gray-100 flex flex-col animate-scale-in">
        
        {/* Top Accent Line */}
        <div className="h-1.5 bg-[#16A34A]" />

        {/* Close Button */}
        <button
          onClick={() => setIsCustomerAuthOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1 rounded-full hover:bg-gray-100 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Subtle Config Notice - Clean, non-disruptive, for developers only */}
        {!isSupabaseConfigured && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-[11px] p-3.5 space-y-1 leading-relaxed">
            <div className="font-bold text-amber-900 flex items-center space-x-1">
              <span>⚠️ Configuration Notice</span>
            </div>
            <p>
              Please configure <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in environment settings to enable live cloud authentication.
            </p>
          </div>
        )}

        {mode === 'login' && (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-100">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-gray-900 uppercase tracking-wider">Sign In</h3>
              <p className="text-[11px] text-gray-500 leading-normal max-w-xs mx-auto">
                Access your account, track active orders, and view saved settings.
              </p>
            </div>

            {/* Custom Tab Selector for Login Method */}
            <div className="grid grid-cols-2 p-1 bg-gray-100 rounded text-[11px] font-bold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setLoginMethod('password')}
                className={`py-1.5 rounded transition-all cursor-pointer border-none ${loginMethod === 'password' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-900 bg-transparent'}`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('otp')}
                className={`py-1.5 rounded transition-all cursor-pointer border-none ${loginMethod === 'otp' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-900 bg-transparent'}`}
              >
                One-Time Code (OTP)
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. josiahtreasure1424@gmail.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded pl-10 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all font-mono"
                  />
                  <Mail className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                </div>
              </div>

              {loginMethod === 'password' ? (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-gray-600 font-bold uppercase tracking-wider">Password</label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[10px] text-emerald-600 hover:underline font-bold bg-transparent border-none cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full bg-gray-50 border border-gray-200 rounded pl-10 pr-10 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all font-mono"
                    />
                    <Key className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded shadow transition-all cursor-pointer border-none flex items-center justify-center space-x-2 text-[11px] uppercase tracking-wide disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{loginMethod === 'password' ? 'Sign In' : 'Send Login Code'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-gray-100">
              <p className="text-[11px] text-gray-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setPassword('');
                  }}
                  className="text-emerald-600 font-extrabold hover:underline"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>
        )}

        {mode === 'register' && (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-100">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-gray-900 uppercase tracking-wider">Create Account</h3>
              <p className="text-[11px] text-gray-500 leading-normal max-w-xs mx-auto">
                Join our marketplace. Verify your account immediately using a secure code.
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Josiah Treasure"
                    className="w-full bg-gray-50 border border-gray-200 rounded pl-10 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                  <User className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. josiah@example.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded pl-10 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all font-mono"
                  />
                  <Mail className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. 08033001234"
                    className="w-full bg-gray-50 border border-gray-200 rounded pl-10 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all font-mono"
                  />
                  <Phone className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                </div>
              </div>

              {/* Country & State Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Country</label>
                  <div className="relative">
                    <select
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded pl-9 pr-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      {COUNTRIES.map(c => (
                        <option key={c.code} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                    <Globe className="absolute left-2.5 top-2.5 text-gray-400 w-3.5 h-3.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">State / Region</label>
                  <div className="relative">
                    {country === 'Nigeria' ? (
                      <select
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded pl-9 pr-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all appearance-none cursor-pointer"
                      >
                        {NIGERIAN_STATES.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        required
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        placeholder="e.g. California"
                        className="w-full bg-gray-50 border border-gray-200 rounded pl-9 pr-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
                      />
                    )}
                    <MapPin className="absolute left-2.5 top-2.5 text-gray-400 w-3.5 h-3.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Strong Password Field */}
              <div>
                <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Set Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-gray-50 border border-gray-200 rounded pl-10 pr-10 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all font-mono"
                  />
                  <Key className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Real-time Password Requirements Checklist */}
                {password.length > 0 && (
                  <div className="mt-2 bg-gray-50 p-2.5 rounded border border-gray-150 space-y-1 text-[10px]">
                    <p className="font-bold text-gray-600 uppercase tracking-wider mb-1">Password Requirements:</p>
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
                disabled={isLoading || (password.length > 0 && !isPasswordStrong)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded shadow transition-all cursor-pointer border-none flex items-center justify-center space-x-2 text-[11px] disabled:opacity-50 uppercase tracking-wide disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-gray-100">
              <p className="text-[11px] text-gray-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-emerald-600 font-extrabold hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        )}

        {mode === 'verify-otp' && (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-100">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-base font-black text-gray-900 uppercase tracking-wider">Enter Code</h3>
              <p className="text-[11px] text-gray-500 leading-normal max-w-xs mx-auto">
                We sent a 6-digit verification code to <strong className="text-gray-700 font-mono text-[10.5px]">{email}</strong>. Enter it below to secure your account.
              </p>
            </div>

            <form onSubmit={handleVerifyOtpSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider text-center">6-Digit Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full bg-gray-50 border border-gray-200 rounded py-3 text-lg text-center tracking-[1em] pl-[1em] focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all font-mono font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length < 6}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded shadow transition-all cursor-pointer border-none flex items-center justify-center space-x-2 text-[11px] disabled:opacity-50 uppercase tracking-wide"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Activate</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-gray-100 flex flex-col space-y-2">
              <p className="text-[11px] text-gray-500">
                Didn't get a code?{' '}
                <button
                  type="button"
                  disabled={isResendingOtp}
                  onClick={handleResendSignUpOtp}
                  className="text-emerald-600 font-extrabold hover:underline disabled:opacity-50"
                >
                  {isResendingOtp ? 'Sending...' : 'Resend Code'}
                </button>
              </p>
              
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[10px] text-gray-500 hover:text-emerald-600 font-bold underline"
              >
                ← Back to registration
              </button>
            </div>
          </div>
        )}

        {mode === 'verify-login-otp' && (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-100">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-base font-black text-gray-900 uppercase tracking-wider">Enter Login Code</h3>
              <p className="text-[11px] text-gray-500 leading-normal max-w-xs mx-auto">
                We sent a 6-digit login verification code to <strong className="text-gray-700 font-mono text-[10.5px]">{email}</strong>. Enter it below to sign in.
              </p>
            </div>

            <form onSubmit={handleVerifyLoginOtpSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider text-center">6-Digit Login Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full bg-gray-50 border border-gray-200 rounded py-3 text-lg text-center tracking-[1em] pl-[1em] focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all font-mono font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length < 6}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded shadow transition-all cursor-pointer border-none flex items-center justify-center space-x-2 text-[11px] disabled:opacity-50 uppercase tracking-wide"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-gray-100 flex flex-col space-y-2">
              <p className="text-[11px] text-gray-500">
                Didn't get a code?{' '}
                <button
                  type="button"
                  disabled={isResendingOtp}
                  onClick={handleResendLoginOtp}
                  className="text-emerald-600 font-extrabold hover:underline disabled:opacity-50"
                >
                  {isResendingOtp ? 'Sending...' : 'Resend Code'}
                </button>
              </p>
              
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[10px] text-gray-500 hover:text-emerald-600 font-bold underline"
              >
                ← Return to Sign In
              </button>
            </div>
          </div>
        )}

        {mode === 'forgot' && (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-100">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-gray-900 uppercase tracking-wider">Reset Password</h3>
              <p className="text-[11px] text-gray-500 leading-normal max-w-xs mx-auto">
                Enter your account email. We will send a secure password recovery code to your inbox.
              </p>
            </div>

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. josiah@example.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded pl-10 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all font-mono"
                  />
                  <Mail className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded shadow transition-all cursor-pointer border-none flex items-center justify-center space-x-2 text-[11px] disabled:opacity-50 uppercase tracking-wide"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Email</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-gray-500 hover:text-emerald-600 font-bold underline"
              >
                ← Return to Sign In
              </button>
            </div>
          </div>
        )}

        {mode === 'update-password' && (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-100">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-gray-900 uppercase tracking-wider">Set New Password</h3>
              <p className="text-[11px] text-gray-500 leading-normal max-w-xs mx-auto">
                Secure your account with a new high-strength password.
              </p>
            </div>

            <form onSubmit={handleUpdatePasswordSubmit} className="space-y-4 text-xs">
              {email && (
                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase tracking-wider">Account Email</label>
                  <p className="font-mono text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded px-3 py-2 select-none">
                    {email}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-gray-50 border border-gray-200 rounded pl-10 pr-10 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all font-mono"
                  />
                  <Key className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Real-time Password Requirements Checklist */}
                {password.length > 0 && (
                  <div className="mt-2 bg-gray-50 p-2.5 rounded border border-gray-150 space-y-1 text-[10px]">
                    <p className="font-bold text-gray-600 uppercase tracking-wider mb-1">Password Requirements:</p>
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
                disabled={isLoading || !isPasswordStrong}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded shadow transition-all cursor-pointer border-none flex items-center justify-center space-x-2 text-[11px] disabled:opacity-50 uppercase tracking-wide disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Update Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-gray-500 hover:text-emerald-600 font-bold underline bg-transparent border-none cursor-pointer"
              >
                ← Cancel & Return to Sign In
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
