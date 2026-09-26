import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Truck,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Clock,
  Printer,
  CheckCircle2,
  AlertCircle,
  Save,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminService } from '../../services/adminService';
import { Order } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('Pending');
  const [note, setNote] = useState<string>('');
  const [updating, setUpdating] = useState(false);

  const { success, error } = useToast();

  const loadOrder = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await adminService.getOrderById(id);
      if (res.data) {
        setOrder(res.data);
        setStatus(res.data.orderStatus);
      }
    } catch (err: any) {
      error(err.message || 'Could not fetch order.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setUpdating(true);
    try {
      const res = await adminService.updateOrderStatus(id, status, note);
      if (res.data) {
        setOrder(res.data);
        setNote('');
        success(`Order status updated to ${status}.`);
      }
    } catch (err: any) {
      error(err.message || 'Failed to update order status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !order) {
    return (
      <AdminLayout title="Order Details">
        <div className="py-20 text-center text-xs text-chocolate-600">
          <div className="w-8 h-8 border-3 border-caramel-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading order details...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Order #${order.orderNumber}`}>
      <div className="max-w-5xl space-y-8">
        {/* Top Back & Print */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-chocolate-700 hover:text-caramel-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Orders Pipeline</span>
          </Link>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-cream-50 hover:bg-cream-200 border border-cream-300 text-chocolate-900 rounded-lg text-xs font-bold transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Packing Slip</span>
          </button>
        </div>

        {/* Status Control Panel */}
        <form
          onSubmit={handleUpdateStatus}
          className="bg-cream-50 p-6 rounded-2xl border border-cream-300 shadow-artisan space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-caramel-700">
                Order Status Lifecycle
              </span>
              <div className="text-lg font-bold text-chocolate-950 flex items-center gap-2">
                <span>Current:</span>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-caramel-100 text-caramel-900 border border-caramel-300">
                  {order.orderStatus}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-3 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl font-bold text-chocolate-900 focus:outline-none focus:ring-1 focus:ring-caramel-500 cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <button
                type="submit"
                disabled={updating || status === order.orderStatus}
                className="px-4 py-2 bg-chocolate-900 text-cream-50 hover:bg-caramel-700 font-bold text-xs rounded-xl transition shadow-sm disabled:opacity-40"
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
              Internal Status Log / Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Dispatched with Australia Post tracking #AP987654321..."
              className="w-full px-3 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl text-chocolate-900 focus:outline-none focus:ring-1 focus:ring-caramel-500"
            />
          </div>
        </form>

        {/* 2 Columns: Items & Address Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Items */}
          <div className="lg:col-span-8 bg-cream-50 p-6 rounded-2xl border border-cream-300 shadow-artisan space-y-4">
            <h3 className="font-serif text-lg font-bold text-chocolate-900 border-b border-cream-200 pb-2">
              Ordered Confectionery Items ({order.items.length})
            </h3>

            <div className="divide-y divide-cream-200">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg bg-cream-200 border border-cream-300 flex-shrink-0"
                      />
                    )}
                    <div>
                      <div className="font-bold text-sm text-chocolate-950">{item.name}</div>
                      <div className="text-chocolate-500 font-mono text-[10px]">
                        SKU: {item.sku} • {item.weight}
                      </div>
                      <div className="text-chocolate-600">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="font-bold text-sm text-chocolate-900 font-mono">
                    ${item.subtotal.toFixed(2)} AUD
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal & Totals */}
            <div className="border-t border-cream-200 pt-4 space-y-2 text-xs text-chocolate-700 max-w-xs ml-auto">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-chocolate-900">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-bold text-chocolate-900">
                  {order.shippingAmount === 0 ? 'FREE' : `$${order.shippingAmount.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-2 border-t border-cream-300 flex justify-between items-baseline font-serif text-lg font-bold text-chocolate-950">
                <span>Grand Total</span>
                <span>${order.totalAmount.toFixed(2)} AUD</span>
              </div>
              <div className="text-[10px] text-chocolate-500 text-right">
                Payment: {order.paymentMethod} ({order.paymentStatus})
              </div>
            </div>
          </div>

          {/* Right Column: Customer & Delivery Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-cream-50 p-6 rounded-2xl border border-cream-300 shadow-artisan space-y-4 text-xs text-chocolate-800">
              <h3 className="font-serif text-base font-bold text-chocolate-900 border-b border-cream-200 pb-2">
                Customer Information
              </h3>
              <div>
                <strong className="block text-sm text-chocolate-950">
                  {order.customer.firstName} {order.customer.lastName}
                </strong>
                <div className="text-chocolate-600 flex items-center gap-1.5 mt-1">
                  <Mail className="w-3.5 h-3.5 text-caramel-600" />
                  <span>{order.customer.email}</span>
                </div>
                <div className="text-chocolate-600 flex items-center gap-1.5 mt-1">
                  <Phone className="w-3.5 h-3.5 text-caramel-600" />
                  <span>{order.customer.phone}</span>
                </div>
              </div>
            </div>

            <div className="bg-cream-50 p-6 rounded-2xl border border-cream-300 shadow-artisan space-y-4 text-xs text-chocolate-800">
              <h3 className="font-serif text-base font-bold text-chocolate-900 border-b border-cream-200 pb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-caramel-700" />
                Shipping Destination
              </h3>
              <p className="leading-relaxed">
                {order.shippingAddress.address}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postcode}<br />
                {order.shippingAddress.country}
              </p>
              {order.notes && (
                <div className="p-3 bg-cream-100 rounded-xl border border-cream-200 mt-2">
                  <strong className="text-chocolate-900 block mb-0.5">Customer Note:</strong>
                  <span>{order.notes}</span>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-cream-50 p-6 rounded-2xl border border-cream-300 shadow-artisan space-y-4 text-xs">
              <h3 className="font-serif text-base font-bold text-chocolate-900 border-b border-cream-200 pb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-caramel-700" />
                Order Audit Trail
              </h3>

              <div className="space-y-3">
                {order.timeline.map((event, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-caramel-600 mt-1.5 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-chocolate-900">
                        {event.status}{' '}
                        <span className="font-normal text-chocolate-400 text-[10px]">
                          {new Date(event.timestamp).toLocaleDateString('en-AU', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-chocolate-600 text-[11px]">{event.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
