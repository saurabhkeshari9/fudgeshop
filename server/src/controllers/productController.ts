import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';
import { Category } from '../models/Category';

// Helper to sanitize slug
const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Customer: Get products with filters, sorting, search & pagination
export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      sort,
      featured,
      bestseller,
      inStock,
      page = 1,
      limit = 12,
    } = req.query;

    const query: any = { status: 'active' };

    // Filter by category slug or ID
    if (category && category !== 'all') {
      const foundCategory = await Category.findOne({
        $or: [{ slug: category }, { _id: category.toString().match(/^[0-9a-fA-F]{24}$/) ? category : null }],
      });
      if (foundCategory) {
        query.category = foundCategory._id;
      }
    }

    // Search keyword
    if (search && typeof search === 'string' && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { description: regex },
        { ingredients: regex },
        { allergens: regex },
      ];
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Flags
    if (featured === 'true') query.featured = true;
    if (bestseller === 'true') query.bestseller = true;
    if (inStock === 'true') query.stock = { $gt: 0 };

    // Sorting
    let sortOptions: any = { sortOrder: 1, createdAt: -1 };
    if (sort === 'price-asc') sortOptions = { price: 1 };
    else if (sort === 'price-desc') sortOptions = { price: -1 };
    else if (sort === 'newest') sortOptions = { createdAt: -1 };
    else if (sort === 'name') sortOptions = { name: 1 };

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      limit: limitNum,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// Customer: Get product by slug
export const getProductBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug, status: 'active' }).populate('category', 'name slug description');

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found or unavailable.' });
      return;
    }

    // Fetch up to 4 related products from the same category
    const related = await Product.find({
      category: (product.category as any)?._id || product.category,
      _id: { $ne: product._id },
      status: 'active',
    })
      .populate('category', 'name slug')
      .limit(4);

    res.status(200).json({
      success: true,
      data: product,
      related,
    });
  } catch (error) {
    next(error);
  }
};

// Customer: Featured products
export const getFeaturedProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await Product.find({ status: 'active', featured: true })
      .populate('category', 'name slug')
      .limit(8)
      .sort({ sortOrder: 1, createdAt: -1 });

    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

// Customer: Bestselling products
export const getBestsellers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await Product.find({ status: 'active', bestseller: true })
      .populate('category', 'name slug')
      .limit(8)
      .sort({ sortOrder: 1, createdAt: -1 });

    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all products with filters
export const adminGetProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, category, status, stock, page = 1, limit = 20 } = req.query;
    const query: any = {};

    if (search && typeof search === 'string') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { sku: regex }, { description: regex }];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (stock === 'low') {
      query.stock = { $lte: 5 };
    } else if (stock === 'out') {
      query.stock = 0;
    }

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.max(1, parseInt(limit as string, 10));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get product by ID
export const adminGetProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('category');

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// Admin: Create product
export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      name,
      slug,
      description,
      category,
      price,
      compareAtPrice,
      weight,
      stock,
      sku,
      ingredients,
      allergens,
      storageInstructions,
      images,
      status,
      featured,
      bestseller,
      sortOrder,
    } = req.body;

    const finalSlug = slug ? slugify(slug) : slugify(name);
    const existingSlug = await Product.findOne({ slug: finalSlug });
    if (existingSlug) {
      res.status(400).json({ success: false, message: 'A product with this URL slug already exists.' });
      return;
    }

    const finalSku = (sku || `FSH-${Math.floor(1000 + Math.random() * 9000)}`).toUpperCase().trim();
    const existingSku = await Product.findOne({ sku: finalSku });
    if (existingSku) {
      res.status(400).json({ success: false, message: 'A product with this SKU already exists.' });
      return;
    }

    const product = await Product.create({
      name,
      slug: finalSlug,
      description,
      category,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      weight: weight || '100g Slice',
      stock: Number(stock) || 0,
      sku: finalSku,
      ingredients,
      allergens,
      storageInstructions,
      images: Array.isArray(images) ? images : images ? [images] : [],
      status: status || 'active',
      featured: Boolean(featured),
      bestseller: Boolean(bestseller),
      sortOrder: Number(sortOrder) || 0,
    });

    const populated = await Product.findById(product._id).populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Artisan product created successfully.',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update product
export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    if (updates.slug && updates.slug !== product.slug) {
      const finalSlug = slugify(updates.slug);
      const existing = await Product.findOne({ slug: finalSlug, _id: { $ne: id } });
      if (existing) {
        res.status(400).json({ success: false, message: 'Another product with this slug already exists.' });
        return;
      }
      updates.slug = finalSlug;
    }

    if (updates.sku && updates.sku.toUpperCase() !== product.sku) {
      const finalSku = updates.sku.toUpperCase().trim();
      const existing = await Product.findOne({ sku: finalSku, _id: { $ne: id } });
      if (existing) {
        res.status(400).json({ success: false, message: 'Another product with this SKU already exists.' });
        return;
      }
      updates.sku = finalSku;
    }

    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);
    if (updates.compareAtPrice !== undefined) {
      updates.compareAtPrice = updates.compareAtPrice ? Number(updates.compareAtPrice) : undefined;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete product
export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// Admin: Toggle status
export const toggleProductStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    product.status = product.status === 'active' ? 'inactive' : 'active';
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product status changed to ${product.status}.`,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
