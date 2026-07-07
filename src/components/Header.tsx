import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingCart, User, HelpCircle, Store, ChevronDown, LogOut, FileText, CheckCircle, Globe, Menu, X, Package, LayoutDashboard } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    cart,
    orders,
    searchQuery,
    setSearchQuery,
    setIsCartOpen,
    isSellerOpen,
    setIsSellerOpen,
    isAdminLoginOpen,
    setIsAdminLoginOpen,
    setIsCustomerCareOpen,
    setIsCustomerAuthOpen,
    setIsCustomerDashboardOpen,
    currentUser,
    logoutUser,
    loginUser,
    currentAdmin,
    logoutAdmin,
    currency,
    setCurrency,
    sellerTab,
    setSellerTab
  } = useStore();

  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
      {/* Top Banner Scrolling Marquee */}
      <div className="bg-[#16A34A] text-white text-xs font-bold py-2.5 px-4 overflow-hidden border-b border-[#16A34A]/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 uppercase tracking-widest">
          <div className="flex items-center space-x-2">
            <span className="bg-white text-[#16A34A] text-[9px] px-1.5 py-0.5 rounded uppercase font-black">LIVE UPDATE</span>
            <p className="truncate text-[10px] sm:text-xs">
              Flash Sale: Seasonal harvest discounts active &bull; Nationwide & Global Export Logistics operational
            </p>
          </div>
          <div className="flex items-center space-x-4 text-[10px] sm:text-xs shrink-0">
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-[#141414] text-white py-3 sm:py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6">
          
          {/* Top Row on Mobile: Logo & Compact Actions */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="flex items-center space-x-3 shrink-0">
              {/* Mobile Hamburger Menu Toggle Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1.5 text-gray-300 hover:text-[#16A34A] transition-colors cursor-pointer md:hidden focus:outline-none"
                aria-label="Open Menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Brand Logo */}
              <button 
                onClick={() => { setIsSellerOpen(false); setSearchQuery(''); }}
                className="flex items-baseline space-x-1 select-none cursor-pointer focus:outline-none"
              >
                <span className="text-xl sm:text-2xl font-black tracking-tighter text-[#16A34A]">
                  JULIA<span className="text-white font-normal opacity-90">AGRO</span>
                </span>
                <span className="text-[8px] sm:text-[9px] bg-[#16A34A] text-white px-1.5 py-0.5 rounded font-black uppercase tracking-widest hidden sm:inline ml-1">
                  {currency === 'USD' ? 'GLOBAL' : 'NG'}
                </span>
              </button>
            </div>

            {/* Mobile Actions: Simplified, letting Sidebar do the heavy lifting */}
            <div className="flex items-center space-x-2.5 md:hidden">
              {/* Cart shortcut for quick checkout access on mobile */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-1.5 text-gray-300 hover:text-[#16A34A] transition-colors cursor-pointer focus:outline-none"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#16A34A] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-sm">
                    {totalCartItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar - full width on mobile, responsive sizes */}
          <div className="w-full md:flex-1 md:max-w-2xl relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search products, brands and categories..."
                className="w-full bg-gray-100/10 hover:bg-gray-100/15 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:bg-white focus:text-gray-900 transition-all text-sm border border-transparent"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Desktop Nav Actions (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            
            {currentAdmin && (
              <button
                id="seller-center-btn"
                onClick={() => {
                  setIsSellerOpen(!isSellerOpen);
                }}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-xs font-black uppercase tracking-wider border transition-all duration-300 cursor-pointer ${
                  isSellerOpen 
                    ? 'bg-[#16A34A] text-white border-[#16A34A] shadow-sm' 
                    : 'bg-transparent text-[#16A34A] border-[#16A34A] hover:bg-[#16A34A] hover:text-white'
                }`}
              >
                <Store className="w-4 h-4 shrink-0" />
                <span>Seller Center 📊</span>
              </button>
            )}

            {/* Currency Selector */}
            <div className="flex items-center space-x-1 bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded border border-gray-100/10 transition-all">
              <Globe className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'NGN' | 'USD')}
                className="bg-transparent text-white font-extrabold text-[11px] focus:outline-none cursor-pointer border-none"
                style={{ colorScheme: 'dark' }}
              >
                <option value="NGN" className="text-gray-900 bg-white">₦ NGN</option>
                <option value="USD" className="text-gray-900 bg-white">$ USD</option>
              </select>
            </div>

            {/* Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="flex items-center space-x-1.5 hover:text-[#16A34A] py-1 text-sm font-semibold tracking-wide transition-colors cursor-pointer focus:outline-none"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline truncate max-w-[100px]">
                  Hi, {currentAdmin ? currentAdmin.name.split(' ')[0] : (currentUser ? currentUser.name.split(' ')[0] : 'Account')}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {showAccountDropdown && (
                <div className="absolute right-0 mt-2.5 w-56 bg-white text-gray-800 rounded-md shadow-xl border border-gray-200 overflow-hidden py-1.5 z-50">
                  {currentUser || currentAdmin ? (
                    <>
                      {currentUser && (
                        <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Customer Profile</p>
                          <p className="text-sm font-bold text-gray-800 truncate">{currentUser.name}</p>
                          <p className="text-[11px] text-gray-500 truncate">{currentUser.email}</p>
                        </div>
                      )}

                      {currentAdmin && (
                        <div className="px-4 py-2 border-b border-gray-100 bg-green-50/40">
                          <div className="flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 bg-[#16A34A] rounded-full animate-pulse"></span>
                            <p className="text-[10px] text-[#16A34A] font-bold uppercase tracking-wider">Active Admin</p>
                          </div>
                          <p className="text-sm font-bold text-gray-800 truncate">{currentAdmin.name}</p>
                          <p className="text-[11px] text-gray-500 truncate">{currentAdmin.email}</p>
                        </div>
                      )}

                      {currentUser && (
                        <>
                          <button
                            onClick={() => {
                              setIsCustomerDashboardOpen(true);
                              setShowAccountDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-green-50/50 text-xs flex items-center space-x-2 font-medium cursor-pointer border-none bg-transparent"
                          >
                            <User className="w-4 h-4 text-[#16A34A] shrink-0" />
                            <span>My Profile & Trade Station</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsCustomerDashboardOpen(true);
                              setShowAccountDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-green-50/50 text-xs flex items-center space-x-2 font-medium cursor-pointer border-none bg-transparent"
                          >
                            <FileText className="w-4 h-4 text-[#16A34A] shrink-0" />
                            <span>Order History</span>
                          </button>
                        </>
                      )}

                      {currentUser && (
                        <button
                          onClick={() => {
                            logoutUser();
                            setShowAccountDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-red-50 text-xs text-red-600 border-t border-gray-100 flex items-center space-x-2 font-semibold cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out Customer</span>
                        </button>
                      )}

                      {currentAdmin && (
                        <>
                          <button
                            onClick={() => {
                              setSellerTab('overview');
                              setIsSellerOpen(true);
                              setShowAccountDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-green-50/50 text-xs flex items-center space-x-2 font-medium cursor-pointer border-none bg-transparent"
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#16A34A] shrink-0" />
                            <span>Admin Dashboard 📊</span>
                          </button>

                          <button
                            onClick={() => {
                              setSellerTab('products');
                              setIsSellerOpen(true);
                              setShowAccountDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-green-50/50 text-xs flex items-center space-x-2 font-medium cursor-pointer border-none bg-transparent"
                          >
                            <Store className="w-4 h-4 text-[#16A34A] shrink-0" />
                            <span>Products Catalog 🌾</span>
                          </button>

                          <button
                            onClick={() => {
                              setSellerTab('inventory');
                              setIsSellerOpen(true);
                              setShowAccountDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-green-50/50 text-xs flex items-center space-x-2 font-medium cursor-pointer border-none bg-transparent"
                          >
                            <Package className="w-4 h-4 text-[#16A34A] shrink-0" />
                            <span>Stock Controller 📦</span>
                          </button>
                        </>
                      )}

                      {currentAdmin && (
                        <button
                          onClick={() => {
                            logoutAdmin();
                            setShowAccountDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-red-50 text-xs text-red-600 border-t border-gray-100 flex items-center space-x-2 font-semibold cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out Admin</span>
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="p-3 space-y-3">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-center mb-1.5">Customer Access</p>
                        <button
                          onClick={() => {
                            setIsCustomerAuthOpen(true);
                            setShowAccountDropdown(false);
                          }}
                          className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold py-2 px-3 rounded text-center transition-colors cursor-pointer shadow-sm"
                        >
                          Sign In / Register
                        </button>
                      </div>
                      <div className="border-t border-gray-100 pt-2.5">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-center mb-1.5 font-mono">Administrative</p>
                        <button
                          onClick={() => {
                            setIsAdminLoginOpen(true);
                            setShowAccountDropdown(false);
                          }}
                          className="w-full bg-gray-900 hover:bg-black text-white text-xs font-bold py-2 px-3 rounded text-center transition-colors cursor-pointer shadow-sm border border-gray-800"
                        >
                          Admin Portal Sign In
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Help Dropdown */}
            <button
              onClick={() => setIsCustomerCareOpen(true)}
              className="hidden md:flex items-center space-x-1.5 text-sm hover:text-[#16A34A] cursor-pointer transition-colors bg-transparent border-none text-white font-semibold focus:outline-none"
            >
              <HelpCircle className="w-5 h-5 text-gray-300" />
              <span>Help & Care</span>
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center space-x-1.5 hover:text-[#16A34A] py-1 text-sm font-bold transition-colors cursor-pointer focus:outline-none"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#16A34A] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-extrabold shadow-md">
                    {totalCartItems}
                  </span>
                )}
              </div>
              <span className="hidden lg:inline text-sm uppercase font-bold tracking-wider">Cart</span>
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Sidebar Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          />
          
          {/* Sidebar Panel */}
          <div className="relative flex w-full max-w-xs flex-col bg-[#141414] text-white p-5 shadow-2xl border-r border-[#16A34A]/20 h-full overflow-y-auto animate-slide-in-left">
            
            {/* Header / Logo + Close button */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-black tracking-tighter text-[#16A34A]">
                  JULIA<span className="text-white font-normal opacity-90">AGRO</span>
                </span>
                <span className="text-[8px] bg-[#16A34A] text-white px-1.5 py-0.5 rounded font-black uppercase tracking-widest ml-1">
                  {currency}
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* User Profile Info section */}
            <div className="py-6 border-b border-white/10">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg border border-white/5">
                    <div className="bg-[#16A34A]/20 p-2 rounded-full text-[#16A34A]">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs text-gray-400 font-medium">Logged in as</p>
                      <p className="text-sm font-black text-white truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsCustomerDashboardOpen(true);
                      }}
                      className="flex items-center justify-center space-x-1.5 bg-white/10 hover:bg-white/15 text-white py-2 px-3 rounded text-xs font-semibold cursor-pointer border border-white/10"
                    >
                      <User className="w-3.5 h-3.5 text-[#16A34A]" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        logoutUser();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center space-x-1.5 bg-red-600/25 hover:bg-red-600/35 text-red-300 py-2 px-3 rounded text-xs font-bold cursor-pointer border border-red-500/20"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 p-4 rounded-lg border border-white/5 text-center space-y-3 flex flex-col gap-2">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2 text-left pl-1">Customer Access</p>
                    <button
                      onClick={() => {
                        setIsCustomerAuthOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold py-2 px-3 rounded text-center transition-colors cursor-pointer shadow-sm"
                    >
                      Sign In / Register
                    </button>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2 font-mono text-left pl-1">Administrative</p>
                    <button
                      onClick={() => {
                        setIsAdminLoginOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold py-2 px-3 rounded text-center transition-colors cursor-pointer shadow-sm border border-white/5"
                    >
                      Admin Sign In
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Navigation Options */}
            <div className="flex-grow py-6 space-y-4">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Navigation Menu</p>
              
              <div className="space-y-2">
                {/* Seller Center */}
                {currentAdmin && (
                  <button
                    onClick={() => {
                      setIsSellerOpen(!isSellerOpen);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-md text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                      isSellerOpen 
                        ? 'bg-[#16A34A] text-white border-[#16A34A] shadow-md' 
                        : 'bg-white/5 text-gray-300 hover:text-[#16A34A] hover:bg-white/10 border-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Store className="w-4 h-4 text-[#16A34A]" />
                      <span>Seller Center 📊</span>
                    </div>
                    <span className="text-[10px] opacity-75 font-normal">Manage</span>
                  </button>
                )}

                {/* Cart Drawer */}
                <button
                  onClick={() => {
                    setIsCartOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-md text-xs font-bold uppercase tracking-wider bg-white/5 text-gray-300 hover:text-[#16A34A] hover:bg-white/10 border border-white/5 cursor-pointer transition-all"
                >
                  <div className="flex items-center space-x-2.5">
                    <ShoppingCart className="w-4 h-4 text-[#16A34A]" />
                    <span>My Cart</span>
                  </div>
                  {totalCartItems > 0 && (
                    <span className="bg-[#16A34A] text-white text-[9px] px-2 py-0.5 rounded-full font-black">
                      {totalCartItems}
                    </span>
                  )}
                </button>

                {/* Help & Customer Care */}
                <button
                  onClick={() => {
                    setIsCustomerCareOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2.5 px-4 py-3 rounded-md text-xs font-bold uppercase tracking-wider bg-white/5 text-gray-300 hover:text-[#16A34A] hover:bg-white/10 border border-white/5 cursor-pointer transition-all"
                >
                  <HelpCircle className="w-4 h-4 text-[#16A34A]" />
                  <span>Help & Care Support</span>
                </button>
              </div>

              {/* Preferences Settings (Simulation, Currency) */}
              <div className="pt-6 border-t border-white/10 space-y-4">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Preferences</p>
                
                {/* Currency Selector option */}
                <div className="flex items-center justify-between bg-white/5 px-4 py-3 rounded-md border border-white/5 text-xs">
                  <span className="text-gray-300 font-bold uppercase tracking-wide flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-[#16A34A]" />
                    <span>Trading Currency</span>
                  </span>
                  <div className="flex items-center space-x-1 bg-white/10 px-2 py-1 rounded">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as 'NGN' | 'USD')}
                      className="bg-transparent text-white font-extrabold text-xs focus:outline-none cursor-pointer border-none"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="NGN" className="text-gray-900 bg-white">₦ NGN</option>
                      <option value="USD" className="text-gray-900 bg-white">$ USD</option>
                    </select>
                  </div>
                </div>

              </div>

            </div>

            {/* Footer station indicator */}
            <div className="pt-4 border-t border-white/10 text-center">
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
