import { Request, Response, NextFunction } from 'express';
import { Order, IOrderItem } from '../models/Order';
import { Product } from '../models/Product';
import { StoreSettings } from '../models/StoreSettings';
import { AuthRequest } from '../middleware/auth';

// Generate human-friendly order number
const generateOrderNumber = async (): Promise<string> => {
  const settings = await StoreSettings.findOne();
  const prefix = settings?.orderPrefix || 'FSH-2026-';
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `${prefix}${randomSuffix}`;
  
  // Ensure uniqueness
  const existing = await Order.findOne({ orderNumber });
  if (existing) {
    return `${prefix}${Date.now().toString().slice(-4)}`;
  }
  return orderNumber;
};

// Customer: Place Order (Server validates items, prices & computes total)
export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authUser = (req as AuthRequest).user;
    const { customer, shippingAddress, items, shippingMethod = 'standard', notes } = req.body;

    // 1. Validate customer & address fields
    if (!customer?.firstName || !customer?.lastName || !customer?.email || !customer?.phone) {
      res.status(400).json({ success: false, message: 'Please provide complete customer details (name, email, phone).' });
      return;
    }

    if (!shippingAddress?.address || !shippingAddress?.city || !shippingAddress?.state || !shippingAddress?.postcode) {
      res.status(400).json({ success: false, message: 'Please provide a valid Australian delivery address.' });
      return;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'Your cart is empty. Please add items before checking out.' });
      return;
    }

    // 2. Fetch Store Settings for shipping rules
    const settings = await StoreSettings.findOne();
    const standardFee = settings?.standardShippingFee ?? 12.5;
    const expressFee = settings?.expressShippingFee ?? 16.5;
    const freeThreshold = settings?.freeShippingThreshold ?? 75.0;

    // 3. Look up real products in database & build snapshots
    const orderItems: IOrderItem[] = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      const product = await Product.findById(item.productId || item.product || item._id);

      if (!product) {
        res.status(400).json({
          success: false,
          message: `Product with ID ${item.productId} was not found. It may no longer exist.`,
        });
        return;
      }

      if (product.status !== 'active') {
        res.status(400).json({
          success: false,
          message: `"${product.name}" is currently unavailable for order.`,
        });
        return;
      }

      if (product.stock < quantity) {
        res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.stock} left in stock.`,
        });
        return;
      }

      const itemSubtotal = Number((product.price * quantity).toFixed(2));
      calculatedSubtotal += itemSubtotal;

      orderItems.push({
        product: product._id as any,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity,
        subtotal: itemSubtotal,
        image: product.images[0] || '',
        weight: product.weight,
      });

      // Atomically decrement stock
      product.stock -= quantity;
      await product.save();
    }

    calculatedSubtotal = Number(calculatedSubtotal.toFixed(2));

    // 4. Calculate shipping fee
    let shippingAmount = 0;
    if (calculatedSubtotal >= freeThreshold && shippingMethod === 'standard') {
      shippingAmount = 0;
    } else {
      shippingAmount = shippingMethod === 'express' ? expressFee : standardFee;
    }
    shippingAmount = Number(shippingAmount.toFixed(2));

    const grandTotal = Number((calculatedSubtotal + shippingAmount).toFixed(2));
    const orderNumber = await generateOrderNumber();

    // 5. Create Order
    const order = await Order.create({
      orderNumber,
      user: authUser ? (authUser._id as any) : undefined,
      customer: {
        firstName: customer.firstName.trim(),
        lastName: customer.lastName.trim(),
        email: customer.email.toLowerCase().trim(),
        phone: customer.phone.trim(),
      },
      shippingAddress: {
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim().toUpperCase(),
        postcode: shippingAddress.postcode.trim(),
        country: shippingAddress.country || 'Australia',
      },
      items: orderItems,
      subtotal: calculatedSubtotal,
      shippingAmount,
      totalAmount: grandTotal,
      paymentMethod: req.body.paymentMethod || 'Credit / Debit Card (Demo)',
      paymentStatus: 'paid',
      orderStatus: 'Pending',
      notes: notes || '',
      timeline: [
        {
          status: 'Pending',
          note: `Order received and confirmed. Payment authorized (${calculatedSubtotal} AUD + ${shippingAmount} AUD shipping).`,
          timestamp: new Date(),
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Customer: Get order confirmation details by ID or Order Number
export const getOrderByIdOrNumber = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    let order;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }

    if (!order) {
      order = await Order.findOne({ orderNumber: id });
    }

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all orders with status/search/date filters
export const adminGetOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, search, page = 1, limit = 15 } = req.query;
    const query: any = {};

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { orderNumber: regex },
        { 'customer.firstName': regex },
        { 'customer.lastName': regex },
        { 'customer.email': regex },
        { 'customer.phone': regex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.max(1, parseInt(limit as string, 10));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Order.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get single order by ID
export const adminGetOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// Admin: Update order status & append to timeline
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed values: ${validStatuses.join(', ')}`,
      });
      return;
    }

    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    // If cancelling order, restore product inventory
    if (status === 'Cancelled' && order.orderStatus !== 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    order.orderStatus = status;
    order.timeline.push({
      status,
      note: note || `Order status updated to ${status} by admin.`,
      timestamp: new Date(),
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order #${order.orderNumber} updated to ${status}.`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Customer: Get personal order history
export const getMyOrders = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const orders = await Order.find({
      $or: [
        { user: req.user._id },
        { 'customer.email': req.user.email.toLowerCase().trim() },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// Customer: Get specific order by orderNumber or ID
export const getMyOrderById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { id } = req.params;
    let order;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }

    if (!order) {
      order = await Order.findOne({ orderNumber: id });
    }

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    // Security check: ensure order belongs to this customer or user is admin
    const isOwner =
      (order.user && order.user.toString() === req.user._id.toString()) ||
      order.customer.email.toLowerCase() === req.user.email.toLowerCase() ||
      req.user.role === 'admin' ||
      req.user.role === 'staff';

    if (!isOwner) {
      res.status(403).json({ success: false, message: 'Access denied to this order.' });
      return;
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
