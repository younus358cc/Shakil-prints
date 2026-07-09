import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, FileText, CheckCircle, Clock, AlertTriangle, AlertCircle, RefreshCw, Printer, LogIn, ArrowRight, BookOpen } from 'lucide-react';
import { Order } from '../types';

interface CustomerPortalProps {
  onNavigate: (page: string) => void;
}

export default function CustomerPortal({ onNavigate }: CustomerPortalProps) {
  // Tracking states
  const [trackId, setTrackId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [trackError, setTrackError] = useState('');
  const [trackLoading, setTrackLoading] = useState(false);

  // History states
  const [lookupPhone, setLookupPhone] = useState('');
  const [historyOrders, setHistoryOrders] = useState<Order[]>([]);
  const [historyError, setHistoryError] = useState('');
  const [historyLoading, setHistoryLoading] = useState(false);

  // Simple Auth simulated states
  const [activeTab, setActiveTab] = useState<'track' | 'history' | 'login'>('track');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Handle Track order
  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackId.trim()) return;
    
    setTrackLoading(true);
    setTrackError('');
    setTrackedOrder(null);

    try {
      const res = await fetch(`/api/orders/track/${trackId}`);
      const data = await res.json();
      if (data.success) {
        setTrackedOrder(data.order);
      } else {
        setTrackError(data.message || 'Order ID not found.');
      }
    } catch (err) {
      setTrackError('Failed to contact server.');
    } finally {
      setTrackLoading(false);
    }
  };

  // Handle Lookup History
  const handleLookupHistory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupPhone.trim()) return;

    setHistoryLoading(true);
    setHistoryError('');
    setHistoryOrders([]);

    try {
      const res = await fetch(`/api/orders?phone=${lookupPhone}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setHistoryOrders(data);
        if (data.length === 0) {
          setHistoryError('No orders associated with this phone number.');
        }
      } else {
        setHistoryError('Failed to fetch order history.');
      }
    } catch (err) {
      setHistoryError('Failed to connect to server.');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Handle Simple Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('shakil_token', data.token);
        localStorage.setItem('shakil_user', JSON.stringify(data.user));
        
        if (data.user.role === 'admin') {
          onNavigate('admin');
        } else {
          // Normal customer
          setLookupPhone(data.user.phoneNumber);
          setActiveTab('history');
          // Trigger history search automatically
          const histRes = await fetch(`/api/orders?phone=${data.user.phoneNumber}`);
          const histData = await histRes.json();
          if (Array.isArray(histData)) {
            setHistoryOrders(histData);
          }
        }
      } else {
        setAuthError(data.message || 'Login failed.');
      }
    } catch (err) {
      setAuthError('Connection error.');
    } finally {
      setAuthLoading(false);
    }
  };

  const printInvoice = () => {
    window.print();
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400';
      case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400';
      default: return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 max-w-md mx-auto p-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
        <button
          onClick={() => setActiveTab('track')}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'track'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          Track Order
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          Order History
        </button>
        <button
          onClick={() => setActiveTab('login')}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'login'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          Portal Login
        </button>
      </div>

      <div className="print:hidden">
        {activeTab === 'track' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Check Printing Status</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Input your 12-digit Order ID (e.g. <strong>SPD-2026-0003</strong>) printed on your dynamic receipt or email.
              </p>
            </div>

            <form onSubmit={handleTrack} className="flex gap-3 max-w-md mx-auto">
              <input
                type="text"
                required
                placeholder="e.g. SPD-2026-0003"
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm font-mono focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={trackLoading}
                className="px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-1 shrink-0"
              >
                {trackLoading ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                <span>Track</span>
              </button>
            </form>

            {trackError && (
              <div className="p-4 max-w-md mx-auto bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle size={16} />
                <span>{trackError}</span>
              </div>
            )}

            {trackedOrder && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm"
              >
                {/* Visual Process Stepper */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono">ORDER TRACKING</span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-mono">{trackedOrder.id}</h3>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusStyle(trackedOrder.status)}`}>
                    {trackedOrder.status}
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Real-time status roadmap */}
                  <div className="grid grid-cols-4 gap-2 max-w-lg mx-auto relative pt-4">
                    <div className="absolute top-7 left-10 right-10 h-0.5 bg-slate-200 dark:bg-slate-800 -z-10" />
                    
                    {/* Stage 1 */}
                    <div className="text-center space-y-1.5 flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        ['Pending', 'In Progress', 'Completed'].includes(trackedOrder.status)
                          ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'
                      }`}>
                        1
                      </div>
                      <span className="text-[9px] font-bold text-slate-500">Pending</span>
                    </div>

                    {/* Stage 2 */}
                    <div className="text-center space-y-1.5 flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        ['In Progress', 'Completed'].includes(trackedOrder.status)
                          ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'
                      }`}>
                        2
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 font-display">In Progress</span>
                    </div>

                    {/* Stage 3 */}
                    <div className="text-center space-y-1.5 flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        trackedOrder.status === 'Completed'
                          ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                      }`}>
                        3
                      </div>
                      <span className="text-[9px] font-bold text-slate-500">Ready</span>
                    </div>

                    {/* Stage 4 */}
                    <div className="text-center space-y-1.5 flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        trackedOrder.status === 'Completed'
                          ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                      }`}>
                        4
                      </div>
                      <span className="text-[9px] font-bold text-slate-500">Completed</span>
                    </div>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800" />

                  {/* Order Specifications Table */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                    <div className="space-y-2">
                      <p><span className="text-slate-400">Customer Name:</span> <strong className="text-slate-800 dark:text-white">{trackedOrder.customerName}</strong></p>
                      <p><span className="text-slate-400">Contact Number:</span> <strong className="text-slate-800 dark:text-white font-mono">{trackedOrder.phoneNumber}</strong></p>
                      <p><span className="text-slate-400">Service:</span> <strong className="text-slate-800 dark:text-white">{trackedOrder.serviceName}</strong></p>
                      <p><span className="text-slate-400">Quantity / Paper Size:</span> <strong className="text-slate-800 dark:text-white">{trackedOrder.quantity} units ({trackedOrder.paperSize})</strong></p>
                    </div>
                    <div className="space-y-2">
                      <p><span className="text-slate-400">Submited At:</span> <strong className="text-slate-800 dark:text-white font-mono">{new Date(trackedOrder.createdAt).toLocaleDateString()}</strong></p>
                      <p><span className="text-slate-400">Color Palette:</span> <strong className="text-slate-800 dark:text-white">{trackedOrder.colorOption}</strong></p>
                      <p><span className="text-slate-400">Attachment:</span> <strong className="text-slate-800 dark:text-white truncate max-w-[200px] block">{trackedOrder.fileName || 'No file attached'}</strong></p>
                      <p><span className="text-slate-400">Total Price:</span> <strong className="text-orange-500 font-mono text-sm">৳{trackedOrder.totalPrice}</strong></p>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-xl text-xs text-blue-700 dark:text-blue-300">
                    ℹ️ You can print or save this page to act as your official collection memo when collecting documents at the store.
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Order History Lookup</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Type in your phone number to check all printing or studio logs registered with Shakil Printers.
              </p>
            </div>

            <form onSubmit={handleLookupHistory} className="flex gap-3 max-w-md mx-auto">
              <input
                type="tel"
                required
                placeholder="e.g. 01912345678"
                value={lookupPhone}
                onChange={(e) => setLookupPhone(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm font-mono focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={historyLoading}
                className="px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-1 shrink-0"
              >
                {historyLoading ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                <span>Fetch History</span>
              </button>
            </form>

            {historyError && (
              <div className="p-4 max-w-md mx-auto bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle size={16} />
                <span>{historyError}</span>
              </div>
            )}

            {historyOrders.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-slate-800 dark:text-white uppercase tracking-wider font-mono">Found {historyOrders.length} Orders</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {historyOrders.map((order) => (
                    <div 
                      key={order.id}
                      className="border border-slate-100 dark:border-slate-800 rounded-2xl p-5 hover:border-blue-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">{order.id}</span>
                          <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full border ${getStatusStyle(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-white">{order.serviceName} ({order.quantity} units)</h4>
                        <p className="text-[10px] text-slate-400">Submitted on {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Charged</span>
                          <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">৳{order.totalPrice}</span>
                        </div>
                        <button
                          onClick={() => {
                            setTrackedOrder(order);
                            setTrackId(order.id);
                            setActiveTab('track');
                          }}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-bold transition-all"
                        >
                          Invoice/Track
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'login' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6 max-w-md mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Secure Portal Access</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log into your customer record or admin operations console.
              </p>
            </div>

            {authError && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle size={16} />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="admin@shakilprinters.com or customer email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <input
                  type="password"
                  required
                  placeholder="admin password or customer password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm"
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl text-[11px] text-slate-500 border border-slate-100 dark:border-slate-700">
                🔑 <strong>Default Admin Access:</strong><br />
                Email: <span className="font-mono text-blue-600">admin@shakilprinters.com</span><br />
                Password: <span className="font-mono text-blue-600">admin</span>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 bg-blue-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <LogIn size={14} />
                <span>{authLoading ? 'Verifying Credentials...' : 'Authenticate Login'}</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Elegant formal Printable Invoice overlay, active when checking tracked order */}
      {trackedOrder && (
        <div className="bg-white text-slate-900 border border-slate-200 p-8 sm:p-12 rounded-3xl shadow-md space-y-8 print:border-none print:shadow-none print:p-0">
          <div className="flex items-center justify-between print:hidden">
            <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
              <FileText size={16} />
              <span>Collection Invoice Handoff</span>
            </h3>
            <button
              onClick={printInvoice}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-1"
            >
              <Printer size={14} />
              <span>Print Collection Invoice</span>
            </button>
          </div>

          {/* Actual Invoice Body */}
          <div id="invoice-printable-area" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-4 border-b border-slate-200 pb-6">
              <div>
                <h1 className="text-2xl font-black font-display text-blue-800">Shakil Digital Printers & Studio</h1>
                <p className="text-[10px] text-slate-400 mt-1">Mahmudpur road- Melandah Bazar</p>
                <p className="text-[10px] text-slate-400">Phone: 01936-488304 | info@shakildigitalprinters.com</p>
              </div>
              <div className="text-right sm:text-right">
                <span className="text-[10px] uppercase font-bold text-orange-500 font-mono tracking-wider block">OFFICIAL MEMO RECEIPT</span>
                <span className="text-lg font-mono font-bold block">{trackedOrder.id}</span>
                <span className="text-[10px] text-slate-400">Date: {new Date(trackedOrder.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Customer metadata row */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[9px] mb-1">Billed To:</span>
                <p className="font-bold text-slate-800">{trackedOrder.customerName}</p>
                <p className="font-mono text-slate-500">{trackedOrder.phoneNumber}</p>
                <p className="text-slate-500">{trackedOrder.email || 'No email attached'}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[9px] mb-1">Shipment/Delivery Info:</span>
                <p className="text-slate-700">{trackedOrder.deliveryAddress}</p>
              </div>
            </div>

            {/* Line items table */}
            <table className="w-full text-left text-xs border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-mono uppercase text-[9px] border-b border-slate-200">
                  <th className="py-2.5 px-4">Item & Description</th>
                  <th className="py-2.5 px-4">Specs</th>
                  <th className="py-2.5 px-4 text-center">Qty</th>
                  <th className="py-2.5 px-4 text-right">Unit Price</th>
                  <th className="py-2.5 px-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-800">{trackedOrder.serviceName}</p>
                    <p className="text-[10px] text-slate-400">{trackedOrder.fileName ? `Uploaded: ${trackedOrder.fileName}` : 'No document attachments'}</p>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">
                    {trackedOrder.paperSize} | {trackedOrder.colorOption}
                  </td>
                  <td className="py-3 px-4 text-center font-mono">{trackedOrder.quantity}</td>
                  <td className="py-3 px-4 text-right font-mono">৳{(trackedOrder.totalPrice / trackedOrder.quantity).toFixed(1)}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold">৳{trackedOrder.totalPrice}</td>
                </tr>
              </tbody>
            </table>

            {/* Totals panel */}
            <div className="flex justify-end pt-4">
              <div className="w-60 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal:</span>
                  <span className="font-mono">৳{trackedOrder.totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">VAT (0% default):</span>
                  <span className="font-mono">৳0.0</span>
                </div>
                <hr className="border-slate-200" />
                <div className="flex justify-between text-sm font-bold">
                  <span>Grand Total Charged:</span>
                  <span className="font-mono text-blue-700">৳{trackedOrder.totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Footer details */}
            <div className="border-t border-slate-200 pt-6 text-[10px] text-slate-400 leading-relaxed text-center space-y-1">
              <p>Thank you for doing business with Shakil Digital Printers & Studio!</p>
              <p>For support, please quote Order ID <strong>{trackedOrder.id}</strong> on any calls. This is a computer-generated collection document.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
