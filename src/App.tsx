import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SellerDashboard } from './components/SellerDashboard';
import { CustomerCareDrawer } from './components/CustomerCareDrawer';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { AdminLoginPage } from './components/AdminLoginPage';
import { TermsAndPrivacyModal } from './components/TermsAndPrivacyModal';
import { 
  Sprout, Wheat, Leaf, Beef, Droplet, Hammer, ShoppingBag, 
  ChevronRight, Timer, ShieldCheck, HelpCircle, Zap, Truck, Globe, Award, Check
} from 'lucide-react';

const CATEGORIES_WITH_ICONS = [
  { name: 'All Categories', icon: ShoppingBag },
  { name: 'Grains & Cereals', icon: Wheat },
  { name: 'Fresh Produce & Tubers', icon: Leaf },
  { name: 'Livestock & Poultry', icon: Beef },
  { name: 'Fertilizers & Agro-Chemicals', icon: Droplet },
  { name: 'Farm Tools & Seeds', icon: Sprout }
];

const CAROUSEL_SLIDES = [
  {
    title: 'JULIA AGRO Harvest Deals!',
    subtitle: 'Direct from verified Nigerian farm belts to your doorstep.',
    cta: 'Shop Harvest',
    image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=1200',
    color: 'bg-gradient-to-r from-[#16A34A] to-green-600'
  },
  {
    title: 'Nationwide Delivery & Logistics',
    subtitle: 'Cheap flat shipping rates for major agricultural goods.',
    cta: 'Browse Products',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200',
    color: 'bg-gradient-to-r from-emerald-600 to-[#16A34A]'
  },
  {
    title: 'Certified Organic & High Yield Inputs',
    subtitle: 'High-quality fertilizers, screens, and disease-resistant seeds.',
    cta: 'View Seeds',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=1200',
    color: 'bg-gradient-to-r from-green-600 to-amber-600'
  }
];

function MainLayout() {
  const {
    products,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    toast,
    hideToast,
    setSelectedProduct,
    formatPrice,
    isSellerOpen,
    currentAdmin
  } = useStore();

  // Carousel slider state
  const [slideIdx, setSlideIdx] = useState(0);

  // Terms and conditions modal state
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'terms' | 'privacy'>('terms');

  const openLegal = (tab: 'terms' | 'privacy') => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  // Countdown timer for Flash Sale (8h : 45m : 31s init)
  const [timeLeft, setTimeLeft] = useState({ h: 8, m: 45, s: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { h: prev.h, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return { h: 8, m: 45, s: 30 }; // Reset
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Slide interval switcher
  useEffect(() => {
    const carouselTimer = setInterval(() => {
      setSlideIdx(idx => (idx + 1) % CAROUSEL_SLIDES.length);
    }, 6000);
    return () => clearInterval(carouselTimer);
  }, []);

  // Filter products by Category & Search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const isPublished = product.status !== 'Draft';
    return matchesCategory && matchesSearch && isPublished;
  });

  const flashSaleProducts = products.filter(p => p.flashSale && p.stock > 0 && p.status !== 'Draft');
  const activeFlashProduct = products.find(p => p.flashSale && p.stock > 0 && p.status !== 'Draft');
  const activeDirectProduct = products.find(p => p.directDistribution && p.stock > 0 && p.status !== 'Draft');

  // Auto hide Toast alert after 4 seconds
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => {
        hideToast();
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-gray-800 flex flex-col font-sans pb-12">
      <Header />

      {/* Hero Banner Grid (Visible on catalog overview without active search) */}
      {!searchQuery && selectedCategory === 'All Categories' && (
        <section className="max-w-7xl mx-auto w-full px-4 pt-5">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            
            {/* Left Category List Sidebar */}
            <div className="hidden lg:block bg-white rounded-md shadow-sm border border-gray-200 p-2.5 h-full">
              <p className="text-[10px] font-extrabold uppercase text-gray-400 px-3.5 mb-2.5 tracking-wider">Top Categories</p>
              <div className="space-y-1">
                {CATEGORIES_WITH_ICONS.map(cat => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-md transition-all text-left cursor-pointer ${
                        isActive 
                          ? 'bg-[#16A34A]/10 text-[#16A34A]' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#16A34A]' : 'text-gray-400'}`} />
                        <span>{cat.name}</span>
                      </div>
                      <ChevronRight className={`w-3 h-3 text-gray-300 transition-transform ${isActive ? 'translate-x-0.5' : ''}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Middle Promotion Sliding Carousel */}
            <div className="lg:col-span-2 relative bg-gray-200 rounded-md overflow-hidden shadow-sm aspect-video sm:aspect-auto sm:h-96 group">
              <div 
                className="w-full h-full flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${slideIdx * 100}%)` }}
              >
                {CAROUSEL_SLIDES.map((slide, idx) => (
                  <div key={idx} className="w-full h-full shrink-0 relative flex flex-col justify-end p-6 sm:p-10 text-white overflow-hidden">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover brightness-50 group-hover:scale-101 transition-all duration-1000"
                    />
                    <div className="relative z-10 max-w-md">
                      <span className="bg-[#16A34A] text-white text-[9px] font-black tracking-widest px-2 py-0.5 rounded uppercase">
                        Super Deals
                      </span>
                      <h2 className="text-xl sm:text-3xl font-black mt-2 leading-tight drop-shadow-md">
                        {slide.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-200 mt-1.5 font-medium drop-shadow-sm">
                        {slide.subtitle}
                      </p>
                      <button className="mt-5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold py-2 px-5 rounded uppercase tracking-wider transition-colors shadow-md cursor-pointer border-none">
                        {slide.cta}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slider Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 z-20">
                {CAROUSEL_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSlideIdx(idx)}
                    className={`h-2 rounded-full transition-all ${
                      slideIdx === idx ? 'w-5 bg-[#16A34A]' : 'w-2 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Promo Cards panel */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3.5">
              {activeFlashProduct ? (
                <div 
                  className="bg-white rounded-md p-4 border border-gray-200 shadow-sm flex flex-col justify-between cursor-pointer hover:border-red-300 transition-all group"
                  onClick={() => setSelectedProduct(activeFlashProduct)}
                >
                  <div className="flex gap-2 items-start">
                    <div className="flex-1">
                      <span className="text-[10px] bg-red-100 text-red-600 font-extrabold px-1.5 py-0.5 rounded uppercase font-mono">FLASH deals</span>
                      <h4 className="text-xs font-bold text-gray-800 mt-2 leading-snug group-hover:text-red-600 transition-colors line-clamp-2 font-sans">
                        {activeFlashProduct.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Stock drops in real-time!</p>
                    </div>
                    {activeFlashProduct.image && (
                      <img 
                        src={activeFlashProduct.image} 
                        alt="" 
                        className="w-12 h-12 object-cover rounded border border-gray-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                  <div className="flex items-baseline space-x-1.5 mt-3">
                    <span className="text-sm font-bold text-gray-900">{formatPrice(activeFlashProduct.price)}</span>
                    {activeFlashProduct.originalPrice > activeFlashProduct.price && (
                      <span className="text-[10px] text-gray-400 line-through">{formatPrice(activeFlashProduct.originalPrice)}</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50/50 rounded-md p-4 border border-dashed border-gray-200 shadow-sm flex flex-col justify-center items-center text-center py-8 min-h-[120px]">
                  <span className="text-[10px] bg-gray-100 text-gray-500 font-extrabold px-1.5 py-0.5 rounded uppercase font-mono">FLASH deals</span>
                  <p className="text-[11px] text-gray-400 mt-3 font-medium">No product assigned</p>
                  <p className="text-[9px] text-gray-300 mt-0.5">Go to Seller Center to edit & assign a flash deal.</p>
                </div>
              )}

              {activeDirectProduct ? (
                <div 
                  className="bg-white rounded-md p-4 border border-gray-200 shadow-sm flex flex-col justify-between cursor-pointer hover:border-green-300 transition-all group"
                  onClick={() => setSelectedProduct(activeDirectProduct)}
                >
                  <div className="flex gap-2 items-start">
                    <div className="flex-1">
                      <span className="text-[10px] bg-green-100 text-green-700 font-extrabold px-1.5 py-0.5 rounded uppercase font-mono">DIRECT DISTRIBUTOR</span>
                      <h4 className="text-xs font-bold text-gray-800 mt-2 leading-snug group-hover:text-[#16A34A] transition-colors line-clamp-2">
                        {activeDirectProduct.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Shipped from JULIA Agro Hub.</p>
                    </div>
                    {activeDirectProduct.image && (
                      <img 
                        src={activeDirectProduct.image} 
                        alt="" 
                        className="w-12 h-12 object-cover rounded border border-gray-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                  <div className="flex items-baseline space-x-1.5 mt-3">
                    <span className="text-sm font-bold text-gray-900">{formatPrice(activeDirectProduct.price)}</span>
                    {activeDirectProduct.originalPrice > activeDirectProduct.price && (
                      <span className="text-[10px] text-gray-400 line-through">{formatPrice(activeDirectProduct.originalPrice)}</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50/50 rounded-md p-4 border border-dashed border-gray-200 shadow-sm flex flex-col justify-center items-center text-center py-8 min-h-[120px]">
                  <span className="text-[10px] bg-gray-100 text-gray-400 font-extrabold px-1.5 py-0.5 rounded uppercase font-mono">DIRECT DISTRIBUTOR</span>
                  <p className="text-[11px] text-gray-400 mt-3 font-medium">No product assigned</p>
                  <p className="text-[9px] text-gray-300 mt-0.5">Go to Seller Center to edit & assign a distributor.</p>
                </div>
              )}
            </div>

          </div>
        </section>
      )}

      {/* Dynamic mobile Categories Filter pills */}
      <section className="max-w-7xl mx-auto w-full px-4 pt-4 lg:hidden">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES_WITH_ICONS.map(cat => {
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`text-xs font-bold px-3.5 py-2.5 rounded-full border whitespace-nowrap transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#16A34A] border-[#16A34A] text-white shadow-sm' 
                    : 'bg-white border-gray-200 text-gray-700'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* FLASH SALES TIMER COMPONENT (Only shown on catalog page) */}
      {!searchQuery && selectedCategory === 'All Categories' && flashSaleProducts.length > 0 && (
        <section className="max-w-7xl mx-auto w-full px-4 pt-6">
          <div className="bg-red-600 text-white rounded-md p-3.5 sm:p-4 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="bg-white text-red-600 p-1.5 rounded-full animate-pulse">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black tracking-wider uppercase">JULIA Flash Sales</h3>
                <p className="text-[10px] sm:text-xs text-red-100 font-semibold">Limited stock remaining. Decrements observed in real-time!</p>
              </div>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center space-x-2.5">
              <span className="text-[11px] font-bold text-red-100 uppercase tracking-widest flex items-center gap-1">
                <Timer className="w-4 h-4" />
                <span>Ends In:</span>
              </span>
              <div className="flex items-center space-x-1 text-xs font-mono font-black text-red-600">
                <span className="bg-white px-2 py-1 rounded shadow-sm">{timeLeft.h.toString().padStart(2, '0')}h</span>
                <span>:</span>
                <span className="bg-white px-2 py-1 rounded shadow-sm">{timeLeft.m.toString().padStart(2, '0')}m</span>
                <span>:</span>
                <span className="bg-white px-2 py-1 rounded shadow-sm animate-pulse">{timeLeft.s.toString().padStart(2, '0')}s</span>
              </div>
            </div>
          </div>

          {/* Flash sale products grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
            {flashSaleProducts.slice(0, 5).map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* CORE CATALOG GRID SECTION */}
      <section className="max-w-7xl mx-auto w-full px-4 pt-6 flex-1">
        <div className="bg-white rounded-md p-4 sm:p-5 border border-gray-200 shadow-sm">
          
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
            <div>
              <h2 className="text-sm sm:text-base font-black uppercase text-gray-900 flex items-center space-x-2">
                <span className="bg-[#16A34A] w-1.5 h-5 block"></span>
                <span>
                  {searchQuery 
                    ? `Search Results for "${searchQuery}"` 
                    : `${selectedCategory}`}
                </span>
              </h2>
              <p className="text-[10px] text-gray-400 mt-0.5">{filteredProducts.length} premium products matching selection criteria.</p>
            </div>
            
            <div className="text-[11px] text-gray-400 font-mono hidden md:block">
              System stock synced. Secure Payments.
            </div>
          </div>

          {/* Catalog grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-gray-500 max-w-sm mx-auto">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="font-bold text-gray-800">No items found!</p>
              <p className="text-xs text-gray-400 mt-1">We couldn't locate any products matching your query. Clear search input or choose a different category.</p>
              <button 
                onClick={() => { setSelectedCategory('All Categories'); }}
                className="mt-4 text-xs font-bold text-[#16A34A] hover:underline cursor-pointer"
              >
                Reset Selection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Trust Signalling Footer Details */}
      <section className="max-w-7xl mx-auto w-full px-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-4 border border-gray-200 shadow-sm rounded-md flex flex-col items-center">
            <Truck className="w-6 h-6 text-[#16A34A] mb-1" />
            <h5 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide">Nationwide Logistics</h5>
            <p className="text-[10px] text-gray-400 mt-1">Ventilated transit network for fresh produce and heavy tubers.</p>
          </div>
          <div className="bg-white p-4 border border-gray-200 shadow-sm rounded-md flex flex-col items-center">
            <ShieldCheck className="w-6 h-6 text-[#16A34A] mb-1" />
            <h5 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide">Secured Escrow</h5>
            <p className="text-[10px] text-gray-400 mt-1">Funds are protected and held in escrow until produce is verified.</p>
          </div>
          <div className="bg-white p-4 border border-gray-200 shadow-sm rounded-md flex flex-col items-center">
            <Award className="w-6 h-6 text-[#16A34A] mb-1" />
            <h5 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide">Quality Guarantee</h5>
            <p className="text-[10px] text-gray-400 mt-1">Seeds and soil inputs are lab-certified with high-yield parameters.</p>
          </div>
          <div className="bg-white p-4 border border-gray-200 shadow-sm rounded-md flex flex-col items-center">
            <Globe className="w-6 h-6 text-[#16A34A] mb-1" />
            <h5 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide">Cooperative Sourcing</h5>
            <p className="text-[10px] text-gray-400 mt-1">Sourced directly from verified farm belts and farmer cooperatives.</p>
          </div>
        </div>
      </section>

      {/* --- FLOATING OVERLAYS & MODALS --- */}
      <ProductDetailsModal />
      <CartDrawer />
      <CheckoutModal />
      {isSellerOpen && currentAdmin && <SellerDashboard />}
      <CustomerCareDrawer />
      <CustomerAuthModal />
      <CustomerAccountModal />
      <AdminLoginPage />
      
      {/* Platform Footer */}
      <footer className="w-full bg-[#141414] text-gray-400 mt-12 py-8 px-4 border-t border-gray-950 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="font-extrabold text-white uppercase tracking-wider text-sm flex items-center justify-center md:justify-start gap-1">
              <span className="text-[#16A34A]">JULIA AGRO</span>
              <span className="text-[10px] bg-green-900/40 text-green-400 border border-green-800/60 px-1.5 py-0.5 rounded font-mono">COOPERATIVE ENGINE</span>
            </p>
            <p className="text-[10px] text-gray-500 mt-1">
              Providing direct field transparency, secure digital escrow payouts, and nationwide logistics.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-bold">
            <button 
              onClick={() => openLegal('terms')}
              className="hover:text-green-400 transition-colors cursor-pointer border-none bg-transparent"
              id="footer-terms-btn"
            >
              Terms & Conditions
            </button>
            <span className="text-gray-700 hidden sm:inline">|</span>
            <button 
              onClick={() => openLegal('privacy')}
              className="hover:text-green-400 transition-colors cursor-pointer border-none bg-transparent"
              id="footer-privacy-btn"
            >
              Privacy Policy
            </button>
          </div>

          <div className="text-center md:text-right text-[10px] text-gray-500 font-mono">
            <p>© {new Date().getFullYear()} Julia Agro. All Rights Reserved.</p>
            <p className="text-gray-600 mt-0.5">Secure escrow system synced with Nigerian state channels.</p>
          </div>
        </div>
      </footer>

      <TermsAndPrivacyModal 
        isOpen={isLegalOpen} 
        onClose={() => setIsLegalOpen(false)} 
        initialTab={legalTab} 
      />

      {/* Custom Global Toast Alert */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-slide-in max-w-sm text-xs">
          <div className={`p-3.5 rounded-lg shadow-xl border flex items-center space-x-2.5 ${
            toast.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : toast.type === 'warning' 
                ? 'bg-red-50 border-red-200 text-red-800' 
                : 'bg-green-50 border-green-200 text-green-900'
          }`}>
            <div className={`w-2 h-2 rounded-full shrink-0 ${
              toast.type === 'success' ? 'bg-green-500' : toast.type === 'warning' ? 'bg-red-500 animate-ping' : 'bg-green-500 animate-pulse'
            }`} />
            <p className="font-semibold leading-relaxed flex-1">{toast.message}</p>
            <button 
              onClick={hideToast}
              className="text-gray-400 hover:text-gray-600 font-bold px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
