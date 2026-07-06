import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, User, Mail, Phone, MapPin, Key, Heart, FileText, Plus, Trash2, 
  CreditCard, ShieldCheck, ShoppingCart, Star, CheckCircle, RefreshCw, AlertCircle,
  Truck, Package, Clock
} from 'lucide-react';

export const CustomerAccountModal: React.FC = () => {
  const {
    isCustomerDashboardOpen,
    setIsCustomerDashboardOpen,
    currentUser,
    customers,
    products,
    orders,
    formatPrice,
    addToCart,
    toggleWishlist,
    updateCustomerProfile,
    addShippingAddress,
    removeShippingAddress,
    setDefaultShippingAddress,
    addSavedPayment,
    removeSavedPayment,
    changeCustomerPassword,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'payments' | 'wishlist' | 'orders'>('profile');

  // Find currently logged-in customer's database profile
  const profile = customers.find(c => c.email.toLowerCase() === currentUser?.email?.toLowerCase());

  // Profile forms states
  const [profileName, setProfileName] = useState(profile?.name || '');
  const [profilePhone, setProfilePhone] = useState(profile?.phone || '');
  const [profileLocation, setProfileLocation] = useState(profile?.location || '');

  // Update form values if profile changes or logs in
  React.useEffect(() => {
    if (profile) {
      setProfileName(profile.name);
      setProfilePhone(profile.phone);
      setProfileLocation(profile.location);
    }
  }, [profile]);

  // Password change form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Address form states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrLine, setAddrLine] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrCountry, setAddrCountry] = useState('Nigeria');
  const [addrDefault, setAddrDefault] = useState(false);

  // Payment form states
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payType, setPayType] = useState<'card' | 'bank'>('card');
  const [cardBrand, setCardBrand] = useState<'Visa' | 'Mastercard' | 'Verve'>('Visa');
  const [cardLast4, setCardLast4] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');

  // Real-time order refresh simulation


  const handleRefreshOrder = (orderId: string) => {
    showToast(`Order #${orderId} telemetry is fully synchronized!`, 'success');
  };

  if (!isCustomerDashboardOpen || !currentUser) return null;

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      showToast('Name cannot be blank', 'warning');
      return;
    }
    updateCustomerProfile({
      name: profileName,
      phone: profilePhone,
      location: profileLocation
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'warning');
      return;
    }
    if (newPassword.length < 4) {
      showToast('New password must be at least 4 characters.', 'warning');
      return;
    }
    const success = changeCustomerPassword(currentPassword, newPassword);
    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName || !addrPhone || !addrLine || !addrState) {
      showToast('Please fill out all address fields.', 'warning');
      return;
    }
    addShippingAddress({
      fullName: addrName,
      phone: addrPhone,
      addressLine: addrLine,
      state: addrState,
      country: addrCountry,
      isDefault: addrDefault
    });
    // Reset form
    setAddrName('');
    setAddrPhone('');
    setAddrLine('');
    setAddrState('');
    setAddrDefault(false);
    setShowAddressForm(false);
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (payType === 'card') {
      if (cardLast4.length !== 4 || isNaN(Number(cardLast4))) {
        showToast('Please enter a valid 4-digit card last numbers.', 'warning');
        return;
      }
      addSavedPayment({
        type: 'card',
        cardBrand,
        last4: cardLast4,
        expiryDate: cardExpiry || '12/28'
      });
    } else {
      if (!bankName || bankAccount.length < 10) {
        showToast('Please enter a valid Bank Name and Account Number.', 'warning');
        return;
      }
      addSavedPayment({
        type: 'bank',
        bankName,
        accountNumber: bankAccount,
        last4: bankAccount.slice(-4)
      });
    }
    // Reset states
    setCardLast4('');
    setCardExpiry('');
    setBankName('');
    setBankAccount('');
    setShowPaymentForm(false);
  };

  // Get current wishlist items mapped to product details
  const wishlistProductIds = profile?.wishlist || [];
  const wishlistProducts = products.filter(p => wishlistProductIds.includes(p.id));

  // Get current user's past orders (supporting email matching too)
  const customerOrders = orders.filter(
    order => {
      // Exclude simulated orders
      const isSimulated = order.customerName.includes('(Simulated)') || order.customerName.includes('(Global Export)');
      if (isSimulated) return false;

      const emailLower = currentUser.email.toLowerCase();
      const orderEmailLower = order.customerEmail?.toLowerCase();
      const emailMatch = !!(orderEmailLower && orderEmailLower === emailLower);
      const phoneMatch = !!(profile?.phone && order.phone === profile.phone);
      
      const trimmedName = currentUser.name?.trim();
      const nameMatch = !!(trimmedName && trimmedName.length >= 3 && order.customerName.toLowerCase() === trimmedName.toLowerCase());

      return emailMatch || phoneMatch || nameMatch;
    }
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full relative overflow-hidden border border-gray-100 flex flex-col h-[85vh] md:h-[75vh]">
        
        {/* Header Accent Band */}
        <div className="h-1.5 bg-[#16A34A]" />

        {/* Modal Close */}
        <button
          onClick={() => setIsCustomerDashboardOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100 cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Container Split */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-5 flex flex-col shrink-0">
            <div className="mb-6">
              <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                <div className="bg-green-50 p-2.5 rounded-full text-[#16A34A] border border-green-100">
                  <User className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Trading Account</p>
                  <p className="text-sm font-black text-gray-800 truncate leading-snug">{currentUser.name}</p>
                  <p className="text-[11px] text-gray-500 truncate leading-none mt-0.5">{currentUser.email}</p>
                </div>
              </div>
            </div>

            <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 gap-1.5 scrollbar-none">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center space-x-2 px-3 py-2.5 rounded text-xs font-bold transition-all whitespace-nowrap border-none text-left w-full cursor-pointer ${
                  activeTab === 'profile' 
                    ? 'bg-[#16A34A] text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <User className="w-4 h-4 shrink-0" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center justify-between px-3 py-2.5 rounded text-xs font-bold transition-all whitespace-nowrap border-none text-left w-full cursor-pointer ${
                  activeTab === 'orders' 
                    ? 'bg-[#16A34A] text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Order History</span>
                </div>
                {customerOrders.length > 0 && (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    activeTab === 'orders' ? 'bg-white text-[#16A34A]' : 'bg-[#16A34A]/15 text-[#16A34A]'
                  }`}>
                    {customerOrders.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`flex items-center justify-between px-3 py-2.5 rounded text-xs font-bold transition-all whitespace-nowrap border-none text-left w-full cursor-pointer ${
                  activeTab === 'wishlist' 
                    ? 'bg-[#16A34A] text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 shrink-0" />
                  <span>My Wishlist</span>
                </div>
                {wishlistProductIds.length > 0 && (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    activeTab === 'wishlist' ? 'bg-white text-[#16A34A]' : 'bg-[#16A34A]/15 text-[#16A34A]'
                  }`}>
                    {wishlistProductIds.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`flex items-center space-x-2 px-3 py-2.5 rounded text-xs font-bold transition-all whitespace-nowrap border-none text-left w-full cursor-pointer ${
                  activeTab === 'addresses' 
                    ? 'bg-[#16A34A] text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Saved Addresses</span>
              </button>

              <button
                onClick={() => setActiveTab('payments')}
                className={`flex items-center space-x-2 px-3 py-2.5 rounded text-xs font-bold transition-all whitespace-nowrap border-none text-left w-full cursor-pointer ${
                  activeTab === 'payments' 
                    ? 'bg-[#16A34A] text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <span>Saved Payments</span>
              </button>
            </nav>

            {/* Sidebar Footer Info */}
            <div className="mt-auto hidden md:block pt-4 border-t border-gray-200">
              <div className="bg-green-50/55 p-3 rounded-lg border border-green-100 text-center space-y-1">
                <ShieldCheck className="w-4 h-4 text-[#16A34A] mx-auto" />
                <p className="text-[10px] font-black text-[#16A34A] uppercase tracking-wider">Escrow Trade Security</p>
                <p className="text-[9px] text-green-700 leading-normal font-medium">Your trade logs are certified, verified, and secured with physical logistics escrow.</p>
              </div>
            </div>
          </div>

          {/* Main Panel Content Area */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col h-full bg-white">
            
            {/* TABS 1: PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6 flex flex-col h-full">
                <div className="border-b border-gray-100 pb-3">
                  <h4 className="text-sm sm:text-base font-black uppercase text-gray-900">Personal Information</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Edit your Jumia Julia Agro customer contact details and geographic station.</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={e => setProfileName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white"
                      />
                      <User className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Email Address (Locked)</label>
                    <div className="relative">
                      <input
                        type="email"
                        disabled
                        value={currentUser.email}
                        className="w-full bg-gray-100 border border-gray-200 rounded pl-9 pr-3 py-2 text-xs text-gray-500 font-mono cursor-not-allowed"
                      />
                      <Mail className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={e => setProfilePhone(e.target.value)}
                        placeholder="e.g. 08033001234"
                        className="w-full bg-gray-50 border border-gray-200 rounded pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white font-mono"
                      />
                      <Phone className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">State / Region</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={profileLocation}
                        onChange={e => setProfileLocation(e.target.value)}
                        placeholder="e.g. Lagos"
                        className="w-full bg-gray-50 border border-gray-200 rounded pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white"
                      />
                      <MapPin className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="bg-[#16A34A] hover:bg-[#15803D] text-white font-black py-2 px-4 rounded text-xs uppercase tracking-wide cursor-pointer transition-all border-none"
                    >
                      Save Profile Updates
                    </button>
                  </div>
                </form>

                <div className="border-t border-gray-100 pt-6 mt-4 space-y-4">
                  <div className="border-b border-gray-100 pb-2">
                    <h5 className="text-xs font-black uppercase text-gray-800">Change Account Password</h5>
                    <p className="text-[10px] text-gray-400 mt-0.5">Keep your account secure by periodically changing your password PIN.</p>
                  </div>

                  <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Current Password</label>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">New Password</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Minimum 4 characters"
                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Confirm Password</label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white font-mono"
                      />
                    </div>

                    <div className="md:col-span-3 pt-1">
                      <button
                        type="submit"
                        className="bg-gray-800 hover:bg-black text-white font-black py-2 px-4 rounded text-xs uppercase tracking-wide cursor-pointer transition-all border-none"
                      >
                        Change Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* TABS 2: SAVED ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-6 flex flex-col h-full">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h4 className="text-sm sm:text-base font-black uppercase text-gray-900">Manage Addresses</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Add, edit or set default physical shipping addresses for your harvest log deliveries.</p>
                  </div>
                  {!showAddressForm && (
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold py-1.5 px-3 rounded flex items-center space-x-1 uppercase cursor-pointer border-none"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Address</span>
                    </button>
                  )}
                </div>

                {showAddressForm ? (
                  <form onSubmit={handleAddAddress} className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs space-y-4 animate-slide-in">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <p className="font-extrabold text-gray-800 uppercase tracking-wide">Enter New Shipping Address</p>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="text-gray-400 hover:text-gray-600 font-bold"
                      >
                        ✕ Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Contact Name</label>
                        <input
                          type="text"
                          required
                          value={addrName}
                          onChange={e => setAddrName(e.target.value)}
                          placeholder="e.g. Josiah Treasure"
                          className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Contact Phone</label>
                        <input
                          type="tel"
                          required
                          value={addrPhone}
                          onChange={e => setAddrPhone(e.target.value)}
                          placeholder="e.g. 08033001234"
                          className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 font-mono"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Street Address Line</label>
                        <input
                          type="text"
                          required
                          value={addrLine}
                          onChange={e => setAddrLine(e.target.value)}
                          placeholder="e.g. 12 Herbert Macaulay Way"
                          className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">State / Region</label>
                        <input
                          type="text"
                          required
                          value={addrState}
                          onChange={e => setAddrState(e.target.value)}
                          placeholder="e.g. Lagos"
                          className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Country</label>
                        <input
                          type="text"
                          required
                          value={addrCountry}
                          onChange={e => setAddrCountry(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                      </div>

                      <div className="md:col-span-2 flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="addr_default"
                          checked={addrDefault}
                          onChange={e => setAddrDefault(e.target.checked)}
                          className="rounded text-green-600 focus:ring-green-500"
                        />
                        <label htmlFor="addr_default" className="text-gray-700 font-semibold select-none">
                          Set as default shipping address
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold py-2 px-4 rounded uppercase tracking-wide cursor-pointer border-none"
                    >
                      Save Shipping Address
                    </button>
                  </form>
                ) : null}

                {/* Addresses List */}
                {(!profile?.addresses || profile.addresses.length === 0) ? (
                  <div className="py-12 text-center text-gray-500 bg-gray-50 rounded border border-dashed border-gray-200">
                    <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="font-bold">No saved addresses</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Please add a shipping address to speed up checkout.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.addresses.map((addr) => (
                      <div 
                        key={addr.id} 
                        className={`p-4 rounded-lg border flex flex-col justify-between relative transition-all ${
                          addr.isDefault 
                            ? 'bg-green-50/20 border-[#16A34A] shadow-xs' 
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-extrabold text-xs text-gray-900">{addr.fullName}</span>
                            {addr.isDefault && (
                              <span className="bg-green-100 text-[#16A34A] text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-xs font-semibold leading-normal">{addr.addressLine}</p>
                          <p className="text-gray-500 text-[11px] mt-0.5">{addr.state}, {addr.country}</p>
                          <p className="text-gray-400 text-[10px] mt-2 font-mono">📞 {addr.phone}</p>
                        </div>

                        <div className="flex items-center space-x-3 mt-4 pt-3 border-t border-gray-100">
                          {!addr.isDefault && (
                            <button
                              onClick={() => setDefaultShippingAddress(addr.id)}
                              className="text-[10px] text-green-600 hover:text-green-700 font-extrabold transition-colors cursor-pointer bg-transparent border-none p-0 uppercase"
                            >
                              Set As Default
                            </button>
                          )}
                          <button
                            onClick={() => removeShippingAddress(addr.id)}
                            className="text-[10px] text-red-500 hover:text-red-600 font-extrabold flex items-center space-x-0.5 transition-colors cursor-pointer ml-auto bg-transparent border-none p-0 uppercase"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TABS 3: SAVED PAYMENT METHODS */}
            {activeTab === 'payments' && (
              <div className="space-y-6 flex flex-col h-full">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h4 className="text-sm sm:text-base font-black uppercase text-gray-900">Payment Methods</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Manage secure, simulated payment methods saved in your cooperative profile.</p>
                  </div>
                  {!showPaymentForm && (
                    <button
                      onClick={() => setShowPaymentForm(true)}
                      className="bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold py-1.5 px-3 rounded flex items-center space-x-1 uppercase cursor-pointer border-none"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Payment</span>
                    </button>
                  )}
                </div>

                {showPaymentForm ? (
                  <form onSubmit={handleAddPayment} className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs space-y-4 animate-slide-in">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <p className="font-extrabold text-gray-800 uppercase tracking-wide">Add Saved Payment Method</p>
                      <button
                        type="button"
                        onClick={() => setShowPaymentForm(false)}
                        className="text-gray-400 hover:text-gray-600 font-bold"
                      >
                        ✕ Cancel
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Method Type</label>
                        <div className="flex space-x-4">
                          <label className="flex items-center space-x-2 font-bold text-gray-700">
                            <input
                              type="radio"
                              name="payType"
                              checked={payType === 'card'}
                              onChange={() => setPayType('card')}
                              className="text-[#16A34A] focus:ring-[#16A34A]"
                            />
                            <span>Debit Card 💳</span>
                          </label>
                          <label className="flex items-center space-x-2 font-bold text-gray-700">
                            <input
                              type="radio"
                              name="payType"
                              checked={payType === 'bank'}
                              onChange={() => setPayType('bank')}
                              className="text-[#16A34A] focus:ring-[#16A34A]"
                            />
                            <span>Bank Account 🏦</span>
                          </label>
                        </div>
                      </div>

                      {payType === 'card' ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Card Brand</label>
                            <select
                              value={cardBrand}
                              onChange={e => setCardBrand(e.target.value as any)}
                              className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                            >
                              <option value="Visa">Visa</option>
                              <option value="Mastercard">Mastercard</option>
                              <option value="Verve">Verve</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Last 4 Digits</label>
                            <input
                              type="text"
                              required
                              maxLength={4}
                              value={cardLast4}
                              onChange={e => setCardLast4(e.target.value.replace(/\D/g, ''))}
                              placeholder="e.g. 4242"
                              className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Expiry Date</label>
                            <input
                              type="text"
                              maxLength={5}
                              value={cardExpiry}
                              onChange={e => setCardExpiry(e.target.value)}
                              placeholder="MM/YY e.g. 12/28"
                              className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 font-mono"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Bank Name</label>
                            <input
                              type="text"
                              required
                              value={bankName}
                              onChange={e => setBankName(e.target.value)}
                              placeholder="e.g. Access Bank or GTBank"
                              className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Account Number</label>
                            <input
                              type="text"
                              required
                              maxLength={10}
                              value={bankAccount}
                              onChange={e => setBankAccount(e.target.value.replace(/\D/g, ''))}
                              placeholder="10-digit account number"
                              className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 font-mono"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold py-2 px-4 rounded uppercase tracking-wide cursor-pointer border-none"
                    >
                      Save Payment Method
                    </button>
                  </form>
                ) : null}

                {/* Payments List */}
                {(!profile?.savedPayments || profile.savedPayments.length === 0) ? (
                  <div className="py-12 text-center text-gray-500 bg-gray-50 rounded border border-dashed border-gray-200">
                    <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="font-bold">No saved payments</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Please add a simulated card or bank account.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.savedPayments.map((pay) => (
                      <div 
                        key={pay.id} 
                        className="bg-white border border-gray-200 p-4 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3.5">
                          <div className="bg-green-50 text-[#16A34A] p-2 rounded-lg border border-green-100">
                            {pay.type === 'card' ? <CreditCard className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="font-extrabold text-xs text-gray-900">
                              {pay.type === 'card' 
                                ? `${pay.cardBrand} Debit Card` 
                                : `${pay.bankName} Account`}
                            </p>
                            <p className="text-gray-500 text-[11px] mt-0.5 font-mono">
                              {pay.type === 'card' 
                                ? `•••• •••• •••• ${pay.last4} (${pay.expiryDate})` 
                                : `Acct No: •••••••${pay.last4}`}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => removeSavedPayment(pay.id)}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-all border-none bg-transparent cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TABS 4: WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6 flex flex-col h-full">
                <div className="border-b border-gray-100 pb-3">
                  <h4 className="text-sm sm:text-base font-black uppercase text-gray-900">My Saved Items</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Products you added to your wishlist. Add them directly to your active cart when ready.</p>
                </div>

                {wishlistProducts.length === 0 ? (
                  <div className="py-16 text-center text-gray-500 bg-gray-50 rounded border border-dashed border-gray-200 my-auto">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="font-bold text-gray-800">Your wishlist is empty!</p>
                    <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">Browse our organic, high-yield agricultural goods and click the heart icon to save products here.</p>
                    <button
                      onClick={() => {
                        setIsCustomerDashboardOpen(false);
                      }}
                      className="mt-4 bg-[#16A34A] text-white text-xs font-bold px-4 py-2 rounded uppercase tracking-wide hover:bg-[#15803D] cursor-pointer border-none"
                    >
                      Shop Grains & Produce
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistProducts.map((prod) => (
                      <div 
                        key={prod.id} 
                        className="bg-white border border-gray-200 rounded-lg p-3 flex space-x-3.5 hover:shadow-md transition-shadow relative"
                      >
                        {/* Remove heart */}
                        <button
                          onClick={() => toggleWishlist(prod.id)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer p-1 rounded-full hover:bg-gray-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="w-20 h-20 rounded bg-gray-100 overflow-hidden shrink-0">
                          <img
                            src={prod.image}
                            alt={prod.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between overflow-hidden text-xs">
                          <div>
                            <h5 className="font-extrabold text-gray-900 truncate pr-6">{prod.title}</h5>
                            <p className="text-[10px] text-gray-400 font-semibold">{prod.category}</p>
                            <div className="flex items-center space-x-1.5 mt-1">
                              <span className="font-bold text-gray-900 text-xs">{formatPrice(prod.price)}</span>
                              {prod.originalPrice > prod.price && (
                                <span className="text-[10px] text-gray-400 line-through">{formatPrice(prod.originalPrice)}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 pt-2">
                            {prod.stock > 0 ? (
                              <button
                                onClick={() => addToCart(prod, 1)}
                                className="bg-[#16A34A] hover:bg-[#15803D] text-white text-[10px] font-black py-1.5 px-2.5 rounded flex items-center space-x-1 uppercase cursor-pointer border-none"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>Buy Now</span>
                              </button>
                            ) : (
                              <span className="text-red-500 font-bold text-[10px] uppercase">Out of Stock</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TABS 5: ORDER HISTORY */}
            {activeTab === 'orders' && (
              <div className="space-y-6 flex flex-col h-full">
                <div className="border-b border-gray-100 pb-3">
                  <h4 className="text-sm sm:text-base font-black uppercase text-gray-900">Order History</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Real-time status updates and delivery logs matching your profile.</p>
                </div>

                {customerOrders.length === 0 ? (
                  <div className="py-16 text-center text-gray-500 bg-gray-50 rounded border border-dashed border-gray-200 my-auto">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="font-bold text-gray-800">No purchase records found</p>
                    <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">You have not submitted any physical cargo orders yet. Submit items in your cart to checkout.</p>
                    <button
                      onClick={() => {
                        setIsCustomerDashboardOpen(false);
                      }}
                      className="mt-4 bg-[#16A34A] text-white text-xs font-bold px-4 py-2 rounded uppercase tracking-wide hover:bg-[#15803D] cursor-pointer border-none"
                    >
                      Shop Agro Store
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {customerOrders.map((order) => (
                      <div 
                        key={order.id} 
                        className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md transition-all hover:border-[#16A34A]/35"
                      >
                        {/* Order Header banner */}
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center space-x-3">
                            <span className="font-extrabold text-gray-900">#{order.id}</span>
                            <span className="text-[10px] text-gray-400 font-medium font-mono">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2.5">
                            <span className="text-[11px] text-gray-500 font-semibold font-mono">Total: <strong className="text-gray-900">{formatPrice(order.total)}</strong></span>
                            
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider flex items-center space-x-1 ${
                              order.status === 'Delivered' 
                                ? 'bg-green-100 text-[#16A34A]' 
                                : order.status === 'Shipped' 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-amber-100 text-amber-700'
                            }`}>
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                              <span>
                                {order.status === 'Delivered' 
                                  ? 'Delivered' 
                                  : order.status === 'Shipped' 
                                    ? 'In Transit' 
                                    : 'Processing'}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Real-time Order Tracking Stepper */}
                        <div className="bg-gray-50/40 border-b border-gray-100 px-4 py-5">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider flex items-center space-x-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                              <span>GPS Telemetry Synced</span>
                            </span>
                          </div>

                          <div className="relative py-2">
                            {/* Desktop Connective Progress Line */}
                            <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 -translate-y-1/2 z-0 hidden sm:block"></div>
                            <div 
                              className="absolute top-6 left-6 -translate-y-1/2 h-0.5 bg-[#16A34A] transition-all duration-500 z-0 hidden sm:block"
                              style={{
                                width: order.status === 'Delivered' 
                                  ? 'calc(100% - 48px)' 
                                  : order.status === 'Shipped' 
                                    ? '50%' 
                                    : '0%'
                              }}
                            ></div>

                            {/* Stepper Steps Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-2 relative z-10">
                              {/* Step 1: Processing */}
                              <div className="flex sm:flex-col items-start sm:items-center text-left sm:text-center space-x-3 sm:space-x-0">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                                  order.status === 'Pending' 
                                    ? 'bg-green-50 border-[#16A34A] text-[#16A34A] ring-4 ring-green-100/70 animate-pulse'
                                    : 'bg-[#16A34A] border-[#16A34A] text-white shadow-sm'
                                }`}>
                                  {order.status !== 'Pending' ? (
                                    <CheckCircle className="w-5 h-5 stroke-[2.5]" />
                                  ) : (
                                    <Clock className="w-4 h-4" />
                                  )}
                                </div>
                                <div className="mt-0 sm:mt-2.5">
                                  <p className="font-extrabold text-gray-900 text-[11px] uppercase tracking-wide">Processing</p>
                                  <p className="text-[9px] text-gray-400 mt-0.5 leading-normal sm:max-w-[150px]">
                                    Order verified & packaging initiated.
                                  </p>
                                </div>
                              </div>

                              {/* Step 2: In Transit */}
                              <div className="flex sm:flex-col items-start sm:items-center text-left sm:text-center space-x-3 sm:space-x-0">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                                  order.status === 'Shipped'
                                    ? 'bg-green-50 border-[#16A34A] text-[#16A34A] ring-4 ring-green-100/70 animate-pulse'
                                    : order.status === 'Delivered'
                                      ? 'bg-[#16A34A] border-[#16A34A] text-white shadow-sm'
                                      : 'bg-white border-gray-200 text-gray-400'
                                }`}>
                                  {order.status === 'Delivered' ? (
                                    <CheckCircle className="w-5 h-5 stroke-[2.5]" />
                                  ) : (
                                    <Truck className="w-4 h-4" />
                                  )}
                                </div>
                                <div className="mt-0 sm:mt-2.5">
                                  <p className={`font-extrabold text-[11px] uppercase tracking-wide ${
                                    order.status === 'Shipped' || order.status === 'Delivered' ? 'text-gray-900' : 'text-gray-400'
                                  }`}>In Transit</p>
                                  <p className="text-[9px] text-gray-400 mt-0.5 leading-normal sm:max-w-[150px]">
                                    {order.status === 'Pending' 
                                      ? 'Awaiting dispatch confirmation.' 
                                      : 'Dispatched via certified regional cargo.'}
                                  </p>
                                </div>
                              </div>

                              {/* Step 3: Delivered */}
                              <div className="flex sm:flex-col items-start sm:items-center text-left sm:text-center space-x-3 sm:space-x-0">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                                  order.status === 'Delivered'
                                    ? 'bg-green-50 border-[#16A34A] text-[#16A34A] ring-4 ring-green-100/70'
                                    : 'bg-white border-gray-200 text-gray-400'
                                }`}>
                                  <CheckCircle className="w-4 h-4" />
                                </div>
                                <div className="mt-0 sm:mt-2.5">
                                  <p className={`font-extrabold text-[11px] uppercase tracking-wide ${
                                    order.status === 'Delivered' ? 'text-gray-900 font-black' : 'text-gray-400'
                                  }`}>Delivered</p>
                                  <p className="text-[9px] text-gray-400 mt-0.5 leading-normal sm:max-w-[150px]">
                                    {order.status === 'Delivered' 
                                      ? 'Arrived and checked out at station.' 
                                      : 'Awaiting hand-off confirmation.'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Extra confirmation details */}
                          {(order.deliveryTime || order.confirmedAt) && (
                            <div className="mt-4 bg-green-50/70 border border-green-100 rounded p-2.5 text-[10px] text-green-800 space-y-0.5 font-medium leading-relaxed">
                              {order.deliveryTime && (
                                <p>📦 <strong>Expected Delivery:</strong> <span className="text-[#16A34A] font-extrabold">{order.deliveryTime}</span></p>
                              )}
                              {order.confirmedAt && (
                                <p>⏰ <strong>Dispatched Timestamp:</strong> <span className="font-mono">{new Date(order.confirmedAt).toLocaleString()}</span></p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Order Items & Shipping split */}
                        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          {/* Items Column */}
                          <div className="md:col-span-2 space-y-2">
                            <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-1">Products Ordered</p>
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center space-x-3 bg-gray-50/50 p-2 rounded border border-gray-100">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  referrerPolicy="no-referrer"
                                  className="w-10 h-10 object-cover rounded bg-white border border-gray-200"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-800 truncate">{item.title}</p>
                                  <p className="text-[10px] text-gray-400 font-medium font-mono">
                                    {item.quantity}x &bull; {formatPrice(item.price)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Shipping Column */}
                          <div className="bg-gray-50/40 p-3 rounded border border-gray-100 space-y-1.5 flex flex-col justify-between">
                            <div>
                              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-1">Shipping Log</p>
                              <p className="font-bold text-gray-800 leading-normal">{order.customerName}</p>
                              <p className="text-gray-600 leading-relaxed font-semibold mt-0.5">{order.address}</p>
                              <p className="text-gray-500">{order.state}, {order.country || 'Nigeria'}</p>
                            </div>
                            <div className="pt-2 border-t border-gray-200 mt-2 flex items-center justify-between text-[10px]">
                              <span className="text-gray-400">Method:</span>
                              <span className="font-extrabold text-[#16A34A]">{order.paymentMethod}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
