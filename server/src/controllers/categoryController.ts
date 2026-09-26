import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category';
import { Product } from '../models/Product';

export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await Category.find({ status: 'active' }).sort({ sortOrder: 1, name: 1 });
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    next(error);
  }
};

export const adminGetCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1, name: 1 });
    
    // Attach product count to each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id });
        return {
          ...cat.toObject(),
          productCount: count,
        };
      })
    );

    res.status(200).json({ success: true, data: categoriesWithCounts });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, slug, description, image, status, sortOrder } = req.body;
    
    const formattedSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existing = await Category.findOne({ slug: formattedSlug });
    if (existing) {
      res.status(400).json({ success: false, message: 'A category with this slug already exists.' });
      return;
    }

    const category = await Category.create({
      name,
      slug: formattedSlug,
      description,
      image,
      status: status || 'active',
      sortOrder: sortOrder || 0,
    });

    res.status(201).json({ success: true, message: 'Category created successfully', data: category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, slug, description, image, status, sortOrder } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found.' });
      return;
    }

    if (slug && slug !== category.slug) {
      const formattedSlug = slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const existing = await Category.findOne({ slug: formattedSlug, _id: { $ne: id } });
      if (existing) {
        res.status(400).json({ success: false, message: 'Another category with this slug already exists.' });
        return;
      }
      category.slug = formattedSlug;
    }

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (status) category.status = status;
    if (sortOrder !== undefined) category.sortOrder = sortOrder;

    await category.save();

    res.status(200).json({ success: true, message: 'Category updated successfully', data: category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const count = await Product.countDocuments({ category: id });
    if (count > 0) {
      res.status(400).json({
        success: false,
        message: `Cannot delete category: ${count} product(s) are currently assigned to this category. Please reassign or delete those products first.`,
      });
      return;
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found.' });
      return;
    }

    res.status(200).json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
