import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Flame, Image as ImageIcon } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminService } from '../../services/adminService';
import { Category } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    sku: '',
    category: '',
    price: '',
    compareAtPrice: '',
    weight: '110g Slice',
    stock: '25',
    description: '',
    ingredients: 'Sugar, Condensed Milk, Butter, Glucose Syrup, Natural Flavourings.',
    allergens: 'Contains Milk / Dairy. May contain traces of tree nuts, peanuts, and gluten.',
    storageInstructions: 'Store in an airtight container in a cool dry pantry away from direct heat.',
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop',
    status: 'active' as 'active' | 'inactive',
    featured: false,
    bestseller: false,
    sortOrder: '0',
  });

  useEffect(() => {
    adminService.getCategories().then((res) => {
      if (res.data) {
        setCategories(res.data);
        if (!form.category && res.data.length > 0) {
          setForm((prev) => ({ ...prev, category: res.data[0]._id }));
        }
      }
    }).catch(() => {});

    if (isEditing && id) {
      adminService
        .getProductById(id)
        .then((res) => {
          if (res.data) {
            const p = res.data;
            setForm({
              name: p.name,
              slug: p.slug,
              sku: p.sku,
              category: typeof p.category === 'object' ? (p.category as any)._id : p.category,
              price: String(p.price),
              compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : '',
              weight: p.weight || '110g Slice',
              stock: String(p.stock),
              description: p.description,
              ingredients: p.ingredients,
              allergens: p.allergens,
              storageInstructions: p.storageInstructions,
              imageUrl: p.images[0] || '',
              status: p.status,
              featured: p.featured,
              bestseller: p.bestseller,
              sortOrder: String(p.sortOrder || 0),
            });
          }
        })
        .catch((err: any) => {
          error(err.message || 'Could not load product details.');
          navigate('/admin/products');
        })
        .finally(() => setFetching(false));
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      error('Product name is required.');
      return;
    }
    if (!form.price || isNaN(Number(form.price))) {
      error('A valid numeric price is required.');
      return;
    }
    if (!form.category) {
      error('Please select a category.');
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        sku: form.sku.trim(),
        category: form.category,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
        weight: form.weight.trim(),
        stock: parseInt(form.stock, 10) || 0,
        description: form.description.trim(),
        ingredients: form.ingredients.trim(),
        allergens: form.allergens.trim(),
        storageInstructions: form.storageInstructions.trim(),
        images: form.imageUrl ? [form.imageUrl.trim()] : [],
        status: form.status,
        featured: form.featured,
        bestseller: form.bestseller,
        sortOrder: parseInt(form.sortOrder, 10) || 0,
      };

      if (isEditing && id) {
        await adminService.updateProduct(id, payload);
        success(`"${payload.name}" was updated successfully.`);
      } else {
        await adminService.createProduct(payload);
        success(`"${payload.name}" was created successfully.`);
      }

      navigate('/admin/products');
    } catch (err: any) {
      error(err.message || 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout title="Edit Product">
        <div className="py-20 text-center text-xs text-chocolate-600">
          <div className="w-8 h-8 border-3 border-caramel-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading product record...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEditing ? `Edit: ${form.name}` : 'New Artisan Product'}>
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1 text-xs font-bold text-chocolate-700 hover:text-caramel-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-chocolate-900 text-cream-50 hover:bg-caramel-700 font-bold text-xs rounded-xl transition shadow-sm disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Save Changes' : 'Create Product'}</span>
          </button>
        </div>

        {/* Section 1: Basic Information */}
        <div className="bg-cream-50 p-6 sm:p-8 rounded-2xl border border-cream-300 shadow-artisan space-y-5">
          <h3 className="font-serif text-lg font-bold text-chocolate-900 border-b border-cream-200 pb-2">
            General Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Biscoff & Clotted Cream Fudge"
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Category *
              </label>
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                URL Slug (Optional - auto-generated from name)
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="e.g. biscoff-and-clotted-cream-fudge"
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                SKU (Optional - auto-generated if blank)
              </label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                placeholder="e.g. FSH-BISCOFF-02"
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500 font-mono uppercase"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the texture, taste profile, and copper kettle craft..."
              className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
            />
          </div>
        </div>

        {/* Section 2: Pricing & Inventory */}
        <div className="bg-cream-50 p-6 sm:p-8 rounded-2xl border border-cream-300 shadow-artisan space-y-5">
          <h3 className="font-serif text-lg font-bold text-chocolate-900 border-b border-cream-200 pb-2">
            Pricing & Stock
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Price ($ AUD) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="6.50"
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Compare-at Price ($)
              </label>
              <input
                type="number"
                step="0.1"
                value={form.compareAtPrice}
                onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
                placeholder="e.g. 7.50"
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Stock Units *
              </label>
              <input
                type="number"
                required
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="25"
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Unit / Weight
              </label>
              <input
                type="text"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                placeholder="e.g. 110g Slice"
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Ingredients & Storage */}
        <div className="bg-cream-50 p-6 sm:p-8 rounded-2xl border border-cream-300 shadow-artisan space-y-5">
          <h3 className="font-serif text-lg font-bold text-chocolate-900 border-b border-cream-200 pb-2">
            Ingredients & Food Information
          </h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Full Ingredients List
              </label>
              <textarea
                rows={2}
                value={form.ingredients}
                onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Allergens Notice
              </label>
              <input
                type="text"
                value={form.allergens}
                onChange={(e) => setForm({ ...form, allergens: e.target.value })}
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Storage Instructions
              </label>
              <input
                type="text"
                value={form.storageInstructions}
                onChange={(e) => setForm({ ...form, storageInstructions: e.target.value })}
                className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Imagery & Visibility */}
        <div className="bg-cream-50 p-6 sm:p-8 rounded-2xl border border-cream-300 shadow-artisan space-y-5">
          <h3 className="font-serif text-lg font-bold text-chocolate-900 border-b border-cream-200 pb-2">
            Imagery & Presentation
          </h3>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
              Primary Product Image URL
            </label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
            />
            {form.imageUrl && (
              <div className="mt-2 w-28 h-28 rounded-xl overflow-hidden border border-cream-300 bg-cream-200">
                <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-cream-200">
            <label className="flex items-center gap-2.5 text-xs font-bold text-chocolate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded text-caramel-600 focus:ring-caramel-500 w-4 h-4"
              />
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-caramel-600" />
                Featured on Homepage
              </span>
            </label>

            <label className="flex items-center gap-2.5 text-xs font-bold text-chocolate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={form.bestseller}
                onChange={(e) => setForm({ ...form, bestseller: e.target.checked })}
                className="rounded text-caramel-600 focus:ring-caramel-500 w-4 h-4"
              />
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-caramel-600" />
                Store Bestseller
              </span>
            </label>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Status:
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="px-3 py-1 text-xs bg-cream-100 border border-cream-300 rounded-lg text-chocolate-900 cursor-pointer font-bold"
              >
                <option value="active">Active (Visible)</option>
                <option value="inactive">Inactive (Hidden)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Save Button */}
        <div className="flex justify-end gap-3 pt-4">
          <Link
            to="/admin/products"
            className="px-6 py-2.5 bg-cream-200 hover:bg-cream-300 text-chocolate-900 font-semibold text-xs rounded-xl transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 bg-chocolate-900 text-cream-50 hover:bg-caramel-700 font-bold text-xs rounded-xl transition shadow-sm disabled:opacity-60"
          >
            {isEditing ? 'Save Product Changes' : 'Create Artisan Product'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};
