/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { useStore } from './StoreContext';
import { 
  Search, 
  MapPin, 
  Truck, 
  Clock, 
  Package, 
  CheckCircle, 
  PhoneCall, 
  CreditCard,
  XCircle
} from 'lucide-react';
import { Order } from '../types';

export default function OrderTracking() {
  const { trackedOrderNumber, setTrackedOrderNumber, showNotification } = useStore();
  const [inputNum, setInputNum] = useState(trackedOrderNumber);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const fetchTrackedOrder = async (numberToFetch: string) => {
    if (!numberToFetch) return;
    setIsSearching(true);
    try {
      const res = await fetch(`/api/orders/track/${numberToFetch.trim()}`);
      if (res.ok) {
        const data = await res.json();
        setActiveOrder(data);
      } else {
        const err = await res.json();
        setActiveOrder(null);
        showNotification(err.error || "Order tracking code not found", "error");
      }
    } catch (e) {
      console.error(e);
      setActiveOrder(null);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (trackedOrderNumber) {
      setInputNum(trackedOrderNumber);
      fetchTrackedOrder(trackedOrderNumber);
    }
  }, [trackedOrderNumber]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNum) return;
    setTrackedOrderNumber(inputNum);
    fetchTrackedOrder(inputNum);
  };

  // Status mapping indices for progress bar calculations
  const statusValues = {
    'pending': 1,
    'processing': 2,
    'shipped': 3,
    'delivered': 4,
    'cancelled': 0
  };

  const getActiveState = (stepStatus: 'pending' | 'processing' | 'shipped' | 'delivered') => {
    if (!activeOrder) return 'gray';
    if (activeOrder.status === 'cancelled') return 'red';
    
    const activeIdx = statusValues[activeOrder.status];
    const stepIdx = statusValues[stepStatus];

    if (activeIdx >= stepIdx) return 'blue';
    return 'gray';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 font-sans" id="order-tracking-module">
      {/* Tracker search bar header */}
      <div className="bg-gradient-to-br from-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md mb-8">
        <h2 className="text-xl sm:text-2xl font-black font-sans mb-1.5 tracking-tight">Active electronic shipment tracker</h2>
        <p className="text-xs text-blue-200/90 font-medium mb-6">Enter your standard invoice tracking code printed on your receipt payload (e.g. KGS-10023)</p>

        <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-lg relative z-10" id="tracker-bar-form">
          <input 
            type="text"
            required
            value={inputNum}
            onChange={(e) => setInputNum(e.target.value)}
            placeholder="e.g. KGS-100234"
            className="flex-1 px-4 py-3 rounded-xl text-gray-900 border border-transparent font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <button 
            type="submit"
            disabled={isSearching}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Search className="w-4 h-4" />
            <span>{isSearching ? "Searching Records..." : "Query Tracker"}</span>
          </button>
        </form>

        <div className="flex gap-4 mt-6 text-[10px] text-blue-200 tracking-wider uppercase font-mono font-bold">
          <span>✔️ Standard SMS alert synced</span>
          <span>✔️ SSL Invoicing secured</span>
        </div>
      </div>

      {activeOrder ? (
        // TIMELINE AND DATA SUMMARY
        <div className="space-y-8" id="tracker-success-timeline">
          
          {/* A. Status timeline */}
          <div className="bg-white border border-gray-150 p-6 sm:p-8 rounded-2xl shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <span className="text-xs font-bold text-gray-400 font-mono">TRACKING INVOICE</span>
                <h3 className="text-lg font-black text-blue-950 font-mono tracking-tight">{activeOrder.orderNumber}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-gray-400 block font-mono">DELIVERY DESTINATION</span>
                <span className="text-sm font-semibold text-gray-800 flex items-center gap-1 mt-0.5 justify-end">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> {activeOrder.shippingAddress.split(',')[0]}
                </span>
              </div>
            </div>

            {/* Cancelled Alert Banner if applicable */}
            {activeOrder.status === 'cancelled' && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-800 text-xs sm:text-sm font-semibold mb-6 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span>This electronic order has been officially designated as CANCELLED by the system administrative executives. Re-clearing requires direct support escalation.</span>
              </div>
            )}

            {activeOrder.status !== 'cancelled' && (
              /* PROGRESS STATIONS */
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative" id="stations-grid">
                
                {/* STATION 1: Pending */}
                <div className="flex flex-row md:flex-col items-center gap-4 text-left md:text-center relative">
                  <div className={`p-3.5 rounded-full flex items-center justify-center border-2 ${getActiveState('pending') === 'blue' ? 'bg-blue-50 border-blue-600 text-blue-600 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-300'}`}>
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-blue-950">Pending Clearance</h4>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">Order logged & awaiting payments verification.</p>
                  </div>
                </div>

                {/* STATION 2: Processing */}
                <div className="flex flex-row md:flex-col items-center gap-4 text-left md:text-center relative">
                  <div className={`p-3.5 rounded-full flex items-center justify-center border-2 ${getActiveState('processing') === 'blue' ? 'bg-blue-50 border-blue-600 text-blue-600 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-300'}`}>
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-blue-950">Packing & Verification</h4>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">Device serial numbers cataloged for warranty.</p>
                  </div>
                </div>

                {/* STATION 3: Shipped */}
                <div className="flex flex-row md:flex-col items-center gap-4 text-left md:text-center relative">
                  <div className={`p-3.5 rounded-full flex items-center justify-center border-2 ${getActiveState('shipped') === 'blue' ? 'bg-blue-50 border-blue-600 text-blue-600 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-300'}`}>
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-blue-950">Dispatched Transit</h4>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">Cargo loaded to CBD logistics courier teams.</p>
                  </div>
                </div>

                {/* STATION 4: Delivered */}
                <div className="flex flex-row md:flex-col items-center gap-4 text-left md:text-center relative">
                  <div className={`p-3.5 rounded-full flex items-center justify-center border-2 ${getActiveState('delivered') === 'blue' ? 'bg-emerald-50 border-emerald-600 text-emerald-600 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-300'}`}>
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-blue-950 font-sans">Fulfillment Clear</h4>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 font-sans">Device received and warranties validated.</p>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* B. Items & Financial details breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Shipment details listing */}
            <div className="md:col-span-7 bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-4" id="tracker-cargo-desc">
              <h4 className="text-sm font-bold text-gray-905 border-b border-gray-100 pb-2 uppercase tracking-wide">Shipment Specifications</h4>
              
              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Billed Recipient:</span>
                  <span className="font-bold text-blue-950">{activeOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Recipient Contacts Email:</span>
                  <span className="font-bold text-blue-950 font-mono text-xs">{activeOrder.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium font-sans">Fulfillment Hub Street:</span>
                  <span className="font-bold text-blue-950 max-w-[200px] truncate">{activeOrder.shippingAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Clearance Gateway:</span>
                  <span className="font-bold text-blue-950 uppercase">{activeOrder.paymentMethod} Payment Mode</span>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Items row */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block font-mono">Invoice Payload lists</span>
                {activeOrder.items.map((it: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-xs sm:text-sm text-gray-700 bg-gray-50/50 p-2 border border-gray-100 rounded-lg">
                    <span className="font-semibold text-blue-950 leading-tight truncate max-w-[200px]">{it.productName}</span>
                    <span className="font-mono text-xs font-bold text-gray-500">{it.quantity} units • Ksh {it.price.toLocaleString()} ea</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Live Automated SMS Dispatches logs */}
            <div className="md:col-span-5 bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-4" id="tracker-logs">
              <h4 className="text-sm font-bold text-gray-905 border-b border-gray-100 pb-2 uppercase tracking-wide">Simulated SMS & Email Log</h4>
              
              <div className="space-y-4 max-h-[190px] overflow-y-auto pr-2 scrollbar-thin font-mono text-[9px] sm:text-[10px] text-gray-500">
                {activeOrder.history.map((hist: any, hIdx: number) => (
                  <div key={hIdx} className="border-l-2 border-blue-505 pl-3 py-1 bg-gray-50/50 rounded-r-md">
                    <div className="flex justify-between text-[8px] text-gray-400 font-bold">
                      <span>{hist.status.toUpperCase()} UPDATED</span>
                      <span>{new Date(hist.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-blue-950 font-semibold leading-tight mt-0.5">{hist.note}</p>
                    <span className="text-cyan-600 font-bold block mt-1 tracking-tight">💬 [SMS] Dispatched to: {activeOrder.customerPhone}</span>
                    <span className="text-emerald-600 font-bold block tracking-tight">📧 [EMAIL] PDF Invoice dispatched to: {activeOrder.customerEmail}</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-blue-900 text-[10.5px] leading-relaxed">
                🚀 Timelines and SMS dispatches represent active database signals. If locks align, our cbd dispatcher handles restocks in 24 hours.
              </div>
            </div>

          </div>

        </div>
      ) : (
        // INITIAL PLACEHOLDER OR SEARCH PROMPT DETAILS
        <div className="text-center py-16 bg-white border border-gray-150 rounded-2xl shadow-sm font-sans" id="tracker-prompt-box">
          <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-700">Waiting for Order query</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">Please enter your order's direct KGS code (e.g., KGS-100021) in the text box above to audit fulfillment histories, payment stamps, and live courier coordinates.</p>
        </div>
      )}
    </div>
  );
}
