/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from './StoreContext';
import { Mail, Phone, MapPin, Send, HelpCircle, Shield, FileText, Gift, RotateCcw, Wrench, LifeBuoy, Map, ChevronDown } from 'lucide-react';

interface TabConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export default function AboutContactFAQ({ initialTab = 'about' }: { initialTab?: string }) {
  const { showNotification, websiteSettings } = useStore();
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  
  // Simulated Zoom state for Maps
  const [mapZoom, setMapZoom] = useState(15);

  const tabs: TabConfig[] = [
    { id: 'about', name: 'About Us', icon: <Gift className="w-4 h-4" /> },
    { id: 'contact', name: 'Contact Us', icon: <MapPin className="w-4 h-4 text-blue-600" /> },
    { id: 'faq', name: 'FAQs Accordion', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'privacy', name: 'Privacy Policy', icon: <Shield className="w-4 h-4" /> },
    { id: 'terms', name: 'Terms & Conditions', icon: <FileText className="w-4 h-4" /> },
    { id: 'returns', name: 'Return Policy', icon: <RotateCcw className="w-4 h-4" /> },
    { id: 'warranty', name: 'Warranty Specs', icon: <Wrench className="w-4 h-4" /> },
    { id: 'support', name: 'Customer Support', icon: <LifeBuoy className="w-4 h-4 text-emerald-600" /> }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      showNotification("Please fill in all required fields", "error");
      return;
    }
    showNotification(`Thanks ${contactName}! Your inquiry has been dispatched to the Sales desk. Kelly's Support will write back shortly.`, "success");
    setContactName('');
    setContactEmail('');
    setContactSubject('');
    setContactMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="info-center-module">
      {/* Title */}
      <div className="text-center mb-10" id="info-header-intro">
        <h2 className="text-3xl font-extrabold text-blue-950 font-sans tracking-tight">
          Help Desk & Store Information
        </h2>
        <p className="text-emerald-600 text-sm font-semibold tracking-wider uppercase mt-1">
          Kelly's Gadgets official customer support terminal
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side Tab Selectors Navigation List */}
        <div className="lg:col-span-3 flex flex-col gap-1 bg-white border border-gray-100 p-3 rounded-xl shadow-xs" id="info-tabs-navigator">
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2 px-3 block">Navigation Pages</span>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex items-center gap-3 py-3 px-4 rounded-lg text-sm font-semibold transition-all text-left cursor-pointer ${activeTab === t.id ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`}
            >
              {t.icon}
              <span>{t.name}</span>
            </button>
          ))}
        </div>

        {/* Right Side Tab Panels content dynamic display */}
        <div className="lg:col-span-9 bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-xs" id="info-dynamic-panels">
          
          {/* 1. ABOUT US PANEL */}
          {activeTab === 'about' && (
            <div className="prose max-w-none text-gray-700 font-sans leading-relaxed" id="panel-about">
              <h3 className="text-2xl font-bold text-blue-950 mb-4 pb-2 border-b border-gray-150">About {websiteSettings.storeName || "Kelly's Gadgets Store"}</h3>
              <p className="mb-4 text-sm sm:text-base whitespace-pre-line">
                {websiteSettings.aboutText || `Welcome to Kelly's Gadgets Store, the premier technology destination established in 2026. Inspired by the lack of direct, high-quality, authentic consumer electronics retailers, Kelly Super Admin launched this platform to bridge the gap by offering premium smartphones, productivity laptops, accessories, elite smart watches, screen tablets, immersive speakers, and modern high-frame combat consoles.

Every single item in our inventory is strictly sourced directly from official manufacturing headquarters, ensuring that counterfeit risks are eliminated. Our fully integrated custom localized payment architectures (like Safaricom M-Pesa alongside automated Mastercard and Visa clearances) are calibrated to empower buyers across Africa and globally with frictionless checkout clearances.`}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                <div className="bg-blue-50/50 border border-blue-100/50 p-4 rounded-xl text-center">
                  <span className="text-3xl font-bold text-blue-700 block mb-1">100% Secure</span>
                  <span className="text-xs uppercase font-semibold text-gray-500">M-Pesa & Card Integrity</span>
                </div>
                <div className="bg-blue-50/50 border border-blue-100/50 p-4 rounded-xl text-center">
                  <span className="text-3xl font-bold text-blue-700 block mb-1">Direct Warranty</span>
                  <span className="text-xs uppercase font-semibold text-gray-500">24-Month Backing</span>
                </div>
                <div className="bg-blue-50/50 border border-blue-100/50 p-4 rounded-xl text-center">
                  <span className="text-3xl font-bold text-blue-700 block mb-1">Fast Delivery</span>
                  <span className="text-xs uppercase font-semibold text-gray-500">Nationwide Cargo</span>
                </div>
              </div>

              <h4 className="text-lg font-bold text-blue-900 mb-2">Our Corporate Pledge</h4>
              <p className="text-sm whitespace-pre-line font-medium text-gray-705">
                {websiteSettings.aboutPledge || `To respect consumer trust. We avoid the inflation common in third-party retail channels by providing real-time stock balances, dynamic discount triggers, automated invoice billing, and an absolute commitment to customer security under the surveillance of our two primary operations executives.`}
              </p>
            </div>
          )}

          {/* 2. CONTACT US PANEL with Google Maps location and Contact Form */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 font-sans" id="panel-contact">
              {/* Form columns */}
              <div className="md:col-span-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-blue-950 mb-2">Send us a Message</h3>
                  <p className="text-sm text-gray-500 mb-6 font-medium">Have general specs queries or special corporate procurement bids? Shoot us an email!</p>
                  
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Full Name *</label>
                      <input 
                        type="text" 
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                        placeholder="e.g. Kelvin Mutua"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address *</label>
                      <input 
                        type="email" 
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                        placeholder="yourname@domain.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subject</label>
                      <input 
                        type="text" 
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                        placeholder="Product inquiry, wholesale pricing..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Message Content *</label>
                      <textarea 
                        required
                        rows={4}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-blue-500"
                        placeholder="Write down details of your gadget or shipping concern here..."
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm cursor-pointer transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Maps & Direct Info Column */}
              <div className="md:col-span-6 flex flex-col gap-6">
                <div>
                  <h3 className="text-xl font-bold text-blue-950 mb-3">Direct Contact Info</h3>
                  <div className="space-y-3.5 text-sm text-gray-600">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{websiteSettings.contactAddress || "Standard Building, 1st Floor Suite 12B, Standard Street, CBD, Nairobi, Kenya"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                      <span>{websiteSettings.contactPhone || "+254 712 345 678"} | +254 700 111 222</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                      <span>{websiteSettings.contactEmail || "sales@kellys.com"} | support@kellys.com</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Interactive Google Maps Location with zoom toggles! */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                      <Map className="w-4 h-4 text-blue-600" /> Interactive Google Maps Location
                    </span>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => setMapZoom(prev => Math.max(12, prev - 1))}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-6 h-6 rounded text-xs font-bold cursor-pointer"
                        title="Zoom Out Map view"
                      >
                        -
                      </button>
                      <button 
                        onClick={() => setMapZoom(prev => Math.min(18, prev + 1))}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-6 h-6 rounded text-xs font-bold cursor-pointer"
                        title="Zoom In Map view"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Aesthetic Blue Technology Map Layout representation */}
                  <div className="border border-blue-100 rounded-xl bg-slate-50 overflow-hidden relative" id="simulated-google-map-box">
                    {/* Visual schematic represented */}
                    <div className="p-4 h-[240px] flex flex-col justify-between" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)', backgroundColor: '#f8fafc', backgroundSize: '16px 16px' }}>
                      {/* Compass and directions label */}
                      <div className="bg-white/90 border border-gray-100 p-2.5 rounded-lg shadow-sm flex items-center gap-2 text-xs font-semibold relative z-10">
                        <MapPin className="text-red-500 w-4 h-4 animate-bounce" />
                        <div>
                          <p className="text-blue-950 font-bold">{websiteSettings.storeName || "Kelly's Gadgets Store"} Headquarter</p>
                          <p className="text-[10px] text-gray-500">Nairobi, Kenya</p>
                        </div>
                      </div>

                      {/* Map abstract street graphics */}
                      <div className="absolute inset-x-0 top-1/3 bottom-12 flex flex-col justify-center pointer-events-none opacity-40">
                        <div className="h-6 bg-blue-100 border-y border-blue-200 flex items-center justify-center font-mono text-[9px] text-blue-800 tracking-widest font-bold">STANDARD STREET</div>
                        <div className="h-10 bg-gray-100 w-6 absolute left-1/2 -top-4 border-x border-gray-300 transform -rotate-12" />
                        <div className="h-10 bg-gray-100 w-6 absolute right-12 bottom-0 border-x border-gray-300 transform rotate-45" />
                      </div>

                      {/* Center pin highlight coordinate details */}
                      <div className="text-center font-mono text-[9.5px] text-gray-600 relative z-10 self-center">
                        Coordinates: <strong className="text-blue-950">{websiteSettings.contactMapCoords || "-1.2829,36.8225"}</strong>
                        <br />
                        <span className="text-cyan-600 font-semibold uppercase tracking-wider">Dynamic Zoom level: {mapZoom}x</span>
                      </div>

                      <div className="bg-blue-950 text-white px-3 py-1.5 rounded-b-lg text-[10px] font-semibold flex justify-between items-center relative z-10 -mx-4 -mb-4">
                        <span>🛰️ Live satellite data synchronized</span>
                        <a 
                          href={`https://maps.google.com/?q=${encodeURIComponent(websiteSettings.contactMapCoords || "-1.2829,36.8225")}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-cyan-400 hover:underline flex items-center gap-1 hover:text-cyan-300"
                        >
                          Open coordinates in new tab
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. FAQs PANEL */}
          {activeTab === 'faq' && (
            <div className="space-y-4 font-sans" id="panel-faq">
              <h3 className="text-2xl font-bold text-blue-950 mb-1">Frequently Asked Questions</h3>
              <p className="text-xs text-gray-500 mb-6 font-medium">Clear answers regarding payment integrations, orders deliveries, and warranty coverages.</p>

              {[
                { q: "How do I secure an M-Pesa automated transaction?", a: "To clear using Safaricom M-Pesa, input your phone number in our payment fields during the checkout sequence. Our system triggers an instant STK Push pin prompt directly to your handset device. Enter your secret credential PIN to finalize authorization." },
                { q: "Who are the authorized administrator profiles?", a: "For extreme cyber security, only TWO hardcoded administrative credentials exist: Kelly Super Admin (admin@kellys.com) and the Operations Manager (manager@kellys.com). No other standard sign-ups can override or unlock dashboard panels." },
                { q: "Can I track the real-time fulfillment timeline of my gadget?", a: "Yes, absolutely! Use our standalone 'Track Order' tool in the topmost Header. Enter your specific tracking code (e.g., KGS-100234) printed on your invoice payload to view live step logs." },
                { q: "Are standard credit and debit cards backed by SSL?", a: "Every form submission and credit clearance matching Mastercard, Visa, or PayPal runs behind strict AES-256 and HTTPS SSL standards, fully locking down your transaction security." },
                { q: "Do you offer physical warranty validations?", a: "All high-tier mobile smartphones and notebooks sold by Kelly's Gadgets Store are packaged alongside official 12 to 24-Month structural warranties." }
              ].map((faq, idx) => (
                <details key={idx} className="group border border-gray-150 rounded-xl bg-white focus-within:ring-2 focus-within:ring-blue-100 duration-200">
                  <summary className="flex justify-between items-center font-bold text-sm sm:text-base text-gray-900 px-5 py-4 cursor-pointer select-none">
                    <span>{faq.q}</span>
                    <span className="transition-transform group-open:rotate-180 duration-200 text-blue-600">
                      <ChevronDown className="w-5 h-5" />
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm sm:text-base text-gray-650 leading-relaxed border-t border-gray-100/60 pt-3">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          )}

          {/* 4. PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="prose max-w-none text-gray-700 font-sans text-sm leading-relaxed" id="panel-privacy">
              <h3 className="text-2xl font-bold text-blue-950 mb-4 pb-2 border-b border-gray-150">Privacy Integrity Policy</h3>
              <p className="mb-3">Kelly's Gadgets Store is committed to preserving customer privacy. Personal identifiers (names, emails, physical shipping coordinates, telephone lines) harvested during orders checkout or account registration profiles are strictly used for physical shipment delivery and financial audit validation.</p>
              <p className="mb-3 font-semibold text-blue-800">We strictly pledge: zero telemarketing, zero metadata resale, and zero third-party profiling systems.</p>
              <p className="mb-3">Cookie markers set in your client browser are purely focused on maintaining responsive shopping carts and authentication tokens. Payment details such as bank accounts or Mastercard credentials are not stored on our server, but processed securely via external verified payment gateways.</p>
            </div>
          )}

          {/* 5. TERMS AND CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="prose max-w-none text-gray-700 font-sans text-sm leading-relaxed" id="panel-terms">
              <h3 className="text-2xl font-bold text-blue-950 mb-4 pb-2 border-b border-gray-150">Terms and Conditions of Engagement</h3>
              <p className="mb-2"><strong>1. Orders Placement and Integrity:</strong> By finalising payment via M-Pesa or standard cards, the buyer acknowledges that the inventory status is subject to stock balances. If a device becomes sold out prior to delivery, we offer instant cash refunds or equivalent store credits.</p>
              <p className="mb-2"><strong>2. Price Transparency:</strong> Pricing and optional discount coupons are dynamic. The store reserves the right to modify prices without prior announcements.</p>
              <p className="mb-2"><strong>3. Usage Limits:</strong> Standard consumers are forbidden from injecting automated scraping agents, denial of service scripts, or cracking administrators credentials. Unauthorized attempts are instantly cataloged inside the Activity Log.</p>
            </div>
          )}

          {/* 6. RETURN POLICY */}
          {activeTab === 'returns' && (
            <div className="prose max-w-none text-gray-700 font-sans leading-relaxed text-sm" id="panel-returns">
              <h3 className="text-2xl font-bold text-blue-950 mb-4 pb-2 border-b border-gray-150">Hassle-Free Returns & Replacement Guidelines</h3>
              <p className="mb-3">Our return policy lasts <strong>7 calendar days</strong> from point of physical arrival.</p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Devices must remain fully encapsulated in original retail wraps with pristine IMEI/serial stickers.</li>
                <li>Laptops and tablets must not have customizable operating systems modified or custom firmware installed.</li>
                <li>Refunds are dispatched back to the exact initial payment channel of origin (M-Pesa transaction number, bank account or card balance) within 48 business hours with zero penalty levies.</li>
              </ul>
            </div>
          )}

          {/* 7. WARRANTY INFORMATION */}
          {activeTab === 'warranty' && (
            <div className="prose max-w-none text-gray-700 font-sans leading-relaxed text-sm" id="panel-warranty">
              <h3 className="text-2xl font-bold text-blue-950 mb-4 pb-2 border-b border-gray-150">Product Warranty validation</h3>
              <p className="mb-3">Every elite laptop, premium smartphone, and smart watch in this store is protected against structural hardware issues:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="border border-green-200 bg-green-50/50 p-4 rounded-xl">
                  <h4 className="font-bold text-green-950 text-xs uppercase tracking-wide">Included Coverage</h4>
                  <p className="text-[12px] text-gray-650 mt-1">Motherboard shorts, display flickering, internal components faults, built-in battery drops within bounds.</p>
                </div>
                <div className="border border-red-200 bg-red-50/50 p-4 rounded-xl">
                  <h4 className="font-bold text-red-950 text-xs uppercase tracking-wide">Excluded Coverage</h4>
                  <p className="text-[12px] text-gray-650 mt-1">Water submergences beyond depth ratings, display fractures, high electrical voltage spikes, custom ROM roots.</p>
                </div>
              </div>
            </div>
          )}

          {/* 8. CUSTOMER SUPPORT FAQ & DIRECT SUBMISSION */}
          {activeTab === 'support' && (
            <div className="prose max-w-none text-gray-700 font-sans leading-relaxed" id="panel-support">
              <h3 className="text-2xl font-bold text-blue-950 mb-2">24/7 Priority Customer Support</h3>
              <p className="text-sm text-gray-500 mb-6 font-medium">Under the immediate supervision of Super Admin and Operations, we maintain a dedicated staff ready to solve shipping or gadget configurations.</p>
              
              <div className="bg-sky-50 border border-sky-100 p-5 rounded-2xl mb-6">
                <h4 className="font-bold text-sky-950 text-sm sm:text-base flex items-center gap-2 mb-2">
                  <LifeBuoy className="w-5 h-5 text-sky-600" />
                  Need Immediate Telephonic Assistance?
                </h4>
                <p className="text-xs sm:text-sm text-sky-900 leading-relaxed">
                  Call our live desk inside CBD Nairobi at <strong>+254 712 345 678</strong>. We are active Monday through Sunday from 07:00 AM to 10:00 PM East African Standard Time (EAT).
                </p>
              </div>

              <p className="text-xs text-gray-500 font-medium">To escalate ticket resolutions matching a previous buy, please include your unique Invoice code (KGS-XXXXX) to speed up our lookups.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
