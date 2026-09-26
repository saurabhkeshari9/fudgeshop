import mongoose, { Document, Schema } from 'mongoose';

export interface IStoreSettings extends Document {
  storeName: string;
  phone: string;
  email: string;
  address: {
    shop: string;
    street: string;
    suburb: string;
    state: string;
    postcode: string;
    country: string;
  };
  openingHours: string;
  standardShippingFee: number;
  expressShippingFee: number;
  freeShippingThreshold: number;
  currency: string;
  taxRate: number; // e.g. 0.1 for 10% GST included
  abn: string;
  orderPrefix: string;
  updatedAt: Date;
}

const StoreSettingsSchema = new Schema<IStoreSettings>(
  {
    storeName: { type: String, default: 'The Fudge Shop Hahndorf' },
    phone: { type: String, default: '(08) 8388 7970' },
    email: { type: String, default: 'contact@fudgeshophahndorf.com.au' },
    address: {
      shop: { type: String, default: 'Shop 4' },
      street: { type: String, default: '56 Mount Barker Rd' },
      suburb: { type: String, default: 'Hahndorf' },
      state: { type: String, default: 'SA' },
      postcode: { type: String, default: '5245' },
      country: { type: String, default: 'Australia' },
    },
    openingHours: { type: String, default: 'Monday – Sunday: 10:00 AM – 5:00 PM' },
    standardShippingFee: { type: Number, default: 12.5 },
    expressShippingFee: { type: Number, default: 16.5 },
    freeShippingThreshold: { type: Number, default: 75.0 },
    currency: { type: String, default: 'AUD' },
    taxRate: { type: Number, default: 0.1 },
    abn: { type: String, default: '78 123 456 789' },
    orderPrefix: { type: String, default: 'FSH-2026-' },
  },
  {
    timestamps: true,
  }
);

export const StoreSettings = mongoose.model<IStoreSettings>('StoreSettings', StoreSettingsSchema);
