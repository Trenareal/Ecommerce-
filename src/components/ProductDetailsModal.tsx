import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, Heart, Shield, RotateCcw, Truck, MessageSquare, Plus, Minus, AlertTriangle } from 'lucide-react';

export const ProductDetailsModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, products, showToast, formatPrice } = useStore();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [userName, setUserName] = useState('');
  
  // Custom Reviews for this session
  const [localReviews, setLocalReviews] = useState<Record<string, Array<{id: string; name: string; rating: number; comment: string; date: string}>>>({
    'prod-1': [
      { id: 'rev-1', name: 'Chinedu O.', rating: 5, comment: 'This is the best phone ever! Delivery was super fast, highly recommended.', date: '2026-06-28' },
      { id: 'rev-2', name: 'Adebayo T.', rating: 4, comment: 'Incredible performance, but quite expensive. Love the dynamic island!', date: '2026-06-15' }
    ]
  });

  if (!selectedProduct) return null;

  // Sync current state of product in products database (e.g., to have accurate live stock)
  const product = products.find(p => p.id === selectedProduct.id) || selectedProduct;

  const handleClose = () => {
    setSelectedProduct(null);
    setQuantity(1);
    setUserName('');
    setUserComment('');
    setUserRating(5);
  };

  const incrementQty = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else {
      showToast(`Cannot select more. Only ${product.stock} units available!`, 'warning');
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    handleClose();
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userComment.trim()) {
      showToast('Please fill out all review fields.', 'warning');
      return;
    }

    const newReview = {
      id: `rev-user-${Date.now()}`,
      name: userName,
      rating: userRating,
      comment: userComment,
      date: new Date().toISOString().split('T')[0]
    };

    const productReviews = localReviews[product.id] || [];
    setLocalReviews({
      ...localReviews,
      [product.id]: [newReview, ...productReviews]
    });

    // Update reviewsCount on product
    product.reviewsCount += 1;
    product.rating = parseFloat(((product.rating * (product.reviewsCount - 1) + userRating) / product.reviewsCount).toFixed(1));

    showToast('Review submitted successfully!', 'success');
    setUserName('');
    setUserComment('');
    setUserRating(5);
  };

  const reviews = localReviews[product.id] || [
    { id: 'rev-def-1', name: 'Funmi A.', rating: 5, comment: 'Super fast shipping, standard packaging, and very authentic product! Thank you Jumia!', date: '2026-06-30' },
    { id: 'rev-def-2', name: 'Obinna E.', rating: 4, comment: 'Product works perfectly fine. Battery life is fantastic. Customer service can be improved.', date: '2026-06-25' }
  ];

  const formattedPrice = formatPrice(product.price);
  const formattedOriginalPrice = formatPrice(product.originalPrice);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative animate-fade-in">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 sm:p-8">
          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left: Product Images Slider */}
            <div className="flex flex-col space-y-4">
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100 relative">
                <img
                  src={product.images[activeImageIdx] || product.image}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {product.isExpress && (
                  <span className="absolute top-3 left-3 bg-[#16A34A] text-white text-[10px] font-black px-2 py-1 rounded italic uppercase tracking-wider">
                    EXPRESS DELIVERY
                  </span>
                )}
              </div>
              
              {/* Image Sub-sliders */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-16 h-16 rounded border-2 overflow-hidden shrink-0 transition-all ${
                        activeImageIdx === idx ? 'border-[#16A34A]' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}

              {/* Jumia Guarantee Badges */}
              <div className="grid grid-cols-3 gap-2 pt-4 text-center border-t border-gray-200">
                <div className="flex flex-col items-center p-2 bg-[#F1F1F3] rounded border border-gray-200">
                  <Shield className="w-5 h-5 text-[#16A34A] mb-1" />
                  <span className="text-[10px] font-bold text-gray-700">100% Authentic</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-[#F1F1F3] rounded border border-gray-200">
                  <RotateCcw className="w-5 h-5 text-[#16A34A] mb-1" />
                  <span className="text-[10px] font-bold text-gray-700">7 Days Return</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-[#F1F1F3] rounded border border-gray-200">
                  <Truck className="w-5 h-5 text-[#16A34A] mb-1" />
                  <span className="text-[10px] font-bold text-gray-700">Jumia Express</span>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Add to Cart */}
            <div className="flex flex-col">
              <span className="text-xs text-[#16A34A] font-bold uppercase tracking-wider mb-1.5">
                {product.category}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight mb-2">
                {product.title}
              </h2>

              {/* Rating Summary */}
              <div className="flex items-center space-x-1.5 mb-4">
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'}`}
                    />
                  ))}
                  <span className="text-sm font-bold text-gray-700 ml-1.5">{product.rating}</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-xs text-[#16A34A] font-semibold hover:underline cursor-pointer">
                  {product.reviewsCount} verified reviews
                </span>
              </div>

              {/* Price Area */}
              <div className="p-4 bg-[#F1F1F3] rounded-lg border border-gray-200 mb-4">
                <div className="flex items-baseline space-x-3">
                  <span className="text-2xl font-black text-gray-950">{formattedPrice}</span>
                  <span className="text-sm text-gray-400 line-through font-mono">{formattedOriginalPrice}</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1 font-medium">
                  Eligible for Pay on Delivery or Bank Transfer. Safe & secure payment.
                </p>
              </div>

              {/* Real-time Stock Display */}
              <div className="mb-4">
                {product.stock > 0 ? (
                  <div className={`p-3 rounded border flex items-center space-x-2 text-xs ${
                    product.stock <= 3 
                      ? 'bg-red-50 border-red-200 text-red-800' 
                      : 'bg-green-50 border-green-200 text-green-800'
                  }`}>
                    {product.stock <= 3 ? <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" /> : <Shield className="w-4 h-4 text-green-600 shrink-0" />}
                    <div className="flex-1">
                      <p className="font-bold">
                        {product.stock <= 3 
                          ? `Hurry! Only ${product.stock} left in stock.` 
                          : `In Stock: ${product.stock} units available.`}
                      </p>
                      <p className="text-[10px] text-opacity-80">
                        Real-time system stock level checked at {new Date().toLocaleTimeString()}.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded border bg-gray-50 border-gray-200 text-gray-600 flex items-center space-x-2 text-xs">
                    <X className="w-4 h-4 text-gray-400 shrink-0" />
                    <div>
                      <p className="font-bold">Currently Sold Out</p>
                      <p className="text-[10px]">Restocking processes initiated. Check back shortly!</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-xs sm:text-sm text-gray-800 font-semibold mb-3 leading-relaxed">
                  {product.shortDescription}
                </p>
              )}

              {/* Main Description */}
              <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>

              {/* Brand, SKU, Weight, Dimensions */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 border border-gray-100 rounded-lg text-xs mb-4">
                {product.brand && (
                  <div>
                    <span className="text-gray-400 font-bold block">Brand</span>
                    <span className="text-gray-800 font-semibold">{product.brand}</span>
                  </div>
                )}
                {product.sku && (
                  <div>
                    <span className="text-gray-400 font-bold block">SKU</span>
                    <span className="text-gray-800 font-mono">{product.sku}</span>
                  </div>
                )}
                {product.weight && (
                  <div>
                    <span className="text-gray-400 font-bold block">Weight</span>
                    <span className="text-gray-800 font-semibold">{product.weight}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div>
                    <span className="text-gray-400 font-bold block">Dimensions</span>
                    <span className="text-gray-800 font-semibold">{product.dimensions}</span>
                  </div>
                )}
              </div>

              {/* Video URL */}
              {product.videoUrl && (
                <div className="mb-4">
                  <a 
                    href={product.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs text-red-600 hover:text-red-700 font-bold hover:underline"
                  >
                    <span>🎥 Watch Product Video Demo</span>
                  </a>
                </div>
              )}

              {/* Export Grade Certifications */}
              {product.isExportGrade && product.exportCertifications && (
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 mb-4">
                  <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                    <span>Export Quality & Compliance Cleared</span>
                    <span className="text-emerald-600">🛡️🌍</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {product.exportCertifications.map((cert, i) => (
                      <span key={i} className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        {cert}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-emerald-700/85 mt-1.5">
                    Fully compliant with USDA, FDA, and EU sanitary regulations. Air cargo customs clearing and full Phytosanitary export document bundle processed instantly on dispatch.
                  </p>
                </div>
              )}

              {/* Specifications List */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Key Specifications</h4>
                <ul className="space-y-1.5">
                  {product.specs.map((spec, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start space-x-2">
                      <span className="text-[#16A34A] font-bold mt-0.5">•</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity Selector & Add Action */}
              {product.stock > 0 ? (
                <div className="flex items-center space-x-4 mt-auto">
                  <div className="flex items-center border border-gray-300 rounded-md bg-white">
                    <button 
                      onClick={decrementQty}
                      className="p-2 hover:bg-gray-100 text-gray-500 rounded-l-md transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-bold font-mono text-gray-800">{quantity}</span>
                    <button 
                      onClick={incrementQty}
                      className="p-2 hover:bg-gray-100 text-gray-500 rounded-r-md transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold py-3 px-6 rounded-md shadow-md transition-all uppercase tracking-wider text-xs sm:text-sm cursor-pointer border-none"
                  >
                    Add to Cart
                  </button>
                </div>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-200 text-gray-400 font-bold py-3 px-6 rounded-md cursor-not-allowed uppercase text-sm"
                >
                  Sold Out
                </button>
              )}
            </div>

          </div>

          {/* Bottom Tabs: Description vs Reviews */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <h3 className="text-base font-bold text-gray-900 flex items-center space-x-2 mb-4">
              <MessageSquare className="w-5 h-5 text-[#16A34A]" />
              <span>Verified Customer Reviews ({reviews.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Reviews Listing */}
              <div className="md:col-span-2 space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-lg bg-gray-50 border border-gray-100 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1">
                        <span className="font-bold text-gray-800">{rev.name}</span>
                        <span className="bg-green-100 text-green-700 font-semibold px-1 py-0.2 rounded text-[9px] uppercase">
                          Verified
                        </span>
                      </div>
                      <span className="text-gray-400 font-mono text-[10px]">{rev.date}</span>
                    </div>
                    <div className="flex items-center text-yellow-500 mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <p className="text-gray-600 leading-relaxed font-medium">"{rev.comment}"</p>
                  </div>
                ))}
              </div>

              {/* Review Write Form */}
              <div className="bg-green-50/20 rounded-lg border border-green-100 p-5 h-fit text-xs">
                <h4 className="font-bold text-gray-900 mb-3">Rate this product</h4>
                <form onSubmit={handleAddReview} className="space-y-3">
                  <div>
                    <label className="block text-gray-600 font-medium mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={e => setUserName(e.target.value)}
                      placeholder="e.g. Samuel K."
                      className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-medium mb-1">Rating</label>
                    <select
                      value={userRating}
                      onChange={e => setUserRating(Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500 font-bold text-yellow-600"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                      <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                      <option value="3">⭐⭐⭐ 3 Stars</option>
                      <option value="2">⭐⭐ 2 Stars</option>
                      <option value="1">⭐ 1 Star</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-600 font-medium mb-1">Comment</label>
                    <textarea
                      required
                      rows={3}
                      value={userComment}
                      onChange={e => setUserComment(e.target.value)}
                      placeholder="Share your experience with this item..."
                      className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#16A34A] hover:bg-green-700 text-white font-bold py-2 rounded shadow-sm transition-all cursor-pointer border-none"
                  >
                    Submit Review
                  </button>
                </form>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
