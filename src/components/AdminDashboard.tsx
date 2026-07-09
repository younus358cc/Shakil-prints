import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, ShoppingBag, Loader2, Users, FileText, CheckCircle, 
  Trash2, Filter, Settings, RefreshCw, Image, CreditCard, LogOut, Info,
  PlusCircle, Edit3, X, Mail, Phone, Clock, FileDown, CheckSquare, Search, Award, AlertCircle, Printer
} from 'lucide-react';
import { Order, Service, PriceItem, GalleryItem, User, WebsiteSettings, DashboardStats, AppNotification } from '../types';

interface AdminDashboardProps {
  services: Service[];
  prices: PriceItem[];
  galleryItems: GalleryItem[];
  onRefreshData: () => void;
  onNavigate: (page: string) => void;
}

export default function AdminDashboard({ services, prices, galleryItems, onRefreshData, onNavigate }: AdminDashboardProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState<'orders' | 'services' | 'prices' | 'gallery' | 'users' | 'settings'>('orders');

  // Order filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  // Editing Modals State
  const [serviceModal, setServiceModal] = useState<Partial<Service> | null>(null);
  const [priceModal, setPriceModal] = useState<Partial<PriceItem> | null>(null);
  const [galleryModal, setGalleryModal] = useState<Partial<GalleryItem> | null>(null);

  // Selected invoice state
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Check admin auth
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authPasscode, setAuthPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    // Check local storage for authenticated admin
    const storedUser = localStorage.getItem('shakil_user');
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        if (userObj.role === 'admin') {
          setIsAuthorized(true);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Fetch admin stats, orders, and configuration
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [resOrders, resStats, resNotifs, resUsers, resSettings] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/stats'),
        fetch('/api/notifications'),
        fetch('/api/users'),
        fetch('/api/settings')
      ]);

      const dataOrders = await resOrders.json();
      const dataStats = await resStats.json();
      const dataNotifs = await resNotifs.json();
      const dataUsers = await resUsers.json();
      const dataSettings = await resSettings.json();

      setOrders(dataOrders);
      setStats(dataStats);
      setNotifications(dataNotifs);
      setUserList(dataUsers);
      setSettings(dataSettings);
    } catch (err) {
      console.error("Error fetching administrative data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchAdminData();
    }
  }, [isAuthorized]);

  // Handle Passcode Login
  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authPasscode === 'admin') {
      const adminUser: User = {
        id: 'u1',
        name: 'Shakil Ahmed',
        email: 'admin@shakilprinters.com',
        phoneNumber: '01712345678',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('shakil_user', JSON.stringify(adminUser));
      setIsAuthorized(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect administrative passcode. Enter "admin" for demo testing.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('shakil_user');
    localStorage.removeItem('shakil_token');
    setIsAuthorized(false);
    onNavigate('home');
  };

  // Change Order Status
  const handleStatusChange = async (orderId: string, status: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('Are you absolutely sure you want to delete this order?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Save Service (Create or Update)
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceModal) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceModal)
      });
      if (res.ok) {
        setServiceModal(null);
        onRefreshData();
        await fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Service
  const handleDeleteService = async (serviceId: string) => {
    if (!window.confirm('Deleting this service will also wipe any matching price entries. Proceed?')) return;
    setActionLoading(true);
    try {
      await fetch(`/api/services/${serviceId}`, { method: 'DELETE' });
      onRefreshData();
      await fetchAdminData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Save Price List Item (Create or Update)
  const handleSavePriceItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!priceModal) return;

    const matchedSrv = services.find(s => s.id === priceModal.serviceId);
    const payload = {
      ...priceModal,
      serviceName: matchedSrv ? matchedSrv.name : 'Unknown'
    };

    setActionLoading(true);
    try {
      const res = await fetch('/api/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setPriceModal(null);
        onRefreshData();
        await fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Price Item
  const handleDeletePriceItem = async (priceId: string) => {
    if (!window.confirm('Delete this pricing row?')) return;
    setActionLoading(true);
    try {
      await fetch(`/api/prices/${priceId}`, { method: 'DELETE' });
      onRefreshData();
      await fetchAdminData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Save Gallery Item
  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryModal) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryModal)
      });
      if (res.ok) {
        setGalleryModal(null);
        onRefreshData();
        await fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Gallery Item
  const handleDeleteGalleryItem = async (itemId: string) => {
    if (!window.confirm('Delete this item from the studio gallery portfolio?')) return;
    setActionLoading(true);
    try {
      await fetch(`/api/gallery/${itemId}`, { method: 'DELETE' });
      onRefreshData();
      await fetchAdminData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Save Website Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        await fetchAdminData();
        alert('Settings updated successfully!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
      await fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.phoneNumber.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter) {
      const oDate = new Date(o.createdAt).toISOString().split('T')[0];
      matchesDate = oDate === dateFilter;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Login Screen if not authorized
  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md">
            <Settings size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Admin Security Lock</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Provide the administrative passcode to toggle website configs, inspect user attachments, and edit pricing tables.
          </p>
        </div>

        {authError && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle size={16} />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handlePasscodeLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Admin Passcode</label>
            <input
              type="password"
              required
              placeholder="Enter admin code"
              value={authPasscode}
              onChange={(e) => setAuthPasscode(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm text-center font-mono focus:outline-none"
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl text-[11px] text-slate-500 border border-slate-100 dark:border-slate-700 text-center">
            💡 Enter <strong>"admin"</strong> to easily test dashboard controls.
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs transition-all shadow-md"
          >
            Authorize Terminal
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Admin Title Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <span className="text-[10px] tracking-wider uppercase font-bold text-orange-500 font-mono bg-orange-500/10 px-2.5 py-1 rounded-full">OPERATIONAL CONSOLE</span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display mt-2">Shakil Management Hub</h1>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={fetchAdminData}
            className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-600 dark:text-slate-300 rounded-xl transition-all"
            title="Refresh Server Records"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-bold rounded-xl text-xs transition-all flex items-center space-x-1.5"
          >
            <LogOut size={14} />
            <span>Terminate Session</span>
          </button>
        </div>
      </div>

      {/* Top statistics widgets */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
            <ShoppingBag className="text-blue-600" size={20} />
            <h4 className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Total Orders</h4>
            <p className="text-2xl font-black font-display font-mono text-slate-800 dark:text-white">{stats.totalOrders}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
            <Loader2 className="text-amber-500 animate-spin" size={20} />
            <h4 className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Pending Tasks</h4>
            <p className="text-2xl font-black font-display font-mono text-slate-800 dark:text-white">{stats.pendingOrders}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
            <CheckCircle className="text-emerald-500" size={20} />
            <h4 className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Completed Tasks</h4>
            <p className="text-2xl font-black font-display font-mono text-slate-800 dark:text-white">{stats.completedOrders}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
            <Users className="text-sky-600" size={20} />
            <h4 className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Customers</h4>
            <p className="text-2xl font-black font-display font-mono text-slate-800 dark:text-white">{stats.totalCustomers}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2 col-span-2 lg:col-span-1">
            <CreditCard className="text-orange-500" size={20} />
            <h4 className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Sales Revenue</h4>
            <p className="text-2xl font-black font-display font-mono text-orange-500">৳{stats.revenue}</p>
          </div>
        </div>
      )}

      {/* Sub tabs selector */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 gap-2">
        {(['orders', 'services', 'prices', 'gallery', 'users', 'settings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setCurrentTab(tab)}
            className={`py-2 px-4 text-xs font-semibold rounded-xl capitalize transition-all whitespace-nowrap ${
              currentTab === tab
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="animate-spin text-blue-600 mx-auto" size={36} />
          <p className="text-sm text-slate-400">Synchronizing database files...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* ORDERS TAB */}
          {currentTab === 'orders' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-6">
              {/* Header Filters */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display">System Production Queue</h3>
                
                {/* Inputs */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Search */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-2.5 flex items-center text-slate-400"><Search size={14} /></span>
                    <input
                      type="text"
                      placeholder="Search ID, customer..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white"
                    />
                  </div>
                  {/* Status Dropdown */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  {/* Date Filter */}
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Table list */}
              <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 font-mono border-b border-slate-100 dark:border-slate-800">
                      <th className="py-3.5 px-4 font-semibold">Order ID</th>
                      <th className="py-3.5 px-4 font-semibold">Client Info</th>
                      <th className="py-3.5 px-4 font-semibold">Product Spec</th>
                      <th className="py-3.5 px-4 font-semibold">Price</th>
                      <th className="py-3.5 px-4 font-semibold">Attached File</th>
                      <th className="py-3.5 px-4 font-semibold">Status Action</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                          <button onClick={() => setSelectedInvoiceOrder(order)} className="hover:underline">
                            {order.id}
                          </button>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-900 dark:text-white">{order.customerName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{order.phoneNumber}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-slate-800 dark:text-slate-300">{order.serviceName}</p>
                          <p className="text-[10px] text-slate-400">{order.quantity}x {order.paperSize} | {order.colorOption}</p>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold">৳{order.totalPrice}</td>
                        <td className="py-3.5 px-4 max-w-[120px] truncate">
                          {order.fileData ? (
                            <a
                              href={order.fileData}
                              download={order.fileName || 'attachment'}
                              className="text-blue-500 hover:underline flex items-center space-x-1 font-mono text-[10px]"
                            >
                              <FileDown size={12} className="shrink-0" />
                              <span className="truncate">{order.fileName || 'Download'}</span>
                            </a>
                          ) : (
                            <span className="text-slate-400 text-[10px]">None</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={order.status}
                            disabled={actionLoading}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="px-2 py-1 text-[11px] bg-slate-50 dark:bg-slate-800 border rounded font-semibold"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          No printing production tasks match your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SERVICES TAB */}
          {currentTab === 'services' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display">Catalog Editor</h3>
                <button
                  onClick={() => setServiceModal({})}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-1"
                >
                  <PlusCircle size={14} />
                  <span>Add Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map(s => (
                  <div key={s.id} className="border border-slate-100 dark:border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between">
                        <span className="text-[10px] font-mono text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full uppercase">{s.category}</span>
                        {s.popular && <span className="text-[9px] bg-emerald-50 text-emerald-600 font-bold px-2 rounded">Popular</span>}
                      </div>
                      <h4 className="font-semibold text-slate-800 dark:text-white text-sm mt-2">{s.name}</h4>
                      <p className="text-xs text-slate-400 font-light line-clamp-2 mt-1">{s.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold font-mono">৳{s.startingPrice} <span className="text-[9px] text-slate-400 font-light">start</span></span>
                      
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setServiceModal(s)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteService(s.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRICES TAB */}
          {currentTab === 'prices' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display">Price List Matrix</h3>
                <button
                  onClick={() => setPriceModal({ serviceId: services[0]?.id || '', paperType: '', size: '', pricePerUnit: 5, minQuantity: 1 })}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-1"
                >
                  <PlusCircle size={14} />
                  <span>Add Price Row</span>
                </button>
              </div>

              <div className="overflow-x-auto border rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 font-mono">
                    <tr className="border-b">
                      <th className="py-3 px-4">Service Category</th>
                      <th className="py-3 px-4">Paper Type</th>
                      <th className="py-3 px-4">Size</th>
                      <th className="py-3 px-4 text-right">Price per Page</th>
                      <th className="py-3 px-4 text-center">Min Qty</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700 dark:text-slate-300">
                    {prices.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/20">
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{p.serviceName}</td>
                        <td className="py-3 px-4">{p.paperType}</td>
                        <td className="py-3 px-4 font-mono">{p.size}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold">৳{p.pricePerUnit}</td>
                        <td className="py-3 px-4 text-center font-mono">{p.minQuantity}</td>
                        <td className="py-3 px-4 text-right flex justify-end space-x-1">
                          <button
                            onClick={() => setPriceModal(p)}
                            className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeletePriceItem(p.id)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* GALLERY TAB */}
          {currentTab === 'gallery' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display">Studio Gallery Items</h3>
                <button
                  onClick={() => setGalleryModal({ category: 'Banner', title: '', imageUrl: '' })}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-1"
                >
                  <PlusCircle size={14} />
                  <span>Add Showcase item</span>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryItems.map(g => (
                  <div key={g.id} className="border border-slate-100 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
                    <div className="aspect-video bg-slate-100">
                      <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                      <div className="truncate pr-2">
                        <p className="text-[10px] text-slate-400 font-mono">{g.category}</p>
                        <p className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[120px]">{g.title}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteGalleryItem(g.id)}
                        className="text-rose-500 hover:bg-rose-100 p-1 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {currentTab === 'users' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display">Registered Contacts Directory</h3>
              
              <div className="overflow-x-auto border rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 font-mono">
                    <tr className="border-b">
                      <th className="py-3 px-4">Contact Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Phone Number</th>
                      <th className="py-3 px-4">System Role</th>
                      <th className="py-3 px-4">Joined At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map(u => (
                      <tr key={u.id} className="border-b hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{u.name}</td>
                        <td className="py-3 px-4 font-mono">{u.email}</td>
                        <td className="py-3 px-4 font-mono">{u.phoneNumber}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                            u.role === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {currentTab === 'settings' && settings && (
            <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display">Metadata & Operational Settings</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Studio Name</label>
                  <input
                    type="text"
                    required
                    value={settings.businessName}
                    onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-800 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Brand Tagline</label>
                  <input
                    type="text"
                    required
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Phone</label>
                  <input
                    type="text"
                    required
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-800 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">WhatsApp API link</label>
                  <input
                    type="text"
                    required
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-800 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Support Email</label>
                  <input
                    type="email"
                    required
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Facebook URL</label>
                <input
                  type="text"
                  required
                  value={settings.facebook}
                  onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Top Banner Announcement</label>
                <input
                  type="text"
                  value={settings.announcement || ''}
                  onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-800 dark:text-white font-medium text-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl text-xs transition-all shadow-md"
              >
                Save Settings
              </button>
            </form>
          )}
        </div>
      )}

      {/* Invoice Lightbox view */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 relative border border-slate-200">
            <button
              onClick={() => setSelectedInvoiceOrder(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700"
            >
              <X size={18} />
            </button>

            {/* Print header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-extrabold text-blue-800 font-display text-lg">Shakil Printers & Studio</h3>
                <span className="text-[10px] text-slate-400 font-mono">Invoice Receipt for collection</span>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-lg text-xs flex items-center space-x-1"
              >
                <Printer size={12} />
                <span>Print Invoice</span>
              </button>
            </div>

            {/* Receipt body */}
            <div className="space-y-4 text-xs">
              <div className="flex justify-between font-mono">
                <span className="font-bold text-blue-600">{selectedInvoiceOrder.id}</span>
                <span className="text-slate-400">{new Date(selectedInvoiceOrder.createdAt).toLocaleDateString()}</span>
              </div>
              <p>Client Name: <strong className="text-slate-800">{selectedInvoiceOrder.customerName}</strong></p>
              <p>Contact Phone: <strong className="text-slate-800 font-mono">{selectedInvoiceOrder.phoneNumber}</strong></p>
              <p>Address: <span className="text-slate-600">{selectedInvoiceOrder.deliveryAddress}</span></p>
              
              <hr />

              <div className="flex justify-between font-bold">
                <span>{selectedInvoiceOrder.serviceName} ({selectedInvoiceOrder.quantity} units)</span>
                <span className="font-mono text-blue-700">৳{selectedInvoiceOrder.totalPrice}</span>
              </div>
              <p className="text-[10px] text-slate-400 italic">Specs: {selectedInvoiceOrder.paperSize} | {selectedInvoiceOrder.colorOption}</p>
              {selectedInvoiceOrder.additionalInstructions && (
                <p className="p-2.5 bg-slate-50 rounded border text-[11px] text-slate-600">Note: {selectedInvoiceOrder.additionalInstructions}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SERVICE MODAL */}
      {serviceModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveService} className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="font-bold text-slate-900 dark:text-white">{serviceModal.id ? 'Edit Catalog Service' : 'Add Catalog Service'}</h4>
              <button type="button" onClick={() => setServiceModal(null)} className="text-slate-400"><X size={18} /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold">Service Name</label>
                <input
                  type="text"
                  required
                  value={serviceModal.name || ''}
                  onChange={(e) => setServiceModal({ ...serviceModal, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold">Category</label>
                <select
                  value={serviceModal.category || 'Studio'}
                  onChange={(e) => setServiceModal({ ...serviceModal, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none"
                >
                  <option value="Studio">Studio</option>
                  <option value="Printing">Printing</option>
                  <option value="Wide Format">Wide Format</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Designing">Designing</option>
                  <option value="Cards">Cards</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold">Starting Price (BDT)</label>
                <input
                  type="number"
                  required
                  value={serviceModal.startingPrice || 0}
                  onChange={(e) => setServiceModal({ ...serviceModal, startingPrice: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={serviceModal.description || ''}
                  onChange={(e) => setServiceModal({ ...serviceModal, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold">Lucide Icon Name</label>
                <input
                  type="text"
                  required
                  value={serviceModal.iconName || 'Printer'}
                  onChange={(e) => setServiceModal({ ...serviceModal, iconName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={serviceModal.popular || false}
                  onChange={(e) => setServiceModal({ ...serviceModal, popular: e.target.checked })}
                  id="popCheck"
                />
                <label htmlFor="popCheck">Mark as Popular</label>
              </div>
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
            >
              {actionLoading ? 'Saving...' : 'Save Service'}
            </button>
          </form>
        </div>
      )}

      {/* PRICE MODAL */}
      {priceModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSavePriceItem} className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="font-bold text-slate-900 dark:text-white">{priceModal.id ? 'Edit Price Rule' : 'Add Price Rule'}</h4>
              <button type="button" onClick={() => setPriceModal(null)} className="text-slate-400"><X size={18} /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold">Service Group</label>
                <select
                  value={priceModal.serviceId || ''}
                  onChange={(e) => setPriceModal({ ...priceModal, serviceId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold">Paper Type / Material</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Glossy Cardstock"
                  value={priceModal.paperType || ''}
                  onChange={(e) => setPriceModal({ ...priceModal, paperType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold">Paper Size</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A4 or Passport"
                  value={priceModal.size || ''}
                  onChange={(e) => setPriceModal({ ...priceModal, size: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold">Price Per Unit (BDT)</label>
                <input
                  type="number"
                  required
                  value={priceModal.pricePerUnit || 0}
                  onChange={(e) => setPriceModal({ ...priceModal, pricePerUnit: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold">Minimum Bulk Quantity</label>
                <input
                  type="number"
                  required
                  value={priceModal.minQuantity || 1}
                  onChange={(e) => setPriceModal({ ...priceModal, minQuantity: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
            >
              {actionLoading ? 'Saving...' : 'Save Price Entry'}
            </button>
          </form>
        </div>
      )}

      {/* GALLERY MODAL */}
      {galleryModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveGalleryItem} className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="font-bold text-slate-900 dark:text-white">{galleryModal.id ? 'Edit Gallery Showcase' : 'Add Gallery Showcase'}</h4>
              <button type="button" onClick={() => setGalleryModal(null)} className="text-slate-400"><X size={18} /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold">Showcase Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Standard spot UV cards"
                  value={galleryModal.title || ''}
                  onChange={(e) => setGalleryModal({ ...galleryModal, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold">Category Category</label>
                <select
                  value={galleryModal.category || 'Banner'}
                  onChange={(e) => setGalleryModal({ ...galleryModal, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none"
                >
                  <option value="Banner">Banner</option>
                  <option value="Business Card">Business Card</option>
                  <option value="Photo Print">Photo Print</option>
                  <option value="Flex">Flex</option>
                  <option value="ID Card">ID Card</option>
                  <option value="Wedding Cards">Wedding Cards</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold">Image URL (Unsplash Link or Data URI)</label>
                <input
                  type="text"
                  required
                  value={galleryModal.imageUrl || ''}
                  onChange={(e) => setGalleryModal({ ...galleryModal, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
            >
              {actionLoading ? 'Saving...' : 'Save Gallery Entry'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
