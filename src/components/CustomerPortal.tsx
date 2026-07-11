import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, FileText, CheckCircle, Clock, AlertTriangle, AlertCircle, RefreshCw, Printer, LogIn, ArrowRight, BookOpen } from 'lucide-react';
import { Order } from '../types';
import { useLanguage } from '../LanguageContext';

interface CustomerPortalProps {
  onNavigate: (page: string) => void;
}

export default function CustomerPortal({ onNavigate }: CustomerPortalProps) {
  const { language, t } = useLanguage();
  const isEn = language === 'en';

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
        setTrackError(data.message || (isEn ? 'Order ID not found.' : 'অর্ডার আইডিটি পাওয়া যায়নি।'));
      }
    } catch (err) {
      setTrackError(isEn ? 'Failed to contact server.' : 'সার্ভারের সাথে সংযোগ করা যায়নি।');
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
          setHistoryError(isEn ? 'No orders associated with this phone number.' : 'এই মোবাইল নম্বরের বিপরীতে কোনো অর্ডার পাওয়া যায়নি।');
        }
      } else {
        setHistoryError(isEn ? 'Failed to fetch order history.' : 'অর্ডার হিস্ট্রি লোড করা সম্ভব হয়নি।');
      }
    } catch (err) {
      setHistoryError(isEn ? 'Failed to connect to server.' : 'সার্ভারের সাথে সংযোগ করতে ব্যর্থ হয়েছে।');
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
        setAuthError(data.message || (isEn ? 'Login failed.' : 'লগইন করতে ব্যর্থ হয়েছে।'));
      }
    } catch (err) {
      setAuthError(isEn ? 'Connection error.' : 'সংযোগের ত্রুটি।');
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
          {isEn ? "Track Order" : "অর্ডার ট্র্যাক"}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          {isEn ? "Order History" : "অর্ডার হিস্ট্রি"}
        </button>
        <button
          onClick={() => setActiveTab('login')}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'login'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          {isEn ? "Portal Login" : "পোর্টাল লগইন"}
        </button>
      </div>

      <div className="print:hidden">
        {activeTab === 'track' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">{isEn ? "Check Printing Status" : "প্রিন্টিংয়ের অবস্থা জানুন"}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEn ? "Input your 12-digit Order ID (e.g. SPD-2026-0003) printed on your dynamic receipt or email." : "আপনার ডায়নামিক রসিদ বা ইমেইলে থাকা ১২-ডিজিটের অর্ডার আইডি (যেমন: SPD-2026-0003) লিখুন।"}
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
                className="px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-1 shrink-0 cursor-pointer"
              >
                {trackLoading ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                <span>{isEn ? "Track" : "ট্র্যাক করুন"}</span>
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
                    <span className="text-[10px] text-slate-400 font-mono">{isEn ? "ORDER TRACKING" : "অর্ডার ট্র্যাকিং"}</span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-mono">{trackedOrder.id}</h3>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusStyle(trackedOrder.status)}`}>
                    {trackedOrder.status === 'Pending' ? (isEn ? 'Pending' : 'অপেক্ষমান') :
                     trackedOrder.status === 'In Progress' ? (isEn ? 'In Progress' : 'প্রসেসিং হচ্ছে') :
                     trackedOrder.status === 'Completed' ? (isEn ? 'Completed' : 'সম্পন্ন') : trackedOrder.status}
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
                      <span className="text-[9px] font-bold text-slate-500">{isEn ? "Pending" : "অপেক্ষমান"}</span>
                    </div>

                    {/* Stage 2 */}
                    <div className="text-center space-y-1.5 flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        ['In Progress', 'Completed'].includes(trackedOrder.status)
                          ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'
                      }`}>
                        2
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 font-display">{isEn ? "In Progress" : "প্রসেসিং"}</span>
                    </div>

                    {/* Stage 3 */}
                    <div className="text-center space-y-1.5 flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        trackedOrder.status === 'Completed'
                          ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                      }`}>
                        3
                      </div>
                      <span className="text-[9px] font-bold text-slate-500">{isEn ? "Ready" : "প্রস্তুত"}</span>
                    </div>

                    {/* Stage 4 */}
                    <div className="text-center space-y-1.5 flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        trackedOrder.status === 'Completed'
                          ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                      }`}>
                        4
                      </div>
                      <span className="text-[9px] font-bold text-slate-500">{isEn ? "Completed" : "সম্পন্ন"}</span>
                    </div>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800" />

                  {/* Order Specifications Table */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                    <div className="space-y-2">
                      <p><span className="text-slate-400">{isEn ? "Customer Name:" : "গ্রাহকের নাম:"}</span> <strong className="text-slate-800 dark:text-white">{trackedOrder.customerName}</strong></p>
                      <p><span className="text-slate-400">{isEn ? "Contact Number:" : "মোবাইল নম্বর:"}</span> <strong className="text-slate-800 dark:text-white font-mono">{trackedOrder.phoneNumber}</strong></p>
                      <p><span className="text-slate-400">{isEn ? "Service:" : "সেবার ধরন:"}</span> <strong className="text-slate-800 dark:text-white">
                        {isEn ? trackedOrder.serviceName : (
                          trackedOrder.serviceId === '1' ? 'পিভিসি আইডি কার্ড' :
                          trackedOrder.serviceId === '2' ? 'কাস্টম ফ্লেক্স ব্যানার' :
                          trackedOrder.serviceId === '3' ? 'লাক্সারি বিজনেস কার্ড' :
                          trackedOrder.serviceId === '4' ? 'অ্যাকাডেমিক আইডি কার্ড' :
                          trackedOrder.serviceId === '5' ? 'ডিজিটাল ফটো প্রিন্টিং' :
                          trackedOrder.serviceId === '6' ? 'আমন্ত্রণ ও ওয়েডিং কার্ড' : trackedOrder.serviceName
                        )}
                      </strong></p>
                      <p><span className="text-slate-400">{isEn ? "Quantity / Paper Size:" : "পরিমাণ / কাগজের সাইজ:"}</span> <strong className="text-slate-800 dark:text-white">{trackedOrder.quantity} {isEn ? "units" : "টি"} ({
                        isEn ? trackedOrder.paperSize : (
                          trackedOrder.paperSize === 'Passport Size' ? 'পাসপোর্ট সাইজ' :
                          trackedOrder.paperSize === 'Passport (Set of 8)' ? 'পাসপোর্ট (৮টির সেট)' :
                          trackedOrder.paperSize === 'Stamp (Set of 12)' ? 'স্ট্যাম্প (১২টির সেট)' :
                          trackedOrder.paperSize === 'Per Sq. Ft.' ? 'প্রতি বর্গফুট' :
                          trackedOrder.paperSize === 'Standard ID' ? 'স্ট্যান্ডার্ড আইডি' : trackedOrder.paperSize
                        )
                      })</strong></p>
                    </div>
                    <div className="space-y-2">
                      <p><span className="text-slate-400">{isEn ? "Submitted At:" : "অর্ডারের তারিখ:"}</span> <strong className="text-slate-800 dark:text-white font-mono">{new Date(trackedOrder.createdAt).toLocaleDateString()}</strong></p>
                      <p><span className="text-slate-400">{isEn ? "Color Palette:" : "রঙের মোড:"}</span> <strong className="text-slate-800 dark:text-white">{
                        trackedOrder.colorOption === 'Color' ? (isEn ? 'Color' : 'رঙিন') : (isEn ? 'Black & White' : 'সাদাকালো')
                      }</strong></p>
                      <p><span className="text-slate-400">{isEn ? "Attachment:" : "সংযুক্ত ফাইল:"}</span> <strong className="text-slate-800 dark:text-white truncate max-w-[200px] block">{trackedOrder.fileName || (isEn ? 'No file attached' : 'কোনো ফাইল সংযুক্ত নেই')}</strong></p>
                      <p><span className="text-slate-400">{isEn ? "Total Price:" : "মোট মূল্য:"}</span> <strong className="text-orange-500 font-mono text-sm">৳{trackedOrder.totalPrice}</strong></p>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-xl text-xs text-blue-700 dark:text-blue-300">
                    ℹ️ {isEn ? "You can print or save this page to act as your official collection memo when collecting documents at the store." : "দোকান থেকে ডকুমেন্ট বা ছবি সংগ্রহের সময় এই রসিদটি প্রিন্ট করে মেমো হিসেবে আমাদের প্রদর্শন করতে পারেন।"}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">{isEn ? "Order History Lookup" : "অর্ডার হিস্ট্রি অনুসন্ধান"}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEn ? "Type in your phone number to check all printing or studio logs registered with Shakil Printers." : "শাকিল ডিজিটাল প্রিন্টার্সে রেজিস্টার করা আপনার সকল অর্ডার বা স্টুডিও ফাইল দেখতে আপনার মোবাইল নম্বরটি লিখুন।"}
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
                className="px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-1 shrink-0 cursor-pointer"
              >
                {historyLoading ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                <span>{isEn ? "Fetch History" : "হিস্ট্রি দেখুন"}</span>
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
                <h3 className="font-semibold text-sm text-slate-800 dark:text-white uppercase tracking-wider font-mono">
                  {isEn ? `Found ${historyOrders.length} Orders` : `${historyOrders.length}টি অর্ডার পাওয়া গেছে`}
                </h3>
                
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
                            {order.status === 'Pending' ? (isEn ? 'Pending' : 'অপেক্ষমান') :
                             order.status === 'In Progress' ? (isEn ? 'In Progress' : 'প্রসেসিং হচ্ছে') :
                             order.status === 'Completed' ? (isEn ? 'Completed' : 'সম্পন্ন') : order.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-white">
                          {isEn ? order.serviceName : (
                            order.serviceId === '1' ? 'পিভিসি আইডি কার্ড' :
                            order.serviceId === '2' ? 'কাস্টম ফ্লেক্স ব্যানার' :
                            order.serviceId === '3' ? 'লাক্সারি বিজনেস কার্ড' :
                            order.serviceId === '4' ? 'অ্যাকাডেমিক আইডি কার্ড' :
                            order.serviceId === '5' ? 'ডিজিটাল ফটো প্রিন্টিং' :
                            order.serviceId === '6' ? 'আমন্ত্রণ ও ওয়েডিং কার্ড' : order.serviceName
                          )} ({order.quantity} {isEn ? "units" : "টি"})
                        </h4>
                        <p className="text-[10px] text-slate-400">{isEn ? "Submitted on" : "অর্ডার করার তারিখ:"} {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">{isEn ? "Charged" : "মোট চার্জ"}</span>
                          <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">৳{order.totalPrice}</span>
                        </div>
                        <button
                          onClick={() => {
                            setTrackedOrder(order);
                            setTrackId(order.id);
                            setActiveTab('track');
                          }}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
                        >
                          {isEn ? "Invoice/Track" : "রসিদ ও ট্র্যাকিং"}
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
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">{isEn ? "Secure Portal Access" : "সুরক্ষিত পোর্টাল লগইন"}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEn ? "Log into your customer record or admin operations console." : "আপনার কাস্টমার হিস্ট্রি দেখতে বা অ্যাডমিন ম্যানেজমেন্ট কনসোলে প্রবেশ করতে লগইন করুন।"}
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
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{isEn ? "Email Address" : "ইমেইল অ্যাড্রেস"}</label>
                <input
                  type="email"
                  required
                  placeholder={isEn ? "admin@shakilprinters.com or customer email" : "ইমেইল এড্রেস লিখুন"}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{isEn ? "Password" : "পাসওয়ার্ড"}</label>
                <input
                  type="password"
                  required
                  placeholder={isEn ? "admin password or customer password" : "পাসওয়ার্ড লিখুন"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm"
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl text-[11px] text-slate-500 border border-slate-100 dark:border-slate-700">
                🔑 <strong>{isEn ? "Default Admin Access:" : "ডিফল্ট অ্যাডমিন অ্যাক্সেস:"}</strong><br />
                {isEn ? "Email" : "ইমেইল"}: <span className="font-mono text-blue-600">admin@shakilprinters.com</span><br />
                {isEn ? "Password" : "পাসওয়ার্ড"}: <span className="font-mono text-blue-600">admin</span>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 bg-blue-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
              >
                <LogIn size={14} />
                <span>{authLoading ? (isEn ? 'Verifying Credentials...' : 'লগইন যাচাই করা হচ্ছে...') : (isEn ? 'Authenticate Login' : 'লগইন করুন')}</span>
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
              <span>{isEn ? "Collection Invoice Handoff" : "সংগ্রহের জন্য মেমো ইনভয়েস"}</span>
            </h3>
            <button
              onClick={printInvoice}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-1 cursor-pointer"
            >
              <Printer size={14} />
              <span>{isEn ? "Print Collection Invoice" : "ইনভয়েস প্রিন্ট করুন"}</span>
            </button>
          </div>

          {/* Actual Invoice Body */}
          <div id="invoice-printable-area" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-4 border-b border-slate-200 pb-6">
              <div>
                <h1 className="text-2xl font-black font-display text-blue-800">{isEn ? "Shakil Digital Printers & Studio" : "শাকিল ডিজিটাল প্রিন্টার্স অ্যান্ড স্টুডিও"}</h1>
                <p className="text-[10px] text-slate-400 mt-1">{isEn ? "Mahmudpur road- Melandah Bazar" : "মাহমুদপুর রোড - মেলান্দহ বাজার"}</p>
                <p className="text-[10px] text-slate-400">{isEn ? "Phone: 01936-488304 | info@shakildigitalprinters.com" : "ফোন: ০১৯৩৬-৪৮৮৩০৪ | info@shakildigitalprinters.com"}</p>
              </div>
              <div className="text-right sm:text-right">
                <span className="text-[10px] uppercase font-bold text-orange-500 font-mono tracking-wider block">{isEn ? "OFFICIAL MEMO RECEIPT" : "অফিসিয়াল মেমো রসিদ"}</span>
                <span className="text-lg font-mono font-bold block">{trackedOrder.id}</span>
                <span className="text-[10px] text-slate-400">{isEn ? "Date:" : "তারিখ:"} {new Date(trackedOrder.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Customer metadata row */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[9px] mb-1">{isEn ? "Billed To:" : "গ্রাহকের তথ্য:"}</span>
                <p className="font-bold text-slate-800">{trackedOrder.customerName}</p>
                <p className="font-mono text-slate-500">{trackedOrder.phoneNumber}</p>
                <p className="text-slate-500">{trackedOrder.email || (isEn ? 'No email attached' : 'কোনো ইমেইল দেওয়া নেই')}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[9px] mb-1">{isEn ? "Shipment/Delivery Info:" : "ডেলিভারি ঠিকানা:"}</span>
                <p className="text-slate-700">{trackedOrder.deliveryAddress || (isEn ? 'In-store collection' : 'দোকান থেকে সংগ্রহ')}</p>
              </div>
            </div>

            {/* Line items table */}
            <table className="w-full text-left text-xs border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-mono uppercase text-[9px] border-b border-slate-200">
                  <th className="py-2.5 px-4">{isEn ? "Item & Description" : "আইটেম এবং বিবরণ"}</th>
                  <th className="py-2.5 px-4">{isEn ? "Specs" : "স্পেসিফিকেশন"}</th>
                  <th className="py-2.5 px-4 text-center">{isEn ? "Qty" : "পরিমাণ"}</th>
                  <th className="py-2.5 px-4 text-right">{isEn ? "Unit Price" : "একক মূল্য"}</th>
                  <th className="py-2.5 px-4 text-right">{isEn ? "Subtotal" : "উপ-মোট"}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-800">
                      {isEn ? trackedOrder.serviceName : (
                        trackedOrder.serviceId === '1' ? 'পিভিসি আইডি কার্ড' :
                        trackedOrder.serviceId === '2' ? 'কাস্টম ফ্লেক্স ব্যানার' :
                        trackedOrder.serviceId === '3' ? 'লাক্সারি বিজনেস কার্ড' :
                        trackedOrder.serviceId === '4' ? 'অ্যাকাডেমিক আইডি কার্ড' :
                        trackedOrder.serviceId === '5' ? 'ডিজিটাল ফটো প্রিন্টিং' :
                        trackedOrder.serviceId === '6' ? 'আমন্ত্রণ ও ওয়েডিং কার্ড' : trackedOrder.serviceName
                      )}
                    </p>
                    <p className="text-[10px] text-slate-400">{trackedOrder.fileName ? `${isEn ? 'Uploaded:' : 'আপলোড করা ফাইল:'} ${trackedOrder.fileName}` : (isEn ? 'No document attachments' : 'কোনো ডকুমেন্ট ফাইল নেই')}</p>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">
                    {(isEn ? trackedOrder.paperSize : (
                      trackedOrder.paperSize === 'Passport Size' ? 'পাসপোর্ট সাইজ' :
                      trackedOrder.paperSize === 'Passport (Set of 8)' ? 'পাসপোর্ট (৮টির সেট)' :
                      trackedOrder.paperSize === 'Stamp (Set of 12)' ? 'স্ট্যাম্প (১২টির সেট)' :
                      trackedOrder.paperSize === 'Per Sq. Ft.' ? 'প্রতি বর্গফুট' :
                      trackedOrder.paperSize === 'Standard ID' ? 'স্ট্যান্ডার্ড আইডি' : trackedOrder.paperSize
                    ))} | {trackedOrder.colorOption === 'Color' ? (isEn ? 'Color' : 'রঙিন') : (isEn ? 'Black & White' : 'সাদাকালো')}
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
                  <span className="text-slate-400">{isEn ? "Subtotal:" : "সাবটোটাল:"}</span>
                  <span className="font-mono">৳{trackedOrder.totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isEn ? "VAT (0% default):" : "ভ্যাট (০%):"}</span>
                  <span className="font-mono">৳0.0</span>
                </div>
                <hr className="border-slate-200" />
                <div className="flex justify-between text-sm font-bold">
                  <span>{isEn ? "Grand Total Charged:" : "সর্বমোট চার্জ:"}</span>
                  <span className="font-mono text-blue-700">৳{trackedOrder.totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Footer details */}
            <div className="border-t border-slate-200 pt-6 text-[10px] text-slate-400 leading-relaxed text-center space-y-1">
              <p>{isEn ? "Thank you for doing business with Shakil Digital Printers & Studio!" : "শাকিল ডিজিটাল প্রিন্টার্স অ্যান্ড স্টুডিও-র সাথে থাকার জন্য আপনাকে আন্তরিক ধন্যবাদ!"}</p>
              <p>{isEn ? "For support, please quote Order ID" : "যেকোনো সহায়তার জন্য দয়া করে অর্ডার আইডিটি প্রদর্শন করুন:"} <strong>{trackedOrder.id}</strong>{isEn ? " on any calls. This is a computer-generated collection document." : "। এটি একটি কম্পিউটার জেনারেটেড সংগ্রহের ডকুমেন্ট বা মেমো।"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
