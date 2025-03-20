import { Order, OrderStatus } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Generic fetch function with error handling
async function fetchAPI<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
}

/**
 * Fetches orders from the API, optionally filtered by status
 */
export async function fetchOrders(status?: string) {
  console.log(`[API] Fetching orders with status: ${status || 'all'}`);
  try {
    const endpoint = status && status !== 'all' 
      ? `${API_URL}/orders/status/${status}` 
      : `${API_URL}/orders`;
    
    console.log(`[API] Request URL: ${endpoint}`);
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`Error fetching orders: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`[API] Successfully fetched ${data.length} orders`);
    return data;
  } catch (error) {
    console.error('[API] Error fetching orders:', error);
    throw error;
  }
}

export const fetchOrder = async (id: string): Promise<Order> => {
  return fetchAPI<Order>(`/orders/${id}`);
};

export const createOrder = async (orderData: {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  status: string;
  paymentCondition: string;
  notes: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  createdBy: string;
  dispatchDate?: Date;
  orderImage?: string;
}): Promise<Order> => {
  console.log('[API] Creating new order:', JSON.stringify(orderData, null, 2));
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('[API] Error response:', responseData);
      throw new Error(responseData.message || responseData.details || 'Error creating order');
    }
    
    console.log('[API] Order created successfully:', responseData);
    return responseData;
  } catch (error) {
    console.error('[API] Error creating order:', error);
    throw error;
  }
};

export const updateOrderAPI = async (id: string, updates: Partial<Order>): Promise<Order> => {
  console.log(`[API] Updating order ${id}:`, updates);
  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error(`Error updating order: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('[API] Order updated successfully:', data);
    return data;
  } catch (error) {
    console.error('[API] Error updating order:', error);
    throw error;
  }
};

export const deleteOrderAPI = async (id: string): Promise<{ message: string }> => {
  console.log(`[API] Deleting order: ${id}`);
  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting order: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('[API] Order deleted successfully:', data);
    return data;
  } catch (error) {
    console.error('[API] Error deleting order:', error);
    throw error;
  }
}; 