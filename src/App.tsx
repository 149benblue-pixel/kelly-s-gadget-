/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from './components/StoreContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetails from './components/ProductDetails';
import CartCheckout from './components/CartCheckout';
import CustomerAccount from './components/CustomerAccount';
import OrderTracking from './components/OrderTracking';
import AdminPanel from './components/AdminPanel';
import AboutContactFAQ from './components/AboutContactFAQ';
import { 
  Laptop, 
  Smartphone, 
  Tv, 
  Volume2, 
  Watch, 
  Gamepad, 
  Cable, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  CheckCircle,
  HelpCircle,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';

export default function App() {
  const { 
    currentView, 
    setView, 
    products, 
    categories, 
    fetchProducts,
    showNotification,
    websiteSettings,
    user
  } = useStore();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [activeFiltTab, setActiveFiltTab] = useState<'all' | 'featured' | 'bestsellers' | 'arrivals'>('all');
  const [aboutInitialTab, setAboutInitialTab] = useState('about');

  // Shop filter parameters states
  const [shopCategory, setShopCategory] = useState('all');
  const [shopMaxPrice, setShopMaxPrice] = useState(500000);
  const [shopSearch, setShopSearch] = useState('');

  const handleCategorySelection = (slug: string) => {
    fetchProducts({ category: slug });
    setShopCategory(slug);
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getFilteredProductsHome = () => {
    switch (activeFiltTab) {
      case 'featured':
        return products.filter(p => p.featured).slice(0, 4);
      case 'bestsellers':
        return products.filter(p => p.bestSeller).slice(0, 4);
      case 'arrivals':
        return products.filter(p => p.newArrival).slice(0, 4);
      default:
        return products.slice(0, 8);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    showNotification(`Subscription secured! We'll dispatch discount notifications to: ${newsletterEmail}`, "success");
    setNewsletterEmail('');
  };

  const openAboutInformationPage = (tabName: string) => {
    setAboutInitialTab(tabName);
    setView('about-contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- FILTERS LOGIC FOR SHOP PAGE ---
  const applyShopFiltersReset = () => {
    setShopCategory('all');
    setShopMaxPrice(2500);
    setShopSearch('');
    fetchProducts();
  };

  const getFilteredShopProductsList = () => {
    return products.filter(p => {
      const matchCat = shopCategory === 'all' || p.category === shopCategory;
      const matchPrice = p.price <= shopMaxPrice;
      const matchSearch = !shopSearch || 
        p.name.toLowerCase().includes(shopSearch.toLowerCase()) || 
        p.description.toLowerCase().includes(shopSearch.toLowerCase());
      return matchCat && matchPrice && matchSearch;
    });
  };

  return (
    <div className="bg-slate-50/50 min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white" id="storefront-root">
      {/* Upper header */}
      <Header />

      {/* Main Dynamic Workspace Frame */}
      <main className="flex-1" id="main-content-flow">
        
        {/* VIEW 1: HOMEPAGE SCREEN */}
        {currentView === 'home' && (
          <div className="space-y-16 pb-16" id="view-homepage">
            {/* Hero slider */}
            <Hero />

            {/* A. Category Navigation Row Bubble Cards */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12" id="home-categories-rail">
              <div className="text-center mb-8">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#0ea5e9]">Premium Catalog Specialties</span>
                <h3 className="text-2xl font-black text-blue-950 font-sans tracking-tight mt-1">Browse and filter by Specialty</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4" id="categories-boxes-rail">
                {[
                  { id: '1', slug: 'smartphones', name: 'Smartphones', icon: <Smartphone className="w-5 h-5 text-blue-600" /> },
                  { id: '2', slug: 'laptops', name: 'Notebooks', icon: <Laptop className="w-5 h-5 text-blue-600" /> },
                  { id: '3', slug: 'accessories', name: 'Accessories', icon: <Cable className="w-5 h-5 text-blue-600" /> },
                  { id: '4', slug: 'smart-watches', name: 'Watches', icon: <Watch className="w-5 h-5 text-blue-600" /> },
                  { id: '5', slug: 'tablets', name: 'Tablets', icon: <Tv className="w-5 h-5 text-blue-600" /> },
                  { id: '6', slug: 'speakers', name: 'Speakers', icon: <Volume2 className="w-5 h-5 text-blue-600" /> },
                  { id: '7', slug: 'gaming-devices', name: 'Consoles', icon: <Gamepad className="w-5 h-5 text-blue-600" /> }
                ].map(cat => (
                  <div 
                    key={cat.id}
                    onClick={() => handleCategorySelection(cat.slug)}
                    className="bg-white border border-gray-100 hover:border-blue-200 hover:shadow-xs rounded-2xl p-4 text-center cursor-pointer transition-all duration-300"
                  >
                    <div className="bg-gray-50 group-hover:bg-blue-50 w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-2.5 transition-colors">
                      {cat.icon}
                    </div>
                    <span className="text-xs font-bold text-gray-800 tracking-tight block truncate uppercase">{cat.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* B. Dynamic Filter Tabs Grid products showcase */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="home-showcase">
              <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-100 pb-5 mb-8 gap-4">
                <div className="text-left">
                  <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase">Guaranteed Authentic Devices</span>
                  <h3 className="text-2xl font-black text-blue-950 tracking-tight mt-0.5">Explore popular models</h3>
                </div>

                {/* Switcher tabs */}
                <div className="flex bg-gray-100/60 p-1 rounded-xl border border-gray-200 text-xs font-bold text-gray-700">
                  <button 
                    onClick={() => setActiveFiltTab('all')}
                    className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${activeFiltTab === 'all' ? 'bg-white text-blue-600 shadow-3xs' : 'hover:text-blue-600'}`}
                  >
                    All Specialties
                  </button>
                  <button 
                    onClick={() => setActiveFiltTab('featured')}
                    className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${activeFiltTab === 'featured' ? 'bg-white text-blue-600 shadow-3xs' : 'hover:text-blue-600'}`}
                  >
                    Featured Devices
                  </button>
                  <button 
                    onClick={() => setActiveFiltTab('bestsellers')}
                    className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${activeFiltTab === 'bestsellers' ? 'bg-white text-blue-600 shadow-3xs' : 'hover:text-blue-600'}`}
                  >
                    Best Sellers
                  </button>
                  <button 
                    onClick={() => setActiveFiltTab('arrivals')}
                    className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${activeFiltTab === 'arrivals' ? 'bg-white text-blue-600 shadow-3xs' : 'hover:text-blue-600'}`}
                  >
                    Latest Arrivals
                  </button>
                </div>
              </div>

              {/* Grid cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="home-product-showcase-grid">
                {getFilteredProductsHome().map(p => (
                  <div key={p.id} className="contents">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>

              {/* View all button links */}
              <div className="text-center mt-10">
                <button 
                  onClick={() => { applyShopFiltersReset(); setView('shop'); }}
                  className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xs transition-transform cursor-pointer"
                >
                  <span>Explore complete catalog ({products.length} models)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>

            {/* C. Dynamic visual promo campaign card boxes */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6" id="home-banners">
              {/* Box 1: ANC Systems */}
              <div className="bg-gradient-to-br from-blue-950 to-indigo-900 text-white rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between h-56 border border-blue-900 shadow-md">
                <div className="max-w-xs relative z-10">
                  <span className="text-[10px] font-extrabold uppercase bg-indigo-500 text-white px-2 py-0.5 rounded tracking-wide font-mono">Special Campaign</span>
                  <h4 className="text-xl sm:text-2xl font-black mt-2 leading-tight">Elevate Sound Specs. Pure ANC Active.</h4>
                  <p className="text-xs text-blue-200 mt-1">Acquire elite headsets with up to 24 Months store warrants coverage clearance.</p>
                </div>
                <button 
                  onClick={() => handleCategorySelection('accessories')}
                  className="bg-white hover:bg-gray-100 text-blue-950 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer w-max relative z-10 self-start transition-all"
                >
                  Apply Code TECH10
                </button>
                <div className="absolute right-0 bottom-0 w-36 h-36 bg-blue-500 rounded-full filter blur-2xl opacity-20 pointer-events-none" />
              </div>

              {/* Box 2: Laptops */}
              <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between h-56 border border-emerald-950 shadow-md">
                <div className="max-w-xs relative z-10">
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-500 text-white px-2 py-0.5 rounded tracking-wide font-mono">Operations Special</span>
                  <h4 className="text-xl sm:text-2xl font-black mt-2 leading-tight">M3 MacBook Pro 16" Coding Rigs.</h4>
                  <p className="text-xs text-emerald-200 mt-1">Direct logistics dispatches safely to our Sophia Road Homabay head office.</p>
                </div>
                <button 
                  onClick={() => handleCategorySelection('laptops')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer w-max relative z-10 self-start transition-all"
                >
                  Shop Custom Notebooks
                </button>
                <div className="absolute right-0 bottom-0 w-36 h-36 bg-emerald-500 rounded-full filter blur-2xl opacity-20 pointer-events-none" />
              </div>
            </section>

            {/* D. Testimonials carousel */}
            <section className="bg-white border-y border-gray-100 py-16" id="home-customer-testimonials">
              <div className="max-w-4xl mx-auto px-4 text-center font-sans">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0ea5e9]">COMMUNITY TESTIMONIALS</span>
                <h3 className="text-2xl font-black text-blue-950 tracking-tight mt-1 mb-8">What tech developers say about Kelly's</h3>
                
                <div className="italic text-base sm:text-lg text-gray-700 leading-relaxed font-sans max-w-2xl mx-auto mb-6">
                  "Kelly's Gadgets Store completely solved my corporate notebook procurement concern! We cleared multiple customized laptops using Safaricom M-Pesa STK prompts without any banking latency. First-day courier was pristine!"
                </div>
                <p className="text-xs sm:text-sm font-bold text-blue-950 uppercase">— Kelvin Gitau, Tech Operations lead (Homabay Branch)</p>
              </div>
            </section>

            {/* E. Newsletter Subscription */}
            <section className="max-w-4xl mx-auto px-4 text-center" id="home-newsletter-subscription">
              <div className="bg-gradient-to-br from-[#0c4a6e] to-[#0f172a] text-white rounded-3xl p-6 sm:p-10 border border-sky-950 shadow-md">
                <span className="text-[10px] uppercase font-bold text-[#38bdf8] tracking-widest block mb-1">STAY TUNED FOR RE-STOCKS</span>
                <h4 className="text-xl sm:text-2xl font-black tracking-tight">Obtain customized coupons and specifications alerts</h4>
                <p className="text-xs text-sky-200 mt-1 mb-6 max-w-sm mx-auto">Input your active mail details. We dispatch verified hardware deals once every week.</p>
                
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto relative z-10" id="newsletter-inner-form">
                  <input 
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter email e.g. mercy@domain.com"
                    className="flex-1 px-4 py-2.5 text-sm text-gray-900 border border-transparent rounded-xl focus:outline-hidden"
                  />
                  <button 
                    type="submit"
                    className="bg-[#0284c7] hover:bg-[#38bdf8] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Subscribe Alerts
                  </button>
                </form>
              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: COMPLETE ELECTRONICS CATALOG (SHOPPING PAGE) */}
        {currentView === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="view-shopping-catalog">
            
            <div className="flex flex-col md:flex-row gap-8 items-start">
              
              {/* Left filter columns sidebar - Desktop only */}
              <aside className="w-full md:w-64 bg-white border border-gray-150 p-5 rounded-2xl shadow-3xs space-y-6" id="shop-categories-filters">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                  <span className="text-xs uppercase font-extrabold text-blue-950">Catalog Filters</span>
                  <button 
                    onClick={applyShopFiltersReset}
                    className="text-[10px] text-red-500 font-bold hover:underline"
                  >
                    Reset Filter
                  </button>
                </div>

                {/* Categories filtering list */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Category lists</span>
                  <button 
                    onClick={() => setShopCategory('all')}
                    className={`w-full text-left py-1.5 px-3 rounded-lg text-xs font-bold transition-colors block ${shopCategory === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                     All Specialties
                  </button>
                  {categories.map(c => (
                    <button 
                      key={c.id} 
                      onClick={() => setShopCategory(c.slug)}
                      className={`w-full text-left py-1.5 px-3 rounded-lg text-xs font-bold transition-all block ${shopCategory === c.slug ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>

                {/* Pricing slider filters */}
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Pricing limits (Ksh)</span>
                  <input 
                    type="range"
                    min={1000}
                    max={500000}
                    step={1000}
                    value={shopMaxPrice}
                    onChange={(e) => setShopMaxPrice(Number(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                  />
                  <div className="flex justify-between items-center text-xs font-bold text-blue-955 font-mono">
                    <span>Ksh 1,000</span>
                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">Up to: Ksh {shopMaxPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Text search filters inside sidebar */}
                <div className="space-y-2 pt-3 border-t border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1 font-sans">Filter keywords</span>
                  <input 
                    type="text"
                    value={shopSearch}
                    onChange={(e) => setShopSearch(e.target.value)}
                    placeholder="e.g. titanium, retina hdd..."
                    className="w-full px-3 py-1.5 border border-gray-200 text-xs rounded-lg bg-gray-50 focus:outline-hidden"
                  />
                </div>
              </aside>

              {/* Right Showcase Products grid */}
              <div className="flex-1" id="shop-results-panel">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-blue-955 font-sans leading-none">Custom Electronics Catalog</h2>
                    <span className="text-[11px] text-gray-400 font-medium block mt-1 uppercase">Filtering match: {getFilteredShopProductsList().length} unique listings found</span>
                  </div>
                </div>

                {getFilteredShopProductsList().length === 0 ? (
                  <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <h3 className="text-lg font-bold text-gray-700">No products match current specifications</h3>
                    <p className="text-xs text-gray-500 mt-1 mb-4">Please refine your category keywords, increase price limits or click reset.</p>
                    <button 
                      onClick={applyShopFiltersReset}
                      className="bg-blue-600 text-white font-semibold text-xs px-5 py-2 rounded-lg cursor-pointer"
                    >
                      Reset Catalog Parameters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="shop-products-cards-grid">
                    {getFilteredShopProductsList().map(p => (
                      <div key={p.id} className="contents">
                        <ProductCard product={p} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* VIEW 3: PRODUCT SPECIFICATIONS & DETAILS */}
        {currentView === 'product-detail' && <ProductDetails />}

        {/* VIEW 4: CART AND SECURE CHECKOUT SCREENS */}
        {(currentView === 'cart' || currentView === 'checkout' || currentView === 'wishlist') && <CartCheckout />}

        {/* VIEW 5: SECURITY USER ACCOUNT */}
        {currentView === 'customer-account' && <CustomerAccount />}

        {/* VIEW 6: ORDER TRANSIT TRACKER */}
        {currentView === 'order-tracking' && <OrderTracking />}

        {/* VIEW 7: SUPER USER ADMINISTRATION BACKUPS SUITE */}
        {currentView === 'admin-dashboard' && <AdminPanel />}

        {/* VIEW 8: ABOUT US, CONTACT US, MAPS */}
        {currentView === 'about-contact' && <AboutContactFAQ initialTab={aboutInitialTab} />}

      </main>

      {/* Persistent Footer with rich information anchors */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800" id="store-main-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12" id="footer-bento">
            
            {/* Logo Description block Column */}
            <div className="md:col-span-4 space-y-4">
              <span className="text-white text-lg font-black tracking-tight flex items-center gap-1 cursor-pointer" onClick={() => { setView('home'); fetchProducts(); }}>
                Kelly's <span className="text-blue-500">Gadgets Store</span>
              </span>
              <p className="text-xs leading-relaxed text-slate-400 max-w-xs font-sans">
                Premium authorized consumer electronics retailer matching smartphones, productivity laptops, smart watches, sound speakers, tablets, accessories, and elite gaming consoles. Established within Homabay.
              </p>
              
              {/* Social links */}
              <div className="flex gap-2.5 pt-2" id="footer-social-anchors">
                <a href={websiteSettings.socialFacebook || "https://facebook.com"} target="_blank" rel="noreferrer" className="bg-slate-800 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors cursor-pointer" title="Facebook Page Link">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href={websiteSettings.socialTwitter || "https://twitter.com"} target="_blank" rel="noreferrer" className="bg-slate-800 hover:bg-[#00acee] text-white p-2 rounded-lg transition-colors cursor-pointer" title="Twitter Page Link">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href={websiteSettings.socialInstagram || "https://instagram.com"} target="_blank" rel="noreferrer" className="bg-slate-800 hover:bg-[#d62976] text-white p-2 rounded-lg transition-colors cursor-pointer" title="Instagram Page Link">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href={websiteSettings.socialYoutube || "https://youtube.com"} target="_blank" rel="noreferrer" className="bg-slate-800 hover:bg-red-650 text-white p-2 rounded-lg transition-colors cursor-pointer" title="Youtube Video Channel">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick anchors columns */}
            <div className="md:col-span-3 space-y-3 text-xs sm:text-sm" id="footer-help-links">
              <h5 className="text-slate-100 font-bold uppercase tracking-wider text-xs">Help & Support Desk</h5>
              <div className="flex flex-col gap-2 font-medium">
                <button onClick={() => openAboutInformationPage('faq')} className="text-left hover:text-white transition-colors cursor-pointer">FAQs & Payment Guidelines</button>
                <button onClick={() => openAboutInformationPage('returns')} className="text-left hover:text-white transition-colors cursor-pointer">Returns & Refunds Policy</button>
                <button onClick={() => openAboutInformationPage('warranty')} className="text-left hover:text-white transition-colors cursor-pointer">Warranty & Authenticity Specs</button>
                <button onClick={() => openAboutInformationPage('support')} className="text-left hover:text-white transition-colors cursor-pointer">24/7 Priority Support Desk</button>
              </div>
            </div>

            {/* General policies anchors columns */}
            <div className="md:col-span-2 space-y-3 text-xs sm:text-sm">
              <h5 className="text-slate-100 font-bold uppercase tracking-wider text-xs">Kelly's Company</h5>
              <div className="flex flex-col gap-2 font-medium">
                <button onClick={() => openAboutInformationPage('about')} className="text-left hover:text-white transition-colors cursor-pointer text-xs">About Us Bio</button>
                <button onClick={() => openAboutInformationPage('contact')} className="text-left hover:text-white transition-colors cursor-pointer text-xs">Homabay Offices Map Location</button>
                <button onClick={() => openAboutInformationPage('privacy')} className="text-left hover:text-white transition-colors cursor-pointer text-xs">Privacy Integrity Policy</button>
                <button onClick={() => openAboutInformationPage('terms')} className="text-left hover:text-white transition-colors cursor-pointer text-xs">Terms & Conditions</button>
              </div>
            </div>

            {/* Physical Location indicators */}
            <div className="md:col-span-3 space-y-3 text-xs" id="footer-coordinates">
              <h5 className="text-slate-100 font-bold uppercase tracking-wider text-xs">Physical Coordinates</h5>
              <div className="space-y-2 leading-relaxed text-slate-400">
                <p>📍 {websiteSettings?.contactAddress || "Lavin Tower, First Floor, Sophia, Homabay, Kenya"}</p>
                <p>📞 Phone support: {websiteSettings?.contactPhone || "+254 787 272 428"}</p>
                <p className="font-semibold text-white">⌚ Open Mon - Sat: 8:00 AM to 5:00 PM</p>
              </div>
            </div>

          </div>

          <hr className="border-slate-800 my-8" />

          {/* Copyright ribbon */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500" id="footer-copyright-strip">
            <span>© 2026 Kelly's Gadgets Store LTD. Exclusive authorized consumer electronics retailer. All Rights Reserved.</span>
            <span>Made with ❤️ in Homabay</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
