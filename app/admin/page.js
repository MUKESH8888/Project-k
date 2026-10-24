'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../components/AuthContext';
import { useCart } from '../../components/CartContext';

export default function AdminDashboardPage() {
  const { user, isAdmin, logout, login } = useAuth();
  const { showToast } = useCart();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateString, setDateString] = useState('');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // New product form
  const [newProductData, setNewProductData] = useState({
    title: '',
    department: 'women',
    category: 'Kanchipuram Pattu',
    price: '',
    originalPrice: '',
    stock: 5,
    telugu: '',
    image: '',
  });
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  useEffect(() => {
    setDateString(
      new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  }, []);

  // Fetch live API data
  const fetchData = async () => {
    try {
      const [statsRes, ordersRes, apptsRes, prodsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/orders'),
        fetch('/api/appointments'),
        fetch('/api/products'),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.orders);
      }
      if (apptsRes.ok) {
        const data = await apptsRes.json();
        setAppointments(data.appointments);
      }
      if (prodsRes.ok) {
        const data = await prodsRes.json();
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  // Update order status via PUT /api/orders/[id]
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast(`Order ${orderId} status updated to ${newStatus}`);
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      showToast('Failed to update order status');
    }
  };

  // Update appointment status via PUT /api/appointments/[id]
  const handleUpdateApptStatus = async (apptId, newStatus) => {
    try {
      const res = await fetch(`/api/appointments/${apptId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast(`Appointment status updated to ${newStatus}`);
        setAppointments((prev) =>
          prev.map((a) => (a.id === apptId ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      showToast('Failed to update appointment status');
    }
  };

  // Add new product via POST /api/products
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProductData.title || !newProductData.price) return;
    try {
      const defaultImages = {
        women: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        men: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
        kids: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80',
      };
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProductData,
          price: Number(newProductData.price),
          originalPrice: Number(newProductData.originalPrice || newProductData.price),
          image: newProductData.image || defaultImages[newProductData.department] || defaultImages.women,
          colors: ['#8E1624', '#D49E35'],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        showToast('New product added to live catalog!');
        setProducts([data.product, ...products]);
        setIsAddingProduct(false);
        setNewProductData({
          title: '',
          department: 'women',
          category: 'Kanchipuram Pattu',
          price: '',
          originalPrice: '',
          stock: 5,
          telugu: '',
          image: '',
        });
      }
    } catch (err) {
      showToast('Failed to create product');
    }
  };

  // If not admin, show gate
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-inverse-surface text-inverse-on-surface flex flex-col justify-center items-center p-6">
        <div className="max-w-md w-full bg-surface-container-lowest text-on-surface rounded-2xl p-8 shadow-2xl border border-secondary-fixed/40 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[36px]">lock</span>
          </div>

          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">
            RESTRICTED ACCESS
          </span>

          <h1 className="font-headline-sm text-headline-sm font-bold text-primary">
            Admin Authorization Required
          </h1>

          <p className="font-body-sm text-body-sm text-on-surface-variant">
            You must be logged in as an authorized store administrator to access the Kalyanam Shopping Mall enterprise operations dashboard.
          </p>

          <div className="flex flex-col gap-2 w-full pt-2">
            <Link
              href="/admin/login"
              className="w-full py-3 rounded-lg bg-primary text-on-primary font-semibold text-center hover:bg-primary-container transition-colors shadow-md"
            >
              Sign In to Admin Portal
            </Link>


            <Link
              href="/"
              className="w-full py-2 text-label-sm text-on-surface-variant hover:underline text-center"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      {/* Admin Top Navigation Bar */}
      <header className="bg-inverse-surface text-inverse-on-surface border-b border-surface-dim/20 sticky top-0 z-40 px-margin py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-gutter">
          <div className="flex items-center gap-space-md">
            <Link href="/" className="flex items-center gap-2 group">
              <img
                alt="Kalyanam Shopping Mall"
                className="h-9 w-auto object-contain"
                src="/images/logo.png"
              />
              <span className="font-headline-sm text-headline-sm font-bold text-secondary-fixed">
                Admin
              </span>
            </Link>
            <span className="bg-secondary text-on-secondary font-label-sm text-[10px] px-2 py-0.5 rounded font-bold uppercase hidden sm:inline">
              LIVE SYSTEM
            </span>
          </div>

          <div className="flex items-center gap-space-md">
            <span className="text-label-sm text-surface-dim hidden md:inline">{dateString}</span>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 text-label-sm text-secondary-fixed transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>View Mall</span>
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-surface-dim/30">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs uppercase">
                {user.name.charAt(0)}
              </div>
              <div className="hidden lg:flex flex-col text-left leading-tight">
                <span className="font-label-sm text-label-sm font-bold text-inverse-on-surface">
                  {user.name}
                </span>
                <span className="text-[10px] text-secondary-fixed">Chief Curator</span>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 rounded-lg text-error hover:bg-error-container/20 transition-colors cursor-pointer ml-1"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Stage */}
      <div className="max-w-7xl mx-auto px-margin py-space-lg w-full flex-1 flex flex-col gap-space-lg">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-surface-container overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'dashboard', label: 'Executive Overview', icon: 'dashboard' },
            { id: 'orders', label: `Orders (${orders.length})`, icon: 'shopping_bag' },
            { id: 'appointments', label: `Video Appointments (${appointments.length})`, icon: 'videocam' },
            { id: 'products', label: `Catalog (${products.length})`, icon: 'inventory_2' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-4 rounded-lg font-title-sm text-title-sm flex items-center gap-2 cursor-pointer transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 1. EXECUTIVE OVERVIEW TAB */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-space-lg">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
              <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container flex flex-col justify-between">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className="font-label-sm uppercase tracking-wider">Gross Revenue</span>
                  <span className="material-symbols-outlined text-secondary text-[22px]">payments</span>
                </div>
                <div className="mt-2">
                  <span className="font-display-md text-headline-lg font-bold text-primary">
                    {stats?.revenue || '₹13,74,300'}
                  </span>
                  <span className="text-[12px] text-tertiary-container font-semibold block mt-0.5">
                    ↑ +18.2% vs last month
                  </span>
                </div>
              </div>

              <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container flex flex-col justify-between">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className="font-label-sm uppercase tracking-wider">Orders Processed</span>
                  <span className="material-symbols-outlined text-primary text-[22px]">package_2</span>
                </div>
                <div className="mt-2">
                  <span className="font-display-md text-headline-lg font-bold text-on-surface">
                    {orders.length + 47}
                  </span>
                  <span className="text-[12px] text-tertiary-container font-semibold block mt-0.5">
                    ↑ 12 placed today
                  </span>
                </div>
              </div>

              <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container flex flex-col justify-between">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className="font-label-sm uppercase tracking-wider">Video Appointments</span>
                  <span className="material-symbols-outlined text-secondary text-[22px]">videocam</span>
                </div>
                <div className="mt-2">
                  <span className="font-display-md text-headline-lg font-bold text-on-surface">
                    {appointments.length}
                  </span>
                  <span className="text-[12px] text-secondary font-semibold block mt-0.5">
                    {appointments.filter((a) => a.status === 'Booked').length} Pending Sessions
                  </span>
                </div>
              </div>

              <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container flex flex-col justify-between">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className="font-label-sm uppercase tracking-wider">Inventory Alerts</span>
                  <span className="material-symbols-outlined text-error text-[22px]">warning</span>
                </div>
                <div className="mt-2">
                  <span className="font-display-md text-headline-lg font-bold text-error">
                    {products.filter((p) => p.stock <= 2).length + 3}
                  </span>
                  <span className="text-[12px] text-error font-semibold block mt-0.5">
                    Action required on 3 looms
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Orders & Appointments Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
              {/* Recent Orders Table */}
              <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-surface-container flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-surface-container pb-2">
                  <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
                    Recent Matrimonial Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-secondary font-semibold text-body-sm hover:underline cursor-pointer"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-body-sm font-body-sm">
                    <thead>
                      <tr className="border-b border-surface-container text-on-surface-variant font-label-sm">
                        <th className="py-2">Order ID</th>
                        <th className="py-2">Bride / Customer</th>
                        <th className="py-2">Amount</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-surface-container/40">
                          <td className="py-2.5 font-mono text-xs font-bold text-primary">
                            {order.id}
                          </td>
                          <td className="py-2.5">
                            <span className="font-semibold block">{order.customerName}</span>
                            <span className="text-[11px] text-on-surface-variant">
                              {order.items[0]?.title || 'Heirloom Saree'}
                            </span>
                          </td>
                          <td className="py-2.5 font-semibold">
                            ₹{order.totalAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                order.status === 'Confirmed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.status === 'Processing'
                                  ? 'bg-amber-100 text-amber-800'
                                  : order.status === 'Dispatched'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-2.5">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="text-[11px] bg-surface-container px-2 py-1 rounded border border-surface-dim/40 cursor-pointer"
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Dispatched">Dispatched</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Video Appointments Schedule */}
              <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-surface-container flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-surface-container pb-2">
                  <h3 className="font-headline-sm text-headline-sm font-bold text-secondary">
                    Video Walkthroughs
                  </h3>
                  <span className="text-[11px] bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded font-bold">
                    TODAY
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {appointments.slice(0, 4).map((apt) => (
                    <div
                      key={apt.id}
                      className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-1 border border-surface-container"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-title-sm text-title-sm font-bold text-on-surface">
                          {apt.customerName}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            apt.status === 'Booked'
                              ? 'bg-primary text-on-primary'
                              : 'bg-tertiary text-on-tertiary'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                      <span className="text-body-sm text-on-surface-variant">
                        📱 {apt.customerPhone} • {apt.slot}
                      </span>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-secondary font-medium">
                          {Array.isArray(apt.weaves) ? apt.weaves.join(', ') : apt.weaves}
                        </span>
                        {apt.status === 'Booked' && (
                          <button
                            onClick={() => handleUpdateApptStatus(apt.id, 'Completed')}
                            className="text-[11px] bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded font-bold hover:bg-secondary-fixed-dim transition-colors cursor-pointer"
                          >
                            Mark Done ✓
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. ORDERS MANAGEMENT TAB */}
        {activeTab === 'orders' && (
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-surface-container flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div>
                <h2 className="font-headline-sm text-headline-sm font-bold text-primary">
                  All Matrimonial &amp; Heritage Orders
                </h2>
                <p className="text-body-sm text-on-surface-variant">
                  Real-time status updates sync with customer order trackers and courier APIs.
                </p>
              </div>
              <button
                onClick={fetchData}
                className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-label-sm font-semibold hover:bg-surface-container-high transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                <span>Refresh Live</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-body-sm font-body-sm">
                <thead>
                  <tr className="border-b border-surface-container text-on-surface-variant font-label-sm">
                    <th className="py-3">Order ID</th>
                    <th className="py-3">Customer &amp; Contact</th>
                    <th className="py-3">Items Ordered</th>
                    <th className="py-3">Shipping Address</th>
                    <th className="py-3">Amount</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-surface-container/40">
                      <td className="py-3 font-mono text-xs font-bold text-primary">
                        {order.id}
                        <span className="block text-[10px] text-on-surface-variant font-normal">
                          {order.date}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="font-bold block text-on-surface">{order.customerName}</span>
                        <span className="text-[11px] text-on-surface-variant">{order.customerPhone}</span>
                      </td>
                      <td className="py-3">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="text-body-sm">
                            <span className="font-medium">{it.title}</span>
                            <span className="text-[11px] text-on-surface-variant block">
                              Shade: {it.shade || 'Red'} (Qty: {it.quantity || 1})
                            </span>
                          </div>
                        ))}
                      </td>
                      <td className="py-3 max-w-xs text-body-sm text-on-surface-variant">
                        {order.shippingAddress}
                      </td>
                      <td className="py-3 font-bold text-primary">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            order.status === 'Confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'Processing'
                              ? 'bg-amber-100 text-amber-800'
                              : order.status === 'Dispatched'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="bg-surface-container px-2.5 py-1.5 rounded-lg border border-surface-dim/40 text-body-sm font-medium cursor-pointer"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. VIDEO APPOINTMENTS TAB */}
        {activeTab === 'appointments' && (
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-surface-container flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div>
                <h2 className="font-headline-sm text-headline-sm font-bold text-secondary">
                  Bridal Video Shopping Appointments
                </h2>
                <p className="text-body-sm text-on-surface-variant">
                  Sessions booked by brides globally for personalized Jubilee Hills showroom walkthroughs.
                </p>
              </div>
              <button
                onClick={fetchData}
                className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-label-sm font-semibold hover:bg-surface-container-high transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                <span>Refresh Live</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex flex-col justify-between gap-3 shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-title-md text-title-md font-bold text-on-surface">
                        {apt.customerName}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          apt.status === 'Booked'
                            ? 'bg-primary text-on-primary'
                            : 'bg-tertiary text-on-tertiary'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    <div className="mt-2 text-body-sm text-on-surface-variant flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-primary">
                          phone
                        </span>
                        <span className="font-semibold text-on-surface">{apt.customerPhone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-secondary">
                          calendar_month
                        </span>
                        <span>
                          {apt.date} • {apt.slot}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-secondary">
                          language
                        </span>
                        <span>Language: {apt.language || 'Telugu'}</span>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-surface-container">
                      <span className="text-[11px] text-secondary font-bold uppercase tracking-wider block">
                        Interested Weaves:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(Array.isArray(apt.weaves) ? apt.weaves : [apt.weaves]).map((w, i) => (
                          <span
                            key={i}
                            className="bg-surface-container px-2 py-0.5 rounded text-[11px] font-medium"
                          >
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() =>
                        handleUpdateApptStatus(
                          apt.id,
                          apt.status === 'Booked' ? 'Completed' : 'Booked'
                        )
                      }
                      className="flex-1 py-2 rounded-lg bg-secondary-fixed text-on-secondary-fixed font-semibold text-xs hover:bg-secondary-fixed-dim transition-colors cursor-pointer text-center"
                    >
                      {apt.status === 'Booked' ? 'Mark Completed ✓' : 'Mark Booked'}
                    </button>
                    <a
                      href={`https://wa.me/${apt.customerPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-lg bg-green-700 text-white text-xs font-semibold hover:bg-green-800 transition-colors flex items-center gap-1"
                    >
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. CATALOG & INVENTORY TAB */}
        {activeTab === 'products' && (
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-surface-container flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div>
                <h2 className="font-headline-sm text-headline-sm font-bold text-primary">
                  Master Handloom Catalog &amp; Inventory
                </h2>
                <p className="text-body-sm text-on-surface-variant">
                  Direct weaver loom allotments, Silk Mark registry, and active stock counts.
                </p>
              </div>
              <button
                onClick={() => setIsAddingProduct(!isAddingProduct)}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold text-body-sm hover:bg-primary-container transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isAddingProduct ? 'close' : 'add'}
                </span>
                <span>{isAddingProduct ? 'Cancel' : 'Add New Handloom Saree'}</span>
              </button>
            </div>

            {/* Add Product Form */}
            {isAddingProduct && (
              <form
                onSubmit={handleAddProduct}
                className="p-4 bg-surface-container-low rounded-xl border border-secondary-fixed/40 flex flex-col gap-3"
              >
                <h3 className="font-title-md text-title-md font-bold text-primary">
                  New Product Entry
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-label-sm font-semibold mb-1">Department</label>
                    <select
                      value={newProductData.department}
                      onChange={(e) => {
                        const dept = e.target.value;
                        const defaultCats = {
                          women: 'Kanchipuram Pattu',
                          men: 'Pattu Panche & Dhotis',
                          kids: 'Girls Pattu Pavada',
                        };
                        setNewProductData({
                          ...newProductData,
                          department: dept,
                          category: defaultCats[dept] || 'Traditional Wear',
                        });
                      }}
                      className="w-full px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-dim/40 text-body-sm"
                    >
                      <option value="women">Women (మహిళలు)</option>
                      <option value="men">Men (పురుషులు)</option>
                      <option value="kids">Kids (పిల్లలు)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-label-sm font-semibold mb-1">Product Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Swarna Kanchi Bridal Pattu Saree"
                      value={newProductData.title}
                      onChange={(e) => setNewProductData({ ...newProductData, title: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-dim/40 text-body-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-label-sm font-semibold mb-1">
                      Telugu Name (తెలుగు పేరు)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. స్వర్ణ కాంచీపురం పట్టు చీర"
                      value={newProductData.telugu}
                      onChange={(e) => setNewProductData({ ...newProductData, telugu: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-dim/40 text-body-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-label-sm font-semibold mb-1">Category</label>
                    {newProductData.department === 'women' && (
                      <select
                        value={newProductData.category}
                        onChange={(e) => setNewProductData({ ...newProductData, category: e.target.value })}
                        className="w-full px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-dim/40 text-body-sm"
                      >
                        <option>Kanchipuram Pattu</option>
                        <option>Bridal Pattu</option>
                        <option>Banarasi Silk</option>
                        <option>Bridal Lehengas</option>
                        <option>Half Sarees (Langa Voni)</option>
                        <option>Gadwal Handloom</option>
                        <option>Pochampally Ikat</option>
                      </select>
                    )}
                    {newProductData.department === 'men' && (
                      <select
                        value={newProductData.category}
                        onChange={(e) => setNewProductData({ ...newProductData, category: e.target.value })}
                        className="w-full px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-dim/40 text-body-sm"
                      >
                        <option>Pattu Panche & Dhotis</option>
                        <option>Sherwanis</option>
                        <option>Kurta Sets</option>
                        <option>Silk Shirts</option>
                      </select>
                    )}
                    {newProductData.department === 'kids' && (
                      <select
                        value={newProductData.category}
                        onChange={(e) => setNewProductData({ ...newProductData, category: e.target.value })}
                        className="w-full px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-dim/40 text-body-sm"
                      >
                        <option>Girls Pattu Pavada</option>
                        <option>Boys Kurta Sets</option>
                        <option>Kids Festive Wear</option>
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-label-sm font-semibold mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="42500"
                      value={newProductData.price}
                      onChange={(e) => setNewProductData({ ...newProductData, price: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-dim/40 text-body-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-label-sm font-semibold mb-1">Stock Count</label>
                    <input
                      type="number"
                      placeholder="5"
                      value={newProductData.stock}
                      onChange={(e) => setNewProductData({ ...newProductData, stock: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-dim/40 text-body-sm"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="self-end px-5 py-2.5 rounded-lg bg-primary text-on-primary font-semibold text-body-sm hover:bg-primary-container transition-colors cursor-pointer"
                >
                  Publish Product to Live Mall
                </button>
              </form>
            )}

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-body-sm font-body-sm">
                <thead>
                  <tr className="border-b border-surface-container text-on-surface-variant font-label-sm">
                    <th className="py-3">SKU</th>
                    <th className="py-3">Product</th>
                    <th className="py-3">Department</th>
                    <th className="py-3">Category</th>
                    <th className="py-3">Price</th>
                    <th className="py-3">In Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-surface-container/40">
                      <td className="py-3 font-mono text-xs font-bold text-secondary">
                        {prod.sku}
                      </td>
                      <td className="py-3">
                        <span className="font-bold block text-on-surface">{prod.title}</span>
                        <span className="text-[11px] text-on-surface-variant">{prod.telugu}</span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                            prod.department === 'women'
                              ? 'bg-[#751E2B]/10 text-[#751E2B]'
                              : prod.department === 'men'
                              ? 'bg-[#1B4D3E]/10 text-[#1B4D3E]'
                              : 'bg-[#1A5276]/10 text-[#1A5276]'
                          }`}
                        >
                          {prod.department || 'general'}
                        </span>
                      </td>
                      <td className="py-3 font-medium">{prod.category}</td>
                      <td className="py-3 font-bold text-primary">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            prod.stock <= 2
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {prod.stock} Available
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
