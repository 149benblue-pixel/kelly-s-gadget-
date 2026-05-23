/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from './StoreContext';
import { 
  User, 
  Lock, 
  MapPin, 
  Smartphone, 
  ShieldCheck, 
  Clock, 
  FileText, 
  Key, 
  CreditCard,
  Building
} from 'lucide-react';

export default function CustomerAccount() {
  const { 
    user, 
    login, 
    registerCustomer, 
    orderHistory, 
    fetchOrderHistory, 
    setView,
    setTrackedOrderNumber,
    showNotification
  } = useStore();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);
    if (success) {
      setEmail('');
      setPassword('');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPass) return;
    setIsSubmitting(true);
    const success = await registerCustomer({
      name: regName,
      email: regEmail,
      password: regPass,
      phone: regPhone,
      address: regAddress
    });
    setIsSubmitting(false);
    if (success) {
      setRegName('');
      setRegEmail('');
      setRegPass('');
      setRegPhone('');
      setRegAddress('');
    }
  };

  const triggerQuickFill = (emailStr: string, passStr: string) => {
    setEmail(emailStr);
    setPassword(passStr);
    showNotification("Quickcredentials inserted! Click Submit Login now.", "info");
  };

  const handleTrackInvoiceOrderClick = (orderNumber: string) => {
    setTrackedOrderNumber(orderNumber);
    setView('order-tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- RENDERING IF USER NOT CONNECTED ---
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 font-sans" id="authentication-portal">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Main Input Credentials Card */}
          <div className="md:col-span-7 bg-white border border-gray-150 p-6 sm:p-8 rounded-2xl shadow-sm">
            <h2 className="text-xl sm:text-2xl font-extrabold text-blue-950 mb-2">
              {isRegisterMode ? "Create Customer Account" : "Access Customer Storefront"}
            </h2>
            <p className="text-xs text-gray-400 mb-6 font-medium">
              Join Kelly's Gadgets premium club to review invoice histories and secure trackers.
            </p>

            {isRegisterMode ? (
              // REGISTER FORM
              <form onSubmit={handleRegisterSubmit} className="space-y-4" id="registration-block">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Full Name *</label>
                  <input 
                    type="text" required value={regName} onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden"
                    placeholder="e.g. Kelvin Mutua"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address *</label>
                  <input 
                    type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden"
                    placeholder="mutua@domain.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Secret Password *</label>
                  <input 
                    type="password" required value={regPass} onChange={(e) => setRegPass(e.target.value)}
                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Active Telephone *</label>
                  <input 
                    type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden"
                    placeholder="+254 700 XXX XXX"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Physical Delivery Street Coordinate</label>
                  <input 
                    type="text" value={regAddress} onChange={(e) => setRegAddress(e.target.value)}
                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden"
                    placeholder="e.g. Lavin Tower, First Floor, Sophia, Homabay"
                  />
                </div>
                <button 
                  type="submit" disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm cursor-pointer transition-colors"
                >
                  {isSubmitting ? "Setting Up Coordinates..." : "Launch Standard Account"}
                </button>
              </form>
            ) : (
              // LOGIN FORM
              <form onSubmit={handleLoginSubmit} className="space-y-4" id="login-block">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Verified Email *</label>
                  <input 
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-hidden bg-gray-50/50"
                    placeholder="admin@kellys.com, manager@kellys.com, or customer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Account Password *</label>
                  <input 
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-hidden bg-gray-50/50"
                    placeholder="••••••••"
                  />
                </div>
                <button 
                  type="submit" disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-sm cursor-pointer transition-colors shadow-sm"
                >
                  {isSubmitting ? "Verifying Keys..." : "Secure Sign In Clearance"}
                </button>
              </form>
            )}

            {/* Toggle Switch */}
            <div className="text-center mt-6">
              <button 
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                {isRegisterMode ? "Already registered? Clear Sign In" : "New e-shopper? Register standard client account"}
              </button>
            </div>
          </div>

          {/* Quick administrator credential fill blocks (extremely smart feature!) */}
          <div className="md:col-span-5 flex flex-col gap-4" id="auth-info-aside">
            <div className="bg-blue-900 text-white p-5 rounded-2xl border border-blue-950" id="admin-lim-notice">
              <h3 className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 mb-2 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Strict Security Lock</span>
              </h3>
              <p className="text-[12px] text-blue-100 leading-relaxed font-sans mb-3">
                Kelly's Gadgets Store applies strict role-based control. No administrative accounts can be initialized by clients on the fly (limited exclusively to TWO pre-configured developers slots).
              </p>
              
              <span className="text-[10px] font-sans text-blue-300 font-bold tracking-widest uppercase block mb-2">QUICK ACCESS PRESETS:</span>
              <div className="space-y-2">
                <button 
                  onClick={() => triggerQuickFill('admin@kellys.com', 'KellyAdmin123!')}
                  className="w-full bg-white/10 hover:bg-white/15 border border-white/10 p-2.5 rounded-lg text-left text-[11px] font-sans block transition-colors cursor-pointer"
                >
                  <p className="font-bold text-emerald-300">🔐 slot 1: Kelly Super Admin</p>
                  <p className="font-mono text-[9px] text-gray-350">ID: admin@kellys.com • KellyAdmin123!</p>
                </button>

                <button 
                  onClick={() => triggerQuickFill('manager@kellys.com', 'KellyGadgetsStore2026!')}
                  className="w-full bg-white/10 hover:bg-white/15 border border-white/10 p-2.5 rounded-lg text-left text-[11px] font-sans block transition-colors cursor-pointer"
                >
                  <p className="font-bold text-amber-300">🔐 slot 2: Gabriel Operations Manager</p>
                  <p className="font-mono text-[9px] text-gray-350">ID: manager@kellys.com • KellyGadgetsStore2026!</p>
                </button>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-150 p-5 rounded-2xl block text-xs space-y-2">
              <span className="font-extrabold text-blue-950 uppercase tracking-wide block">Standard Customer Demo?</span>
              <p className="text-gray-650 font-medium">To test Standard Customer operations without signing up, register a quick fake email like "test@cust.com", fill any word password, and you are logged inside instantly!</p>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // --- RENDERING ACCREDITED PORTAL FOR LOGGED USER ---
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans" id="customer-profile-portal">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column User Information Profile summary card */}
        <div className="lg:col-span-4 bg-white border border-gray-150 p-6 rounded-2xl" id="profile-card">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-blue-100">
              <User className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-blue-950 capitalize">{user.name}</h3>
            <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold block mt-1.5 self-center mx-auto w-max border border-emerald-100">
              Verified {user.role} Status
            </span>
          </div>

          <hr className="border-gray-100 mb-5" />

          {/* Details list */}
          <div className="space-y-4 text-xs sm:text-sm text-gray-650" id="profile-coordinates-lines">
            <div className="flex items-center gap-2.5">
              <Key className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="font-mono text-gray-800">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{user.phone}</span>
              </div>
            )}
            {user.address && (
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span>{user.address}</span>
              </div>
            )}
            
            {user.role === 'admin' && (
              <div className="bg-blue-900 text-white rounded-xl p-4 mt-8 space-y-1.5 border border-blue-950">
                <p className="font-bold text-[12px] text-emerald-400 flex items-center gap-1">🔧 ADMIN PRIVILEGES ACTIVE</p>
                <p className="text-[10px] leading-relaxed text-blue-100">You hold absolute authorization over cataloging, pricing modules, coupons, system backups, and database restores.</p>
                <button 
                  onClick={() => setView('admin-dashboard')}
                  className="w-full mt-2 text-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 rounded-lg text-xs cursor-pointer shadow-xs"
                >
                  Enter Admin System
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Orders history dashboard */}
        <div className="lg:col-span-8 bg-white border border-gray-150 p-6 sm:p-8 rounded-2xl shrink-0" id="history-container">
          <h3 className="text-lg font-bold text-gray-905 tracking-tight mb-6">Recent Procurement Invoices</h3>
          
          {orderHistory.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-150 rounded-xl font-sans text-xs">
              <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 font-medium">You have not completed any gadget invoices under this account.</p>
              <button 
                onClick={() => setView('shop')}
                className="text-blue-600 hover:underline font-semibold mt-1.5 cursor-pointer block mx-auto"
              >
                Shop smartphones and gear now
              </button>
            </div>
          ) : (
            <div className="space-y-4" id="invoices-list">
              {orderHistory.map(o => (
                <div key={o.id} className="border border-gray-100 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Summary */}
                  <div className="space-y-1 font-sans">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-blue-950 font-mono tracking-tight">{o.orderNumber}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wide ${o.status === 'pending' ? 'bg-amber-100 text-amber-800' : o.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : o.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                        {o.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 font-mono">{new Date(o.createdAt).toLocaleString()}</p>
                    <p className="text-xs text-gray-650 font-medium truncate max-w-[280px]">
                      {o.items.map(it => `${it.quantity}x ${it.productName}`).join(', ')}
                    </p>
                  </div>

                  {/* Pricing and Clearance actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                    <span className="text-sm sm:text-base font-extrabold text-blue-950 font-mono">Ksh {o.total.toLocaleString()}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleTrackInvoiceOrderClick(o.orderNumber)}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Open interactive shipment map progress"
                      >
                        Track Progress
                      </button>
                      
                      <button 
                        onClick={() => {
                          // Simulated Print invoice receipt trigger
                          const printWindow = window.open("", "_blank");
                          if (printWindow) {
                            printWindow.document.write(`
                              <html>
                                <head>
                                  <title>Invoice - ${o.orderNumber}</title>
                                  <style>
                                    body { font-family: sans-serif; padding: 40px; color: #333; }
                                    .header { display: flex; justify-between; border-bottom: 2px solid #0284c7; pb: 20px; }
                                    .invoice-num { font-size: 24px; font-weight: bold; color: #1e3a8a; }
                                    table { width: 100%; border-collapse: collapse; margin-top: 30px; }
                                    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                                    th { background-color: #f8fafc; }
                                    .total-box { text-align: right; margin-top: 30px; font-size: 18px; font-weight: bold; }
                                    .notes { margin-top: 40px; font-size: 11px; color: #666; font-style: italic; }
                                  </style>
                                </head>
                                <body>
                                  <div style="text-align: center;">
                                    <h2>Kelly's Gadgets Store Invoicing Authority</h2>
                                    <p>Homabay Sophia • Sales Dept</p>
                                  </div>
                                  <hr />
                                  <div style="display: flex; justify-content: space-between;">
                                    <div>
                                      <strong>Billed to:</strong><br/>
                                      Name: ${o.customerName}<br/>
                                      Email: ${o.customerEmail}<br/>
                                      Coordinates: ${o.shippingAddress}
                                    </div>
                                    <div style="text-align: right;">
                                      <span class="invoice-num">${o.orderNumber}</span><br/>
                                      Date: ${new Date(o.createdAt).toLocaleDateString()}<br/>
                                      Payment Channel: ${o.paymentMethod.toUpperCase()}
                                    </div>
                                  </div>
                                  
                                  <table>
                                    <thead>
                                      <tr>
                                        <th>Product details description</th>
                                        <th>Qty</th>
                                        <th>Unit Cost</th>
                                        <th>Line Net</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      ${o.items.map(it => `
                                        <tr>
                                          <td>${it.productName}</td>
                                          <td>${it.quantity}</td>
                                          <td>Ksh ${it.price.toLocaleString()}</td>
                                          <td>Ksh ${(it.price * it.quantity).toLocaleString()}</td>
                                        </tr>
                                      `).join('')}
                                    </tbody>
                                  </table>

                                  <div class="total-box">
                                    <p>Subtotal: Ksh ${o.subtotal.toLocaleString()}</p>
                                    <p>Discount Coupon: -Ksh ${o.discountAmount.toLocaleString()}</p>
                                    <p>VAT Contribution: Ksh ${((o.subtotal - o.discountAmount) * 0.16).toLocaleString()}</p>
                                    <p>Shipment Cargo: Ksh ${o.shippingFee.toLocaleString()}</p>
                                    <p style="font-size:22px; color:#1e40af;">Invoice Grand Total: Ksh ${o.total.toLocaleString()}</p>
                                  </div>

                                  <div class="notes">
                                    This invoice represents fully authorized electronics procurement records from Kellys Gadget Store databases. Warranty covers components for up to 24 Months. Signature of Super Admin validated.
                                  </div>
                                </body>
                              </html>
                            `);
                            printWindow.document.close();
                            printWindow.print();
                          }
                        }}
                        className="text-[11px] font-bold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-lg cursor-pointer"
                        title="Print detailed physical invoice"
                      >
                        <FileText className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
