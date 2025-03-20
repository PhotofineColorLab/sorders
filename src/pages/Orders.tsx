import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { OrdersFilters } from '@/components/orders/OrdersFilters';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { EmptyOrdersState } from '@/components/orders/EmptyOrdersState';
import { OrderViewDialog } from '@/components/orders/OrderViewDialog';
import { DeleteOrderDialog } from '@/components/orders/DeleteOrderDialog';
import { deleteOrder, getOrders, updateOrder } from '@/lib/data';
import { Order, OrderStatus } from '@/lib/types';
import OrderForm from '@/components/forms/OrderForm';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';

export default function Orders() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
  const [orders, setOrders] = useState(getOrders());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setIsUpdateLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Set dispatchDate if status is changing to dispatched
      const updates: any = { status };
      if (status === 'dispatched') {
        updates.dispatchDate = new Date();
      }
      
      const updatedOrder = updateOrder(orderId, updates);
      
      if (updatedOrder) {
        setOrders(
          orders.map(order => (order.id === orderId ? updatedOrder : order))
        );
        
        toast.success(`Order status updated to ${status}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update order status');
    } finally {
      setIsUpdateLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      deleteOrder(orderId);
      setOrders(orders.filter(order => order.id !== orderId));
      setIsDeleteDialogOpen(false);
      toast.success('Order deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete order');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return activeTab === 'all' ? matchesSearch : order.status === activeTab && matchesSearch;
  });

  if (isCreateMode) {
    return (
      <DashboardLayout>
        <OrderForm />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight animate-fade-in">Orders</h1>
          <p className="text-muted-foreground animate-slide-in-bottom">
            Manage customer orders and update their statuses
          </p>
        </div>

        <OrdersFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onRefresh={() => {
            setOrders(getOrders());
            toast.success('Orders refreshed');
          }}
          onCreateOrder={() => setIsCreateMode(true)}
        />

        <Card className="border shadow-sm">
          <CardHeader className="px-5 pt-5 pb-0">
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredOrders.length === 0 ? (
              <EmptyOrdersState searchTerm={searchTerm} />
            ) : (
              <PaginationWrapper
                data={filteredOrders}
                itemsPerPage={10}
              >
                {(paginatedOrders) => (
                  <OrdersTable
                    orders={paginatedOrders}
                    onViewOrder={(order) => {
                      setSelectedOrder(order);
                      setIsViewDialogOpen(true);
                    }}
                    onDeleteOrder={(order) => {
                      setSelectedOrder(order);
                      setIsDeleteDialogOpen(true);
                    }}
                    onStatusChange={handleStatusChange}
                    isUpdateLoading={isUpdateLoading}
                    formatCurrency={formatCurrency}
                  />
                )}
              </PaginationWrapper>
            )}
          </CardContent>
        </Card>
      </div>

      <OrderViewDialog
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        order={selectedOrder}
        onStatusChange={handleStatusChange}
        formatCurrency={formatCurrency}
      />

      <DeleteOrderDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        order={selectedOrder}
        onDelete={handleDeleteOrder}
      />
    </DashboardLayout>
  );
}
