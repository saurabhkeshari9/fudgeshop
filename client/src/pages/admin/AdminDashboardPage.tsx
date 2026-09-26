import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Package,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Plus,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminService } from '../../services/adminService';
import { Order } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<{
    metrics: {
      totalRevenue: number;
      totalOrders: number;
      pendingOrders: number;
      processingOrders: number;
      deliveredOrders: number;
      cancelledOrders: number;
      totalProducts: number;
      activeProducts: number;
      lowStockProducts: number;
    };
    recentOrders: Order[];
    topProducts: { _id: string; name: string; totalSold: number; revenue: number }[];
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getDashboardStats()
      .then((res) => {
        if (res.data) setData(res.data);
      })
      .catch((err) => console.error('Failed to load dashboard metrics', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <AdminLayout title="Overview Dashboard">
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-caramel-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-chocolate-700">Loading store performance metrics...</p>
        </div>
      </AdminLayout>
    );
  }

  const { metrics, recentOrders, topProducts } = data;

  return (
    <AdminLayout title="Overview Dashboard">
      <div className="space-y-8">
        {/* Quick Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-caramel-700">
              Live Storefront Telemetry
            </span>
            <p className="text-sm text-chocolate-600">
              Real-time summary of sales, kitchen orders, and inventory.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/products/new"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-chocolate-900 text-cream-50 hover:bg-caramel-700 font-bold text-xs rounded-xl transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </Link>
            <Link
              to="/admin/homepage"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-cream-50 text-chocolate-900 border border-cream-300 hover:bg-cream-200 font-semibold text-xs rounded-xl transition"
            >
              <span>Edit Homepage</span>
            </Link>
            <Link
              to="/admin/categories"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-cream-50 text-chocolate-900 border border-cream-300 hover:bg-cream-200 font-semibold text-xs rounded-xl transition"
            >
              <span>Categories</span>
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Revenue */}
          <div className="bg-cream-50 p-6 rounded-2xl border border-cream-300 shadow-artisan space-y-3">
            <div className="flex items-center justify-between text-chocolate-600 text-xs font-bold uppercase tracking-wider">
              <span>Total Revenue</span>
              <div className="p-2 bg-caramel-100 text-caramel-700 rounded-lg">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="font-serif text-3xl font-bold text-chocolate-950">
              ${metrics.totalRevenue.toFixed(2)} AUD
            </div>
            <div className="text-xs text-chocolate-500 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Excludes cancelled orders</span>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-cream-50 p-6 rounded-2xl border border-cream-300 shadow-artisan space-y-3">
            <div className="flex items-center justify-between text-chocolate-600 text-xs font-bold uppercase tracking-wider">
              <span>Total Orders</span>
              <div className="p-2 bg-cream-200 text-chocolate-800 rounded-lg">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="font-serif text-3xl font-bold text-chocolate-950">
              {metrics.totalOrders}
            </div>
            <div className="text-xs text-chocolate-500 flex items-center gap-1">
              <span className="font-bold text-chocolate-800">{metrics.deliveredOrders}</span> delivered
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-cream-50 p-6 rounded-2xl border border-cream-300 shadow-artisan space-y-3">
            <div className="flex items-center justify-between text-chocolate-600 text-xs font-bold uppercase tracking-wider">
              <span>Pending Action</span>
              <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="font-serif text-3xl font-bold text-chocolate-950">
              {metrics.pendingOrders}
            </div>
            <div className="text-xs text-chocolate-500">
              <Link to="/admin/orders?status=Pending" className="text-caramel-700 hover:underline font-semibold">
                View awaiting dispatch →
              </Link>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-cream-50 p-6 rounded-2xl border border-cream-300 shadow-artisan space-y-3">
            <div className="flex items-center justify-between text-chocolate-600 text-xs font-bold uppercase tracking-wider">
              <span>Stock Status</span>
              <div className="p-2 bg-red-100 text-red-800 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="font-serif text-3xl font-bold text-chocolate-950">
              {metrics.lowStockProducts}
            </div>
            <div className="text-xs text-chocolate-500">
              {metrics.activeProducts} active products in catalog
            </div>
          </div>
        </div>

        {/* 2 Columns: Recent Orders & Top-Selling Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Orders Table */}
          <div className="lg:col-span-8 bg-cream-50 p-6 rounded-2xl border border-cream-300 shadow-artisan space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <h3 className="font-serif text-lg font-bold text-chocolate-900">
                Recent Customer Orders
              </h3>
              <Link
                to="/admin/orders"
                className="text-xs font-bold text-caramel-700 hover:text-caramel-800 flex items-center gap-1"
              >
                <span>View All Orders</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="py-8 text-center text-xs text-chocolate-500">
                No orders placed yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-chocolate-800">
                  <thead className="bg-cream-100 text-chocolate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-3 rounded-l-lg">Order #</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Total</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 rounded-r-lg text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {recentOrders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-cream-100/50 transition">
                        <td className="py-3 px-3 font-mono font-bold text-chocolate-950">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-chocolate-900 truncate max-w-[140px]">
                            {ord.customer.firstName} {ord.customer.lastName}
                          </div>
                          <div className="text-[10px] text-chocolate-500 truncate max-w-[140px]">
                            {ord.customer.email}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-chocolate-600 whitespace-nowrap">
                          {new Date(ord.createdAt).toLocaleDateString('en-AU', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </td>
                        <td className="py-3 px-3 font-bold text-chocolate-950 whitespace-nowrap">
                          ${ord.totalAmount.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.orderStatus === 'Pending'
                                ? 'bg-amber-100 text-amber-900'
                                : ord.orderStatus === 'Processing'
                                ? 'bg-blue-100 text-blue-900'
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
                        <td className="py-3 px-3 text-right">
                          <Link
                            to={`/admin/orders/${ord._id}`}
                            className="p-1.5 hover:bg-cream-200 text-chocolate-700 hover:text-chocolate-950 rounded-lg inline-block transition"
                            title="View order"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Top Selling Products */}
          <div className="lg:col-span-4 bg-cream-50 p-6 rounded-2xl border border-cream-300 shadow-artisan space-y-4">
            <h3 className="font-serif text-lg font-bold text-chocolate-900 pb-3 border-b border-cream-200">
              Top Selling Confectionery
            </h3>

            {topProducts.length === 0 ? (
              <div className="py-8 text-center text-xs text-chocolate-500">
                Sales statistics will populate after orders are processed.
              </div>
            ) : (
              <div className="space-y-3">
                {topProducts.map((prod, i) => (
                  <div
                    key={prod._id || i}
                    className="flex items-center justify-between p-3 bg-cream-100/70 rounded-xl border border-cream-200 text-xs"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="font-bold text-chocolate-900 truncate">{prod.name}</div>
                      <div className="text-[10px] text-chocolate-500">
                        {prod.totalSold} units ordered
                      </div>
                    </div>
                    <div className="font-bold text-chocolate-950 font-mono">
                      ${prod.revenue.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
