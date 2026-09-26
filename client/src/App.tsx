import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { ShopPage } from './pages/customer/ShopPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { SearchPage } from './pages/customer/SearchPage';
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrderConfirmationPage } from './pages/customer/OrderConfirmationPage';
import { AboutPage } from './pages/customer/AboutPage';
import { VisitUsPage } from './pages/customer/VisitUsPage';
import { ContactPage } from './pages/customer/ContactPage';
import { FAQPage } from './pages/customer/FAQPage';
import { ShippingPage } from './pages/customer/ShippingPage';
import { RefundPolicyPage } from './pages/customer/RefundPolicyPage';
import { PrivacyPage } from './pages/customer/PrivacyPage';
import { TermsPage } from './pages/customer/TermsPage';
import { NotFoundPage } from './pages/customer/NotFoundPage';

// Customer Account Pages
import { CustomerLoginPage } from './pages/customer/account/CustomerLoginPage';
import { CustomerRegisterPage } from './pages/customer/account/CustomerRegisterPage';
import { CustomerProfilePage } from './pages/customer/account/CustomerProfilePage';
import { CustomerOrdersPage } from './pages/customer/account/CustomerOrdersPage';
import { CustomerOrderDetailPage } from './pages/customer/account/CustomerOrderDetailPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminOrderDetailPage } from './pages/admin/AdminOrderDetailPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminHomepageEditorPage } from './pages/admin/AdminHomepageEditorPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Scroll to top on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Customer Layout Wrapper
const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CartDrawer />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Customer Routes */}
              <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
              <Route path="/shop" element={<CustomerLayout><ShopPage /></CustomerLayout>} />
              <Route path="/shop/:category" element={<CustomerLayout><ShopPage /></CustomerLayout>} />
              <Route path="/product/:slug" element={<CustomerLayout><ProductDetailPage /></CustomerLayout>} />
              <Route path="/search" element={<CustomerLayout><SearchPage /></CustomerLayout>} />
              <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
              <Route path="/checkout" element={<CustomerLayout><CheckoutPage /></CustomerLayout>} />
              <Route path="/order-confirmation/:orderId" element={<CustomerLayout><OrderConfirmationPage /></CustomerLayout>} />
              <Route path="/about" element={<CustomerLayout><AboutPage /></CustomerLayout>} />
              <Route path="/visit-us" element={<CustomerLayout><VisitUsPage /></CustomerLayout>} />
              <Route path="/contact" element={<CustomerLayout><ContactPage /></CustomerLayout>} />
              <Route path="/faq" element={<CustomerLayout><FAQPage /></CustomerLayout>} />
              <Route path="/shipping" element={<CustomerLayout><ShippingPage /></CustomerLayout>} />
              <Route path="/refund-policy" element={<CustomerLayout><RefundPolicyPage /></CustomerLayout>} />
              <Route path="/privacy" element={<CustomerLayout><PrivacyPage /></CustomerLayout>} />
              <Route path="/terms" element={<CustomerLayout><TermsPage /></CustomerLayout>} />

              {/* Customer Account Routes */}
              <Route path="/account/login" element={<CustomerLayout><CustomerLoginPage /></CustomerLayout>} />
              <Route path="/account/register" element={<CustomerLayout><CustomerRegisterPage /></CustomerLayout>} />
              <Route path="/account/profile" element={<CustomerLayout><CustomerProfilePage /></CustomerLayout>} />
              <Route path="/account/orders" element={<CustomerLayout><CustomerOrdersPage /></CustomerLayout>} />
              <Route path="/account/orders/:orderNumber" element={<CustomerLayout><CustomerOrderDetailPage /></CustomerLayout>} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/products" element={<AdminProductsPage />} />
              <Route path="/admin/products/new" element={<AdminProductFormPage />} />
              <Route path="/admin/products/:id" element={<AdminProductFormPage />} />
              <Route path="/admin/categories" element={<AdminCategoriesPage />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
              <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />
              <Route path="/admin/customers" element={<AdminCustomersPage />} />
              <Route path="/admin/homepage" element={<AdminHomepageEditorPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />

              {/* Catch-all 404 */}
              <Route path="*" element={<CustomerLayout><NotFoundPage /></CustomerLayout>} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
