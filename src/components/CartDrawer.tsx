import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    setIsCheckoutOpen,
    formatPrice
  } = useStore();

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const formattedSubtotal = formatPrice(subtotal);

  const handleCheckoutInit = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs">
      <div className="absolute inset-0 overflow-hidden">
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md animate-slide-in">
            <div className="flex h-full flex-col bg-white shadow-2xl border-l border-gray-100">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:px-6">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-[#16A34A]" />
                  <h2 className="text-base font-black text-gray-900">My Cart ({totalItems} items)</h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-full p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:px-6">
                {cart.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="bg-green-50 rounded-full p-6 mb-4">
                      <ShoppingBag className="w-12 h-12 text-[#16A34A]" />
                    </div>
                    <h3 className="text-base font-black text-gray-900">Your cart is empty!</h3>
                    <p className="mt-1 text-xs text-gray-500 max-w-xs">
                      Browse our hot electronics, phones, groceries and household essentials to add items to your cart.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-6 rounded-md bg-[#16A34A] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#15803D] transition-colors cursor-pointer"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => {
                      const discount = Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100);
                      const itemPrice = formatPrice(item.product.price);

                      return (
                        <div key={item.product.id} className="flex space-x-4 py-3 border-b border-gray-200 text-xs">
                          {/* Image */}
                          <div className="w-20 h-20 rounded border border-gray-200 overflow-hidden shrink-0 bg-gray-50">
                            <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>

                          {/* Info */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between font-medium text-gray-900">
                                <h4 className="line-clamp-2 pr-2 font-bold text-gray-800">{item.product.title}</h4>
                                <span className="font-bold text-gray-900 shrink-0 font-mono">{itemPrice}</span>
                              </div>
                              <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{item.product.category}</p>
                            </div>

                            {/* Qty and Delete */}
                            <div className="flex items-center justify-between mt-2 pt-1">
                              <div className="flex items-center border border-gray-200 rounded">
                                <button
                                  onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                                  className="p-1 hover:bg-gray-50 text-gray-500 transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-3 text-xs font-bold text-gray-800 font-mono">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                  className="p-1 hover:bg-gray-50 text-gray-500 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer Checkout Summary */}
              {cart.length > 0 && (
                <div className="border-t border-gray-200 p-4 sm:px-6 bg-gray-50">
                  <div className="flex justify-between text-sm font-semibold text-gray-900 mb-2">
                    <p>Subtotal</p>
                    <p className="text-base font-black text-gray-950 font-mono">{formattedSubtotal}</p>
                  </div>
                  <p className="text-[10px] text-gray-500 mb-4">
                    Delivery fees calculated at the checkout page based on state selection (Nigeria) or international export country. Pay on Delivery available for domestic orders.
                  </p>
                  
                  <button
                    onClick={handleCheckoutInit}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[#16A34A] hover:bg-[#15803D] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all uppercase tracking-wider cursor-pointer"
                  >
                    <span>Proceed To Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="mt-3 flex justify-center text-center text-xs text-gray-400">
                    <p>
                      or{' '}
                      <button
                        type="button"
                        className="font-bold text-[#16A34A] hover:underline cursor-pointer focus:outline-none"
                        onClick={() => setIsCartOpen(false)}
                      >
                        Continue Shopping
                      </button>
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
