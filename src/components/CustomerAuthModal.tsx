import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Mail, ShieldCheck, ArrowRight, CheckCircle, RefreshCw, Key, User, Info, Phone, MapPin, Eye, EyeOff } from 'lucide-react';

export const CustomerAuthModal: React.FC = () => {
  const {
    isCustomerAuthOpen,
    setIsCustomerAuthOpen,
    loginCustomerWithCredentials,
    registerCustomer,
    resetCustomerPassword,
    showToast,
    customers
  } = useStore();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'otp' | 'reset_otp'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Lagos');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [generatedCode, setGeneratedCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if ((mode === 'otp' || mode === 'reset_otp') && countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [mode, countdown]);

  // Reset states when modal is closed
  useEffect(() => {
    if (!isCustomerAuthOpen) {
      setMode('login');
      setEmail('');
      setName('');
      setPhone('');
      setPassword('');
      setEnteredCode('');
      setGeneratedCode('');
      setShowPassword(false);
    }
  }, [isCustomerAuthOpen]);

  if (!isCustomerAuthOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginCustomerWithCredentials(email, password);
    if (success) {
      setIsCustomerAuthOpen(false);
    }
  };

  const handleSendRegisterOtp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Please enter your full name.', 'warning');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'warning');
      return;
    }

    if (phone.length < 8) {
      showToast('Please enter a valid phone number.', 'warning');
      return;
    }

    // Check if user already exists
    const exists = customers.some(c => c.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      showToast('This email is already registered. Please log in instead.', 'warning');
      setMode('login');
      return;
    }

    setIsSending(true);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setIsSending(false);
    setMode('otp');
    setCountdown(60);
    showToast(`Verification code sent to ${email}!`, 'success');
  };

  const handleVerifyRegisterOtp = (e: React.FormEvent) => {
    e.preventDefault();

    if (enteredCode.length !== 6) {
      showToast('Please enter the 6-digit verification code.', 'warning');
      return;
    }

    setIsVerifying(true);

    if (enteredCode === generatedCode) {
      setIsVerifying(false);
      const success = registerCustomer(name, email, phone, location, password);
      if (success) {
        setIsCustomerAuthOpen(false);
        showToast('Account created and logged in successfully!', 'success');
      }
    } else {
      setIsVerifying(false);
      showToast('Invalid verification code. Please check and try again.', 'warning');
    }
  };

  const handleSendForgotPasswordOtp = (e: React.FormEvent) => {
    e.preventDefault();

    const exists = customers.some(c => c.email.toLowerCase() === email.toLowerCase());
    if (!exists) {
      showToast('No customer account found with this email.', 'warning');
      return;
    }

    setIsSending(true);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setIsSending(false);
    setMode('reset_otp');
    setCountdown(60);
    showToast(`Password reset code sent to ${email}!`, 'success');
  };

  const handleVerifyResetOtp = (e: React.FormEvent) => {
    e.preventDefault();

    if (enteredCode.length !== 6) {
      showToast('Please enter the 6-digit reset code.', 'warning');
      return;
    }

    if (password.length < 4) {
      showToast('New password must be at least 4 characters.', 'warning');
      return;
    }

    setIsVerifying(true);

    if (enteredCode === generatedCode) {
      setIsVerifying(false);
      const success = resetCustomerPassword(email, password);
      if (success) {
        setMode('login');
        setPassword('');
        setEnteredCode('');
        setGeneratedCode('');
      }
    } else {
      setIsVerifying(false);
      showToast('Invalid reset code. Please check and try again.', 'warning');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full relative overflow-hidden border border-gray-100 flex flex-col">
        
        {/* Top Accent Line */}
        <div className="h-1.5 bg-[#16A34A]" />

        {/* Close Button */}
        <button
          onClick={() => setIsCustomerAuthOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1 rounded-full hover:bg-gray-100 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {mode === 'login' && (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto text-[#16A34A] border border-green-100">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-gray-900 uppercase tracking-wider">Customer Sign In</h3>
              <p className="text-[11px] text-gray-500 leading-normal max-w-xs mx-auto">
                Sign in to manage your trade profile, monitor orders, update addresses, and view your saved items.
              </p>
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
                    className="w-full bg-gray-50 border border-gray-200 rounded pl-10 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white transition-all font-mono"
                  />
                  <Mail className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-gray-600 font-bold uppercase tracking-wider">Password / PIN</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[10px] text-green-600 hover:underline font-bold bg-transparent border-none cursor-pointer"
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
                    className="w-full bg-gray-50 border border-gray-200 rounded pl-10 pr-10 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white transition-all font-mono"
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

              <button
                type="submit"
                className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold py-2.5 rounded shadow transition-all cursor-pointer border-none flex items-center justify-center space-x-2 text-[11px] uppercase tracking-wide"
              >
                <span>Log In Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center pt-2 border-t border-gray-100">
              <p className="text-[11px] text-gray-500">
                Don't have an agro trading account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setPassword('');
                  }}
                  className="text-green-600 font-extrabold hover:underline"
                >
                  Create Account
                </button>
              </p>
            </div>
            
            <div className="bg-gray-50 p-2.5 rounded border border-gray-100 flex items-start space-x-2">
              <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
              <p className="text-[9px] text-gray-500 leading-normal">
                <strong>Demo Credentials:</strong> You can log in instantly with email <strong className="font-mono">josiahtreasure1424@gmail.com</strong> and password <strong className="font-mono">password123</strong>.
              </p>
            </div>
          </div>
        )}

        {mode === 'register' && (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto text-[#16A34A] border border-green-100">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-gray-900 uppercase tracking-wider">Create Your Account</h3>
              <p className="text-[11px] text-gray-500 leading-normal max-w-xs mx-auto">
                Join Jumia Julia Agro Fair-Trade. Secure trade details, track verified listings, and save shipping profiles.
              </p>
            </div>

            <form onSubmit={handleSendRegisterOtp} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Josiah Treasure"
                    className="w-full bg-gray-50 border border-gray-200 rounded pl-10 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white transition-all"
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
                    className="w-full bg-gray-50 border border-gray-200 rounded pl-10 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white transition-all font-mono"
                  />
                  <Mail className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Phone Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="e.g. 08033001234"
                      className="w-full bg-gray-50 border border-gray-200 rounded pl-9 pr-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white transition-all font-mono"
                    />
                    <Phone className="absolute left-2.5 top-2.5 text-gray-400 w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">State / Region</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="e.g. Lagos"
                      className="w-full bg-gray-50 border border-gray-200 rounded pl-9 pr-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white transition-all"
                    />
                    <MapPin className="absolute left-2.5 top-2.5 text-gray-400 w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Set Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={4}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Minimum 4 characters"
                    className="w-full bg-gray-50 border border-gray-200 rounded pl-10 pr-10 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white transition-all font-mono"
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

              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold py-2.5 rounded shadow transition-all cursor-pointer border-none flex items-center justify-center space-x-2 text-[11px] disabled:opacity-50 uppercase tracking-wide"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating Verification Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-[10px] text-gray-400 text-center leading-normal px-2">
                By registering, you acknowledge that you accept our cooperative marketplace Terms & Conditions and agree to our NDPR-compliant Privacy Policy.
              </p>
            </form>

            <div className="text-center pt-2 border-t border-gray-100">
              <p className="text-[11px] text-gray-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-[#16A34A] font-extrabold hover:underline"
                >
                  Log In
                </button>
              </p>
            </div>
          </div>
        )}

        {mode === 'forgot' && (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto text-[#16A34A] border border-green-100">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-gray-900 uppercase tracking-wider">Reset Password</h3>
              <p className="text-[11px] text-gray-500 leading-normal max-w-xs mx-auto">
                Enter your trade email. We will send a verification OTP to unlock your profile.
              </p>
            </div>

            <form onSubmit={handleSendForgotPasswordOtp} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. josiah@example.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded pl-10 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white transition-all font-mono"
                  />
                  <Mail className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold py-2.5 rounded shadow transition-all cursor-pointer border-none flex items-center justify-center space-x-2 text-[11px] disabled:opacity-50 uppercase tracking-wide"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending Reset Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-gray-500 hover:text-green-600 font-bold underline"
              >
                ← Return to login
              </button>
            </div>
          </div>
        )}

        {mode === 'otp' && (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600 border border-green-100">
                <ShieldCheck className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-base font-black text-gray-900 uppercase tracking-wider">Confirm Your Email</h3>
              <p className="text-[11px] text-gray-500 leading-normal max-w-xs mx-auto">
                We sent a 6-digit confirmation PIN to <strong className="text-gray-800 font-bold font-mono">{email}</strong>.
              </p>
            </div>



            <form onSubmit={handleVerifyRegisterOtp} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-600 font-bold mb-1.5 uppercase tracking-wider text-center">Enter 6-Digit PIN</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={enteredCode}
                  onChange={e => setEnteredCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 123456"
                  className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2.5 text-center tracking-[0.5em] font-black text-base focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white transition-all font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-2.5 rounded shadow transition-all cursor-pointer border-none flex items-center justify-center space-x-2 text-[11px] disabled:opacity-50 uppercase tracking-wide"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying & Creating Profile...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Complete Signup</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center space-y-1.5">
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[10px] text-gray-500 hover:text-green-600 font-bold underline"
              >
                ← Edit details
              </button>
              <p className="text-[9px] text-gray-400">
                Resend OTP available in <span className="font-mono">{countdown}s</span>
              </p>
            </div>
          </div>
        )}

        {mode === 'reset_otp' && (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600 border border-green-100">
                <ShieldCheck className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-base font-black text-gray-900 uppercase tracking-wider">Verify Reset OTP</h3>
              <p className="text-[11px] text-gray-500 leading-normal max-w-xs mx-auto">
                We sent a password reset OTP to <strong className="text-gray-800 font-bold font-mono">{email}</strong>.
              </p>
            </div>



            <form onSubmit={handleVerifyResetOtp} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Enter 6-Digit Reset PIN</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={enteredCode}
                  onChange={e => setEnteredCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 123456"
                  className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-center tracking-[0.5em] font-black text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Enter New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={4}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Minimum 4 characters"
                    className="w-full bg-gray-50 border border-gray-200 rounded pl-10 pr-10 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white transition-all font-mono"
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

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-2.5 rounded shadow transition-all cursor-pointer border-none flex items-center justify-center space-x-2 text-[11px] disabled:opacity-50 uppercase tracking-wide"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Reset Password</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-xs text-gray-500 hover:text-green-600 font-bold underline"
              >
                ← Back
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
