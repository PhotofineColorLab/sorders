import express, { RequestHandler } from 'express';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersByStatus,
} from '../controllers/orderController';

const router = express.Router();

// Get all orders
router.get('/', getOrders as RequestHandler);

// Get orders by status - must be before /:id route to avoid conflict
router.get('/status/:status', getOrdersByStatus as RequestHandler);

// Get order by ID
router.get('/:id', getOrder as RequestHandler);

// Create new order
router.post('/', createOrder as RequestHandler);

// Update order
router.put('/:id', updateOrder as RequestHandler);

// Delete order
router.delete('/:id', deleteOrder as RequestHandler);

export default router; 