import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Package, ArrowRight, Clock, CheckCircle, Truck, AlertCircle, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { orderService } from '../../../services/orderService';
import { Order } from '../../../types';
import { AccountNav } from './AccountNav';

export const CustomerOrdersPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      orderService
        .getMyOrders()
        .then((res) => {
          if (res.data) setOrders(res.data);
        })
        .catch((err) => {
          console.error('Failed to load orders', err);
        })
        .finally(() => {
          setLoadingOrders(false);
        });
    }
  }, [isAuthenticated]);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Confirmed':
      case 'Processing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-cream-200 text-chocolate-800 border-cream-300';
    }
  };

  return (
    <div>
      <AccountNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
              Your Orders ({orders.length})
            </h2>
            <p className="text-xs sm:text-sm text-chocolate-600 mt-1">
              Review your dispatched artisanal treats and live fulfillment updates.
            </p>
          </div>

          <Link
            to="/shop"
            className="px-4 py-2 bg-chocolate-900 text-cream-50 hover:bg-caramel-700 font-bold text-xs rounded-xl shadow-artisan transition flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-caramel-300" />
            <span>Shop Treats</span>
          </Link>
        </div>

        {loadingOrders ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-chocolate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-chocolate-600">Retrieving your order history...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-cream-50 rounded-3xl border border-cream-300 p-12 text-center space-y-4 shadow-artisan max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center mx-auto text-chocolate-700">
              <Package className="w-8 h-8 text-caramel-700" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-chocolate-900">
              No orders placed yet
            </h3>
            <p className="text-sm text-chocolate-600">
              You haven't ordered any artisan fudge or confectionery yet. Browse our copper-pan boiled flavours today!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-chocolate-900 text-cream-50 font-bold text-sm rounded-xl hover:bg-caramel-700 transition shadow-artisan"
            >
              <span>Explore Confectionery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-cream-50 rounded-2xl border border-cream-300 p-5 sm:p-6 shadow-artisan hover:border-caramel-400 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-cream-200 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm sm:text-base font-bold text-chocolate-950">
                        #{order.orderNumber}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="text-xs text-chocolate-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-AU', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:text-right">
                    <div>
                      <div className="text-xs text-chocolate-500 uppercase tracking-wider font-semibold">
                        Total Amount
                      </div>
                      <div className="font-serif text-lg sm:text-xl font-bold text-chocolate-950">
                        ${order.totalAmount.toFixed(2)} AUD
                      </div>
                    </div>

                    <Link
                      to={`/account/orders/${order.orderNumber}`}
                      className="px-4 py-2 bg-cream-200 hover:bg-cream-300 text-chocolate-900 font-bold text-xs rounded-xl border border-cream-300 transition flex items-center gap-1.5"
                    >
                      <span>View Details & Receipt</span>
                      <ArrowRight className="w-3.5 h-3.5 text-caramel-700" />
                    </Link>
                  </div>
                </div>

                {/* Items preview */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-x-auto py-1">
                    {order.items.slice(0, 4).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-cream-100 px-3 py-1.5 rounded-xl border border-cream-200 flex-shrink-0"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                        )}
                        <span className="text-xs font-semibold text-chocolate-800 truncate max-w-[160px]">
                          {item.name}
                        </span>
                        <span className="text-[11px] font-bold text-caramel-700">
                          ×{item.quantity}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <span className="text-xs text-chocolate-500 font-medium">
                        +{order.items.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-chocolate-600 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-caramel-600" />
                    <span>
                      Delivery to {order.shippingAddress.city}, {order.shippingAddress.state} (
                      {order.shippingAddress.postcode})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
