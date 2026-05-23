/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from './StoreContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Heart, 
  ShoppingBag as CartIcon, 
  BadgeCheck, 
  PhoneCall, 
  CreditCard, 
  DollarSign, 
  Building,
  ArrowLeft,
  FileText,
  Percent
} from 'lucide-react';
import ProductCard from './ProductCard';

export default function CartCheckout() {
  const { 
    cart, 
    wishlist, 
    products, 
    updateQuantity, 
    removeFromCart, 
    toggleWishlist,
    addToCart,
    currentView, 
    setView,
    couponCode,
    setCouponCode,
    couponDiscount,
    verifyCoupon,
    checkout,
    websiteSettings,
    user
  } = useStore();

  // Selected payment channel inside checkout mode
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'visa' | 'mastercard' | 'paypal' | 'bank_transfer'>('mpesa');
  
  // Checkout Shipping form states
  const [shippingName, setShippingName] = useState(user?.name || '');
  const [shippingEmail, setShippingEmail] = useState(user?.email || '');
  const [shippingPhone, setShippingPhone] = useState(user?.phone || '');
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');

  // Payment integration details states
  const [mpesaPhone, setMpesaPhone] = useState(user?.phone || '');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paypalEmail, setPaypalEmail] = useState(user?.email || '');

  // Invoice view / checkout success modal
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Math totals calculation
  const subtotal = cart.reduce((sum, item) => {
    const prod = products.find(p => p.id === item.productId);
    return sum + (prod ? prod.price * item.quantity : 0);
  }, 0);

  // Discount Math
  let discountAmount = 0;
  if (couponDiscount) {
    if (couponDiscount.type === 'percentage') {
      discountAmount = Number(((subtotal * couponDiscount.value) / 100).toFixed(2));
    } else {
      discountAmount = couponDiscount.value;
    }
  }

  const shippingFee = subtotal > 500 ? 0 : websiteSettings.shippingFee;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Number((taxableAmount * (websiteSettings.taxRate / 100)).toFixed(2));
  const total = Number((taxableAmount + shippingFee + taxAmount).toFixed(2));

  // Validations & Checkout process triggers
  const handleProceedCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingName || !shippingEmail || !shippingPhone || !shippingAddress) {
      alert("Please complete the shipping information fields");
      return;
    }

    // Payment validation checking
    const payDetails: any = {};
    if (paymentMethod === 'mpesa') {
      if (!mpesaPhone) {
        alert("Please enter your M-Pesa standard telephone line for STK Push");
        return;
      }
      payDetails.phoneNumber = mpesaPhone;
      payDetails.transactionId = `MPESA-STK-${Math.floor(Math.random() * 900000 + 100000)}`;
    } else if (paymentMethod === 'visa' || paymentMethod === 'mastercard') {
      if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
        alert("Please complete every Mastercard or Visa clearance input");
        return;
      }
      payDetails.transactionId = `SECURE-SSL-CARD-${Math.floor(Math.random() * 900000000)}`;
    } else if (paymentMethod === 'paypal') {
      if (!paypalEmail) {
        alert("Enter your verified PayPal account address");
        return;
      }
      payDetails.transactionId = `PAYPAL-REF-${Math.floor(Math.random() * 900000)}`;
    } else if (paymentMethod === 'bank_transfer') {
      payDetails.accountNumber = websiteSettings.bankDetails;
    }

    setIsSubmitting(true);
    
    // Simulate payment transaction SSL delay
    setTimeout(async () => {
      const orderRes = await checkout({
        name: shippingName,
        email: shippingEmail,
        phone: shippingPhone,
        address: shippingAddress,
        paymentMethod,
        paymentDetails: payDetails
      });
      setIsSubmitting(false);
    }, 1200);
  };

  const handleApplyCouponForm = (e: React.FormEvent) => {
    e.preventDefault();
    verifyCoupon(couponCode);
  };

  // 1. WISHLIST VIEW
  if (currentView === 'wishlist') {
    const listProducts = products.filter(p => wishlist.includes(p.id));

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="wishlist-page-container">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-blue-950 font-sans tracking-tight">Your Saved Electronics Wishlist</h2>
            <p className="text-sm text-gray-500 font-medium">Click heart to remove, or add items straight to active bag.</p>
          </div>
          <button 
            onClick={() => setView('shop')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg transition-all"
            id="back-to-shop-wishlist"
          >
            ← Back to Store Catalog
          </button>
        </div>

        {listProducts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700 font-sans">Your wishlist is empty</h3>
            <p className="text-xs text-gray-500 mt-1 mb-6 max-w-sm mx-auto">Explore Kelly's catalog and bookmark your favorite premium smartphones, accessories, or consoles.</p>
            <button 
              onClick={() => setView('shop')}
              className="bg-blue-600 text-white font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Start Bookmarking Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="wishlist-grid">
            {listProducts.map(p => (
              <div key={p.id} className="relative">
                <ProductCard product={p} />
                <button 
                  onClick={() => {
                    addToCart(p.id);
                    toggleWishlist(p.id); // Remove from wishlist on successful addToCart
                  }}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  id={`wishlist-add-to-cart-btn-${p.id}`}
                >
                  <Plus className="w-3.5 h-3.5" /> Move to Shopping Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 2. SHOPPING CART VIEW
  if (currentView === 'cart') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans" id="cart-page-container">
        <h2 className="text-2xl font-extrabold text-blue-950 tracking-tight mb-8 flex items-center gap-2">
          <CartIcon className="w-6 h-6 text-blue-600" />
          <span>Shopping Cart Overview</span>
        </h2>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700">Your cart is empty</h3>
            <p className="text-xs text-gray-400 mt-1 mb-6">You have not loaded any electronic gadgets into your active checkout pipeline yet.</p>
            <button 
              onClick={() => setView('shop')}
              className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 cursor-pointer text-sm"
              id="empty-cart-back-shop"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Items Column */}
            <div className="lg:col-span-8 space-y-4" id="cart-items-column">
              {cart.map(item => {
                const prod = products.find(p => p.id === item.productId);
                if (!prod) return null;

                return (
                  <div 
                    key={item.productId} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-150 p-4 rounded-xl bg-white gap-4"
                    id={`cart-row-${item.productId}`}
                  >
                    {/* Thumbnail & Description block */}
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setView('product-detail'); }}>
                      <img 
                        src={prod.imageUrl} 
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 object-contain p-1 border border-gray-100 rounded-md bg-gray-50 shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 hover:text-blue-600 leading-tight line-clamp-2">
                          {prod.name}
                        </h4>
                        <span className="text-xs uppercase font-mono tracking-wider font-semibold text-blue-600 block mt-1">
                          Category: {prod.category}
                        </span>
                        <span className="text-xs text-gray-400 font-medium mt-0.5 block">Stock Status: {prod.stock} left</span>
                      </div>
                    </div>

                    {/* Quantity Adjustment + math line */}
                    <div className="flex items-center justify-between gap-6 sm:justify-end">
                      {/* Incrementor */}
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 px-2.5 hover:bg-gray-150 font-bold text-gray-600 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-bold text-gray-800 font-mono select-none">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 px-2.5 hover:bg-gray-150 font-bold text-gray-600 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line total price */}
                      <div className="text-right min-w-[80px]">
                        <span className="text-sm font-bold text-blue-950 font-sans block">
                          Ksh {(prod.price * item.quantity).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          (Ksh {prod.price.toLocaleString()} ea)
                        </span>
                      </div>

                      {/* Delete */}
                      <button 
                        onClick={() => removeFromCart(item.productId)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })}

              <div className="flex justify-between pt-2">
                <button 
                  onClick={() => setView('shop')}
                  className="text-xs font-bold text-gray-505 hover:text-blue-600 cursor-pointer"
                >
                  ← Continue Shopping
                </button>
              </div>
            </div>

            {/* Right Math Summary Card Column */}
            <div className="lg:col-span-4 bg-gray-50 border border-gray-150 p-6 rounded-2xl" id="cart-summary-column">
              <h3 className="text-md uppercase font-bold text-blue-950 tracking-wider mb-4">Estimated Summary</h3>
              
              <div className="space-y-3.5 text-sm font-sans mb-6 border-b border-gray-200 pb-5">
                <div className="flex justify-between text-gray-600">
                  <span>Cart Items Subtotal:</span>
                  <span className="font-bold text-gray-900 font-mono">Ksh {subtotal.toLocaleString()}</span>
                </div>

                {couponDiscount && (
                  <div className="flex justify-between text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                    <span className="flex items-center gap-1">
                      <Percent className="w-3.5 h-3.5" /> Coupon Applied ({couponDiscount.code})
                    </span>
                    <span className="font-mono">-Ksh {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Tax Amount ({websiteSettings.taxRate}% VAT):</span>
                  <span className="font-bold text-gray-900 font-mono">Ksh {taxAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Standard Shipping Cargo:</span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase text-[11px] tracking-wide">Free Shipping</span>
                  ) : (
                    <span className="font-bold text-gray-900 font-mono">Ksh {shippingFee.toLocaleString()}</span>
                  )}
                </div>
              </div>

              {/* Promo Coupon Form */}
              <form onSubmit={handleApplyCouponForm} className="flex gap-2 mb-6" id="cart-coupon-clearance">
                <input 
                  type="text"
                  placeholder="Insert coupon (e.g. TECH10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-hidden"
                />
                <button 
                  type="submit"
                  className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {/* Total line */}
              <div className="flex justify-between items-end mb-6">
                <span className="font-extrabold text-blue-955 text-base">Net Payable Invoice Amount:</span>
                <span className="text-xl sm:text-2xl font-black text-blue-600 font-mono tracking-tight leading-none">Ksh {total.toLocaleString()}</span>
              </div>

              <button 
                onClick={() => setView('checkout')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                id="cart-checkout-proceed-btn"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <p className="text-[10px] text-gray-400 text-center mt-3 font-medium">SSL Encrypted Clearance Protocol • Automated notifications enabled</p>
            </div>

          </div>
        )}
      </div>
    );
  }

  // 3. SECURE CHECKOUT PAGE
  if (currentView === 'checkout') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans" id="checkout-page-outer">
        <button 
          onClick={() => setView('cart')}
          className="text-xs font-bold text-gray-500 hover:text-blue-600 flex items-center gap-1 mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Shopping Cart
        </button>

        <h2 className="text-2xl font-extrabold text-blue-950 tracking-tight mb-8">Secure Invoice Checkout Portal</h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form column: Shipping details */}
          <form onSubmit={handleProceedCheckout} className="lg:col-span-8 bg-white border border-gray-150 p-6 sm:p-8 rounded-2xl space-y-6" id="checkout-shipping-pay-form">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-blue-950 mb-4 pb-2 border-b border-gray-100 flex items-center gap-1.5">
                <BadgeCheck className="w-5 h-5 text-blue-600" />
                <span>1. Physical Shipping Coordinates</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Receiver Name *</label>
                  <input 
                    type="text"
                    required
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50/50"
                    placeholder="e.g. Dennis Omwamba"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address (Invoicing) *</label>
                  <input 
                    type="email"
                    required
                    value={shippingEmail}
                    onChange={(e) => setShippingEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50/50"
                    placeholder="denny@domain.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number (SMS Alert Notifications) *</label>
                  <input 
                    type="tel"
                    required
                    value={shippingPhone}
                    onChange={(e) => setShippingPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50/50"
                    placeholder="+254 7XX XXX XXX or global code"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Physical Delivery Street & Door Address *</label>
                  <input 
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50/50"
                    placeholder="Lavin Tower, First Floor, Sophia, Homabay, Kenya"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-blue-950 mb-4 pb-2 border-b border-gray-100 flex items-center gap-1.5">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span>2. Select Secure Payment Channel Integration</span>
              </h3>

              {/* Payment selector toggle tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-6" id="payment-options-grid">
                {[
                  { id: 'mpesa', name: 'M-Pesa', icon: <PhoneCall className="w-4 h-4" /> },
                  { id: 'visa', name: 'Visa', icon: <CreditCard className="w-4 h-4" /> },
                  { id: 'mastercard', name: 'Mastercard', icon: <CreditCard className="w-4 h-4" /> },
                  { id: 'paypal', name: 'PayPal', icon: <DollarSign className="w-4 h-4 text-sky-500" /> },
                  { id: 'bank_transfer', name: 'Bank Wire', icon: <Building className="w-4 h-4" /> }
                ].map(pay => (
                  <button
                    key={pay.id}
                    type="button"
                    onClick={() => setPaymentMethod(pay.id as any)}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${paymentMethod === pay.id ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-gray-50 hover:bg-gray-100/55 text-gray-700 border-gray-200'}`}
                  >
                    {pay.icon}
                    <span>{pay.name}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Sub-Forms depending on Payment chosen */}
              <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl relative overflow-hidden" id="payment-channel-form-body">
                
                {/* A. M-PESA */}
                {paymentMethod === 'mpesa' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 rounded uppercase">Safaricom Certified</div>
                      <span className="text-xs font-bold text-gray-500">Fast clearance push integration</span>
                    </div>

                    <div className="max-w-sm">
                      <label className="block text-xs font-bold text-gray-750 uppercase mb-1">M-Pesa Registered Number *</label>
                      <input 
                        type="tel"
                        required
                        value={mpesaPhone}
                        onChange={(e) => setMpesaPhone(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                        placeholder="e.g. +254 787 272 428"
                      />
                      <p className="text-[11px] text-gray-400 mt-1">A Safaricom STK Push query will sound on your display handset after clicking trigger. Input PIN to unlock clearance.</p>
                    </div>
                  </div>
                )}

                {/* B. CARDS VISA AND MASTERCARD */}
                {(paymentMethod === 'visa' || paymentMethod === 'mastercard') && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase">AES256 Encrypted</div>
                      <span className="text-xs font-bold text-gray-500">Fully compliant SSL credit system</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-750 uppercase mb-1">Cardholder Name (printed) *</label>
                        <input 
                          type="text"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                          placeholder="e.g. Dennis Omwamba"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-750 uppercase mb-1">Card Number *</label>
                        <input 
                          type="text"
                          required
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white font-mono"
                          placeholder="4111 2222 3333 4444"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-750 uppercase mb-1">Expiry Date *</label>
                        <input 
                          type="text"
                          required
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white font-mono animate-none"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-750 uppercase mb-1">Security Code (CVV Verification) *</label>
                        <input 
                          type="password"
                          required
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white font-mono"
                          placeholder="***"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* C. PAYPAL */}
                {paymentMethod === 'paypal' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-gray-500">PayPal International Billing checkout</span>
                    </div>

                    <div className="max-w-sm">
                      <label className="block text-xs font-bold text-gray-750 uppercase mb-1">PayPal Verified Email Address *</label>
                      <input 
                        type="email"
                        required
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                        placeholder="paypal-payer@gmail.com"
                      />
                    </div>
                  </div>
                )}

                {/* D. BANK WIRE TRANSFER */}
                {paymentMethod === 'bank_transfer' && (
                  <div className="space-y-3 font-sans" id="bank-wire-notices">
                    <h4 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-1.5 uppercase">Corporate Account Direct Instructions</h4>
                    <p className="text-xs text-gray-650 leading-relaxed">
                      Please deposit the exact invoice sum directly to:
                    </p>
                    <div className="bg-white p-3.5 border border-dashed border-gray-200 rounded-xl text-xs sm:text-sm font-semibold space-y-1 bg-opacity-70 text-blue-950 font-mono">
                      <p>🏦 Bank: <span className="text-blue-700">Equity Bank Kenya</span></p>
                      <p>📁 Account Name: <span className="text-blue-700">Kelly Gadgets Store LTD</span></p>
                      <p>💵 Account Number: <span className="text-blue-700">120034455828</span></p>
                      <p>✨ Swift Code: <span className="text-blue-700 font-mono">EQBLKENXXXX</span></p>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 font-medium">To speed up loading processing, please write your full name or billing phone number onto the transaction bank slip reference details.</p>
                  </div>
                )}

              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full font-sans font-extrabold text-sm py-4 rounded-xl shadow-lg hover:shadow-blue-600/25 transition-all text-white cursor-pointer  ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              id="confirm-checkout-and-pay-btn"
            >
              {isSubmitting ? "Initiating Secure Transaction Encryption..." : `Authorized Payment Clearance of Ksh ${total.toLocaleString()}`}
            </button>
          </form>

          {/* Right Product Checklist Frame Column */}
          <div className="lg:col-span-4 space-y-6" id="checkout-sidebar-column">
            
            {/* Bag list */}
            <div className="bg-gray-50 border border-gray-150 p-6 rounded-2xl" id="checkout-bill-breakdown">
              <h3 className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-4 font-mono">Invoice Summary Breakdown</h3>
              
              <div className="max-h-[160px] overflow-y-auto mb-5 space-y-3 pr-2 scrollbar-thin">
                {cart.map(item => {
                  const prod = products.find(p => p.id === item.productId);
                  if (!prod) return null;
                  return (
                    <div key={item.productId} className="flex justify-between items-center gap-3 text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <img 
                          src={prod.imageUrl} 
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 object-contain p-0.5 border border-gray-200 bg-white rounded shrink-0" 
                        />
                        <span className="font-semibold text-gray-800 truncate block text-[12.5px] leading-tight max-w-[140px]">{prod.name}</span>
                      </div>
                      <span className="font-bold text-gray-700 text-xs shrink-0 font-mono">
                        {item.quantity}x @ Ksh {(prod.price).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Bill Math lines */}
              <div className="space-y-3.5 text-xs border-t border-gray-200 pt-4" id="checkout-math-lines">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Gross Subtotal:</span>
                  <span className="font-bold text-gray-900 font-mono">Ksh {subtotal.toLocaleString()}</span>
                </div>

                {couponDiscount && (
                  <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                    <span>Discounted ({couponDiscount.code}):</span>
                    <span className="font-mono">-Ksh {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Shipping Cargo Fee:</span>
                  <span>{shippingFee === 0 ? "Free Shipping" : `Ksh ${shippingFee.toLocaleString()}`}</span>
                </div>

                <div className="flex justify-between text-gray-600 font-medium">
                  <span>VAT ({websiteSettings.taxRate}%):</span>
                  <span className="font-bold text-gray-900 font-mono">Ksh {taxAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-blue-900 font-black text-sm border-t border-gray-200 pt-4 leading-none select-none">
                  <span>Total Payable:</span>
                  <span className="text-lg font-mono text-blue-600">Ksh {total.toLocaleString()}</span>
                </div>
              </div>

            </div>

            {/* Direct Warranty Support Info */}
            <div className="bg-sky-50 border border-sky-100/70 p-5 rounded-2xl text-xs space-y-2.5">
              <h4 className="font-bold text-sky-950 uppercase tracking-wide flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-sky-600" />
                Customer Support Escalation
              </h4>
              <p className="text-sky-900 leading-relaxed font-sans">
                By ordering, the system fires off a simulated dynamic SMS and secure invoice dispatch directly to your verified contact targets. If you encounter any clearance latency, please call standard operators directly at {websiteSettings?.contactPhone || "+254 787 272 428"}.
              </p>
            </div>

          </div>

        </div>
      </div>
    );
  }

  return null;
}
