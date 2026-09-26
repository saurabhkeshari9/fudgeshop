import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Sparkles,
  Flame,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminService } from '../../services/adminService';
import { Product, Category } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStock, setSelectedStock] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { success, error } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        adminService.getProducts({
          search: search.trim(),
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          stock: selectedStock !== 'all' ? selectedStock : undefined,
          limit: 100,
        }),
        adminService.getCategories(),
      ]);

      if (prodRes.data) setProducts(prodRes.data);
      if (catRes.data) setCategories(catRes.data);
    } catch (err: any) {
      error(err.message || 'Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedStock]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const res = await adminService.toggleProductStatus(id);
      if (res.data) {
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: res.data.status } : p))
        );
        success(`Product is now ${res.data.status}.`);
      }
    } catch (err: any) {
      error(err.message || 'Failed to update status.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    setDeletingId(id);
    try {
      await adminService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      success(`"${name}" was deleted successfully.`);
    } catch (err: any) {
      error(err.message || 'Failed to delete product.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout title="Product Management">
      <div className="space-y-6">
        {/* Top Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-chocolate-900">
              Artisan Confectionery Catalogue ({products.length})
            </h2>
            <p className="text-xs text-chocolate-600">
              Create, edit prices, update stock, and control featured recipes.
            </p>
          </div>

          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-chocolate-900 text-cream-50 hover:bg-caramel-700 font-bold text-xs rounded-xl transition shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Artisan Product</span>
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-cream-50 p-4 rounded-2xl border border-cream-300 shadow-sm flex flex-col md:flex-row items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search by name, SKU, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl text-chocolate-900 focus:outline-none focus:ring-1 focus:ring-caramel-500"
            />
            <Search className="w-4 h-4 text-chocolate-400 absolute left-3 top-2.5" />
          </form>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl text-chocolate-900 focus:outline-none focus:ring-1 focus:ring-caramel-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              className="px-3 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl text-chocolate-900 focus:outline-none focus:ring-1 focus:ring-caramel-500 cursor-pointer"
            >
              <option value="all">All Stock Levels</option>
              <option value="low">Low Stock (≤ 5)</option>
              <option value="out">Sold Out (0)</option>
            </select>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-cream-50 rounded-2xl border border-cream-300 shadow-artisan overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-xs text-chocolate-600">
              <div className="w-8 h-8 border-3 border-caramel-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center text-xs text-chocolate-600 space-y-2">
              <p>No products found matching the criteria.</p>
              <Link
                to="/admin/products/new"
                className="inline-block font-bold text-caramel-700 hover:underline"
              >
                Create your first product →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-chocolate-800">
                <thead className="bg-cream-100 text-chocolate-700 font-bold uppercase tracking-wider text-[10px] border-b border-cream-200">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-3">SKU</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Price</th>
                    <th className="py-3 px-3">Stock</th>
                    <th className="py-3 px-3">Highlights</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200">
                  {products.map((p) => {
                    const categoryTitle =
                      typeof p.category === 'object' ? (p.category as any)?.name : 'Uncategorized';
                    const isLow = p.stock <= 5 && p.stock > 0;
                    const isOut = p.stock <= 0;

                    return (
                      <tr key={p._id} className="hover:bg-cream-100/50 transition">
                        {/* Product Info */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0] || 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=150&auto=format&fit=crop'}
                              alt={p.name}
                              className="w-12 h-12 object-cover rounded-lg bg-cream-200 border border-cream-300 flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <Link
                                to={`/admin/products/${p._id}`}
                                className="font-bold text-chocolate-950 hover:text-caramel-700 transition block truncate max-w-[200px]"
                              >
                                {p.name}
                              </Link>
                              <span className="text-[10px] text-chocolate-500 font-mono">
                                /{p.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="py-3 px-3 font-mono text-chocolate-600 font-medium">
                          {p.sku}
                        </td>

                        {/* Category */}
                        <td className="py-3 px-3 text-chocolate-700 whitespace-nowrap">
                          {categoryTitle}
                        </td>

                        {/* Price */}
                        <td className="py-3 px-3 whitespace-nowrap font-bold text-chocolate-900">
                          ${p.price.toFixed(2)}
                          {p.compareAtPrice && (
                            <span className="block text-[10px] text-chocolate-400 line-through">
                              ${p.compareAtPrice.toFixed(2)}
                            </span>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          {isOut ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-900">
                              Out of stock
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                              Low ({p.stock})
                            </span>
                          ) : (
                            <span className="text-emerald-800 font-bold">{p.stock} units</span>
                          )}
                        </td>

                        {/* Highlights */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {p.featured && (
                              <span
                                className="p-1 bg-amber-100 text-amber-800 rounded-md"
                                title="Featured on Homepage"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </span>
                            )}
                            {p.bestseller && (
                              <span
                                className="p-1 bg-chocolate-900 text-caramel-300 rounded-md"
                                title="Bestseller Badge"
                              >
                                <Flame className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleStatus(p._id)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                              p.status === 'active'
                                ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                                : 'bg-chocolate-200 text-chocolate-700 hover:bg-chocolate-300'
                            }`}
                          >
                            {p.status === 'active' ? (
                              <>
                                <CheckCircle className="w-3 h-3 text-emerald-700" />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 text-chocolate-600" />
                                <span>Inactive</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/product/${p.slug}`}
                              target="_blank"
                              className="p-1.5 text-chocolate-500 hover:text-chocolate-900 hover:bg-cream-200 rounded-lg transition"
                              title="View on Storefront"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            <Link
                              to={`/admin/products/${p._id}`}
                              className="p-1.5 text-chocolate-700 hover:text-caramel-700 hover:bg-cream-200 rounded-lg transition"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleDelete(p._id, p.name)}
                              disabled={deletingId === p._id}
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition disabled:opacity-40"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
