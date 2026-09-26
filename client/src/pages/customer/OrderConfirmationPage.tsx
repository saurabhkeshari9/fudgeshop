import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Printer,
  ShoppingBag,
  ArrowRight,
  Truck,
  MapPin,
  Calendar,
  Clock,
} from 'lucide-react';
import { Order } from '../../types';
import { orderService } from '../../services/orderService';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const res = await orderService.getOrderById(orderId);
        if (res.data) {
          setOrder(res.data);
        } else {
          setError('Order details could not be retrieved.');
        }
      } catch (err: any) {
        setError(err.message || 'Order could not be found.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-caramel-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="font-serif text-xl font-bold text-chocolate-900">
          Loading your order confirmation...
        </h2>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <div className="p-4 bg-red-100 text-red-800 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-chocolate-900">
          Order Not Located
        </h2>
        <p className="text-sm text-chocolate-600">
          We couldn't find an order matching identifier "{orderId}". Please check your confirmation email or contact our Hahndorf store.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-chocolate-900 text-cream-50 font-bold text-sm rounded-xl hover:bg-caramel-700 transition"
        >
          <span>Return to Shop</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Success Banner */}
      <div className="bg-cream-100 p-8 sm:p-10 rounded-3xl border border-cream-300 text-center space-y-4 shadow-artisan">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full mx-auto flex items-center justify-center shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs uppercase tracking-widest font-bold text-caramel-700 block">
          Order Placed Successfully
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-950">
          Thank you, {order.customer.firstName}!
        </h1>
        <p className="text-sm text-chocolate-600 max-w-lg mx-auto">
          Your sweet delicacies have been received at our Hahndorf confectionery kitchen. We have sent confirmation details to{' '}
          <strong className="text-chocolate-900">{order.customer.email}</strong>.
        </p>
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 shadow-sm font-mono text-sm font-bold text-chocolate-900">
          <span>Order Number:</span>
          <span className="text-caramel-800">{order.orderNumber}</span>
        </div>
      </div>

      {/* Printable Receipt Card */}
      <div className="bg-cream-50 rounded-3xl border border-cream-300 shadow-artisan p-6 sm:p-10 space-y-8">
        {/* Top Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-cream-200 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-chocolate-500 block">Order Placed</span>
            <div className="text-sm font-bold text-chocolate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-caramel-700" />
              {new Date(order.createdAt).toLocaleDateString('en-AU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-chocolate-500 block">Order Status</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-caramel-100 text-caramel-900 border border-caramel-300">
              <Clock className="w-3.5 h-3.5" />
              {order.orderStatus}
            </span>
          </div>

          <button
            onClick={() => window.print()}
            className="self-start sm:self-auto px-4 py-2 bg-cream-200 hover:bg-cream-300 text-chocolate-900 text-xs font-bold rounded-xl flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>

        {/* Customer & Delivery Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-chocolate-900">Customer Details</h3>
            <p className="text-chocolate-700">
              <strong>
                {order.customer.firstName} {order.customer.lastName}
              </strong>
              <br />
              Email: {order.customer.email}
              <br />
              Phone: {order.customer.phone}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-chocolate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-caramel-700" />
              Delivery Destination
            </h3>
            <p className="text-chocolate-700">
              {order.shippingAddress.address}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postcode}
              <br />
              {order.shippingAddress.country}
            </p>
          </div>
        </div>

        {/* Ordered Items Table */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-chocolate-900">Purchased Confectionery</h3>
          <div className="divide-y divide-cream-200 border-y border-cream-200">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg bg-cream-200 border border-cream-300 flex-shrink-0"
                    />
                  )}
                  <div>
                    <div className="font-bold text-chocolate-950">{item.name}</div>
                    <div className="text-xs text-chocolate-500">
                      SKU: {item.sku} • Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </div>
                  </div>
                </div>
                <span className="font-bold text-chocolate-900">
                  ${item.subtotal.toFixed(2)} AUD
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Breakdown */}
        <div className="space-y-2 max-w-xs ml-auto text-sm text-chocolate-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-chocolate-900">${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-semibold text-chocolate-900">
              {order.shippingAmount === 0 ? 'FREE' : `$${order.shippingAmount.toFixed(2)}`}
            </span>
          </div>
          <div className="pt-2 border-t border-cream-300 flex justify-between items-baseline">
            <span className="font-bold text-base text-chocolate-950">Grand Total</span>
            <span className="font-serif text-2xl font-bold text-chocolate-950">
              ${order.totalAmount.toFixed(2)} AUD
            </span>
          </div>
          <div className="text-[11px] text-chocolate-400 text-right">
            Paid via {order.paymentMethod}
          </div>
        </div>

        {/* Order Timeline History */}
        {order.timeline && order.timeline.length > 0 && (
          <div className="pt-6 border-t border-cream-200 space-y-4">
            <h3 className="font-serif text-base font-bold text-chocolate-900">Order Progress</h3>
            <div className="space-y-3">
              {order.timeline.map((event, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-caramel-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-bold text-chocolate-900">
                      {event.status} —{' '}
                      <span className="font-normal text-chocolate-500">
                        {new Date(event.timestamp).toLocaleDateString('en-AU', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-chocolate-600">{event.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Continue Shopping CTA */}
      <div className="text-center pt-4">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-chocolate-900 text-cream-50 font-bold text-base rounded-2xl hover:bg-caramel-700 transition shadow-artisan"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Continue Shopping Treats</span>
        </Link>
      </div>
    </div>
  );
};
