import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, FolderTree, X } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminService } from '../../services/adminService';
import { Category } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    status: 'active' as 'active' | 'inactive',
    sortOrder: '0',
  });

  const { success, error } = useToast();

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCategories();
      if (res.data) setCategories(res.data);
    } catch (err: any) {
      error(err.message || 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCat(null);
    setForm({
      name: '',
      slug: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop',
      status: 'active',
      sortOrder: '0',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCat(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image || '',
      status: cat.status,
      sortOrder: String(cat.sortOrder || 0),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      error('Category name is required');
      return;
    }

    try {
      const payload: any = {
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        description: form.description.trim(),
        image: form.image.trim(),
        status: form.status,
        sortOrder: parseInt(form.sortOrder, 10) || 0,
      };

      if (editingCat) {
        await adminService.updateCategory(editingCat._id, payload);
        success(`Category "${payload.name}" updated.`);
      } else {
        await adminService.createCategory(payload);
        success(`Category "${payload.name}" created.`);
      }

      setModalOpen(false);
      loadCategories();
    } catch (err: any) {
      error(err.message || 'Failed to save category.');
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!window.confirm(`Are you sure you want to delete "${cat.name}"?`)) return;

    try {
      await adminService.deleteCategory(cat._id);
      success(`Category "${cat.name}" deleted.`);
      loadCategories();
    } catch (err: any) {
      error(err.message || 'Cannot delete category.');
    }
  };

  return (
    <AdminLayout title="Category Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-chocolate-900">
              Confectionery Collections ({categories.length})
            </h2>
            <p className="text-xs text-chocolate-600">
              Categories help customers filter by fudge, chocolate, ice cream, and gifts.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-chocolate-900 text-cream-50 hover:bg-caramel-700 font-bold text-xs rounded-xl transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Categories Grid / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-16 text-center text-xs text-chocolate-600">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="col-span-full py-16 text-center text-xs text-chocolate-600">
              No categories created yet.
            </div>
          ) : (
            categories.map((cat) => (
              <div
                key={cat._id}
                className="bg-cream-50 rounded-2xl border border-cream-300 p-5 shadow-artisan flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-cream-200 border border-cream-300 flex-shrink-0">
                      <img
                        src={cat.image || 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=200&auto=format&fit=crop'}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cat.status === 'active'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-chocolate-200 text-chocolate-700'
                        }`}
                      >
                        {cat.status}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-caramel-100 text-caramel-900 border border-caramel-200">
                        {cat.productCount ?? 0} treats
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-bold text-chocolate-900">{cat.name}</h3>
                    <div className="text-[11px] font-mono text-chocolate-400">/{cat.slug}</div>
                    <p className="text-xs text-chocolate-600 mt-2 line-clamp-2">
                      {cat.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-cream-200">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-chocolate-700 hover:text-caramel-700 hover:bg-cream-200 rounded-lg transition"
                    title="Edit category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 bg-chocolate-950/60 z-50 flex items-center justify-center p-4">
          <div className="bg-cream-50 rounded-3xl border border-cream-300 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <h3 className="font-serif text-xl font-bold text-chocolate-900">
                {editingCat ? 'Edit Category' : 'New Collection'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-chocolate-400 hover:text-chocolate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Belgian Chocolates"
                  className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  URL Slug (Optional)
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. belgian-chocolates"
                  className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  Image URL
                </label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl cursor-pointer font-semibold text-chocolate-900"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold bg-cream-200 text-chocolate-900 rounded-xl hover:bg-cream-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-bold bg-chocolate-900 text-cream-50 rounded-xl hover:bg-caramel-700 transition"
                >
                  {editingCat ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
