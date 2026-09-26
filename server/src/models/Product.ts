import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  category: Types.ObjectId;
  price: number;
  compareAtPrice?: number;
  weight: string;
  stock: number;
  sku: string;
  ingredients: string;
  allergens: string;
  storageInstructions: string;
  images: string[];
  status: 'active' | 'inactive';
  featured: boolean;
  bestseller: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      default: '',
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be positive'],
    },
    compareAtPrice: {
      type: Number,
      default: undefined,
    },
    weight: {
      type: String,
      default: '100g Slice',
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock cannot be negative'],
      default: 25,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    ingredients: {
      type: String,
      default: 'Sugar, Full Cream Condensed Milk, Butter, Glucose Syrup, Flavourings.',
    },
    allergens: {
      type: String,
      default: 'Contains Milk / Dairy. May contain traces of tree nuts, peanuts, and gluten.',
    },
    storageInstructions: {
      type: String,
      default: 'Store in a cool dry place away from direct sunlight. Does not require refrigeration.',
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ category: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ bestseller: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
