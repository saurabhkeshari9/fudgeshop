import React, { useState, useEffect } from 'react';
import { Save, Sparkles, Home, ExternalLink } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { productService } from '../../services/productService';
import { adminService } from '../../services/adminService';
import { HomepageContent } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminHomepageEditorPage: React.FC = () => {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { success, error } = useToast();

  useEffect(() => {
    productService
      .getHomepageContent()
      .then((res) => {
        if (res.data) setContent(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    setSaving(true);
    try {
      await adminService.updateHomepageContent(content);
      success('Homepage content updated! Changes are live on customer storefront.');
    } catch (err: any) {
      error(err.message || 'Failed to update homepage content.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) {
    return (
      <AdminLayout title="Homepage Content Management">
        <div className="py-20 text-center text-xs text-chocolate-600">
          Loading homepage settings...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Homepage Content Management">
      <form onSubmit={handleSave} className="max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-chocolate-900">
              Live Storefront Editorial Content
            </h2>
            <p className="text-xs text-chocolate-600">
              Changes made here update the customer homepage dynamically.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-chocolate-900 text-cream-50 hover:bg-caramel-700 font-bold text-xs rounded-xl transition shadow-sm disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing...' : 'Publish to Homepage'}</span>
          </button>
        </div>

        {/* 1. Announcement Bar */}
        <div className="bg-cream-50 p-6 sm:p-8 rounded-2xl border border-cream-300 shadow-artisan space-y-4">
          <h3 className="font-serif text-lg font-bold text-chocolate-900 border-b border-cream-200 pb-2">
            Top Header Announcement Bar
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold text-chocolate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={content.announcement.enabled}
                onChange={(e) =>
                  setContent({
                    ...content,
                    announcement: { ...content.announcement, enabled: e.target.checked },
                  })
                }
                className="rounded text-caramel-600 focus:ring-caramel-500 w-4 h-4"
              />
              <span>Enable Announcement Bar</span>
            </label>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Banner Message Text
              </label>
              <input
                type="text"
                value={content.announcement.text}
                onChange={(e) =>
                  setContent({
                    ...content,
                    announcement: { ...content.announcement, text: e.target.value },
                  })
                }
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl text-chocolate-900 focus:outline-none focus:ring-1 focus:ring-caramel-500"
              />
            </div>
          </div>
        </div>

        {/* 2. Hero Section */}
        <div className="bg-cream-50 p-6 sm:p-8 rounded-2xl border border-cream-300 shadow-artisan space-y-4">
          <h3 className="font-serif text-lg font-bold text-chocolate-900 border-b border-cream-200 pb-2">
            Main Hero Banner
          </h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Hero Badge Tagline
              </label>
              <input
                type="text"
                value={content.hero.badgeText}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, badgeText: e.target.value },
                  })
                }
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl text-chocolate-900 focus:outline-none focus:ring-1 focus:ring-caramel-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Primary Headline *
              </label>
              <input
                type="text"
                required
                value={content.hero.headline}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, headline: e.target.value },
                  })
                }
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl text-chocolate-900 focus:outline-none focus:ring-1 focus:ring-caramel-500 font-serif text-sm font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Supporting Subheadline
              </label>
              <textarea
                rows={3}
                value={content.hero.subheadline}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, subheadline: e.target.value },
                  })
                }
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl text-chocolate-900 focus:outline-none focus:ring-1 focus:ring-caramel-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Hero Photography Image URL
              </label>
              <input
                type="url"
                value={content.hero.heroImage}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, heroImage: e.target.value },
                  })
                }
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl text-chocolate-900 focus:outline-none focus:ring-1 focus:ring-caramel-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={content.hero.primaryCtaText}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, primaryCtaText: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl text-chocolate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  Secondary Button Text
                </label>
                <input
                  type="text"
                  value={content.hero.secondaryCtaText}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, secondaryCtaText: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl text-chocolate-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Story Section */}
        <div className="bg-cream-50 p-6 sm:p-8 rounded-2xl border border-cream-300 shadow-artisan space-y-4">
          <h3 className="font-serif text-lg font-bold text-chocolate-900 border-b border-cream-200 pb-2">
            Heritage & Story Section
          </h3>

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  Section Title
                </label>
                <input
                  type="text"
                  value={content.storySection.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      storySection: { ...content.storySection, title: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl text-chocolate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  Section Subtitle
                </label>
                <input
                  type="text"
                  value={content.storySection.subtitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      storySection: { ...content.storySection, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl text-chocolate-900"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Paragraph 1
              </label>
              <textarea
                rows={3}
                value={content.storySection.description1}
                onChange={(e) =>
                  setContent({
                    ...content,
                    storySection: { ...content.storySection, description1: e.target.value },
                  })
                }
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl text-chocolate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Paragraph 2
              </label>
              <textarea
                rows={3}
                value={content.storySection.description2}
                onChange={(e) =>
                  setContent({
                    ...content,
                    storySection: { ...content.storySection, description2: e.target.value },
                  })
                }
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl text-chocolate-900"
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
            {saving ? 'Saving...' : 'Publish to Customer Homepage'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};
