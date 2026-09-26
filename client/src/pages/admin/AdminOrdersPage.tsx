import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, ShoppingBag, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminService } from '../../services/adminService';
import { Order } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { error } = useToast();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await adminService.getOrders({
        search: search.trim(),
        status: statusFilter !== 'all' ? statusFilter : undefined,
        limit: 100,
      });
      if (res.data) setOrders(res.data);
    } catch (err: any) {
      error(err.message || 'Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrders();
  };

  return (
    <AdminLayout title="Order Management">
      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-bold text-chocolate-900">
            Customer Orders Pipeline ({orders.length})
          </h2>
          <p className="text-xs text-chocolate-600">
            Track customer orders from kitchen preparation to Australia Post dispatch.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-cream-50 p-4 rounded-2xl border border-cream-300 shadow-sm flex flex-col md:flex-row items-center gap-3">
          <form onSubmit={handleSearch} className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search by order number, customer name, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl text-chocolate-900 focus:outline-none focus:ring-1 focus:ring-caramel-500"
            />
            <Search className="w-4 h-4 text-chocolate-400 absolute left-3 top-2.5" />
          </form>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl text-chocolate-900 focus:outline-none focus:ring-1 focus:ring-caramel-500 cursor-pointer font-semibold"
          >
            <option value="all">All Order Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="bg-cream-50 rounded-2xl border border-cream-300 shadow-artisan overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-xs text-chocolate-600">
              <div className="w-8 h-8 border-3 border-caramel-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading customer orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center text-xs text-chocolate-600 space-y-2">
              <ShoppingBag className="w-8 h-8 mx-auto text-chocolate-400" />
              <p>No customer orders match the current criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-chocolate-800">
                <thead className="bg-cream-100 text-chocolate-700 font-bold uppercase tracking-wider text-[10px] border-b border-cream-200">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Items</th>
                    <th className="py-3 px-3">Total Amount</th>
                    <th className="py-3 px-3">Payment</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-cream-100/50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-chocolate-950">
                        <Link to={`/admin/orders/${ord._id}`} className="hover:text-caramel-700 underline">
                          {ord.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap text-chocolate-600">
                        {new Date(ord.createdAt).toLocaleDateString('en-AU', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-chocolate-900 truncate max-w-[150px]">
                          {ord.customer.firstName} {ord.customer.lastName}
                        </div>
                        <div className="text-[10px] text-chocolate-500 truncate max-w-[150px]">
                          {ord.customer.email}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap font-medium">
                        {ord.items.reduce((s, i) => s + i.quantity, 0)} units
                      </td>
                      <td className="py-3.5 px-3 font-bold text-chocolate-950 whitespace-nowrap">
                        ${ord.totalAmount.toFixed(2)} AUD
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {ord.paymentStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ord.orderStatus === 'Pending'
                              ? 'bg-amber-100 text-amber-900'
                              : ord.orderStatus === 'Confirmed'
                              ? 'bg-blue-100 text-blue-900'
                              : ord.orderStatus === 'Processing'
                              ? 'bg-indigo-100 text-indigo-900'
                              : ord.orderStatus === 'Shipped'
                              ? 'bg-purple-100 text-purple-900'
                              : ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-red-100 text-red-900'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link
                          to={`/admin/orders/${ord._id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-cream-200 hover:bg-cream-300 text-chocolate-900 font-semibold rounded-lg text-xs transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
