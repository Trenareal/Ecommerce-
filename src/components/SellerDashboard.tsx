import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { CameraModal } from './CameraModal';
import { 
  X, BarChart2, Package, ShoppingCart, RefreshCcw, LogIn, LogOut, TrendingUp, 
  AlertTriangle, Check, ArrowUpRight, History, Play, Pause, Plus, List,
  Camera, Edit, Trash2, CheckCircle, Lock, Mail, Users, Percent, Tag, 
  FileText, PlusCircle, Download, Settings, Edit3, ShieldCheck, Upload,
  Smartphone, MessageSquare, Send, Clock
} from 'lucide-react';

export const SellerDashboard: React.FC = () => {
  const {
    products,
    orders,
    logs,
    restockProduct,
    addNewProduct,
    updateOrderStatus,
    isSellerOpen,
    setIsSellerOpen,
    showToast,
    formatPrice,
    updateProduct,
    deleteProduct,
    addVerifiedPhoto,
    verifiedPhotos,
    currentUser,
    loginUser,
    logoutUser,
    currentAdmin,
    loginAdmin,
    registerAdmin,
    logoutAdmin,

    coupons,
    promotions,
    customers,
    storeSettings,
    addCoupon,
    deleteCoupon,
    toggleCoupon,
    addPromotion,
    deletePromotion,
    togglePromotion,
    addCustomer,
    toggleCustomerStatus,
    updateStoreSettings,
    sellerTab: activeTab,
    setSellerTab: setActiveTab,
    clearAllOrders,
    adminEmails,
    confirmOrderPayment,
    markEmailAsRead,
    deleteEmail
  } = useStore();

  // Admin Login States
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminName, setAdminName] = useState('');
  const [isAdminRegister, setIsAdminRegister] = useState(false);
  
  // Product Creation state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Grains & Cereals');
  const [newStock, setNewStock] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400');
  const [newShortDescription, setNewShortDescription] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newImagesText, setNewImagesText] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [newDimensions, setNewDimensions] = useState('');
  const [newStatus, setNewStatus] = useState<'Published' | 'Draft'>('Published');
  const [newFlashSale, setNewFlashSale] = useState(false);
  const [newDirectDistribution, setNewDirectDistribution] = useState(false);

  // Product Editing state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editOriginalPrice, setEditOriginalPrice] = useState('');
  const [editCategory, setEditCategory] = useState('Grains & Cereals');
  const [editStock, setEditStock] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editShortDescription, setEditShortDescription] = useState('');
  const [editBrand, setEditBrand] = useState('');
  const [editSku, setEditSku] = useState('');
  const [editImagesText, setEditImagesText] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [editDimensions, setEditDimensions] = useState('');
  const [editStatus, setEditStatus] = useState<'Published' | 'Draft'>('Published');
  const [editFlashSale, setEditFlashSale] = useState(false);
  const [editDirectDistribution, setEditDirectDistribution] = useState(false);

  // Camera Audit state
  const [cameraProduct, setCameraProduct] = useState<Product | null>(null);

  // Customers tab state
  const [custSearch, setCustSearch] = useState('');
  const [showAddCust, setShowAddCust] = useState(false);
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custLocation, setCustLocation] = useState('');

  // Mailbox tab state
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  // Discounts tab state
  const [showAddPromo, setShowAddPromo] = useState(false);
  const [promoTitle, setPromoTitle] = useState('');
  const [promoCategory, setPromoCategory] = useState('Grains & Cereals');
  const [promoPercent, setPromoPercent] = useState('');
  const [promoStart, setPromoStart] = useState(new Date().toISOString().split('T')[0]);
  const [promoEnd, setPromoEnd] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);

  // Coupons tab state
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'flat'>('percentage');
  const [couponValue, setCouponValue] = useState('');
  const [couponMinOrder, setCouponMinOrder] = useState('');

  // Settings tab state
  const [settingStoreName, setSettingStoreName] = useState(storeSettings?.storeName || 'JULIA AGRO');
  const [settingEmail, setSettingEmail] = useState(storeSettings?.contactEmail || 'support@julia-agro.com');
  const [settingPhone, setSettingPhone] = useState(storeSettings?.contactPhone || '+234 803 300 1234');
  const [settingRate, setSettingRate] = useState(storeSettings?.nairaToUsdRate?.toString() || '1500');
  const [settingFee, setSettingFee] = useState(storeSettings?.defaultDeliveryFee?.toString() || '1500');
  const [settingEscrow, setSettingEscrow] = useState(storeSettings?.escrowProtectionFee?.toString() || '500');
  const [settingEmailjsServiceId, setSettingEmailjsServiceId] = useState(storeSettings?.emailjsServiceId || '');
  const [settingEmailjsTemplateId, setSettingEmailjsTemplateId] = useState(storeSettings?.emailjsTemplateId || '');
  const [settingEmailjsPublicKey, setSettingEmailjsPublicKey] = useState(storeSettings?.emailjsPublicKey || '');
  const [settingEmailjsEnabled, setSettingEmailjsEnabled] = useState(storeSettings?.emailjsEnabled || false);

  // Reports tab state
  const [reportType, setReportType] = useState<'sales' | 'customers' | 'inventory'>('sales');
  const [reportCategory, setReportCategory] = useState('All');
  const [reportState, setReportState] = useState('All');

  // Order Confirmation States
  const [confirmingOrder, setConfirmingOrder] = useState<any | null>(null);
  const [deliveryTimeframe, setDeliveryTimeframe] = useState('3-5 Business Days');
  const [showSimulatedReceipt, setShowSimulatedReceipt] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [isSimulatingSend, setIsSimulatingSend] = useState(false);
  const [simulationStep, setSimulationStep] = useState<number>(0); // 0: Form, 1: Loading, 2: Sent Success Feedback

  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const basePriceNum = parseFloat(editOriginalPrice);
    const discountPriceNum = parseFloat(editPrice);
    const stockNum = parseInt(editStock);

    if (!editTitle.trim() || isNaN(basePriceNum) || isNaN(stockNum)) {
      showToast('Please fill in title, price, and stock.', 'warning');
      return;
    }

    const finalPrice = !isNaN(discountPriceNum) && discountPriceNum > 0 ? discountPriceNum : basePriceNum;
    const finalOriginalPrice = basePriceNum;

    // Process additional images text
    const extraImages = editImagesText
      ? editImagesText.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const allImages = [editImage.trim(), ...extraImages];

    updateProduct(editingProduct.id, {
      title: editTitle.trim(),
      price: finalPrice,
      originalPrice: finalOriginalPrice,
      category: editCategory,
      stock: stockNum,
      image: editImage.trim(),
      images: allImages,
      description: editDescription,
      shortDescription: editShortDescription || undefined,
      brand: editBrand.trim() || undefined,
      sku: editSku.trim() || undefined,
      videoUrl: editVideoUrl.trim() || undefined,
      weight: editWeight.trim() || undefined,
      dimensions: editDimensions.trim() || undefined,
      status: editStatus,
      flashSale: editFlashSale,
      directDistribution: editDirectDistribution
    });

    setEditingProduct(null);
  };

  const handleConfirmOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmingOrder) return;

    // Update the order in StoreContext
    updateOrderStatus(confirmingOrder.id, 'Shipped', deliveryTimeframe);
    showToast(`Order ${confirmingOrder.id} has been successfully shipped!`, 'success');
    setConfirmingOrder(null);
    setCustomNote('');
  };

  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setEditTitle(prod.title);
    setEditPrice(prod.price === prod.originalPrice ? '' : prod.price.toString());
    setEditOriginalPrice(prod.originalPrice.toString());
    setEditCategory(prod.category);
    setEditStock(prod.stock.toString());
    setEditDescription(prod.description);
    setEditImage(prod.image);
    setEditShortDescription(prod.shortDescription || '');
    setEditBrand(prod.brand || '');
    setEditSku(prod.sku || '');
    setEditImagesText(prod.images ? prod.images.filter(img => img !== prod.image).join(', ') : '');
    setEditVideoUrl(prod.videoUrl || '');
    setEditWeight(prod.weight || '');
    setEditDimensions(prod.dimensions || '');
    setEditStatus(prod.status || 'Published');
    setEditFlashSale(!!prod.flashSale);
    setEditDirectDistribution(!!prod.directDistribution);
    setShowAddForm(false);
  };

  if (!isSellerOpen) return null;

  // Compute Metrics
  const totalRevenue = orders.reduce((total, order) => total + order.subtotal, 0);
  const totalOrdersCount = orders.length;
  const totalItemsSold = orders.reduce((total, order) => {
    return total + order.items.reduce((s, i) => s + i.quantity, 0);
  }, 0);
  const averageOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

  // Custom Formatter
  const fmt = (val: number) => formatPrice(val);

  // Image Upload helper converting files to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'add' | 'edit') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file size must be less than 5MB', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (target === 'add') {
        setNewImage(base64String);
        showToast('Primary image uploaded successfully!', 'success');
      } else {
        setEditImage(base64String);
        showToast('Primary image updated successfully!', 'success');
      }
    };
    reader.onerror = () => {
      showToast('Error reading file', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleAdditionalImagesUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'add' | 'edit') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files) as File[];
    let loadedCount = 0;
    const base64Strings: string[] = [];

    showToast(`Processing ${filesArray.length} file(s)...`, 'info');

    filesArray.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        showToast(`File ${file.name} exceeds 5MB and was skipped.`, 'warning');
        loadedCount++;
        if (loadedCount === filesArray.length) {
          if (base64Strings.length > 0) {
            updateAdditionalState(base64Strings, target);
          }
        }
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        base64Strings.push(reader.result as string);
        loadedCount++;
        if (loadedCount === filesArray.length) {
          updateAdditionalState(base64Strings, target);
        }
      };
      reader.onerror = () => {
        loadedCount++;
        if (loadedCount === filesArray.length) {
          updateAdditionalState(base64Strings, target);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const updateAdditionalState = (base64s: string[], target: 'add' | 'edit') => {
    if (target === 'add') {
      const current = newImagesText ? newImagesText.split(',').map(s => s.trim()).filter(Boolean) : [];
      const updated = [...current, ...base64s].join(', ');
      setNewImagesText(updated);
      showToast('Additional image(s) appended!', 'success');
    } else {
      const current = editImagesText ? editImagesText.split(',').map(s => s.trim()).filter(Boolean) : [];
      const updated = [...current, ...base64s].join(', ');
      setEditImagesText(updated);
      showToast('Additional image(s) appended!', 'success');
    }
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const basePriceNum = parseFloat(newOriginalPrice);
    const discountPriceNum = parseFloat(newPrice);
    const stockNum = parseInt(newStock);

    if (!newTitle.trim() || isNaN(basePriceNum) || isNaN(stockNum)) {
      showToast('Please fill in title, price, and stock.', 'warning');
      return;
    }

    const finalPrice = !isNaN(discountPriceNum) && discountPriceNum > 0 ? discountPriceNum : basePriceNum;
    const finalOriginalPrice = basePriceNum;

    // Process additional images text
    const extraImages = newImagesText
      ? newImagesText.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const allImages = [newImage.trim(), ...extraImages];

    addNewProduct({
      title: newTitle.trim(),
      price: finalPrice,
      originalPrice: finalOriginalPrice,
      category: newCategory,
      stock: stockNum,
      image: newImage.trim(),
      images: allImages,
      description: newDescription || 'Premium product sold via Jumia Seller Center.',
      shortDescription: newShortDescription || undefined,
      brand: newBrand.trim() || undefined,
      sku: newSku.trim() || undefined,
      videoUrl: newVideoUrl.trim() || undefined,
      weight: newWeight.trim() || undefined,
      dimensions: newDimensions.trim() || undefined,
      status: newStatus,
      specs: ['Authentic certified standard', 'Warranty included'],
      isExpress: true,
      flashSale: newFlashSale,
      directDistribution: newDirectDistribution
    });

    // Reset Form
    setNewTitle('');
    setNewPrice('');
    setNewOriginalPrice('');
    setNewStock('');
    setNewDescription('');
    setNewImage('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400');
    setNewShortDescription('');
    setNewBrand('');
    setNewSku('');
    setNewImagesText('');
    setNewVideoUrl('');
    setNewWeight('');
    setNewDimensions('');
    setNewStatus('Published');
    setNewFlashSale(false);
    setNewDirectDistribution(false);
    setShowAddForm(false);
  };

  const handleAddCustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || !custEmail.trim() || !custPhone.trim()) {
      showToast('Please fill out all required fields.', 'warning');
      return;
    }
    addCustomer({
      name: custName.trim(),
      email: custEmail.trim().toLowerCase(),
      phone: custPhone.trim(),
      location: custLocation.trim() || 'Lagos',
      isActive: true
    });
    setCustName('');
    setCustEmail('');
    setCustPhone('');
    setCustLocation('');
    setShowAddCust(false);
  };

  const handleAddPromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const percentNum = parseFloat(promoPercent);
    if (!promoTitle.trim() || isNaN(percentNum)) {
      showToast('Please specify a promotion title and a valid percentage.', 'warning');
      return;
    }
    addPromotion({
      title: promoTitle.trim(),
      category: promoCategory,
      discountPercent: percentNum,
      isActive: true,
      startDate: promoStart,
      endDate: promoEnd
    });
    setPromoTitle('');
    setPromoPercent('');
    setShowAddPromo(false);
  };

  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valNum = parseFloat(couponValue);
    const minNum = parseFloat(couponMinOrder) || 0;
    if (!couponCode.trim() || isNaN(valNum)) {
      showToast('Please specify a coupon code and a valid discount value.', 'warning');
      return;
    }
    addCoupon({
      code: couponCode.trim().toUpperCase(),
      type: couponType,
      value: valNum,
      minOrder: minNum,
      isActive: true
    });
    setCouponCode('');
    setCouponValue('');
    setCouponMinOrder('');
    setShowAddCoupon(false);
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rateNum = parseFloat(settingRate);
    const feeNum = parseFloat(settingFee);
    const escrowNum = parseFloat(settingEscrow);
    if (isNaN(rateNum) || isNaN(feeNum) || isNaN(escrowNum)) {
      showToast('Please enter valid numeric parameters.', 'warning');
      return;
    }
    updateStoreSettings({
      storeName: settingStoreName,
      contactEmail: settingEmail,
      contactPhone: settingPhone,
      nairaToUsdRate: rateNum,
      defaultDeliveryFee: feeNum,
      escrowProtectionFee: escrowNum,
      emailjsServiceId: settingEmailjsServiceId,
      emailjsTemplateId: settingEmailjsTemplateId,
      emailjsPublicKey: settingEmailjsPublicKey,
      emailjsEnabled: settingEmailjsEnabled
    });
  };

  // Compute Sales by Category for custom visual Chart
  const categorySales: Record<string, number> = {
    'Grains & Cereals': 0,
    'Fresh Produce & Tubers': 0,
    'Livestock & Poultry': 0,
    'Fertilizers & Agro-Chemicals': 0,
    'Farm Tools & Seeds': 0
  };

  orders.forEach(order => {
    order.items.forEach(item => {
      // Find category in products
      const prod = products.find(p => p.id === item.productId);
      const cat = prod ? prod.category : 'Grains & Cereals';
      if (categorySales[cat] !== undefined) {
        categorySales[cat] += item.price * item.quantity;
      } else {
        categorySales['Grains & Cereals'] += item.price * item.quantity;
      }
    });
  });

  // Admin/Seller Auth Handlers
  const isSeller = !!currentAdmin;

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdminRegister) {
      if (!adminName.trim() || !adminEmail.trim() || !adminPassword.trim()) {
        showToast('Please enter name, email, and passcode.', 'warning');
        return;
      }
      registerAdmin(adminName, adminEmail, adminPassword);
    } else {
      if (!adminEmail.trim() || !adminPassword.trim()) {
        showToast('Please enter your administrator email and passcode.', 'warning');
        return;
      }
      loginAdmin(adminEmail, adminPassword);
    }
  };

  const triggerDemoAdmin = () => {
    loginAdmin('admin@julia-agro.com', 'admin123');
  };

  // Chart configuration (Custom visual SVG renderer)
  const maxCategorySale = Math.max(...Object.values(categorySales), 10000);

  return (
    <div className="fixed inset-0 z-50 bg-[#f5f5f5] overflow-y-auto flex flex-col font-sans">
      
      {/* Top Header */}
      <div className="bg-[#141414] text-white p-4 sm:p-5 md:px-6 md:py-4 sticky top-0 z-30 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#16A34A] w-full max-w-full overflow-hidden">
        <div className="flex items-start justify-between md:justify-start md:items-center gap-3 w-full md:w-auto">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="bg-[#16A34A] text-white p-1.5 rounded-md shrink-0 mt-0.5 sm:mt-0">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h1 className="text-sm sm:text-base md:text-lg font-black tracking-wider text-white">
                  JULIA AGRO-SELLER CENTER
                </h1>
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5 max-w-lg hidden sm:block">
                Manage real-time catalog, track dynamic inventory alerts & fulfill incoming orders.
              </p>
            </div>
          </div>
          
          {/* Close button on mobile next to brand */}
          <button 
            onClick={() => setIsSellerOpen(false)}
            className="md:hidden text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 p-2 rounded-full cursor-pointer transition-colors focus:outline-none shrink-0"
            aria-label="Close Dashboard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 justify-start md:justify-end w-full md:w-auto mt-1 md:mt-0">
          {isSeller && (
            <button
              onClick={() => logoutAdmin()}
              className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white font-extrabold px-2.5 py-1.5 rounded transition-colors cursor-pointer text-[10px] sm:text-xs uppercase tracking-wide shrink-0 border-none"
              title="Admin Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          )}

          <button 
            onClick={() => setIsSellerOpen(false)}
            className="hidden md:flex text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 p-2 rounded-full cursor-pointer transition-colors focus:outline-none shrink-0"
            aria-label="Close Dashboard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Layout Grid */}
      {!isSeller ? (
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-[#fafafa]">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200/60 max-w-md w-full overflow-hidden animate-fade-in flex flex-col my-8">
            <div className="h-1.5 bg-[#16A34A]" />
            <div className="p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto text-[#16A34A] border border-green-100">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-gray-900 uppercase tracking-wider">
                  {isAdminRegister ? 'Register Seller Profile' : 'Admin & Seller Login'}
                </h3>
                <p className="text-[11px] text-gray-500 leading-normal max-w-xs mx-auto">
                  {isAdminRegister 
                    ? 'Onboard as a verified local distributor, cooperative leader, or logistics inspector.' 
                    : 'Log in to manage fair-trade pricing, track ocean cargo lines, and approve quality audit photos.'}
                </p>
              </div>

              {currentUser && !currentUser.isSeller && (
                <div className="bg-green-50 p-3 rounded border border-green-100 text-[10px] text-green-800 leading-normal">
                  💡 You are currently logged in as a Customer: <strong>{currentUser.email}</strong>. 
                  Please log in with an Admin/Seller account, or register a new Seller profile below to access these tools.
                </div>
              )}

              <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-xs">
                {isAdminRegister && (
                  <div>
                    <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Seller/Cooperative Name</label>
                    <input
                      type="text"
                      required
                      value={adminName}
                      onChange={e => setAdminName(e.target.value)}
                      placeholder="e.g. Northern Grains Cooperative"
                      className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white transition-all"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-gray-600 font-bold mb-1 uppercase tracking-wider">Administrator Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={e => setAdminEmail(e.target.value)}
                      placeholder="e.g. admin@julia-agro.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded pl-10 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white transition-all font-mono"
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
                      value={adminPassword}
                      onChange={e => setAdminPassword(e.target.value)}
                      placeholder="e.g. ••••••••"
                      className="w-full bg-gray-50 border border-gray-200 rounded pl-10 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white transition-all font-mono"
                    />
                    <Lock className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-black text-white font-extrabold py-2.5 rounded shadow transition-all cursor-pointer border-none flex items-center justify-center space-x-2 text-[11px] uppercase tracking-wide"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isAdminRegister ? 'Complete Onboarding' : 'Secure Sign In'}</span>
                </button>
              </form>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider">Demo Sandbox</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button
                type="button"
                onClick={triggerDemoAdmin}
                className="w-full bg-white hover:bg-gray-50 text-[#16A34A] border border-[#16A34A]/40 font-extrabold py-2.5 rounded shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-2 text-[11px] uppercase tracking-wide"
              >
                <span>⚡ Instant Admin Quick-Access</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdminRegister(!isAdminRegister)}
                  className="text-[11px] text-[#16A34A] hover:underline font-bold transition-all bg-transparent border-none cursor-pointer"
                >
                  {isAdminRegister 
                    ? 'Already have an Admin/Seller account? Log In' 
                    : 'Don\'t have an account? Register as a Certified Seller'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:flex-row p-4 sm:p-6 gap-6 overflow-x-hidden">
        
        {/* Left Nav Menu Sidebar */}
        <div className="w-full md:w-56 shrink-0 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-1.5 pb-2.5 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'overview' ? 'bg-[#16A34A] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Sales Overview</span>
          </button>
          
          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'customers' ? 'bg-[#16A34A] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customers</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'products' ? 'bg-[#16A34A] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Products</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all relative whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'orders' ? 'bg-[#16A34A] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Orders</span>
            {orders.filter(o => o.status === 'Pending').length > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {orders.filter(o => o.status === 'Pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('emails')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all relative whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'emails' ? 'bg-[#16A34A] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
            id="btn-admin-mailbox"
          >
            <Mail className="w-4 h-4" />
            <span>Admin Mailbox</span>
            {adminEmails.filter(e => !e.isRead).length > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-amber-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                {adminEmails.filter(e => !e.isRead).length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'inventory' ? 'bg-[#16A34A] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventory</span>
          </button>

          <button
            onClick={() => setActiveTab('discounts')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'discounts' ? 'bg-[#16A34A] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Discounts</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'coupons' ? 'bg-[#16A34A] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>Coupons</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'reports' ? 'bg-[#16A34A] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Reports</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'settings' ? 'bg-[#16A34A] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>

          <div className="hidden md:block my-2 border-t border-gray-200"></div>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'logs' ? 'bg-[#16A34A] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Activity Console</span>
          </button>

          <button
            onClick={() => setActiveTab('audits')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'audits' ? 'bg-[#16A34A] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Photo Audits</span>
            {verifiedPhotos.length > 0 && (
              <span className="bg-[#16A34A] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold ml-1">
                {verifiedPhotos.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab content panel */}
        <div className="flex-1 min-w-0">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* Metrics cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 sm:p-4.5 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-3 sm:space-x-4 min-w-0">
                  <div className="bg-green-50 p-2.5 sm:p-3 rounded-full text-[#16A34A] shrink-0">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">Gross Sales</p>
                    <p className="text-sm sm:text-base md:text-lg font-black text-gray-900 font-mono mt-0.5 truncate" title={fmt(totalRevenue)}>{fmt(totalRevenue)}</p>
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-4.5 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-3 sm:space-x-4 min-w-0">
                  <div className="bg-green-50 p-2.5 sm:p-3 rounded-full text-[#16A34A] shrink-0">
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">Total Orders</p>
                    <p className="text-sm sm:text-base md:text-lg font-black text-gray-900 font-mono mt-0.5 truncate" title={String(totalOrdersCount)}>{totalOrdersCount}</p>
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-4.5 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-3 sm:space-x-4 min-w-0">
                  <div className="bg-green-50 p-2.5 sm:p-3 rounded-full text-[#16A34A] shrink-0">
                    <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">Units Dispensed</p>
                    <p className="text-sm sm:text-base md:text-lg font-black text-gray-900 font-mono mt-0.5 truncate" title={String(totalItemsSold)}>{totalItemsSold}</p>
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-4.5 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-3 sm:space-x-4 min-w-0">
                  <div className="bg-green-50 p-2.5 sm:p-3 rounded-full text-[#16A34A] shrink-0">
                    <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">Average Order</p>
                    <p className="text-sm sm:text-base md:text-lg font-black text-gray-900 font-mono mt-0.5 truncate" title={fmt(averageOrderValue)}>{fmt(averageOrderValue)}</p>
                  </div>
                </div>
              </div>

              {/* Chart Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Sales by Category Custom Bar Chart */}
                <div className="lg:col-span-2 bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-5 pb-2 border-b border-gray-200 flex items-center justify-between">
                    <span>Sales Distribution by Category</span>
                    <span className="text-[10px] text-[#16A34A]">Naira (₦) Volume</span>
                  </h3>

                  <div className="space-y-4">
                    {Object.entries(categorySales).map(([category, value]) => {
                      const barPct = Math.max(3, (value / maxCategorySale) * 100);
                      return (
                        <div key={category} className="space-y-1.5 text-xs">
                          <div className="flex justify-between font-medium">
                            <span className="text-gray-700 font-semibold">{category}</span>
                            <span className="font-bold text-gray-900 font-mono">{fmt(value)}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-[#16A34A] rounded-full transition-all duration-1000"
                              style={{ width: `${barPct}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Stock Warning Box */}
                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
                      Inventory Alerts
                    </h3>
                    
                    <div className="space-y-3 max-h-56 overflow-y-auto">
                      {products.filter(p => p.stock <= 3).length === 0 ? (
                        <div className="text-center py-6 text-gray-400 flex flex-col items-center">
                          <Check className="w-8 h-8 text-green-500 bg-green-50 rounded-full p-1.5 mb-2" />
                          <p className="text-xs font-bold">All stock levels healthy!</p>
                          <p className="text-[10px] text-gray-400">No low stock items currently detected.</p>
                        </div>
                      ) : (
                        products.filter(p => p.stock <= 3).map(p => (
                          <div key={p.id} className="p-2.5 rounded border border-red-100 bg-red-50/50 flex items-start space-x-2 text-xs">
                            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-red-950 truncate">{p.title}</p>
                              <p className="text-[10px] text-red-700 font-medium">
                                {p.stock === 0 ? 'Out of stock!' : `Urgent: only ${p.stock} remaining.`}
                              </p>
                            </div>
                            <button
                              onClick={() => restockProduct(p.id, 10)}
                              className="bg-red-600 hover:bg-red-700 text-white text-[9px] font-bold px-2 py-1 rounded cursor-pointer shrink-0 transition-colors"
                            >
                              Restock +10
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 mt-4 text-[10px] text-gray-400 font-medium leading-relaxed">
                    Live inventory monitoring utilizes state listening. Changes in product counts auto-recompute dashboard values.
                  </div>
                </div>

              </div>
            </div>
          )}
                    {/* PRODUCT MANAGEMENT TAB */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-3 gap-2">
                <div>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Product Catalog Manager</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Create, edit, and delete agricultural produce and items in the live marketplace catalog.</p>
                </div>
                {!showAddForm && !editingProduct && (
                  <button
                    onClick={() => {
                      setShowAddForm(true);
                      setEditingProduct(null);
                    }}
                    className="bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold px-3 py-2 rounded flex items-center space-x-1.5 transition-colors border-none cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Product</span>
                  </button>
                )}
              </div>

              {/* Add Product Form */}
              {showAddForm && (
                <form onSubmit={handleAddProductSubmit} className="bg-green-50/20 p-5 rounded-lg border border-green-100 space-y-4 text-xs animate-fade-in">
                  <h4 className="font-bold text-gray-900 uppercase tracking-wider border-b border-green-100 pb-2">Add New Product</h4>
                  
                  {/* Row 1: Product Name, Category & Brand */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Product Name *</label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        placeholder="e.g. Ogbomosho Cashew Nuts"
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Category *</label>
                      <select
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                      >
                        <option value="Grains & Cereals">Grains & Cereals</option>
                        <option value="Fresh Produce & Tubers">Fresh Produce & Tubers</option>
                        <option value="Livestock & Poultry">Livestock & Poultry</option>
                        <option value="Fertilizers & Agro-Chemicals">Fertilizers & Agro-Chemicals</option>
                        <option value="Farm Tools & Seeds">Farm Tools & Seeds</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Brand (optional)</label>
                      <input
                        type="text"
                        value={newBrand}
                        onChange={e => setNewBrand(e.target.value)}
                        placeholder="e.g. Dangote, Golden Penny"
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  {/* Row 2: Price, Discount Price & Stock */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Price (₦) *</label>
                      <input
                        type="number"
                        required
                        value={newOriginalPrice}
                        onChange={e => setNewOriginalPrice(e.target.value)}
                        placeholder="90000"
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Discount Price (optional) (₦)</label>
                      <input
                        type="number"
                        value={newPrice}
                        onChange={e => setNewPrice(e.target.value)}
                        placeholder="75000"
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Stock Quantity *</label>
                      <input
                        type="number"
                        required
                        value={newStock}
                        onChange={e => setNewStock(e.target.value)}
                        placeholder="20"
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Row 3: SKU, Weight, Dimensions & Status */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">SKU *</label>
                      <input
                        type="text"
                        required
                        value={newSku}
                        onChange={e => setNewSku(e.target.value)}
                        placeholder="e.g. OGB-CSH-01"
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Weight (optional)</label>
                      <input
                        type="text"
                        value={newWeight}
                        onChange={e => setNewWeight(e.target.value)}
                        placeholder="e.g. 50kg bag, 1 tonne"
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Dimensions (optional)</label>
                      <input
                        type="text"
                        value={newDimensions}
                        onChange={e => setNewDimensions(e.target.value)}
                        placeholder="e.g. 60x40x30 cm"
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Status</label>
                      <select
                        value={newStatus}
                        onChange={e => setNewStatus(e.target.value as any)}
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500 font-bold text-gray-700"
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Short Description & Description */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Short Description *</label>
                      <textarea
                        rows={3}
                        required
                        value={newShortDescription}
                        onChange={e => setNewShortDescription(e.target.value)}
                        placeholder="Quick 1-2 sentence highlight of the product..."
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Full Description *</label>
                      <textarea
                        rows={3}
                        required
                        value={newDescription}
                        onChange={e => setNewDescription(e.target.value)}
                        placeholder="Full specs, nutritional values, bulk terms, certificates, etc..."
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                      ></textarea>
                    </div>
                  </div>

                  {/* Row 5: Primary Image, Additional Images & Product Video */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Primary Image *</label>
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          required
                          value={newImage}
                          onChange={e => setNewImage(e.target.value)}
                          placeholder="Image URL or upload below..."
                          className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500 font-mono"
                        />
                        <div className="relative border border-dashed border-gray-300 rounded-md p-2 bg-gray-50 flex items-center justify-center hover:bg-gray-100/70 transition-colors cursor-pointer group">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'add')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="flex items-center space-x-1.5 text-gray-500 pointer-events-none">
                            <Upload className="w-3.5 h-3.5 text-green-600 shrink-0" />
                            <span className="text-[10px] font-bold text-gray-600 group-hover:text-green-700">
                              Upload Image File
                            </span>
                          </div>
                        </div>
                        {newImage && (
                          <div className="flex items-center space-x-2 bg-gray-50 p-1 rounded border border-gray-200">
                            <img 
                              src={newImage} 
                              alt="Preview" 
                              className="w-7 h-7 object-cover rounded border border-gray-300 shrink-0" 
                              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400' }} 
                            />
                            <span className="text-[9px] text-gray-500 truncate flex-1 font-mono">
                              {newImage.startsWith('data:') ? 'Uploaded base64 file' : newImage}
                            </span>
                            <button
                              type="button"
                              onClick={() => setNewImage('')}
                              className="text-red-500 hover:text-red-700 text-[10px] font-extrabold px-1 border-none bg-transparent cursor-pointer"
                            >
                              Clear
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Additional Images</label>
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={newImagesText}
                          onChange={e => setNewImagesText(e.target.value)}
                          placeholder="url1, url2, url3..."
                          className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500 font-mono"
                        />
                        <div className="relative border border-dashed border-gray-300 rounded-md p-2 bg-gray-50 flex items-center justify-center hover:bg-gray-100/70 transition-colors cursor-pointer group">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleAdditionalImagesUpload(e, 'add')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="flex items-center space-x-1.5 text-gray-500 pointer-events-none">
                            <Upload className="w-3.5 h-3.5 text-green-600 shrink-0" />
                            <span className="text-[10px] font-bold text-gray-600 group-hover:text-green-700">
                              Upload Additional File(s)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Product Video URL (optional)</label>
                      <input
                        type="url"
                        value={newVideoUrl}
                        onChange={e => setNewVideoUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Row 6: Promotions / Flags */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-green-50/30 p-2.5 rounded border border-green-100/50">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="newFlashSale"
                        checked={newFlashSale}
                        onChange={e => setNewFlashSale(e.target.checked)}
                        className="rounded border-gray-300 text-[#16A34A] focus:ring-[#16A34A] h-4 w-4"
                      />
                      <label htmlFor="newFlashSale" className="font-bold text-gray-700 cursor-pointer">
                        Flash Sale Product (Show on Home Page Flash Sales)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="newDirectDistribution"
                        checked={newDirectDistribution}
                        onChange={e => setNewDirectDistribution(e.target.checked)}
                        className="rounded border-gray-300 text-[#16A34A] focus:ring-[#16A34A] h-4 w-4"
                      />
                      <label htmlFor="newDirectDistribution" className="font-bold text-gray-700 cursor-pointer">
                        Direct Distribution Product (Show on Home Page Direct Distributor)
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2.5 pt-2 border-t border-green-100">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="border border-gray-300 text-gray-600 font-bold px-4 py-1.5 rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#16A34A] hover:bg-[#15803D] text-white font-bold px-5 py-1.5 rounded border-none cursor-pointer"
                    >
                      Create Product
                    </button>
                  </div>
                </form>
              )}

              {/* Edit Product Form */}
              {editingProduct && (
                <form onSubmit={handleEditProductSubmit} className="bg-green-50/20 p-5 rounded-lg border border-green-100 space-y-4 text-xs animate-fade-in">
                  <h4 className="font-bold text-gray-900 uppercase tracking-wider border-b border-green-100 pb-2">Edit Product: {editingProduct.title}</h4>
                  
                  {/* Row 1: Product Name, Category & Brand */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Product Name *</label>
                      <input
                        type="text"
                        required
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Category *</label>
                      <select
                        value={editCategory}
                        onChange={e => setEditCategory(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                      >
                        <option value="Grains & Cereals">Grains & Cereals</option>
                        <option value="Fresh Produce & Tubers">Fresh Produce & Tubers</option>
                        <option value="Livestock & Poultry">Livestock & Poultry</option>
                        <option value="Fertilizers & Agro-Chemicals">Fertilizers & Agro-Chemicals</option>
                        <option value="Farm Tools & Seeds">Farm Tools & Seeds</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Brand (optional)</label>
                      <input
                        type="text"
                        value={editBrand}
                        onChange={e => setEditBrand(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  {/* Row 2: Price, Discount Price & Stock */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Price (₦) *</label>
                      <input
                        type="number"
                        required
                        value={editOriginalPrice}
                        onChange={e => setEditOriginalPrice(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Discount Price (optional) (₦)</label>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={e => setEditPrice(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Stock Level *</label>
                      <input
                        type="number"
                        required
                        value={editStock}
                        onChange={e => setEditStock(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Row 3: SKU, Weight, Dimensions & Status */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">SKU *</label>
                      <input
                        type="text"
                        required
                        value={editSku}
                        onChange={e => setEditSku(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Weight (optional)</label>
                      <input
                        type="text"
                        value={editWeight}
                        onChange={e => setEditWeight(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Dimensions (optional)</label>
                      <input
                        type="text"
                        value={editDimensions}
                        onChange={e => setEditDimensions(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Status</label>
                      <select
                        value={editStatus}
                        onChange={e => setEditStatus(e.target.value as any)}
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500 font-bold text-gray-700"
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Short Description & Description */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Short Description *</label>
                      <textarea
                        rows={3}
                        required
                        value={editShortDescription}
                        onChange={e => setEditShortDescription(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Full Description *</label>
                      <textarea
                        rows={3}
                        required
                        value={editDescription}
                        onChange={e => setEditDescription(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                      ></textarea>
                    </div>
                  </div>

                  {/* Row 5: Primary Image, Additional Images & Product Video */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Primary Image *</label>
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          required
                          value={editImage}
                          onChange={e => setEditImage(e.target.value)}
                          placeholder="Image URL or upload below..."
                          className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500 font-mono"
                        />
                        <div className="relative border border-dashed border-gray-300 rounded-md p-2 bg-gray-50 flex items-center justify-center hover:bg-gray-100/70 transition-colors cursor-pointer group">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'edit')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="flex items-center space-x-1.5 text-gray-500 pointer-events-none">
                            <Upload className="w-3.5 h-3.5 text-green-600 shrink-0" />
                            <span className="text-[10px] font-bold text-gray-600 group-hover:text-green-700">
                              Upload Image File
                            </span>
                          </div>
                        </div>
                        {editImage && (
                          <div className="flex items-center space-x-2 bg-gray-50 p-1 rounded border border-gray-200">
                            <img 
                              src={editImage} 
                              alt="Preview" 
                              className="w-7 h-7 object-cover rounded border border-gray-300 shrink-0" 
                              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400' }} 
                            />
                            <span className="text-[9px] text-gray-500 truncate flex-1 font-mono">
                              {editImage.startsWith('data:') ? 'Uploaded base64 file' : editImage}
                            </span>
                            <button
                              type="button"
                              onClick={() => setEditImage('')}
                              className="text-red-500 hover:text-red-700 text-[10px] font-extrabold px-1 border-none bg-transparent cursor-pointer"
                            >
                              Clear
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Additional Images</label>
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={editImagesText}
                          onChange={e => setEditImagesText(e.target.value)}
                          placeholder="url1, url2, url3..."
                          className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500 font-mono"
                        />
                        <div className="relative border border-dashed border-gray-300 rounded-md p-2 bg-gray-50 flex items-center justify-center hover:bg-gray-100/70 transition-colors cursor-pointer group">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleAdditionalImagesUpload(e, 'edit')}
                            className="absolute inset-0 z-10 opacity-0 cursor-pointer w-full h-full"
                          />
                          <div className="flex items-center space-x-1.5 text-gray-500 pointer-events-none">
                            <Upload className="w-3.5 h-3.5 text-green-600 shrink-0" />
                            <span className="text-[10px] font-bold text-gray-600 group-hover:text-green-700">
                              Upload Additional File(s)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Product Video URL (optional)</label>
                      <input
                        type="url"
                        value={editVideoUrl}
                        onChange={e => setEditVideoUrl(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Row 6: Promotions / Flags */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-green-50/30 p-2.5 rounded border border-green-100/50">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="editFlashSale"
                        checked={editFlashSale}
                        onChange={e => setEditFlashSale(e.target.checked)}
                        className="rounded border-gray-300 text-[#16A34A] focus:ring-[#16A34A] h-4 w-4"
                      />
                      <label htmlFor="editFlashSale" className="font-bold text-gray-700 cursor-pointer">
                        Flash Sale Product (Show on Home Page Flash Sales)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="editDirectDistribution"
                        checked={editDirectDistribution}
                        onChange={e => setEditDirectDistribution(e.target.checked)}
                        className="rounded border-gray-300 text-[#16A34A] focus:ring-[#16A34A] h-4 w-4"
                      />
                      <label htmlFor="editDirectDistribution" className="font-bold text-gray-700 cursor-pointer">
                        Direct Distribution Product (Show on Home Page Direct Distributor)
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2.5 pt-2 border-t border-green-100">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="border border-gray-300 text-gray-600 font-bold px-4 py-1.5 rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#16A34A] hover:bg-[#15803D] text-white font-bold px-5 py-1.5 rounded border-none cursor-pointer"
                    >
                      Save Updates
                    </button>
                  </div>
                </form>
              )}

              {/* Products Table */}
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 font-bold uppercase border-b border-gray-200">
                      <th className="p-3">Product Info</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Selling Price</th>
                      <th className="p-3">Original Price</th>
                      <th className="p-3 text-center">Stock Level</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-3 flex items-center space-x-2.5">
                          <img src={p.image} alt="" className="w-8 h-8 object-cover rounded border border-gray-200" referrerPolicy="no-referrer" />
                          <div className="min-w-0">
                            <div className="flex items-center space-x-1.5">
                              <span className="font-semibold text-gray-800 block truncate max-w-[200px]">{p.title}</span>
                              {p.status === 'Draft' ? (
                                <span className="bg-gray-100 text-gray-600 font-extrabold px-1 rounded text-[8px] uppercase tracking-wider">Draft</span>
                              ) : (
                                <span className="bg-green-100 text-green-700 font-extrabold px-1 rounded text-[8px] uppercase tracking-wider">Published</span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-gray-400 font-mono mt-0.5">
                              <span>ID: {p.id}</span>
                              {p.sku && <span className="text-gray-500 font-bold">• SKU: {p.sku}</span>}
                              {p.brand && <span className="text-amber-700 font-bold">• {p.brand}</span>}
                              {p.weight && <span className="text-blue-700 font-bold">• {p.weight}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-gray-500 font-medium">{p.category}</td>
                        <td className="p-3 font-bold font-mono text-[#16A34A]">{fmt(p.price)}</td>
                        <td className="p-3 font-mono text-gray-400 line-through">{p.originalPrice ? fmt(p.originalPrice) : fmt(p.price)}</td>
                        <td className="p-3 text-center font-mono">
                          {p.stock === 0 ? (
                            <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded text-[10px] uppercase">Sold Out</span>
                          ) : p.stock <= 3 ? (
                            <span className="bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded text-[10px] animate-pulse">Critical: {p.stock}</span>
                          ) : (
                            <span className="bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded text-[10px]">{p.stock} units</span>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => startEditProduct(p)}
                            className="bg-green-50 hover:bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded transition-colors cursor-pointer border border-green-200/50 inline-flex items-center space-x-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit details</span>
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded transition-colors cursor-pointer border border-red-200/50 inline-flex items-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* INVENTORY TAB */}
          {activeTab === 'inventory' && (
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Inventory Stock Controller</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Audit quantities, trigger escrow physical verifications, and monitor low stock alerts.</p>
              </div>

              {/* Warnings alert panel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-400 font-bold uppercase border-b border-gray-200">
                        <th className="p-3">Produce</th>
                        <th className="p-3">Available / Total Cap</th>
                        <th className="p-3">Stock Health</th>
                        <th className="p-3 text-right">Quick Restock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.map((p) => {
                        let healthBadge = <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase text-[9px]">Healthy</span>;
                        if (p.stock === 0) {
                          healthBadge = <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold uppercase text-[9px]">Sold Out</span>;
                        } else if (p.stock <= 3) {
                          healthBadge = <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold uppercase text-[9px] animate-pulse">Critical</span>;
                        } else if (p.stock <= 10) {
                          healthBadge = <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold uppercase text-[9px]">Low Stock</span>;
                        }

                        return (
                          <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="p-3 flex items-center space-x-2.5">
                              <img src={p.image} alt="" className="w-8 h-8 object-cover rounded border border-gray-200" referrerPolicy="no-referrer" />
                              <span className="font-semibold text-gray-800 line-clamp-1 max-w-[150px]">{p.title}</span>
                            </td>
                            <td className="p-3 font-mono font-bold text-gray-800">
                              <span>{p.stock}</span>
                              <span className="text-gray-400 text-[10px]"> / {p.initialStock} units</span>
                            </td>
                            <td className="p-3">{healthBadge}</td>
                            <td className="p-3 text-right space-x-1 whitespace-nowrap">
                              <button
                                onClick={() => restockProduct(p.id, 10)}
                                className="bg-green-50 hover:bg-green-100 text-[#16A34A] text-[9px] font-bold px-2 py-1 rounded border border-green-200/50 transition-colors cursor-pointer"
                              >
                                Restock +10
                              </button>
                              <button
                                onClick={() => setCameraProduct(p)}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[9px] font-bold px-2 py-1 rounded border border-emerald-200/50 transition-colors cursor-pointer inline-flex items-center space-x-0.5"
                                title="Verification Photo"
                              >
                                <Camera className="w-2.5 h-2.5" />
                                <span>Audit</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Left Mini alerts */}
                <div className="bg-gray-50 border border-gray-200 p-4.5 rounded-lg text-xs space-y-4">
                  <h4 className="font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2 flex items-center justify-between">
                    <span>Critical Alerts</span>
                    <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" />
                  </h4>
                  <div className="space-y-2.5 max-h-72 overflow-y-auto">
                    {products.filter(p => p.stock <= 3).length === 0 ? (
                      <div className="text-center py-6 text-gray-400">
                        <Check className="w-7 h-7 text-green-500 bg-green-100 rounded-full p-1 mx-auto mb-2" />
                        <p className="font-bold">All stock healthy</p>
                      </div>
                    ) : (
                      products.filter(p => p.stock <= 3).map(p => (
                        <div key={p.id} className="p-2 border border-red-100 bg-red-50 rounded flex flex-col space-y-1">
                          <p className="font-bold text-red-950 truncate">{p.title}</p>
                          <p className="text-[10px] text-red-700">{p.stock === 0 ? 'SOLD OUT' : `Low: ${p.stock} left`}</p>
                          <button
                            onClick={() => restockProduct(p.id, 25)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mt-1 cursor-pointer text-[9px]"
                          >
                            Restock +25 Units
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CUSTOMERS MANAGEMENT TAB */}
          {activeTab === 'customers' && (
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-3 gap-2">
                <div>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Customer Registry Manager</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Track customer spends, purchase frequency, account statuses, and register profiles manually.</p>
                </div>
                {!showAddCust && (
                  <button
                    onClick={() => setShowAddCust(true)}
                    className="bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold px-3 py-2 rounded flex items-center space-x-1.5 transition-colors border-none cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Onboard Customer</span>
                  </button>
                )}
              </div>

              {/* Add Customer Form */}
              {showAddCust && (
                <form onSubmit={handleAddCustSubmit} className="bg-gray-50 p-5 rounded-lg border border-gray-200 space-y-4 text-xs animate-fade-in">
                  <h4 className="font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">Manually Onboard Customer</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={custName}
                        onChange={e => setCustName(e.target.value)}
                        placeholder="e.g. Josiah Treasure"
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={custEmail}
                        onChange={e => setCustEmail(e.target.value)}
                        placeholder="e.g. josiah@example.com"
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Phone Number *</label>
                      <input
                        type="text"
                        required
                        value={custPhone}
                        onChange={e => setCustPhone(e.target.value)}
                        placeholder="e.g. +234 803 300 1234"
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Primary State Location</label>
                      <input
                        type="text"
                        value={custLocation}
                        onChange={e => setCustLocation(e.target.value)}
                        placeholder="e.g. Lagos"
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCust(false)}
                      className="border border-gray-300 text-gray-600 font-bold px-4 py-1.5 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#16A34A] hover:bg-[#15803D] text-white font-bold px-4 py-1.5 rounded border-none cursor-pointer"
                    >
                      Onboard Customer
                    </button>
                  </div>
                </form>
              )}

              {/* Filter */}
              <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-xs">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Search Customer:</span>
                <input
                  type="text"
                  placeholder="Filter by name, email or state..."
                  value={custSearch}
                  onChange={e => setCustSearch(e.target.value)}
                  className="bg-white border border-gray-200 rounded px-2 py-1 flex-1 focus:outline-none"
                />
                {custSearch && (
                  <button onClick={() => setCustSearch('')} className="text-gray-400 hover:text-gray-600 font-bold">Clear</button>
                )}
              </div>

              {/* Customer table */}
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 font-bold uppercase border-b border-gray-200">
                      <th className="p-3">Customer Profile</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Location</th>
                      <th className="p-3 font-mono text-right">Spends (₦)</th>
                      <th className="p-3 font-mono text-center">Orders</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {customers
                      .filter(c => 
                        !custSearch ||
                        c.name.toLowerCase().includes(custSearch.toLowerCase()) ||
                        c.email.toLowerCase().includes(custSearch.toLowerCase()) ||
                        c.location.toLowerCase().includes(custSearch.toLowerCase())
                      )
                      .map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-3">
                            <span className="font-bold text-gray-800 block">{c.name}</span>
                            <span className="text-[10px] text-gray-400">Onboarded: {c.joinedAt}</span>
                          </td>
                          <td className="p-3 font-mono">
                            <span className="block text-gray-600">{c.email}</span>
                            <span className="text-gray-400">{c.phone}</span>
                          </td>
                          <td className="p-3 font-medium text-gray-500">{c.location}</td>
                          <td className="p-3 text-right font-bold font-mono text-gray-900">{fmt(c.totalSpent)}</td>
                          <td className="p-3 text-center font-bold font-mono text-gray-500">{c.orderCount}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                              c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {c.isActive ? 'Active' : 'Suspended'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => toggleCustomerStatus(c.id)}
                              className={`text-[9px] font-bold px-2.5 py-1 rounded transition-colors cursor-pointer border ${
                                c.isActive 
                                  ? 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200/50' 
                                  : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200/50'
                              }`}
                            >
                              {c.isActive ? 'Suspend' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DISCOUNTS TAB */}
          {activeTab === 'discounts' && (
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-3 gap-2">
                <div>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Category Discounts Manager</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Manage active promotional discount percentages applied to entire agricultural produce categories.</p>
                </div>
                {!showAddPromo && (
                  <button
                    onClick={() => setShowAddPromo(true)}
                    className="bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold px-3 py-2 rounded flex items-center space-x-1.5 transition-colors border-none cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Category Discount</span>
                  </button>
                )}
              </div>

              {/* Add Promotion Form */}
              {showAddPromo && (
                <form onSubmit={handleAddPromoSubmit} className="bg-gray-50 p-5 rounded-lg border border-gray-200 space-y-4 text-xs animate-fade-in">
                  <h4 className="font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">Create Category Promotion Rule</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Promotion Title *</label>
                      <input
                        type="text"
                        required
                        value={promoTitle}
                        onChange={e => setPromoTitle(e.target.value)}
                        placeholder="e.g. Rainy Season Special Fertilizer Slash"
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Target Category *</label>
                      <select
                        value={promoCategory}
                        onChange={e => setPromoCategory(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none"
                      >
                        <option value="All Categories">All Categories</option>
                        <option value="Grains & Cereals">Grains & Cereals</option>
                        <option value="Fresh Produce & Tubers">Fresh Produce & Tubers</option>
                        <option value="Livestock & Poultry">Livestock & Poultry</option>
                        <option value="Fertilizers & Agro-Chemicals">Fertilizers & Agro-Chemicals</option>
                        <option value="Farm Tools & Seeds">Farm Tools & Seeds</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Percent Off (%) *</label>
                      <input
                        type="number"
                        required
                        max={100}
                        min={1}
                        value={promoPercent}
                        onChange={e => setPromoPercent(e.target.value)}
                        placeholder="15"
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Start Date</label>
                      <input
                        type="date"
                        required
                        value={promoStart}
                        onChange={e => setPromoStart(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Expiry Date</label>
                      <input
                        type="date"
                        required
                        value={promoEnd}
                        onChange={e => setPromoEnd(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddPromo(false)}
                      className="border border-gray-300 text-gray-600 font-bold px-4 py-1.5 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#16A34A] hover:bg-[#15803D] text-white font-bold px-4 py-1.5 rounded border-none cursor-pointer"
                    >
                      Apply Promotion
                    </button>
                  </div>
                </form>
              )}

              {/* Promotions list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {promotions.map((p) => (
                  <div key={p.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-sm text-gray-900 leading-tight">{p.title}</h4>
                          <span className="inline-block bg-green-50 text-[#16A34A] px-2 py-0.5 rounded font-bold text-[9px] mt-1 uppercase border border-green-200/40">
                            {p.category}
                          </span>
                        </div>
                        <span className="text-lg font-black text-[#16A34A] font-mono shrink-0">-{p.discountPercent}%</span>
                      </div>

                      <div className="text-[10px] text-gray-400 font-mono mt-3 space-y-0.5">
                        <p>📅 Active: {p.startDate} to {p.endDate}</p>
                        <p>🔒 Level: Dynamic Automated Calculation</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200/60 pt-3 flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                        p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {p.isActive ? '● Live on Store' : 'Paused'}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => togglePromotion(p.id)}
                          className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-[10px] px-2 py-1 rounded font-bold cursor-pointer"
                        >
                          {p.isActive ? 'Pause' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deletePromotion(p.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/40 text-[10px] px-2 py-1 rounded font-bold cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COUPONS TAB */}
          {activeTab === 'coupons' && (
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-3 gap-2">
                <div>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Promotional Checkout Coupons</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Define promo codes for customers to apply at their secure payment checkout steps.</p>
                </div>
                {!showAddCoupon && (
                  <button
                    onClick={() => setShowAddCoupon(true)}
                    className="bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold px-3 py-2 rounded flex items-center space-x-1.5 transition-colors border-none cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Coupon Code</span>
                  </button>
                )}
              </div>

              {/* Add Coupon Form */}
              {showAddCoupon && (
                <form onSubmit={handleAddCouponSubmit} className="bg-gray-50 p-5 rounded-lg border border-gray-200 space-y-4 text-xs animate-fade-in">
                  <h4 className="font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">Create Coupon Code Rule</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Coupon Promo Code *</label>
                      <input
                        type="text"
                        required
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value)}
                        placeholder="e.g. JULIAAGRO15"
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none uppercase font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Discount Type</label>
                      <select
                        value={couponType}
                        onChange={e => setCouponType(e.target.value as any)}
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none font-bold text-gray-700"
                      >
                        <option value="percentage">Percentage Off (%)</option>
                        <option value="flat">Flat Naira Deduction (₦)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Discount Value *</label>
                      <input
                        type="number"
                        required
                        value={couponValue}
                        onChange={e => setCouponValue(e.target.value)}
                        placeholder={couponType === 'percentage' ? '15' : '5000'}
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Minimum Order Requirement (₦)</label>
                      <input
                        type="number"
                        value={couponMinOrder}
                        onChange={e => setCouponMinOrder(e.target.value)}
                        placeholder="10000"
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCoupon(false)}
                      className="border border-gray-300 text-gray-600 font-bold px-4 py-1.5 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#16A34A] hover:bg-[#15803D] text-white font-bold px-4 py-1.5 rounded border-none cursor-pointer"
                    >
                      Save Coupon Rule
                    </button>
                  </div>
                </form>
              )}

              {/* Coupons list */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {coupons.map((c) => (
                  <div key={c.id} className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50/20 relative flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <p className="font-mono font-black text-sm tracking-wider text-gray-900 bg-gray-100 py-1 px-2.5 rounded inline-block">
                        {c.code}
                      </p>
                      <h4 className="font-extrabold text-xs text-[#16A34A] uppercase tracking-wide">
                        {c.type === 'percentage' ? `${c.value}% discount` : `${fmt(c.value)} cash off`}
                      </h4>
                      <p className="text-[10px] text-gray-400">
                        Min Order: <span className="font-semibold text-gray-700 font-mono">{fmt(c.minOrder)}</span>
                      </p>
                    </div>

                    <div className="border-t border-gray-200/60 pt-3 flex flex-col space-y-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-400">Usage: <strong className="text-gray-700 font-mono">{c.usageCount} times</strong></span>
                        <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                          c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {c.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex justify-between space-x-2 pt-1">
                        <button
                          onClick={() => toggleCoupon(c.id)}
                          className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-[10px] font-bold py-1 px-2 rounded-md transition-colors flex-1 cursor-pointer"
                        >
                          {c.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deleteCoupon(c.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/30 text-[10px] font-bold py-1 px-2 rounded-md transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === 'reports' && (
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm space-y-6 animate-fade-in">
              <div className="border-b border-gray-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-1">
                    <span>Agricultural Analytics & Reporting</span>
                    <span className="text-[9px] bg-green-100 text-[#16A34A] px-1.5 py-0.5 rounded font-mono font-bold">PDF/CSV GEN</span>
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Generate, filter, and export ledger logs for tax auditing and crop season performance evaluations.</p>
                </div>
              </div>

              {/* Filtering Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs">
                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[9px]">Report Scope</label>
                  <select
                    value={reportType}
                    onChange={e => setReportType(e.target.value as any)}
                    className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none font-bold"
                  >
                    <option value="sales">Gross Sales & Revenue</option>
                    <option value="customers">Customer Acquisition & Spends</option>
                    <option value="inventory">Inventory Valuations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[9px]">Category Scope</label>
                  <select
                    value={reportCategory}
                    onChange={e => setReportCategory(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    <option value="Grains & Cereals">Grains & Cereals</option>
                    <option value="Fresh Produce & Tubers">Fresh Produce & Tubers</option>
                    <option value="Livestock & Poultry">Livestock & Poultry</option>
                    <option value="Fertilizers & Agro-Chemicals">Fertilizers & Agro-Chemicals</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[9px]">Destination State</label>
                  <select
                    value={reportState}
                    onChange={e => setReportState(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="All">All States</option>
                    <option value="Lagos">Lagos State</option>
                    <option value="Abuja">F.C.T. Abuja</option>
                    <option value="Kano">Kano State</option>
                    <option value="Rivers">Rivers State</option>
                  </select>
                </div>
              </div>

              {/* Simulated generated results */}
              <div className="space-y-4">
                <div className="bg-gray-950 text-[#3bb75e] p-4.5 rounded-lg border border-gray-900 font-mono text-xs space-y-3.5 shadow-inner">
                  <div className="flex justify-between items-center border-b border-gray-900 pb-2">
                    <p className="text-gray-500 font-bold">// GENERATING COMPILED SYSTEM REPORT LEDGER</p>
                    <span className="text-cyan-400 text-[10px]">TIME: {new Date().toLocaleDateString()}</span>
                  </div>
                  
                  {reportType === 'sales' && (
                    <div className="space-y-2">
                      <p className="text-white font-bold uppercase">📊 GROSS SALES LEDGER REPORT SUMMARY</p>
                      <p>--------------------------------------------------</p>
                      <p>Filter category: {reportCategory}</p>
                      <p>Filter destination: {reportState}</p>
                      <p>Accumulated gross transaction volume: <span className="font-extrabold text-white text-sm">{fmt(totalRevenue)}</span></p>
                      <p>Total processed escrow orders: {totalOrdersCount} successful</p>
                      <p>Average transaction payout size: {fmt(averageOrderValue)}</p>
                      <p>Phytosanitary inspection compliance: 100% certified</p>
                    </div>
                  )}

                  {reportType === 'customers' && (
                    <div className="space-y-2">
                      <p className="text-white font-bold uppercase">👥 CUSTOMER ACQUISITION STATISTICS</p>
                      <p>--------------------------------------------------</p>
                      <p>Total verified active customer profiles: {customers.length}</p>
                      <p>Top paying buyer account: {customers.reduce((top, c) => c.totalSpent > top.totalSpent ? c : top, customers[0])?.name || 'None'}</p>
                      <p>Combined network user capital spends: <span className="font-extrabold text-white text-sm">{fmt(customers.reduce((tot, c) => tot + c.totalSpent, 0))}</span></p>
                      <p>Average transaction size per customer account: {customers.length ? fmt(customers.reduce((tot, c) => tot + c.totalSpent, 0) / customers.length) : '₦0'}</p>
                    </div>
                  )}

                  {reportType === 'inventory' && (
                    <div className="space-y-2">
                      <p className="text-white font-bold uppercase">📦 ACTIVE INVENTORY VALUATIONS</p>
                      <p>--------------------------------------------------</p>
                      <p>Catalog items monitored: {products.length}</p>
                      <p>Aggregated units in storage: {products.reduce((t, p) => t + p.stock, 0)} units</p>
                      <p>Total asset book value: <span className="font-extrabold text-white text-sm">{fmt(products.reduce((val, p) => val + (p.price * p.stock), 0))}</span></p>
                      <p>Out of stock Critical items detected: {products.filter(p => p.stock === 0).length} items</p>
                    </div>
                  )}
                </div>

                {/* Export Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      showToast(`Mock PDF document created. Saved as "julia_agro_report_${reportType}.pdf"`, 'success');
                    }}
                    className="bg-[#16A34A] hover:bg-[#15803D] text-white font-bold py-2.5 px-4 rounded text-xs flex items-center justify-center space-x-2 border-none cursor-pointer flex-1"
                  >
                    <Download className="w-4 h-4 text-white" />
                    <span>Download Official PDF Ledger</span>
                  </button>
                  <button
                    onClick={() => {
                      showToast(`Mock CSV sheet compiled. Exported as "payouts_ledger_${Date.now()}.csv"`, 'success');
                    }}
                    className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold py-2.5 px-4 rounded text-xs flex items-center justify-center space-x-2 cursor-pointer flex-1"
                  >
                    <Download className="w-4 h-4 text-gray-400" />
                    <span>Export Row Data CSV</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STORE SETTINGS TAB */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSettingsSubmit} className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Julia Agro Store Parameters</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Control domestic and global delivery boundaries, USD rates, and escrow protection fees.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                {/* Section A */}
                <div className="space-y-4">
                  <h4 className="font-extrabold text-gray-900 uppercase text-[10px] tracking-wider border-b border-gray-100 pb-1.5 text-gray-500">Contact Details</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Store Name *</label>
                      <input
                        type="text"
                        required
                        value={settingStoreName}
                        onChange={e => setSettingStoreName(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Support Email Address *</label>
                      <input
                        type="email"
                        required
                        value={settingEmail}
                        onChange={e => setSettingEmail(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Support Phone Hotlines *</label>
                      <input
                        type="text"
                        required
                        value={settingPhone}
                        onChange={e => setSettingPhone(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Section B */}
                <div className="space-y-4">
                  <h4 className="font-extrabold text-gray-900 uppercase text-[10px] tracking-wider border-b border-gray-100 pb-1.5 text-gray-500">Financial Gateways</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Naira exchange rate per USD (₦ / $1) *</label>
                      <input
                        type="number"
                        required
                        value={settingRate}
                        onChange={e => setSettingRate(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Standard Domestic Delivery Fee (₦) *</label>
                      <input
                        type="number"
                        required
                        value={settingFee}
                        onChange={e => setSettingFee(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Standard Escrow Protection Fee (₦) *</label>
                      <input
                        type="number"
                        required
                        value={settingEscrow}
                        onChange={e => setSettingEscrow(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION C: GMAIL INTEGRATION via EmailJS */}
              <div className="border-t border-gray-150 pt-5 space-y-4 text-xs">
                <div>
                  <h4 className="font-extrabold text-gray-900 uppercase text-[10px] tracking-wider text-gray-500 flex items-center space-x-1.5">
                    <span className="text-[#16A34A]">✉️</span>
                    <span>Gmail Integration (via EmailJS)</span>
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Forward escrow alerts and payment notifications directly to your Gmail account (<strong className="text-gray-700">josiahtreasure1424@gmail.com</strong>).
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-800 block text-[11px]">Enable Live Gmail Alerts</span>
                      <span className="text-[9px] text-gray-400">Trigger real emails for online checkouts and bank transfer notices.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingEmailjsEnabled}
                        onChange={e => setSettingEmailjsEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16A34A]"></div>
                    </label>
                  </div>

                  {settingEmailjsEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-200 pt-4 animate-fade-in">
                      <div>
                        <label className="block text-gray-600 font-bold mb-1">EmailJS Service ID *</label>
                        <input
                          type="text"
                          required={settingEmailjsEnabled}
                          value={settingEmailjsServiceId}
                          onChange={e => setSettingEmailjsServiceId(e.target.value)}
                          placeholder="e.g. service_xxxxxx"
                          className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 font-bold mb-1">EmailJS Template ID *</label>
                        <input
                          type="text"
                          required={settingEmailjsEnabled}
                          value={settingEmailjsTemplateId}
                          onChange={e => setSettingEmailjsTemplateId(e.target.value)}
                          placeholder="e.g. template_xxxxxx"
                          className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 font-bold mb-1">EmailJS Public Key *</label>
                        <input
                          type="text"
                          required={settingEmailjsEnabled}
                          value={settingEmailjsPublicKey}
                          onChange={e => setSettingEmailjsPublicKey(e.target.value)}
                          placeholder="e.g. public_xxxxxx"
                          className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  )}

                  <div className="bg-amber-50/50 border border-amber-100 rounded-md p-3 text-[10px] text-amber-800 space-y-1">
                    <p className="font-extrabold uppercase tracking-wide text-[9px] flex items-center space-x-1">
                      <span>💡</span>
                      <span>How to set up free Gmail delivery (Option B):</span>
                    </p>
                    <ol className="list-decimal pl-4 space-y-1 text-amber-700/95 leading-relaxed">
                      <li>Go to <a href="https://www.emailjs.com" target="_blank" rel="noreferrer" className="underline font-bold hover:text-amber-900">EmailJS.com</a> and sign up for a free account.</li>
                      <li>In the EmailJS dashboard, add a <strong>Gmail</strong> service under "Email Services" and authorize your admin Gmail. Copy your <strong className="font-mono text-[9px]">Service ID</strong>.</li>
                      <li>Create an email template under "Email Templates". In your template content, you can use placeholders like: <code className="bg-amber-100 px-1 py-0.2 rounded font-mono text-[9px]">{"{{subject}}"}</code> and <code className="bg-amber-100 px-1 py-0.2 rounded font-mono text-[9px]">{"{{message}}"}</code>. Copy your <strong className="font-mono text-[9px]">Template ID</strong>.</li>
                      <li>Go to "Account" then "Public Key" to retrieve your API <strong className="font-mono text-[9px]">Public Key</strong>.</li>
                      <li>Paste the keys above, check "Enable Live Gmail Alerts", and click <strong>Update parameters</strong>. Your escrow notifications will land instantly in your Gmail inbox!</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setSettingStoreName(storeSettings?.storeName || 'JULIA AGRO');
                    setSettingEmail(storeSettings?.contactEmail || 'support@julia-agro.com');
                    setSettingPhone(storeSettings?.contactPhone || '+234 803 300 1234');
                    setSettingRate(storeSettings?.nairaToUsdRate?.toString() || '1500');
                    setSettingFee(storeSettings?.defaultDeliveryFee?.toString() || '1500');
                    setSettingEscrow(storeSettings?.escrowProtectionFee?.toString() || '500');
                    setSettingEmailjsServiceId(storeSettings?.emailjsServiceId || '');
                    setSettingEmailjsTemplateId(storeSettings?.emailjsTemplateId || '');
                    setSettingEmailjsPublicKey(storeSettings?.emailjsPublicKey || '');
                    setSettingEmailjsEnabled(storeSettings?.emailjsEnabled || false);
                    showToast('Reset modifications.', 'info');
                  }}
                  className="border border-gray-300 text-gray-600 font-bold px-4 py-1.5 rounded text-xs transition-colors cursor-pointer"
                >
                  Reset Settings
                </button>
                <button
                  type="submit"
                  className="bg-[#16A34A] hover:bg-[#15803D] text-white font-bold px-4 py-1.5 rounded text-xs transition-colors border-none cursor-pointer flex items-center space-x-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  <span>Update parameters</span>
                </button>
              </div>
            </form>
          )}

          {/* LIVE ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Incoming Orders Queue</h3>
                {orders.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to clear all orders? This cannot be undone.")) {
                        clearAllOrders();
                      }
                    }}
                    className="text-[10px] text-red-600 hover:text-red-800 font-bold uppercase tracking-wider bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded transition-colors cursor-pointer border border-red-200/50"
                  >
                    Clear All Orders
                  </button>
                )}
              </div>
              
              {orders.length === 0 ? (
                <div className="text-center py-10 text-gray-400 flex flex-col items-center">
                  <ShoppingCart className="w-10 h-10 text-gray-300 mb-2" />
                  <p className="text-xs font-bold">No orders processed yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => {
                    return (
                      <div key={ord.id} className="border border-gray-200 rounded-lg p-4 text-xs space-y-3 bg-gray-50/30">
                        {/* Title details */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-200 pb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-black text-gray-900 text-sm font-mono">{ord.id}</span>
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-400 font-mono text-[10px]">
                              {new Date(ord.createdAt).toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center space-x-3">
                            {/* Payment Status Action or Badge */}
                            {ord.paymentStatus === 'Awaiting Verification' ? (
                              <button
                                type="button"
                                onClick={() => confirmOrderPayment(ord.id)}
                                className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded flex items-center space-x-1 uppercase tracking-wide cursor-pointer shadow-sm active:scale-[0.98] transition-transform border-none"
                                id={`btn-confirm-payment-${ord.id}`}
                              >
                                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>Confirm Payment</span>
                              </button>
                            ) : ord.paymentStatus === 'Paid' ? (
                              <span className="bg-green-100 text-[#16A34A] font-extrabold text-[9px] px-2.5 py-1.5 rounded uppercase tracking-wide border border-green-200 flex items-center space-x-1">
                                <CheckCircle className="w-3.5 h-3.5 shrink-0 text-[#16A34A]" />
                                <span>Payment Completed</span>
                              </span>
                            ) : (
                              <span className="bg-gray-100 text-gray-500 font-extrabold text-[9px] px-2.5 py-1.5 rounded uppercase tracking-wide border border-gray-200 flex items-center space-x-1">
                                <span>Unpaid</span>
                              </span>
                            )}

                            {ord.status === 'Pending' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setConfirmingOrder(ord);
                                }}
                                className="bg-[#16A34A] hover:bg-green-700 text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded flex items-center space-x-1 uppercase tracking-wide cursor-pointer shadow-sm active:scale-[0.98] transition-transform border-none"
                                id={`btn-confirm-${ord.id}`}
                              >
                                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>Confirm Order</span>
                              </button>
                            )}
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-400 font-medium">Status:</span>
                              <select
                                value={ord.status}
                                onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                                className="bg-white border border-gray-200 rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold text-gray-700 text-[10px]"
                              >
                                <option value="Pending">🕒 Pending</option>
                                <option value="Shipped">🚚 Dispatched</option>
                                <option value="Delivered">✅ Delivered</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Customer & Item grids */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Items Mini Scroll */}
                          <div className="md:col-span-2 space-y-2">
                            <p className="font-bold text-gray-400 text-[10px] uppercase">Purchased Items</p>
                            {ord.items.map((it, i) => (
                              <div key={i} className="flex items-center space-x-2 bg-white rounded border border-gray-200 p-2">
                                <img src={it.image} alt="" className="w-8 h-8 object-cover rounded border border-gray-200" referrerPolicy="no-referrer" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-800 truncate">{it.title}</p>
                                  <p className="text-[10px] text-gray-400 font-mono">{it.quantity} x {fmt(it.price)}</p>
                                </div>
                              </div>
                            ))}
                            
                            {ord.deliveryTime && (
                              <div className="bg-green-50 border-l-4 border-[#16A34A] p-2.5 rounded text-green-800 text-[11px] leading-relaxed mt-2 shadow-sm">
                                <p className="font-black flex items-center space-x-1.5 uppercase tracking-wide text-[10px] text-green-800">
                                  <CheckCircle className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                                  <span>Order Confirmed & Live Dispatches Triggered</span>
                                </p>
                                <div className="mt-1 space-y-0.5 text-gray-600 font-medium text-[10px]">
                                  <p>• Estimated Delivery Frame: <span className="font-black text-green-700">{ord.deliveryTime}</span></p>
                                  {ord.confirmedAt && (
                                    <p>• Dispatched Date: <span className="font-mono text-[10px]">{new Date(ord.confirmedAt).toLocaleString()}</span></p>
                                  )}
                                  <p className="text-[9px] text-green-700 italic font-bold">✓ Direct WhatsApp & email status notification dispatched to recipient credentials.</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Customer info */}
                          <div className="bg-white border border-gray-200 rounded p-3 text-[11px] leading-relaxed flex flex-col justify-between">
                            <div>
                              <p className="font-bold text-gray-400 text-[10px] uppercase mb-1">Shipping Details</p>
                              <p className="font-bold text-gray-800">{ord.customerName}</p>
                              <p className="text-gray-500 font-mono font-medium">{ord.phone}</p>
                              {ord.customerEmail && (
                                <p className="text-gray-400 font-mono text-[9px] truncate" title={ord.customerEmail}>
                                  📧 {ord.customerEmail}
                                </p>
                              )}
                              <p className="text-gray-500 mt-1">{ord.address}</p>
                              <p className="text-gray-700 font-bold flex items-center space-x-1">
                                <span>{ord.state}</span>
                                {ord.isInternational && (
                                  <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black px-1.5 py-0.5 rounded uppercase shrink-0">
                                    EXPORT 🌍
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="text-[10px] text-gray-400 mt-2 border-t pt-1.5 flex flex-col space-y-1">
                              <p>Paid via: <span className="font-semibold text-gray-700">{ord.paymentMethod}</span></p>
                              <p>Payment Status: <span className={`font-bold uppercase ${ord.paymentStatus === 'Paid' ? 'text-[#16A34A]' : ord.paymentStatus === 'Awaiting Verification' ? 'text-amber-500 animate-pulse' : 'text-gray-500'}`}>{ord.paymentStatus || 'Unpaid'}</span></p>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Calculations */}
                        <div className="flex justify-between items-center bg-white rounded border border-gray-200 p-2 text-[10px] font-bold font-mono">
                          <span className="text-gray-400">Total processed (including delivery):</span>
                          <span className="text-sm font-black text-gray-950">{fmt(ord.total)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* ADMIN MAILBOX & VERIFICATIONS TAB */}
          {activeTab === 'emails' && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden animate-fade-in flex flex-col h-[650px]" id="admin-mailbox-view">
              {/* Mailbox Header */}
              <div className="bg-gray-50 border-b border-gray-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-[#16A34A]" />
                    <span>Admin Secure Inbox</span>
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Live escrow payment notices, customer transfer confirmations, and transaction alerts.
                  </p>
                </div>
                <div className="flex items-center space-x-2 self-stretch sm:self-auto">
                  <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded font-bold uppercase tracking-wider">
                    {adminEmails.filter(e => !e.isRead).length} Unread
                  </span>
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded font-bold font-mono">
                    Total: {adminEmails.length}
                  </span>
                </div>
              </div>

              {/* Mailbox Body Split-Screen */}
              <div className="flex flex-1 overflow-hidden min-h-0 divide-x divide-gray-200">
                {/* Left Side: Email List */}
                <div className="w-full md:w-5/12 overflow-y-auto flex flex-col divide-y divide-gray-100 scrollbar-thin">
                  {adminEmails.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 my-auto flex flex-col items-center">
                      <Mail className="w-10 h-10 text-gray-300 mb-2" />
                      <p className="text-xs font-bold">Mailbox is empty.</p>
                      <p className="text-[10px] text-gray-400 mt-1">No payment verifications or alerts received yet.</p>
                    </div>
                  ) : (
                    adminEmails.map((email) => {
                      const isSelected = selectedEmailId === email.id || (!selectedEmailId && adminEmails[0]?.id === email.id);
                      return (
                        <div
                          key={email.id}
                          onClick={() => {
                            setSelectedEmailId(email.id);
                            markEmailAsRead(email.id);
                          }}
                          className={`p-3.5 text-left cursor-pointer transition-all hover:bg-gray-50 flex flex-col space-y-1 relative ${
                            isSelected ? 'bg-green-50/40 border-l-4 border-l-[#16A34A] pl-2.5' : 'border-l-4 border-l-transparent'
                          }`}
                        >
                          {/* Unread indicator dot */}
                          {!email.isRead && (
                            <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-50" />
                          )}

                          <div className="flex justify-between items-start pr-4">
                            <span className="text-[11px] font-black text-gray-800 tracking-tight truncate max-w-[150px]">
                              {email.sender.split('@')[0].toUpperCase()}
                            </span>
                            <span className="text-[9px] font-medium text-gray-400 whitespace-nowrap font-mono">
                              {new Date(email.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <h4 className={`text-xs tracking-tight truncate pr-4 ${!email.isRead ? 'font-extrabold text-gray-900' : 'text-gray-700'}`}>
                            {email.subject}
                          </h4>

                          <p className="text-[10px] text-gray-400 line-clamp-2 pr-2">
                            {email.body}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Right Side: Email Content Details */}
                <div className="hidden md:flex md:w-7/12 overflow-y-auto flex-col bg-gray-50/40 p-5 scrollbar-thin">
                  {(() => {
                    const activeEmail = adminEmails.find(e => e.id === (selectedEmailId || adminEmails[0]?.id));
                    if (!activeEmail) {
                      return (
                        <div className="m-auto text-center text-gray-400 flex flex-col items-center p-6">
                          <Mail className="w-12 h-12 text-gray-200 mb-3" />
                          <h4 className="text-xs font-bold text-gray-700">No Email Selected</h4>
                          <p className="text-[10px] text-gray-400 mt-1">Select an email from the list on the left to read and verify payments.</p>
                        </div>
                      );
                    }

                    // Attempt to parse Order ID
                    const orderIdMatch = activeEmail.subject.match(/ORD-\d{4}/) || activeEmail.body.match(/ORD-\d{4}/);
                    const associatedOrderId = orderIdMatch ? orderIdMatch[0] : null;
                    const orderObj = associatedOrderId ? orders.find(o => o.id === associatedOrderId) : null;

                    return (
                      <div className="flex flex-col space-y-4 text-left">
                        {/* Email Header Panel */}
                        <div className="bg-white rounded-lg p-4 border border-gray-150 shadow-sm space-y-3">
                          <div className="flex justify-between items-start gap-2">
                            <h2 className="text-sm font-black text-gray-900 leading-tight">
                              {activeEmail.subject}
                            </h2>
                            <button
                              type="button"
                              onClick={() => {
                                deleteEmail(activeEmail.id);
                                setSelectedEmailId(null);
                              }}
                              className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-gray-100 transition-all cursor-pointer border-none animate-fade-in"
                              title="Delete email"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] border-t border-gray-100 pt-3 text-gray-500">
                            <div>
                              <span className="font-bold">From:</span> {activeEmail.sender}
                            </div>
                            <div className="sm:text-right">
                              <span className="font-bold">Sent:</span> {new Date(activeEmail.createdAt).toLocaleString()}
                            </div>
                            <div>
                              <span className="font-bold">To:</span> {activeEmail.recipient}
                            </div>
                            <div className="sm:text-right">
                              <span className="font-bold">Status:</span> <span className={activeEmail.isRead ? 'text-gray-400 font-bold' : 'text-amber-600 font-bold'}>{activeEmail.isRead ? 'Read' : 'Unread'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Email Body Content */}
                        <div className="bg-white rounded-lg p-5 border border-gray-150 shadow-sm text-xs text-gray-700 whitespace-pre-wrap leading-relaxed font-sans min-h-[180px]">
                          {activeEmail.body}
                        </div>

                        {/* Associated Order Action Panel */}
                        {orderObj && (
                          <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 rounded-lg p-4 border border-amber-150 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-black text-amber-800 uppercase bg-amber-100 px-2 py-0.5 rounded tracking-wide">
                                  Action Needed
                                </span>
                                <span className="text-xs font-extrabold text-gray-950 font-mono">
                                  Order #{orderObj.id}
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-600">
                                Customer: <span className="font-extrabold text-gray-800">{orderObj.customerName}</span> (Total: <span className="font-bold text-gray-900">{formatPrice(orderObj.total)}</span>)
                              </p>
                              <p className="text-[9px] text-gray-500">
                                Payment Method: <span className="font-bold text-[#16A34A]">{orderObj.paymentMethod}</span>
                              </p>
                            </div>

                            <div className="shrink-0 self-stretch sm:self-auto">
                              {orderObj.paymentStatus === 'Awaiting Verification' ? (
                                <button
                                  type="button"
                                  onClick={() => confirmOrderPayment(orderObj.id)}
                                  className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-black text-xs py-2 px-3.5 rounded shadow-md active:scale-95 transition-all cursor-pointer border-none flex items-center justify-center space-x-1.5"
                                  id={`mailbox-verify-${orderObj.id}`}
                                >
                                  <CheckCircle className="w-4 h-4 text-white" />
                                  <span>Verify & Confirm Payment</span>
                                </button>
                              ) : (
                                <div className="flex items-center space-x-1.5 text-xs text-[#16A34A] font-extrabold bg-green-50 px-3 py-2 rounded border border-green-150">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Payment Confirmed</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* ACTIVITY CONSOLE TAB */}
          {activeTab === 'logs' && (
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm space-y-4 animate-fade-in">
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-2">
                  <span>Activity System Console Log</span>
                  <span className="text-[9px] bg-[#16A34A] text-white px-1.5 py-0.5 rounded font-mono font-bold">SYS-STREAM</span>
                </h3>
                
                {/* Simulation button removed */}
              </div>

              {/* Logger console */}
              <div className="bg-gray-950 text-[#3bb75e] font-mono text-xs p-4 rounded-lg h-96 overflow-y-auto space-y-2 border border-gray-900 shadow-inner scrollbar-thin">
                <p className="text-gray-500 font-bold text-[10px] border-b border-gray-900 pb-1.5">// INITIATING REAL-TIME SYSTEM TRACE CONTROLLER</p>
                {logs.map((log) => {
                  let color = 'text-[#3bb75e]';
                  if (log.type === 'restock') color = 'text-yellow-400';
                  if (log.type === 'system') color = 'text-cyan-400';
                  
                  return (
                    <div key={log.id} className="flex items-start space-x-2 leading-tight py-0.5 hover:bg-gray-900/40 rounded px-1">
                      <span className="text-gray-600 shrink-0 select-none">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                      <span className={color}>{log.message}</span>
                    </div>
                  );
                })}
              </div>

              <div className="text-[10px] text-gray-400 font-medium leading-relaxed">
                Console monitors simulated buys by mock users, direct checkouts by you, and restocks, keeping record of decrementing indices in real-time.
              </div>
            </div>
          )}

          {/* STOCK VERIFICATION AUDITS TAB */}
          {activeTab === 'audits' && (
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm space-y-6 animate-fade-in">
              <div className="border-b border-gray-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <Camera className="w-4 h-4 text-[#16A34A]" />
                    <span>Visual Stock Audits Ledger</span>
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Historical list of photo-verifications taken for export and national logistics escrow.</p>
                </div>
                {verifiedPhotos.length > 0 && (
                  <span className="text-[10px] bg-green-50 text-green-700 px-2.5 py-1 rounded font-bold border border-green-200 mt-2 sm:mt-0">
                    ✓ {verifiedPhotos.length} Stock Audits Logged
                  </span>
                )}
              </div>

              {verifiedPhotos.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  <Camera className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="font-bold text-gray-800 text-sm">No stock photos taken yet</p>
                  <p className="text-[10px] text-gray-400 mt-1 max-w-xs mx-auto">
                    Go to the <span className="font-bold text-[#16A34A] hover:underline cursor-pointer" onClick={() => setActiveTab('inventory')}>Stock Controller</span> and click "Audit Photo" next to any product to capture a verification photo.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {verifiedPhotos.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow transition-all flex flex-col">
                      <div className="aspect-video w-full bg-gray-900 relative">
                        <img 
                          src={item.photo} 
                          alt={item.productTitle} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[9px] font-mono font-bold">
                          Verified Stock: {item.stock}
                        </div>
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-extrabold text-gray-800 text-xs line-clamp-1">{item.productTitle}</p>
                          <p className="text-[9px] text-gray-400 mt-1 flex items-center space-x-1 font-mono">
                            <span>📅 {new Date(item.timestamp).toLocaleString()}</span>
                          </p>
                        </div>
                        <div className="border-t border-gray-200/60 mt-2.5 pt-2 flex items-center justify-between text-[9px]">
                          <span className="text-green-600 font-bold flex items-center space-x-0.5">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span>Verified Audit</span>
                          </span>
                          <span className="text-gray-400 font-mono">ID: {item.id.slice(0, 10)}</span>
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
      )}

      {cameraProduct && (
        <CameraModal
          product={cameraProduct}
          isOpen={!!cameraProduct}
          onClose={() => setCameraProduct(null)}
          onCapture={(photoBase64, stockCount) => {
            addVerifiedPhoto(cameraProduct.id, photoBase64, stockCount);
          }}
        />
      )}

      {confirmingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto" id="order-confirmation-workflow">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => {
              setConfirmingOrder(null);
            }}
          />

          <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-6">
            <div 
              className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 w-full max-w-lg flex flex-col border border-gray-100 animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-green-800 to-green-700 text-white px-5 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-200" />
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider">
                      Fulfill Order
                    </h3>
                    <p className="text-[9px] text-green-100 font-medium font-mono">
                      ID: {confirmingOrder.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setConfirmingOrder(null);
                  }}
                  className="text-white/80 hover:text-white bg-green-900/30 hover:bg-green-950/40 p-1 rounded-full transition-colors cursor-pointer border-none"
                  aria-label="Close modal"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <form onSubmit={handleConfirmOrderSubmit} className="flex-1 flex flex-col">
                <div className="p-5 space-y-4">
                  {/* Summary */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs space-y-1">
                    <p className="text-gray-500 font-medium">Customer: <span className="font-bold text-gray-900">{confirmingOrder.customerName}</span></p>
                    <p className="text-gray-500 font-medium">Total Value: <span className="font-bold text-green-700">{fmt(confirmingOrder.total)}</span></p>
                    <p className="text-gray-500 font-medium">Destination: <span className="font-bold text-gray-900">{confirmingOrder.address}, {confirmingOrder.state}</span></p>
                  </div>

                  {/* Setup Delivery Period */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#16A34A]" />
                      <h4 className="font-bold text-gray-700 text-[11px] uppercase tracking-wide">
                        Expected Delivery Timeframe
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        '24-48 Hours',
                        '3-5 Business Days',
                        '5-7 Working Days',
                        'Cooperative Pickup'
                      ].map((preset) => (
                        <button
                          type="button"
                          key={preset}
                          onClick={() => setDeliveryTimeframe(preset)}
                          className={`px-2 py-1.5 rounded text-[9px] font-bold text-center border cursor-pointer transition-all ${
                            deliveryTimeframe === preset
                              ? 'bg-[#16A34A] border-[#16A34A] text-white'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-gray-400 uppercase">Or Enter Custom Period</label>
                      <input
                        type="text"
                        required
                        value={deliveryTimeframe}
                        onChange={(e) => setDeliveryTimeframe(e.target.value)}
                        placeholder="e.g., 2-4 Hours..."
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-gray-400 uppercase">Fulfillment Notes (Optional)</label>
                      <input
                        type="text"
                        value={customNote}
                        onChange={(e) => setCustomNote(e.target.value)}
                        placeholder="e.g., Call upon arrival."
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions footer */}
                <div className="bg-gray-50 px-5 py-3.5 flex items-center justify-end border-t border-gray-150 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmingOrder(null);
                    }}
                    className="bg-white hover:bg-gray-50 text-gray-700 font-bold text-[10px] uppercase px-3.5 py-1.5 rounded border border-gray-200 shadow-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#16A34A] hover:bg-green-700 text-white font-bold text-[10px] uppercase px-4 py-1.5 rounded shadow-sm cursor-pointer border-none flex items-center space-x-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Confirm & Ship Order</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
