import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Star, Zap, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct, formatPrice, toggleWishlist, customers, currentUser } = useStore();

  const loggedInCustomer = customers.find(c => c.email.toLowerCase() === currentUser?.email?.toLowerCase());
  const isWishlisted = loggedInCustomer?.wishlist?.includes(product.id) || false;

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const stockPercentage = Math.round((product.stock / product.initialStock) * 100);

  // Determine stock badge / progress bar styling
  let progressColor = 'bg-green-500';
  let stockLabel = `${product.stock} items left`;
  let labelColor = 'text-green-600 bg-green-50';

  if (product.stock === 0) {
    progressColor = 'bg-gray-400';
    stockLabel = 'Out of Stock';
    labelColor = 'text-gray-600 bg-gray-100';
  } else if (product.stock <= 3) {
    progressColor = 'bg-red-500 animate-pulse';
    stockLabel = `Only ${product.stock} left - order soon!`;
    labelColor = 'text-red-600 bg-red-50 font-bold';
  } else if (product.stock <= 10) {
    progressColor = 'bg-emerald-500';
    stockLabel = `Limited stock: ${product.stock} left`;
    labelColor = 'text-emerald-600 bg-emerald-50 font-medium';
  }

  const formattedPrice = formatPrice(product.price);
  const formattedOriginalPrice = formatPrice(product.originalPrice);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col group h-full">
      {/* Product Image & Badges */}
      <div 
        className="relative bg-gray-50 aspect-square overflow-hidden cursor-pointer"
        onClick={() => setSelectedProduct(product)}
      >
        <img
          src={product.image}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-[#16A34A]/10 text-[#16A34A] text-[10px] font-black px-2 py-0.5 rounded">
            -{discount}%
          </span>
        )}

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/95 shadow-md border border-gray-100 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center group/heart"
          aria-label="Add to wishlist"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isWishlisted 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-400 group-hover/heart:text-red-500'
            }`} 
          />
        </button>

        {/* Flash Sale Tag */}
        {product.flashSale && (
          <span className="absolute top-11 right-2 bg-[#16A34A] text-white text-[9px] font-black px-1.5 py-0.5 rounded flex items-center space-x-0.5 shadow-sm animate-pulse">
            <Zap className="w-2.5 h-2.5 fill-white" />
            <span>FLASH</span>
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="p-3.5 flex flex-col flex-1">
        {/* Category */}
        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">
          {product.category}
        </span>

        {/* Title */}
        <h3 
          className="text-xs sm:text-sm text-gray-800 font-semibold hover:text-[#16A34A] transition-colors line-clamp-2 cursor-pointer mb-2 h-10 leading-tight"
          onClick={() => setSelectedProduct(product)}
        >
          {product.title}
        </h3>

        {/* Price Section */}
        <div className="mb-2">
          <span className="text-base sm:text-lg font-black text-gray-900">{formattedPrice}</span>
          {discount > 0 && (
            <span className="text-[11px] sm:text-xs text-gray-400 line-through ml-2">
              {formattedOriginalPrice}
            </span>
          )}
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex items-center text-yellow-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-bold text-gray-700 ml-1">{product.rating}</span>
          </div>
          <span className="text-gray-300">|</span>
          <span className="text-[10px] text-gray-500 font-semibold">({product.reviewsCount} reviews)</span>
        </div>

        {/* Real-time Inventory Tracker Progress Bar */}
        <div className="mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${labelColor}`}>
              {stockLabel}
            </span>
            <span className="text-gray-400 font-mono font-bold text-[10px]">{stockPercentage}% in stock</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${progressColor}`} 
              style={{ width: `${Math.max(0, Math.min(100, stockPercentage))}%` }}
            ></div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-3.5 flex items-center gap-2">
          {product.isExpress && (
            <span className="bg-[#16A34A] text-white text-[9px] font-black px-1.5 py-1 rounded italic uppercase shrink-0 select-none tracking-tighter">
              EXPRESS
            </span>
          )}

          {product.isExportGrade && (
            <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-1 rounded uppercase shrink-0 select-none tracking-tight">
              EXPORT GRADE 🌍
            </span>
          )}
          
          {product.stock > 0 ? (
            <button
              onClick={() => addToCart(product)}
              className="flex-1 bg-gray-900 hover:bg-[#16A34A] text-white text-xs font-bold py-2 px-3 rounded text-center transition-all duration-300 hover:shadow-sm cursor-pointer focus:outline-none"
            >
              Add To Cart
            </button>
          ) : (
            <button
              disabled
              className="flex-1 bg-gray-100 text-gray-400 text-xs font-bold py-2 px-3 rounded text-center cursor-not-allowed"
            >
              Sold Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
