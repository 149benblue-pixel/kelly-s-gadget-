/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore } from './StoreContext';
import { Star, Heart, ShoppingCart, ShieldCheck, Truck, RefreshCcw, Send, Sparkles } from 'lucide-react';
import { Review } from '../types';

export default function ProductDetails() {
  const { 
    selectedProductId, 
    products, 
    addToCart, 
    toggleWishlist, 
    wishlist, 
    setView,
    showNotification
  } = useStore();

  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [productData, setProductData] = useState<any>(null);
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [activeImg, setActiveImg] = useState('');
  
  // Custom reviews submission state
  const [revName, setRevName] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [submittingRev, setSubmittingRev] = useState(false);

  // Detail quantities Counter
  const [detailQty, setDetailQty] = useState(1);

  // Find the basic product first to prevent white screens
  const baseProduct = products.find(p => p.id === selectedProductId);

  const fetchFullProductDetails = async () => {
    if (!selectedProductId) return;
    try {
      const res = await fetch(`/api/products/${selectedProductId}`);
      if (res.ok) {
        const data = await res.json();
        setProductData(data.product);
        setReviewsList(data.reviews || []);
        setActiveImg(data.product.imageUrl);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchFullProductDetails();
  }, [selectedProductId]);

  if (!selectedProductId) {
    return (
      <div className="text-center py-20 font-sans">
        <p className="text-gray-550">No product selected.</p>
        <button onClick={() => setView('shop')} className="text-blue-600 hover:underline mt-2">Go to Shop</button>
      </div>
    );
  }

  const activeProduct = productData || baseProduct;
  if (!activeProduct) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Retrieving specifications...</p>
      </div>
    );
  }

  const isStarredInWishlist = wishlist.includes(activeProduct.id);

  const handleReviewSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName || !revComment) {
      showNotification("Please fill in your name and comment", "error");
      return;
    }

    setSubmittingRev(true);
    try {
      const res = await fetch(`/api/products/${activeProduct.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: revName,
          rating: revRating,
          comment: revComment
        })
      });
      if (res.ok) {
        showNotification("Review posted successfully! Thank you for your feedback.", "success");
        setRevName('');
        setRevComment('');
        setRevRating(5);
        // Refresh detail logs
        fetchFullProductDetails();
      } else {
        showNotification("Failed posting review", "error");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingRev(false);
    }
  };

  // Extra Mock alternative colors for gallery
  const alternativeMockImgs = [
    activeProduct.imageUrl,
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans" id="product-details-container">
      {/* Back breadcrumb */}
      <div className="mb-6 flex justify-between" id="breadcrumb-specs">
        <button 
          onClick={() => { setView('shop'); }}
          className="text-xs font-bold text-gray-500 hover:text-blue-600 cursor-pointer"
        >
          ← Back to Electronic Catalog
        </button>
        <span className="text-xs text-blue-950 font-semibold font-mono uppercase tracking-widest bg-blue-50/50 px-2 py-0.5 rounded border border-blue-100/50">
          Serial ID: {activeProduct.id}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-14">
        
        {/* Left Interactive Image Gallery Side */}
        <div className="lg:col-span-6 flex flex-col gap-4" id="gallery-side">
          <div className="bg-gray-50 border border-gray-150 rounded-2xl p-6 flex items-center justify-center aspect-square overflow-hidden relative">
            <img 
              src={activeImg || activeProduct.imageUrl} 
              alt={activeProduct.name}
              referrerPolicy="no-referrer"
              className="max-h-[380px] w-auto object-contain hover:scale-105 duration-300" 
            />
            <div className="absolute bottom-3 left-3 bg-white/90 border border-gray-150 px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase text-blue-900 pointer-events-none flex items-center gap-1 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" /> High Definition Render
            </div>
          </div>

          {/* Miniatures indicators */}
          <div className="flex gap-2.5">
            {alternativeMockImgs.map((imgUrl, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(imgUrl)}
                className={`w-20 h-20 bg-gray-50 rounded-xl border p-2 flex items-center justify-center cursor-pointer shrink-0 transition-all ${activeImg === imgUrl ? 'border-blue-600 ring-2 ring-blue-100 shadow-sm' : 'border-gray-200 hover:border-blue-400'}`}
              >
                <img src={imgUrl} alt="color-spec" className="max-h-16 w-auto object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Product Attributes Info side */}
        <div className="lg:col-span-6 flex flex-col" id="specs-purchase-side">
          {/* Tags */}
          <div className="flex gap-2 mb-3.5">
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded font-mono">
              {activeProduct.category}
            </span>
            {activeProduct.stock > 0 ? (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                In Stock ({activeProduct.stock} left)
              </span>
            ) : (
              <span className="bg-gray-100 text-gray-850 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                Sold Out
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight leading-tight mb-3">
            {activeProduct.name}
          </h1>

          {/* Stars & rating count */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.round(activeProduct.ratingAverage) ? 'fill-amber-400 text-amber-500' : 'text-gray-200'}`} 
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-800 font-sans">{activeProduct.ratingAverage || 5.0} Average Rating</span>
            <span className="text-gray-400 font-medium text-xs">| Validated: {activeProduct.ratingCount || 1} standard customers</span>
          </div>

          {/* Price details */}
          <div className="bg-gradient-to-r from-blue-50/50 via-blue-50/10 to-transparent p-4 rounded-xl border border-blue-50/50 mb-6" id="pricing-capsule">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block font-mono">Guaranteed retail price</span>
            <div className="flex items-baseline gap-2.5 mt-1">
              <span className="text-3xl font-black text-blue-955 font-mono">Ksh {activeProduct.price.toLocaleString()}</span>
              {activeProduct.originalPrice && (
                <>
                  <span className="text-sm font-medium text-gray-400 line-through font-mono">Ksh {activeProduct.originalPrice.toLocaleString()}</span>
                  <span className="bg-red-100 text-red-800 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded mb-1">
                    Save Ksh {(activeProduct.originalPrice - activeProduct.price).toLocaleString()}!
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Brief teaser description */}
          <p className="text-sm sm:text-base text-gray-650 leading-relaxed mb-6 font-sans">
            {activeProduct.description}
          </p>

          <hr className="border-gray-150 mb-6" />

          {/* Add to checkout interactive pipeline controllers */}
          {activeProduct.stock > 0 ? (
            <div className="flex flex-col sm:flex-row gap-3.5 mb-8" id="actions-line">
              {/* Incrementor quant */}
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden self-start">
                <button 
                  onClick={() => setDetailQty(prev => Math.max(1, prev - 1))}
                  className="p-3.5 hover:bg-gray-150 font-black text-gray-650 cursor-pointer"
                >
                  -
                </button>
                <span className="px-5 text-sm font-extrabold text-blue-950 font-mono select-none">
                  {detailQty}
                </span>
                <button 
                  onClick={() => setDetailQty(prev => Math.min(activeProduct.stock, prev + 1))}
                  className="p-3.5 hover:bg-gray-150 font-black text-gray-650 cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to checkout */}
              <button 
                onClick={() => addToCart(activeProduct.id, detailQty)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer flex-1"
                id="details-add-to-cart-btn"
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                <span>Add {detailQty} To Shopping Bag</span>
              </button>

              {/* Wishlist item toggle */}
              <button 
                onClick={() => toggleWishlist(activeProduct.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${isStarredInWishlist ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-250 hover:bg-gray-50 text-gray-500 hover:text-red-500'}`}
              >
                <Heart className={`w-5 h-5 ${isStarredInWishlist ? 'fill-red-500' : ''}`} />
              </button>
            </div>
          ) : (
            <div className="bg-gray-100 px-5 py-4 rounded-xl border border-gray-200 text-center text-sm font-semibold text-gray-500 mb-8 font-sans">
              ⚠️ Waitlisting available! This premier gadget is temporarily sold out. Our Super Admin is restocking now.
            </div>
          )}

          {/* Secure Trust indicators logos */}
          <div className="grid grid-cols-3 gap-3 text-[11px] sm:text-xs text-gray-500 font-sans" id="trust-ribbon">
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>Full Store Warranty</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Truck className="w-5 h-5 text-blue-600" />
              <span>Worldwide Cargo</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <RefreshCcw className="w-5 h-5 text-blue-600" />
              <span>7 Day Easy Returns</span>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs Layout section: Specs, detailed review list submission */}
      <div className="border border-gray-150 rounded-2xl bg-white overflow-hidden" id="tabs-specification-reviews">
        
        {/* Tab Buttons selection strip */}
        <div className="flex border-b border-gray-150 bg-gray-50 text-xs sm:text-sm font-bold tracking-tight text-gray-600">
          <button
            onClick={() => setActiveTab('desc')}
            className={`py-4 px-6 md:px-8 border-r border-gray-150 transition-colors cursor-pointer ${activeTab === 'desc' ? 'bg-white text-blue-600 border-b-2 border-b-blue-600' : 'hover:bg-gray-100'}`}
          >
            Detailed Bio & Review
          </button>
          
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-4 px-6 md:px-8 border-r border-gray-150 transition-colors cursor-pointer ${activeTab === 'specs' ? 'bg-white text-blue-600 border-b-2 border-b-blue-600' : 'hover:bg-gray-100'}`}
          >
            Technical Specifications ({Object.keys(activeProduct.specs || {}).length})
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 px-6 md:px-8 transition-colors cursor-pointer ${activeTab === 'reviews' ? 'bg-white text-blue-600 border-b-2 border-b-blue-600' : 'hover:bg-gray-100'}`}
          >
            Customers Reviews ({reviewsList.length})
          </button>
        </div>

        {/* Dynamic Inner Tab View */}
        <div className="p-6 sm:p-8 font-sans">
          
          {/* TAB 1: Bio */}
          {activeTab === 'desc' && (
            <div className="prose max-w-none text-gray-750 text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                {activeProduct.description}
              </p>
              <p className="text-xs text-gray-400 font-medium">
                * Note on electronic standards: Every product listed matches strict manufacturing QC validations with official standard accessories packaged straight in structural box sets. No modified adapters or open-boxed shipments are dispatched.
              </p>
            </div>
          )}

          {/* TAB 2: Specifications details */}
          {activeTab === 'specs' && (
            <div className="border border-gray-100 rounded-xl overflow-hidden max-w-2xl">
              <table className="w-full text-xs sm:text-sm text-left border-collapse">
                <tbody>
                  {activeProduct.specs && Object.keys(activeProduct.specs).length > 0 ? (
                    Object.keys(activeProduct.specs).map((key, index) => (
                      <tr key={key} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-5 py-3 font-bold text-blue-950/80 w-1/3 border-b border-gray-100">{key}</td>
                        <td className="px-5 py-3 text-gray-700 font-medium border-b border-gray-100">{activeProduct.specs[key]}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-5 py-4 text-gray-400 font-medium">Standard packaging specifications. Read product label inside main manual.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: Reviews with dynamic add form! */}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start" id="reviews-inner-panel">
              
              {/* Reviews listing column */}
              <div className="md:col-span-7 space-y-4 font-sans" id="reviews-history-listing">
                <h3 className="text-base font-bold text-gray-950 uppercase tracking-wide mb-3">Customer Testimonials</h3>
                
                {reviewsList.length === 0 ? (
                  <p className="text-xs text-gray-450 italic">No reviews submitted yet. Be the first to express feedback on this purchase!</p>
                ) : (
                  reviewsList.map((rev) => (
                    <div key={rev.id} className="border border-gray-150 p-4 rounded-xl bg-gray-50/40 relative">
                      <div className="flex justify-between items-start mb-2.5">
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-blue-950">{rev.customerName}</h4>
                          <span className="text-[10px] text-gray-400 font-mono block">{new Date(rev.date).toLocaleDateString()}</span>
                        </div>
                        {/* Rating stars */}
                        <div className="flex text-amber-500">
                          {Array.from({ length: 5 }).map((_, st) => (
                            <Star 
                              key={st} 
                              className={`w-3 h-3 ${st < rev.rating ? 'fill-amber-400' : 'text-gray-200'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-650 leading-relaxed italic">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Form column */}
              <div className="md:col-span-5 bg-gray-50/55 p-5 border border-gray-150 border-dashed rounded-2xl" id="review-submission-box">
                <h4 className="text-sm font-extrabold text-blue-950 uppercase tracking-wide mb-4 flex items-center gap-1">
                  <span>Write a Product Review</span>
                </h4>

                <form onSubmit={handleReviewSubmission} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Display Name *</label>
                    <input 
                      type="text"
                      required
                      value={revName}
                      onChange={(e) => setRevName(e.target.value)}
                      className="w-full px-4 py-2 text-xs border border-gray-200 rounded-lg bg-white"
                      placeholder="e.g. Mercy Auma" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Rating Stars Score</label>
                    <select
                      value={revRating}
                      onChange={(e) => setRevRating(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white font-semibold"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 Stars Excellent)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 Stars Great)</option>
                      <option value={3}>⭐⭐⭐ (3 Stars Satisfactory)</option>
                      <option value={2}>⭐⭐ (2 Stars Fair)</option>
                      <option value={1}>⭐ (1 Star Unsatisfactory)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1 font-sans">Share your experience *</label>
                    <textarea
                      required
                      rows={3}
                      value={revComment}
                      onChange={(e) => setRevComment(e.target.value)}
                      className="w-full px-4 py-2 text-xs border border-gray-200 rounded-lg bg-white"
                      placeholder="Explain features detail, audio quality, delivery pacing feedback..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingRev}
                    className="w-full bg-blue-900 hover:bg-blue-950 text-white font-semibold text-xs py-2 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Public Feedback</span>
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
