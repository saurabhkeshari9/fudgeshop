import React, { useState, useEffect } from 'react';
import { Users, Search, ShoppingBag, Mail, Phone, Calendar } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminService } from '../../services/adminService';

interface CustomerAgg {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  latestOrderStatus: string;
}

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerAgg[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminService
      .getCustomers()
      .then((res) => {
        if (res.data) setCustomers(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  return (
    <AdminLayout title="Customer Directory">
      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-bold text-chocolate-900">
            Artisan Confectionery Customers ({customers.length})
          </h2>
          <p className="text-xs text-chocolate-600">
            Real customer spending profiles aggregated directly from completed checkout orders.
          </p>
        </div>

        {/* Search */}
        <div className="bg-cream-50 p-4 rounded-2xl border border-cream-300 shadow-sm">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search by customer name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl text-chocolate-900 focus:outline-none focus:ring-1 focus:ring-caramel-500"
            />
            <Search className="w-4 h-4 text-chocolate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Customer Directory Table */}
        <div className="bg-cream-50 rounded-2xl border border-cream-300 shadow-artisan overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-xs text-chocolate-600">
              Loading customer profiles...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-xs text-chocolate-600 space-y-2">
              <Users className="w-8 h-8 mx-auto text-chocolate-400" />
              <p>No customer profiles found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-chocolate-800">
                <thead className="bg-cream-100 text-chocolate-700 font-bold uppercase tracking-wider text-[10px] border-b border-cream-200">
                  <tr>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-3">Contact Email</th>
                    <th className="py-3 px-3">Phone</th>
                    <th className="py-3 px-3">Orders Placed</th>
                    <th className="py-3 px-3">Lifetime Spend</th>
                    <th className="py-3 px-3">Last Active</th>
                    <th className="py-3 px-4 text-right">Latest Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200">
                  {filtered.map((c) => (
                    <tr key={c._id} className="hover:bg-cream-100/50 transition">
                      <td className="py-3.5 px-4 font-bold text-chocolate-950 whitespace-nowrap">
                        {c.firstName} {c.lastName}
                      </td>
                      <td className="py-3.5 px-3 text-chocolate-600 whitespace-nowrap">
                        {c.email}
                      </td>
                      <td className="py-3.5 px-3 text-chocolate-600 whitespace-nowrap font-mono">
                        {c.phone}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap font-bold text-chocolate-900">
                        {c.totalOrders} {c.totalOrders === 1 ? 'order' : 'orders'}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-chocolate-950 whitespace-nowrap font-mono">
                        ${c.totalSpent.toFixed(2)} AUD
                      </td>
                      <td className="py-3.5 px-3 text-chocolate-600 whitespace-nowrap">
                        {c.lastOrderDate
                          ? new Date(c.lastOrderDate).toLocaleDateString('en-AU', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-caramel-100 text-caramel-900">
                          {c.latestOrderStatus || 'Active'}
                        </span>
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
