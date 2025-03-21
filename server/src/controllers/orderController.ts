import { Request, Response } from 'express';
import Order, { IOrder } from '../models/Order';
import { cloudinary } from '../config/cloudinary';

// Get all orders
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// Get order by ID
export const getOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

// Create new order
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Received order request');
    
    // If we have a file, add the image URL to the order data
    if (req.file) {
      console.log('File received:', req.file);
      
      // Get the image URL from Cloudinary
      const file = req.file as any; // Cast to any to access Cloudinary fields
      if (file.path) {
        req.body.orderImage = file.path;
      } else if (file.secure_url) {
        req.body.orderImage = file.secure_url;
      }
    }
    
    console.log('Order data to save:', req.body);
    
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error: any) {
    console.error('Order creation error:', error);
    
    // Check for MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({ 
        message: 'Validation error', 
        details: validationErrors,
        error: error.message 
      });
    } else {
      res.status(400).json({ message: 'Error creating order', error: error.message });
    }
  }
};

// Update order
export const updateOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    // Handle file if it exists
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      req.body.orderImage = result.secure_url;
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: 'Error updating order', error });
  }
};

// Delete order
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    
    // Delete image from Cloudinary if exists
    if (order.orderImage) {
      const publicId = order.orderImage.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`electra-admin-orders/${publicId}`);
      }
    }
    
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
};

// Get orders by status
export const getOrdersByStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ status: req.params.status }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders by status', error });
  }
}; 