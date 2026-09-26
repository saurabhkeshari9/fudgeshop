import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Save, User, MapPin, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { AccountNav } from './AccountNav';

export const CustomerProfilePage: React.FC = () => {
  const { user, isAuthenticated, isLoading, updateProfile } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: 'SA',
    postcode: '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address?.address || '',
        city: user.address?.city || '',
        state: user.address?.state || 'SA',
        postcode: user.address?.postcode || '',
      });
    }
  }, [user]);

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

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: {
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state,
          postcode: formData.postcode.trim(),
          country: 'Australia',
        },
      });
      success('Your profile details and default address have been saved.');
    } catch (err: any) {
      error(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.currentPassword) {
      error('Please enter your current password.');
      return;
    }
    if (passwords.newPassword.length < 6) {
      error('New password must be at least 6 characters long.');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      error('New passwords do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      await updateProfile({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      success('Your password has been changed successfully.');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      error(err.message || 'Failed to update password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div>
      <AccountNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Profile & Address Card */}
          <div className="lg:col-span-8 bg-cream-50 p-6 sm:p-8 rounded-3xl border border-cream-300 shadow-artisan space-y-6">
            <div className="flex items-center justify-between border-b border-cream-200 pb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-chocolate-950 flex items-center gap-2">
                  <User className="w-5 h-5 text-caramel-700" />
                  Personal Details & Shipping Address
                </h2>
                <p className="text-xs text-chocolate-600 mt-0.5">
                  Pre-populates your checkout whenever you order fresh Adelaide Hills confectionery.
                </p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-4 py-2.5 text-sm bg-cream-200/70 border border-cream-300 rounded-xl text-chocolate-600 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-chocolate-400">Email cannot be changed.</p>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                    Mobile / Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 0412 345 678"
                    className="w-full px-4 py-2.5 text-sm bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
                  />
                </div>
              </div>

              {/* Delivery Address Defaults */}
              <div className="space-y-4 pt-4 border-t border-cream-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-caramel-700" />
                  <h3 className="font-serif text-lg font-bold text-chocolate-900">
                    Default Australian Delivery Address
                  </h3>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. 14 Main Street"
                    className="w-full px-4 py-2.5 text-sm bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                      City / Suburb
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Hahndorf"
                      className="w-full px-3 py-2 text-sm bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                      State
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500 cursor-pointer"
                    >
                      <option value="SA">SA</option>
                      <option value="VIC">VIC</option>
                      <option value="NSW">NSW</option>
                      <option value="QLD">QLD</option>
                      <option value="WA">WA</option>
                      <option value="TAS">TAS</option>
                      <option value="ACT">ACT</option>
                      <option value="NT">NT</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                      Postcode
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={formData.postcode}
                      onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                      placeholder="5245"
                      className="w-full px-3 py-2 text-sm bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-chocolate-900 text-cream-50 hover:bg-caramel-700 font-bold text-sm rounded-xl shadow-artisan transition flex items-center gap-2 disabled:opacity-60"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-cream-50 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 text-caramel-300" />
                  )}
                  <span>Save Profile & Address</span>
                </button>
              </div>
            </form>
          </div>

          {/* Password & Security Card */}
          <div className="lg:col-span-4 bg-cream-50 p-6 sm:p-8 rounded-3xl border border-cream-300 shadow-artisan space-y-6">
            <div className="border-b border-cream-200 pb-4">
              <h2 className="font-serif text-xl font-bold text-chocolate-950 flex items-center gap-2">
                <Lock className="w-5 h-5 text-caramel-700" />
                Change Password
              </h2>
              <p className="text-xs text-chocolate-600 mt-0.5">
                Ensure your account credentials remain secure.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  New Password (min 6 chars)
                </label>
                <input
                  type="password"
                  required
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="w-full py-2.5 px-4 bg-cream-200 hover:bg-cream-300 text-chocolate-900 font-bold text-xs rounded-xl border border-cream-300 transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {savingPassword ? (
                    <div className="w-3.5 h-3.5 border-2 border-chocolate-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-caramel-700" />
                  )}
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
