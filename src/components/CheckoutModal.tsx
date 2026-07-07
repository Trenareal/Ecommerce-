import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, MapPin, Truck, CreditCard, ChevronRight, Lock, ShieldCheck, CheckCircle2, RotateCw } from 'lucide-react';
import { STATES_DELIVERY_FEES, INTERNATIONAL_DELIVERY_FEES } from '../data/products';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    placeOrder,
    showToast,
    formatPrice,
    currentUser,
    setIsCustomerAuthOpen
  } = useStore();

  // Checkout phases: 'details' | 'gateway' | 'success'
  const [phase, setPhase] = useState<'details' | 'gateway' | 'success'>('details');
  const [name, setName] = useState('Josiah Treasure');
  const [phone, setPhone] = useState('08033001234');
  const [address, setAddress] = useState('14 Alara Street, Onike-Yaba');
  const [state, setState] = useState('Lagos');
  const [isInternational, setIsInternational] = useState(false);
  const [country, setCountry] = useState('United States');
  const [deliveryMethod, setDeliveryMethod] = useState<'home' | 'pickup'>('home');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'pod'>('card');
  
  // Paystack Simulated Gateway states
  const [paystackMethod, setPaystackMethod] = useState<'card' | 'transfer'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [gatewayStatus, setGatewayStatus] = useState<'idle' | 'authorizing' | 'otp' | 'verifying' | 'success'>('idle');
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(10);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');



  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
    }
  }, [currentUser]);

  // Computations
  const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const deliveryFee = isInternational
    ? (INTERNATIONAL_DELIVERY_FEES[country] || INTERNATIONAL_DELIVERY_FEES['Other Countries'])
    : (deliveryMethod === 'pickup' ? 500 : (STATES_DELIVERY_FEES[state] || STATES_DELIVERY_FEES['Other States']));
  const total = subtotal + deliveryFee;

  // Formats
  const fmt = (val: number) => formatPrice(val);

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      showToast('Please fill out all delivery fields.', 'warning');
      return;
    }

    if (paymentMethod === 'pod') {
      if (isInternational) {
        showToast('Pay on Delivery is not available for international export orders.', 'warning');
        return;
      }
      // Pay on Delivery goes straight to success
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmedOrderId(orderId);
      placeOrder({
        name,
        phone,
        address,
        state,
        country: 'Nigeria',
        isInternational: false,
        paymentMethod: 'Pay on Delivery'
      });
      setPhase('success');
    } else {
      // Card / Transfer goes to Paystack simulated gateway
      setPaystackMethod(paymentMethod === 'card' ? 'card' : 'transfer');
      setPhase('gateway');
      setGatewayStatus('idle');
    }
  };

  // Paystack Card Payment Simulation
  const handlePaystackPay = () => {
    if (paystackMethod === 'card') {
      if (cardNumber.length < 16 || cardExpiry.length < 4 || cardCvv.length < 3) {
        showToast('Please enter valid card details.', 'warning');
        return;
      }
      setGatewayStatus('authorizing');
      setTimeout(() => {
        setGatewayStatus('otp');
      }, 2000);
    } else {
      // Transfer simulation
      setGatewayStatus('verifying');
      setTimeout(() => {
        setGatewayStatus('success');
        setTimeout(() => {
          const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
          setConfirmedOrderId(orderId);
          placeOrder({
            name,
            phone,
            address,
            state: isInternational ? country : state,
            country: isInternational ? country : 'Nigeria',
            isInternational,
            paymentMethod: 'Bank Transfer'
          });
          setPhase('success');
        }, 1500);
      }, 4000);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      showToast('Enter the 4-6 digit OTP code.', 'warning');
      return;
    }
    setGatewayStatus('verifying');
    setTimeout(() => {
      setGatewayStatus('success');
      setTimeout(() => {
        const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
        setConfirmedOrderId(orderId);
        placeOrder({
          name,
          phone,
          address,
          state: isInternational ? country : state,
          country: isInternational ? country : 'Nigeria',
          isInternational,
          paymentMethod: 'Paystack Card'
        });
        setPhase('success');
      }, 1500);
    }, 2500);
  };

  if (!isCheckoutOpen || cart.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative animate-fade-in flex flex-col md:flex-row">
        
        {/* Phase 1 & 2 Left Panel: Checkout Steps */}
        {phase !== 'success' && (
          <div className="flex-1 p-5 sm:p-7 border-r border-gray-100">
            {/* Close */}
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 bg-gray-50 rounded-full cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {!currentUser ? (
              <div className="space-y-6 py-6 animate-fade-in text-xs max-w-sm mx-auto text-center">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-[#16A34A] shadow-sm">
                    <Lock className="w-6 h-6 animate-pulse" />
                  </div>
                  <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">Secured Checkout Gateway</h2>
                  <p className="text-[10px] text-gray-500 max-w-sm mx-auto leading-normal">
                    Sign in with your customer details to unlock Escrow payment options, domestic/international routing, and live customer care support.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setIsCustomerAuthOpen(true);
                    }}
                    className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold uppercase py-3 rounded shadow-md transition-colors cursor-pointer text-xs flex items-center justify-center space-x-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>Customer Log In / Sign Up</span>
                  </button>
                  <p className="text-[10px] text-gray-400">
                    You must sign in as a customer to checkout. Administrators cannot check out using customer accounts.
                  </p>
                </div>

                <div className="text-center pt-2">
                  <p className="text-[10px] text-gray-400">
                    By logging in, you accept our certified Agricultural Fair-Trade escrow terms.
                  </p>
                </div>
              </div>
            ) : phase === 'details' ? (
              <>
                <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2 mb-5">
                  <MapPin className="w-5 h-5 text-[#16A34A]" />
                  <span>Delivery & Payment Information</span>
                </h2>

                <form onSubmit={handleStartPayment} className="space-y-4 text-xs">
                  {/* Row 1: Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="e.g. Josiah Treasure"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Nigerian Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500 font-mono"
                        placeholder="e.g. 08033001234"
                      />
                    </div>
                  </div>

                  {/* Row 2: Address */}
                  <div>
                    <label className="block text-gray-600 font-bold mb-1">Delivery Address</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder="e.g. 14 Alara Street, Onike-Yaba"
                    />
                  </div>

                  {/* Shipping Scope Selector */}
                  <div>
                    <label className="block text-gray-600 font-bold mb-1.5">Shipping Destination Scope</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsInternational(false);
                          setDeliveryMethod('home');
                        }}
                        className={`py-2 text-center rounded border font-bold transition-all cursor-pointer text-xs ${
                          !isInternational 
                            ? 'bg-green-50 border-[#16A34A] text-[#16A34A]' 
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        🇳🇬 Nigeria (Domestic)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsInternational(true);
                          setDeliveryMethod('home');
                          if (paymentMethod === 'pod') {
                            setPaymentMethod('card');
                          }
                        }}
                        className={`py-2 text-center rounded border font-bold transition-all cursor-pointer text-xs ${
                          isInternational 
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-800' 
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        🌍 Global Export (Air Cargo)
                      </button>
                    </div>
                  </div>

                  {/* Destination-specific dropdown */}
                  {!isInternational ? (
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Delivery State (Nigeria)</label>
                      <select
                        value={state}
                        onChange={e => setState(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500 font-bold text-gray-700"
                      >
                        {Object.keys(STATES_DELIVERY_FEES).map(s => (
                          <option key={s} value={s}>{s} (+{fmt(STATES_DELIVERY_FEES[s])})</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Destination Country (Global Export)</label>
                      <select
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold text-gray-700"
                      >
                        {Object.keys(INTERNATIONAL_DELIVERY_FEES).map(c => (
                          <option key={c} value={c}>{c} (+{fmt(INTERNATIONAL_DELIVERY_FEES[c])})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Delivery Method */}
                  <div className="pt-2">
                    <label className="block text-gray-600 font-bold mb-1.5">Delivery Method</label>
                    {!isInternational ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div
                          onClick={() => setDeliveryMethod('home')}
                          className={`p-3 rounded-md border-2 cursor-pointer flex items-start space-x-2 transition-all ${
                            deliveryMethod === 'home' ? 'border-[#16A34A] bg-green-50/20' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Truck className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-gray-800">Home / Office Delivery</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Delivered within 24-48 hours directly to your doorstep.</p>
                          </div>
                        </div>
                        <div
                          onClick={() => setDeliveryMethod('pickup')}
                          className={`p-3 rounded-md border-2 cursor-pointer flex items-start space-x-2 transition-all ${
                            deliveryMethod === 'pickup' ? 'border-[#16A34A] bg-green-50/20' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <MapPin className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-gray-800">Station Pick-up (Cheap)</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Pick up at local station in state. Fee is flat ₦500.</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 bg-emerald-50/50 border-2 border-emerald-200/80 rounded-md flex items-start space-x-2.5">
                        <Truck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-emerald-950">Air Cargo Priority Export ✈️</p>
                          <p className="text-[10px] text-emerald-800 mt-0.5">Includes international freight, customs clearance, and phytosanitary certificate bundle. Delivered within 3-7 working days with real-time customs tracking.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Method Selector */}
                  <div className="pt-2 border-t border-gray-50">
                    <label className="block text-gray-600 font-bold mb-1.5">Select Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      <div
                        onClick={() => setPaymentMethod('card')}
                        className={`p-2.5 rounded-md border cursor-pointer text-center flex flex-col items-center justify-center transition-all ${
                          paymentMethod === 'card' ? 'border-[#16A34A] bg-green-50/10 text-[#16A34A]' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 mb-1" />
                        <span className="font-bold text-[10px]">ATM Card</span>
                      </div>
                      <div
                        onClick={() => setPaymentMethod('transfer')}
                        className={`p-2.5 rounded-md border cursor-pointer text-center flex flex-col items-center justify-center transition-all ${
                          paymentMethod === 'transfer' ? 'border-[#16A34A] bg-green-50/10 text-[#16A34A]' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <RotateCw className="w-4 h-4 mb-1 animate-spin-slow" />
                        <span className="font-bold text-[10px]">Bank Transfer</span>
                      </div>
                      {!isInternational ? (
                        <div
                          onClick={() => setPaymentMethod('pod')}
                          className={`p-2.5 rounded-md border cursor-pointer text-center flex flex-col items-center justify-center transition-all ${
                            paymentMethod === 'pod' ? 'border-[#16A34A] bg-green-50/10 text-[#16A34A]' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Truck className="w-4 h-4 mb-1" />
                          <span className="font-bold text-[10px]">Pay on Delivery</span>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-md border border-gray-100 bg-gray-50 text-gray-400 text-center flex flex-col items-center justify-center cursor-not-allowed select-none">
                          <Truck className="w-4 h-4 mb-1 opacity-50" />
                          <span className="font-bold text-[9px] leading-tight">POD Unavailable</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-bold py-3 rounded-md text-sm shadow transition-all uppercase tracking-wider mt-4 cursor-pointer border-none"
                  >
                    {paymentMethod === 'pod' ? 'Place Order (Pay on Delivery)' : 'Proceed to secure Payment'}
                  </button>
                </form>
              </>
            ) : (
              /* --- PAYSTACK GATEWAY SIMULATED VIEW --- */
              <div className="bg-[#fcfcfc] rounded-lg border border-gray-200 shadow-sm overflow-hidden text-xs max-w-md mx-auto">
                {/* Paystack Header */}
                <div className="bg-white px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 bg-[#3bb75e] rounded-full"></span>
                    <span className="font-black tracking-tight text-[#1c2e22] text-sm">paystack</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-semibold">PAYING</p>
                    <p className="font-bold text-gray-900 font-mono text-xs">{fmt(total)}</p>
                  </div>
                </div>

                {gatewayStatus === 'idle' && (
                  <div className="p-5 space-y-4">
                    {/* Select paystack option */}
                    <div className="flex border-b border-gray-100 text-[10px] font-bold">
                      <button
                        onClick={() => setPaystackMethod('card')}
                        className={`pb-2 flex-1 text-center transition-all cursor-pointer ${
                          paystackMethod === 'card' ? 'text-[#3bb75e] border-b-2 border-[#3bb75e]' : 'text-gray-400'
                        }`}
                      >
                        PAY WITH CARD
                      </button>
                      <button
                        onClick={() => setPaystackMethod('transfer')}
                        className={`pb-2 flex-1 text-center transition-all cursor-pointer ${
                          paystackMethod === 'transfer' ? 'text-[#3bb75e] border-b-2 border-[#3bb75e]' : 'text-gray-400'
                        }`}
                      >
                        PAY WITH TRANSFER
                      </button>
                    </div>

                    {paystackMethod === 'card' ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-gray-400 font-semibold mb-1">CARD NUMBER</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                            placeholder="5399 2145 6124 9012"
                            className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 font-mono text-sm tracking-widest focus:outline-none focus:ring-1 focus:ring-[#3bb75e]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-gray-400 font-semibold mb-1">EXPIRY</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={e => setCardExpiry(e.target.value.replace(/\D/g, '').slice(0, 4))}
                              placeholder="12/28"
                              className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 font-mono text-center focus:outline-none focus:ring-1 focus:ring-[#3bb75e]"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 font-semibold mb-1">CVV</label>
                            <input
                              type="password"
                              value={cardCvv}
                              onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                              placeholder="123"
                              className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 font-mono text-center focus:outline-none focus:ring-1 focus:ring-[#3bb75e]"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Transfer info
                      <div className="space-y-3 text-center py-2 bg-[#f4faf6] border border-[#d6eedc] rounded-md p-3">
                        <p className="text-gray-500 text-[10px]">Transfer exactly <span className="font-bold text-gray-800">{fmt(total)}</span> to the generated account:</p>
                        <div className="bg-white rounded border border-gray-100 p-2 font-mono">
                          <p className="text-xs text-gray-400">BANK NAME</p>
                          <p className="font-bold text-gray-800 text-sm">Wema Bank (Paystack)</p>
                          <p className="text-xs text-gray-400 mt-2">ACCOUNT NUMBER</p>
                          <p className="font-bold text-[#3bb75e] text-lg tracking-wider">9920141203</p>
                        </div>
                        <p className="text-[10px] text-gray-400">This temporary account expires in 15 minutes.</p>
                      </div>
                    )}

                    <button
                      onClick={handlePaystackPay}
                      className="w-full bg-[#3bb75e] hover:bg-green-600 text-white font-bold py-2.5 rounded text-xs shadow-sm transition-colors uppercase tracking-wider cursor-pointer"
                    >
                      {paystackMethod === 'card' ? `Pay ${fmt(total)}` : 'I have sent the money'}
                    </button>
                    
                    <div className="flex items-center justify-center space-x-1.5 text-gray-400 text-[10px] font-semibold pt-1">
                      <Lock className="w-3 h-3 text-gray-400" />
                      <span>SECURED BY PAYSTACK</span>
                    </div>
                  </div>
                )}

                {/* Gateway Loader: Authorizing */}
                {gatewayStatus === 'authorizing' && (
                  <div className="p-10 text-center space-y-4 flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-[#3bb75e] border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-semibold text-[#1c2e22]">Authorizing Card Transactions...</p>
                    <p className="text-[10px] text-gray-400">Do not close this modal. Communicating with secure payment node.</p>
                  </div>
                )}

                {/* Gateway OTP validation */}
                {gatewayStatus === 'otp' && (
                  <form onSubmit={handleOtpSubmit} className="p-6 space-y-4 text-center">
                    <ShieldCheck className="w-10 h-10 text-[#3bb75e] mx-auto animate-bounce" />
                    <div className="space-y-1">
                      <p className="font-bold text-gray-800">Verification Required</p>
                      <p className="text-[10px] text-gray-400">A one-time OTP was sent to your phone matching card 5399****.</p>
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        value={otpCode}
                        onChange={e => setOtpCode(e.target.value.slice(0, 6))}
                        placeholder="Enter OTP (e.g. 1234)"
                        className="w-28 text-center bg-white border-2 border-gray-200 rounded py-2 font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#3bb75e] tracking-widest"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#3bb75e] hover:bg-green-600 text-white font-bold py-2 rounded text-xs transition-colors cursor-pointer"
                    >
                      Authorize Transaction
                    </button>
                    <p className="text-[10px] text-gray-400 font-mono">Expires in 3:00</p>
                  </form>
                )}

                {/* Gateway Loader: Verifying */}
                {gatewayStatus === 'verifying' && (
                  <div className="p-10 text-center space-y-4 flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-[#3bb75e] border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-semibold text-[#1c2e22]">Verifying transaction payload...</p>
                    <p className="text-[10px] text-gray-400">Querying central bank and clearing houses.</p>
                  </div>
                )}

                {/* Gateway Success state */}
                {gatewayStatus === 'success' && (
                  <div className="p-10 text-center space-y-3 flex flex-col items-center">
                    <div className="bg-[#e4faf2] rounded-full p-4 text-[#3bb75e] animate-ping-once">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <p className="font-black text-[#1c2e22] text-sm">PAYMENT SUCCESSFUL</p>
                    <p className="text-[10px] text-gray-400">Your card was successfully charged. Generating order references.</p>
                  </div>
                )}

                {/* Gateway Go Back Option */}
                {gatewayStatus === 'idle' && (
                  <div className="bg-gray-50 border-t border-gray-100 px-4 py-2.5 text-center">
                    <button
                      onClick={() => setPhase('details')}
                      className="text-gray-400 hover:text-gray-600 font-bold tracking-wider uppercase text-[9px] cursor-pointer"
                    >
                      ← CANCEL AND CHOOSE OTHER DETAILS
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Right Panel: Order Cart Review Summary (only for phases Details & Gateway) */}
        {phase !== 'success' && (
          <div className="w-full md:w-80 bg-gray-50 p-5 sm:p-7 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Order Summary</h3>
              
              {/* Items Mini-scroller */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-2.5 text-xs">
                    <img src={item.product.image} alt="" className="w-10 h-10 object-cover rounded border border-gray-200 bg-white" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 font-semibold truncate leading-tight">{item.product.title}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{item.quantity} x {fmt(item.product.price)}</p>
                    </div>
                    <span className="font-bold text-gray-800 shrink-0 font-mono">{fmt(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Price Calculation breakdown */}
              <div className="border-t border-gray-200 mt-5 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Cart Subtotal</span>
                  <span className="font-bold font-mono text-gray-800">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>
                    Shipping Fee ({isInternational ? country : (deliveryMethod === 'pickup' ? 'Station' : state)})
                  </span>
                  <span className="font-bold font-mono text-gray-800">{fmt(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-200 pt-3">
                  <span>Grand Total</span>
                  <span className="text-base font-black text-gray-950 font-mono">{fmt(total)}</span>
                </div>
              </div>
            </div>

            {/* Quality Badges */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center space-y-2.5">
              <div className="flex items-center justify-center space-x-1 text-[10px] text-gray-400 font-semibold">
                <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>256-Bit SSL Secured Transaction</span>
              </div>
              <div className="flex items-center justify-center space-x-1.5 text-[10px] text-gray-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Buyer Protection Guarantee</span>
              </div>
            </div>
          </div>
        )}

        {/* SUCCESS SPLASH SCREEN VIEW */}
        {phase === 'success' && (
          <div className="p-8 sm:p-12 text-center w-full max-w-lg mx-auto flex flex-col items-center">
            <div className="bg-green-100 rounded-full p-5 text-green-600 mb-5 animate-bounce">
              <CheckCircle2 className="w-14 h-14" />
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Order Placed Successfully!</h2>
            <p className="text-xs text-gray-500 mt-2 max-w-sm">
              Thank you for shopping on Jumia Clone! Your order <span className="font-bold font-mono text-gray-800">{confirmedOrderId}</span> has been parsed by our systems.
            </p>

            <div className="bg-green-50/50 rounded-lg p-4 border border-green-100/50 w-full my-6 text-left text-xs space-y-2">
              <p className="font-bold text-gray-800 border-b border-green-100 pb-1.5 uppercase tracking-wider">Customer Delivery Details</p>
              <p><span className="text-gray-400 font-medium">Recipient:</span> <span className="font-bold text-gray-800">{name}</span></p>
              <p><span className="text-gray-400 font-medium">Telephone:</span> <span className="font-mono text-gray-800 font-bold">{phone}</span></p>
              <p><span className="text-gray-400 font-medium">Destination:</span> <span className="text-gray-800 font-medium">{address}, {isInternational ? country : state}</span></p>
              <p><span className="text-gray-400 font-medium">Method:</span> <span className="font-bold text-[#16A34A]">{isInternational ? 'Air Cargo Priority Export ✈️' : (deliveryMethod === 'pickup' ? 'Station Pick-up' : 'Doorstep Delivery')}</span></p>
              <p><span className="text-gray-400 font-medium">Total:</span> <span className="font-bold font-mono text-gray-900">{fmt(total)}</span></p>
              <p><span className="text-gray-400 font-medium">Stock Updated:</span> <span className="text-green-600 font-bold">Yes (Real-time tracking updated)</span></p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 w-full">
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="flex-1 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold py-2.5 rounded shadow-sm uppercase tracking-wider text-xs cursor-pointer transition-colors border-none"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  // Open Seller Center
                  const b = document.getElementById('seller-center-btn');
                  if (b) b.click();
                }}
                className="flex-1 bg-white border-2 border-green-200 text-[#16A34A] hover:bg-green-50/20 font-bold py-2.5 rounded uppercase tracking-wider text-xs cursor-pointer transition-colors"
              >
                View in Seller Dashboard 📊
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
