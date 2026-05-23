/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product } from '../types';
import { useStore } from './StoreContext';
import { Star, Heart, ShoppingCart, Info, Check } from 'lucide-react';

export default function ProductCard({ product }: { product: Product }) {
  const { 
    addToCart, 
    toggleWishlist, 
    wishlist, 
    cart,
    setView, 
    setSelectedProductId 
  } = useStore();

  const isStarredInWishlist = wishlist.includes(product.id);
  const isInCart = cart.some(item => item.productId === product.id);

  // Calculate discount percentage if original price is populated
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) 
    : 0;

  const handleProductViewRedirect = () => {
    setSelectedProductId(product.id);
    setView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      className="bg-white rounded-xl border border-gray-100 hover:border-blue-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group overflow-hidden"
      id={`prod-card-${product.id}`}
    >
      {/* Product Image Stage container */}
      <div className="relative pt-[100%] bg-gray-50 overflow-hidden cursor-pointer" onClick={handleProductViewRedirect}>
        {/* Badges Absolute */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.bestSeller && (
            <span className="bg-blue-600 text-white text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded shadow-sm">
              Best Seller
            </span>
          )}
          {product.newArrival && (
            <span className="bg-emerald-600 text-white text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded shadow-sm">
              New
            </span>
          )}
          {hasDiscount && (
            <span className="bg-red-600 text-white text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded shadow-sm">
              Sale -{discountPercent}%
            </span>
          )}
          {product.stock <= 0 ? (
            <span className="bg-gray-800 text-white text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded shadow-sm">
              Out of Stock
            </span>
          ) : product.stock <= 5 ? (
            <span className="bg-amber-600 text-white text-[9px] font-bold tracking-wider uppercase px-2  py-0.5 rounded shadow-sm animate-pulse">
              Only {product.stock} Left
            </span>
          ) : null}
        </div>

        {/* Wishlist toggle absolute button */}
        <button 
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className="absolute top-3 right-3 p-2 rounded-full shadow-sm bg-white/95 text-gray-400 hover:text-red-500 hover:scale-115 transition-all z-10 cursor-pointer"
          title={isStarredInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 transition-all ${isStarredInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Main image reference */}
        <img 
          src={product.imageUrl} 
          alt={product.name}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-106 transition-transform duration-500"
        />
      </div>

      {/* Captions Frame */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Category label */}
        <span className="text-[11px] font-bold font-mono tracking-wider text-blue-600 uppercase mb-1.5 block">
          {product.category}
        </span>

        {/* Product Title */}
        <h3 
          onClick={handleProductViewRedirect}
          className="text-sm font-bold font-sans text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-2 leading-snug mb-2 flex-1"
        >
          {product.name}
        </h3>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-3.5">
          <div className="flex text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`w-3.5 h-3.5 ${i < Math.round(product.ratingAverage) ? 'fill-amber-400' : 'text-gray-200'}`} 
              />
            ))}
          </div>
          <span className="text-[11px] text-gray-500 font-medium tracking-tight">({product.ratingCount})</span>
        </div>

        {/* Price Tag & CTA Line */}
        <div className="flex items-center justify-between mt-auto gap-2">
          {/* Price */}
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through font-mono">
                Ksh {product.originalPrice?.toLocaleString()}
              </span>
            )}
            <span className="text-base sm:text-lg font-extrabold text-blue-950 font-sans tracking-tight leading-none">
              Ksh {product.price.toLocaleString()}
            </span>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex gap-1">
            <button 
              onClick={handleProductViewRedirect}
              className="p-2 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              title="View Specifications & Reviews"
            >
              <Info className="w-4.5 h-4.5" />
            </button>

            {product.stock > 0 ? (
              <button 
                onClick={() => addToCart(product.id)}
                className={`p-2 rounded-lg font-semibold transition-all flex items-center justify-center cursor-pointer ${isInCart ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'}`}
                title="Add to Shopping Cart"
              >
                {isInCart ? <Check className="w-4.5 h-4.5" /> : <ShoppingCart className="w-4.5 h-4.5" />}
              </button>
            ) : (
              <button 
                disabled
                className="p-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
                title="Sold Out"
              >
                <ShoppingCart className="w-4.5 h-4.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
