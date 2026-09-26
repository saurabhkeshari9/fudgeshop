import React, { useState, useEffect } from 'react';
import { Save, Store, Truck, ShieldCheck } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { productService } from '../../services/productService';
import { adminService } from '../../services/adminService';
import { StoreSettings } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { success, error } = useToast();

  useEffect(() => {
    productService
      .getStoreSettings()
      .then((res) => {
        if (res.data) setSettings(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      await adminService.updateStoreSettings(settings);
      success('Store settings saved successfully!');
    } catch (err: any) {
      error(err.message || 'Failed to update store settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <AdminLayout title="Store Settings">
        <div className="py-20 text-center text-xs text-chocolate-600">
          Loading store settings...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Store Settings">
      <form onSubmit={handleSave} className="max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-chocolate-900">
              Business Configuration & Shipping Rules
            </h2>
            <p className="text-xs text-chocolate-600">
              Configure store contact information, postage rates, and tax parameters.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-chocolate-900 text-cream-50 hover:bg-caramel-700 font-bold text-xs rounded-xl transition shadow-sm disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

        {/* 1. Store Identity & Contact */}
        <div className="bg-cream-50 p-6 sm:p-8 rounded-2xl border border-cream-300 shadow-artisan space-y-4">
          <h3 className="font-serif text-lg font-bold text-chocolate-900 border-b border-cream-200 pb-2">
            Store Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Store Name
              </label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Australian Business Number (ABN)
              </label>
              <input
                type="text"
                value={settings.abn}
                onChange={(e) => setSettings({ ...settings, abn: e.target.value })}
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Contact Phone
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Support Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
              Trading Hours
            </label>
            <input
              type="text"
              value={settings.openingHours}
              onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
              className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl"
            />
          </div>
        </div>

        {/* 2. Physical Location */}
        <div className="bg-cream-50 p-6 sm:p-8 rounded-2xl border border-cream-300 shadow-artisan space-y-4">
          <h3 className="font-serif text-lg font-bold text-chocolate-900 border-b border-cream-200 pb-2">
            Store Location
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Shop / Suite
              </label>
              <input
                type="text"
                value={settings.address.shop}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    address: { ...settings.address, shop: e.target.value },
                  })
                }
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Street Address
              </label>
              <input
                type="text"
                value={settings.address.street}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    address: { ...settings.address, street: e.target.value },
                  })
                }
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Suburb
              </label>
              <input
                type="text"
                value={settings.address.suburb}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    address: { ...settings.address, suburb: e.target.value },
                  })
                }
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  State
                </label>
                <input
                  type="text"
                  value={settings.address.state}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      address: { ...settings.address, state: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  Postcode
                </label>
                <input
                  type="text"
                  value={settings.address.postcode}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      address: { ...settings.address, postcode: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Shipping & Pricing Calculation Rules */}
        <div className="bg-cream-50 p-6 sm:p-8 rounded-2xl border border-cream-300 shadow-artisan space-y-4">
          <h3 className="font-serif text-lg font-bold text-chocolate-900 border-b border-cream-200 pb-2">
            Shipping & Calculation Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Standard Shipping Fee ($)
              </label>
              <input
                type="number"
                step="0.5"
                value={settings.standardShippingFee}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    standardShippingFee: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Express Shipping Fee ($)
              </label>
              <input
                type="number"
                step="0.5"
                value={settings.expressShippingFee}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    expressShippingFee: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Free Shipping Threshold ($)
              </label>
              <input
                type="number"
                step="1"
                value={settings.freeShippingThreshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    freeShippingThreshold: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl font-bold text-emerald-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Order Number Prefix
              </label>
              <input
                type="text"
                value={settings.orderPrefix}
                onChange={(e) => setSettings({ ...settings, orderPrefix: e.target.value })}
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Store Currency
              </label>
              <input
                type="text"
                disabled
                value={settings.currency}
                className="w-full px-4 py-2 text-xs bg-cream-200 border border-cream-300 rounded-xl font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-chocolate-900 text-cream-50 hover:bg-caramel-700 font-bold text-xs rounded-xl transition shadow-sm disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};
