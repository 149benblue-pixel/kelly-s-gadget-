/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from './StoreContext';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  ChevronDown, 
  LogOut, 
  Store, 
  ShieldCheck, 
  ClipboardList, 
  Menu, 
  X,
  Smartphone,
  Laptop,
  Watch,
  Tablet,
  Volume2,
  Gamepad,
  Cable
} from 'lucide-react';

export default function Header() {
  const { 
    cart, 
    wishlist, 
    user, 
    logout, 
    setView, 
    currentView,
    categories,
    fetchProducts
  } = useStore();

  const [searchWord, setSearchWord] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts({ search: searchWord, category: selectedCat });
    setView('shop');
  };

  const handleCategorySelection = (catSlug: string) => {
    setSelectedCat(catSlug);
    fetchProducts({ category: catSlug });
    setView('shop');
    setMobileMenuOpen(false);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone': return <Smartphone className="w-4 h-4" />;
      case 'Laptop': return <Laptop className="w-4 h-4" />;
      case 'Watch': return <Watch className="w-4 h-4" />;
      case 'Tablet': return <Tablet className="w-4 h-4" />;
      case 'Volume2': return <Volume2 className="w-4 h-4" />;
      case 'Gamepad': return <Gamepad className="w-4 h-4" />;
      default: return <Cable className="w-4 h-4" />;
    }
  };

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-blue-50/70 shadow-xs" id="store-main-header">
      {/* Top micro-bar for direct contact & quick admin demo login access notification */}
      <div className="bg-blue-900 text-white text-[12px] py-2 px-4" id="header-top-ribbon">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-1.5 font-sans">
          <div className="flex gap-4">
            <span>📞 Call Us: <strong>+254 712 345 678</strong></span>
            <span className="hidden sm:inline">📍 Standard Street, Nairobi, Kenya (Kelly's building)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-blue-800 text-blue-200 px-2 py-0.5 rounded text-[10px] font-mono tracking-tight font-semibold">2-ADMIN LIMIT CONTROL ON</span>
            <span className="text-blue-100 hidden md:inline">🔥 Get 10% Discount using coupon <strong className="text-white bg-blue-700 px-1 py-0.5 rounded font-mono">TECH10</strong></span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="header-main-bar">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => { setView('home'); fetchProducts(); }} id="store-logo-trigger">
            <div className="bg-blue-600 text-white p-2.5 rounded-lg shadow-sm flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-blue-950 flex items-center gap-1">
                Kelly's <span className="text-blue-600">Gadgets</span>
              </h1>
              <span className="text-[10px] uppercase tracking-widest font-mono text-blue-700 block -mt-1 font-semibold">Premium Retailer</span>
            </div>
          </div>

          {/* Search bar & Category dropdown - Desktop only */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 max-w-lg items-center bg-gray-50 border border-gray-200 focus-within:border-blue-500 rounded-full overflow-hidden shadow-2xs" id="desktop-search-form">
            <div className="relative shrink-0 border-r border-gray-200">
              <select 
                value={selectedCat}
                onChange={(e) => handleCategorySelection(e.target.value)}
                className="bg-transparent pl-4 pr-8 py-2 text-xs font-medium text-gray-700 focus:outline-hidden appearance-none cursor-pointer"
              >
                <option value="all">All Specialties</option>
                {categories.map(c => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
            
            <input 
              type="text"
              placeholder="Search smartphones, gaming rigs, storage specs..."
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              className="flex-1 px-4 py-2 text-sm text-gray-800 focus:outline-hidden bg-transparent"
            />
            
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 mx-1.5 rounded-full transition-colors flex items-center justify-center cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Standard Page Nav triggers for desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600" id="desktop-nav-menu">
            <button 
              onClick={() => { setView('home'); fetchProducts(); }}
              className={`hover:text-blue-600 transition-colors cursor-pointer ${currentView === 'home' ? 'text-blue-600 font-semibold' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => { setView('shop'); fetchProducts(); }}
              className={`hover:text-blue-600 transition-colors cursor-pointer ${currentView === 'shop' ? 'text-blue-600 font-semibold' : ''}`}
            >
              Shop All
            </button>
            <button 
              onClick={() => setView('order-tracking')}
              className={`hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1.5 ${currentView === 'order-tracking' ? 'text-blue-600 font-semibold' : ''}`}
            >
              <ClipboardList className="w-4 h-4" />
              Track Order
            </button>
          </nav>

          {/* Right Icons: Cart, Wishlist, Account, Hamburger */}
          <div className="flex items-center gap-2 sm:gap-4" id="header-action-button-group">
            {/* Wishlist */}
            <button 
              onClick={() => setView('wishlist')}
              className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all cursor-pointer"
              title="View Wishlist"
              id="wishlist-trigger"
            >
              <Heart className="w-5 h-5 sm:w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center ring-2 ring-white animate-bounce">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button 
              onClick={() => setView('cart')}
              className="relative p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all cursor-pointer"
              title="Shopping Bag"
              id="cart-trigger"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 h-6" />
              {cartTotalItems > 0 && (
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartTotalItems}
                </span>
              )}
            </button>

            {/* Profile / Admin dashboard triggers */}
            {user ? (
              <div className="flex items-center gap-2 border-l border-gray-200 pl-2 sm:pl-4" id="user-status-box">
                {user.role === 'admin' ? (
                  <button 
                    onClick={() => setView('admin-dashboard')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold shadow-xs cursor-pointer"
                    title="Open Administrator Dashboard"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="hidden lg:inline">Admin System</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => setView('customer-account')}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium cursor-pointer"
                  >
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="max-w-[80px] truncate hidden sm:inline font-sans">{user.name.split(' ')[0]}</span>
                  </button>
                )}
                <button 
                  onClick={logout}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-full transition-all cursor-pointer"
                  title="Logout Account"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setView('customer-account')}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                id="login-btn-trigger"
              >
                <User className="w-4 h-4" />
                <span>Account Login</span>
              </button>
            )}

            {/* Mobile hamburger menu toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg md:hidden cursor-pointer"
              id="mobile-hamburger-trigger"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile drawer and categories navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg py-4 px-4 transition-all" id="mobile-navigation-drawer">
          {/* Mobile dynamic search */}
          <form onSubmit={handleSearchSubmit} className="flex mb-4 items-center bg-gray-100 border border-gray-200 focus-within:border-blue-500 rounded-lg overflow-hidden py-1.5 z-10">
            <input 
              type="text"
              placeholder="Search store inventory..."
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              className="flex-1 px-3 text-sm text-gray-800 bg-transparent focus:outline-hidden"
            />
            <button type="submit" className="p-2 mr-1 bg-blue-600 text-white rounded-md cursor-pointer">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Quick link triggers */}
          <div className="flex flex-col gap-2 mb-4 font-medium text-sm text-gray-700">
            <button 
              onClick={() => { setView('home'); fetchProducts(); setMobileMenuOpen(false); }}
              className="text-left py-2 px-3 hover:bg-blue-50 rounded-lg"
            >
              Home Page
            </button>
            <button 
              onClick={() => { setView('shop'); fetchProducts(); setMobileMenuOpen(false); }}
              className="text-left py-2 px-3 hover:bg-blue-50 rounded-lg"
            >
              Product Catalog
            </button>
            <button 
              onClick={() => { setView('order-tracking'); setMobileMenuOpen(false); }}
              className="text-left py-2 px-3 hover:bg-blue-50 rounded-lg flex items-center gap-2"
            >
              <ClipboardList className="w-4 h-4" />
              Track Electronic Shipment
            </button>
            <button 
              onClick={() => { setView('wishlist'); setMobileMenuOpen(false); }}
              className="text-left py-2 px-3 hover:bg-blue-50 rounded-lg flex items-center gap-2 text-red-600"
            >
              <Heart className="w-4 h-4 fill-red-600" />
              Wishlist Items ({wishlist.length})
            </button>
          </div>

          <hr className="border-gray-100 my-3" />

          {/* Categories List in mobile drawer */}
          <h3 className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-2 px-3">Filter by Category</h3>
          <div className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
            <button 
              onClick={() => handleCategorySelection('all')}
              className={`flex items-center gap-2.5 py-2 px-3 rounded-lg ${selectedCat === 'all' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
            >
              <Store className="w-4 h-4" />
              <span>All Specialties</span>
            </button>
            {categories.map(c => (
              <button 
                key={c.id} 
                onClick={() => handleCategorySelection(c.slug)}
                className={`flex items-center gap-2.5 py-2 px-3 rounded-lg ${selectedCat === c.slug ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                {getCategoryIcon(c.icon)}
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
