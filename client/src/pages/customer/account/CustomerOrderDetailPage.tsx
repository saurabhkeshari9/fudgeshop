import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { orderService } from '../../../services/orderService';
import { Order } from '../../../types';
import { AccountNav } from './AccountNav';

export const CustomerOrderDetailPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { isAuthenticated, isLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (orderNumber && isAuthenticated) {
      orderService
        .getMyOrderById(orderNumber)
        .then((res) => {
          if (res.data) setOrder(res.data);
        })
        .catch((err) => {
          setErrorMsg(err.message || 'Order could not be found.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [orderNumber, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-chocolate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/account/login" replace />;
  }

  if (loading) {
    return (
      <div>
        <AccountNav />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="w-8 h-8 border-3 border-chocolate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-chocolate-600">Loading order receipt #{orderNumber}...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div>
        <AccountNav />
        <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
          <h2 className="font-serif text-2xl font-bold text-chocolate-900">
            Order Not Found
          </h2>
          <p className="text-sm text-chocolate-600">
            {errorMsg || `We couldn't locate order #${orderNumber} under your account.`}
          </p>
          <Link
            to="/account/orders"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-chocolate-900 text-cream-50 font-bold text-xs rounded-xl hover:bg-caramel-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to My Orders</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AccountNav />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Top actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            to="/account/orders"
            className="inline-flex items-center gap-2 text-xs font-bold text-chocolate-700 hover:text-caramel-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Orders</span>
          </Link>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cream-200 hover:bg-cream-300 text-chocolate-900 font-bold text-xs rounded-xl border border-cream-300 transition"
          >
            <Printer className="w-3.5 h-3.5 text-caramel-700" />
            <span>Print Tax Receipt</span>
          </button>
        </div>

        {/* Receipt Header Card */}
        <div className="bg-cream-50 rounded-3xl border border-cream-300 p-6 sm:p-8 shadow-artisan space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-cream-200 pb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-caramel-700">
                Official Order Receipt
              </span>
              <h1 className="font-serif text-3xl font-bold text-chocolate-950 mt-1">
                Order #{order.orderNumber}
              </h1>
              <div className="flex items-center gap-3 text-xs text-chocolate-600 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-chocolate-400" />
                  {new Date(order.createdAt).toLocaleDateString('en-AU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span>•</span>
                <span className="font-semibold text-chocolate-800">
                  Status: {order.orderStatus}
                </span>
              </div>
            </div>

            <div className="sm:text-right">
              <div className="text-xs text-chocolate-500 uppercase tracking-wider font-semibold">
                Grand Total
              </div>
              <div className="font-serif text-3xl font-bold text-chocolate-950">
                ${order.totalAmount.toFixed(2)} AUD
              </div>
              <span className="inline-block mt-1 px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Payment {order.paymentStatus.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Fulfillment Timeline */}
          {order.timeline && order.timeline.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Fulfillment & Dispatch Progress
              </h2>
              <div className="space-y-3 bg-cream-100/70 p-4 rounded-2xl border border-cream-200">
                {order.timeline.map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-caramel-600 mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="font-bold text-chocolate-900 mr-2">
                        [{entry.status}]
                      </span>
                      <span className="text-chocolate-700">{entry.note}</span>
                    </div>
                    <span className="text-[11px] text-chocolate-400">
                      {new Date(entry.timestamp).toLocaleTimeString('en-AU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items Table */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
              Purchased Artisan Delicacies ({order.items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
            <div className="border border-cream-200 rounded-2xl overflow-x-auto bg-cream-50">
              <table className="w-full min-w-[540px] text-left text-sm">
                <thead className="bg-cream-200/60 text-xs font-bold uppercase tracking-wider text-chocolate-700 border-b border-cream-200">
                  <tr>
                    <th className="py-3 px-4">Flavour / Item</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4 text-right">Unit Price</th>
                    <th className="py-3 px-4 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-cream-100/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-chocolate-900">{item.name}</div>
                        {item.weight && (
                          <div className="text-xs text-chocolate-500">{item.weight}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-chocolate-600">
                        {item.sku}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-chocolate-900">
                        {item.quantity}
                      </td>
                      <td className="py-3.5 px-4 text-right text-chocolate-800">
                        ${item.price.toFixed(2)} AUD
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-chocolate-950">
                        ${item.subtotal.toFixed(2)} AUD
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Address & Calculation Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-cream-200">
            {/* Delivery details */}
            <div className="space-y-2 text-xs">
              <div className="font-bold uppercase tracking-wider text-chocolate-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-caramel-700" />
                Delivery Address
              </div>
              <div className="bg-cream-100 p-4 rounded-xl border border-cream-200 text-chocolate-700 space-y-1">
                <div className="font-bold text-chocolate-900">
                  {order.customer.firstName} {order.customer.lastName}
                </div>
                <div>{order.shippingAddress.address}</div>
                <div>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postcode}
                </div>
                <div>{order.shippingAddress.country}</div>
                <div className="pt-1 text-chocolate-500">Phone: {order.customer.phone}</div>
              </div>
            </div>

            {/* Financial summary */}
            <div className="space-y-2 text-xs">
              <div className="font-bold uppercase tracking-wider text-chocolate-800 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-caramel-700" />
                Payment & Totals
              </div>
              <div className="bg-cream-100 p-4 rounded-xl border border-cream-200 space-y-2">
                <div className="flex justify-between text-chocolate-700">
                  <span>Subtotal</span>
                  <span className="font-bold text-chocolate-900">
                    ${order.subtotal.toFixed(2)} AUD
                  </span>
                </div>
                <div className="flex justify-between text-chocolate-700">
                  <span>Australia Post Shipping</span>
                  <span className="font-bold text-chocolate-900">
                    {order.shippingAmount === 0
                      ? 'FREE'
                      : `$${order.shippingAmount.toFixed(2)} AUD`}
                  </span>
                </div>
                <div className="border-t border-cream-300 pt-2 flex justify-between font-bold text-sm text-chocolate-950">
                  <span>Total Paid</span>
                  <span>${order.totalAmount.toFixed(2)} AUD</span>
                </div>
                <div className="text-[11px] text-chocolate-500 pt-1">
                  Payment Method: {order.paymentMethod}
                </div>
                <div className="text-[10px] text-chocolate-400">
                  Includes 10% GST (${(order.totalAmount / 11).toFixed(2)} AUD)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
