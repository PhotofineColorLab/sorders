import React from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Order, OrderStatus } from '@/lib/types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { PaymentStatusBadge } from './PaymentStatusBadge';

interface OrderViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onMarkPaid?: (orderId: string) => void;
  formatCurrency: (value: number) => string;
}

export function OrderViewDialog({
  isOpen,
  onOpenChange,
  order,
  onStatusChange,
  onMarkPaid,
  formatCurrency
}: OrderViewDialogProps) {
  if (!order) return null;

  const getOrderId = (order: Order) => order._id || order.id || '';

  const getPaymentConditionText = (condition?: string) => {
    switch (condition) {
      case 'immediate':
        return 'Immediate';
      case 'days15':
        return '>15 Days';
      case 'days30':
        return '>30 Days';
      default:
        return 'Not specified';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            View the complete details of this order.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {order.orderImage && (
            <div className="w-full">
              <p className="text-sm font-medium mb-2">Order Image</p>
              <div className="border rounded-md overflow-hidden">
                <img 
                  src={order.orderImage} 
                  alt="Order document" 
                  className="w-full h-auto max-h-[200px] object-contain"
                  onClick={() => window.open(order.orderImage, '_blank')}
                  style={{ cursor: 'pointer' }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Click image to view full size</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Order ID</p>
              <p className="text-sm text-muted-foreground">#{getOrderId(order).substring(0, 8)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Date</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(order.createdAt), 'MMM dd, yyyy')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Customer</p>
              <p className="text-sm text-muted-foreground">{order.customerName}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-sm mt-1 flex items-center">
                <OrderStatusBadge order={order} />
                <PaymentStatusBadge 
                  order={order} 
                  onClick={onMarkPaid && !order.isPaid ? () => {
                    onMarkPaid(getOrderId(order));
                    onOpenChange(false);
                  } : undefined}
                />
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Payment Condition</p>
              <p className="text-sm text-muted-foreground">
                {getPaymentConditionText(order.paymentCondition)}
              </p>
            </div>
            {order.paidAt && (
              <div>
                <p className="text-sm font-medium">Payment Date</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(order.paidAt), 'MMM dd, yyyy')}
                </p>
              </div>
            )}
            {order.dispatchDate && (
              <div>
                <p className="text-sm font-medium">Dispatch Date</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(order.dispatchDate), 'MMM dd, yyyy')}
                </p>
              </div>
            )}
            {order.customerEmail && (
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
              </div>
            )}
            {order.customerPhone && (
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium mb-2">Items</p>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={item._id || item.id || index}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.price * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <p className="text-sm font-medium">Total</p>
            <p className="text-lg font-semibold">{formatCurrency(order.total)}</p>
          </div>

          {order.notes && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-1">Notes</p>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Select
              defaultValue={order.status}
              onValueChange={(value) => {
                onStatusChange(getOrderId(order), value as OrderStatus);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="dc">DC Generated</SelectItem>
                <SelectItem value="invoice">Invoice Generated</SelectItem>
                <SelectItem value="dispatched">Dispatched</SelectItem>
              </SelectContent>
            </Select>
            
            {order.status === 'dispatched' && !order.isPaid && onMarkPaid && (
              <Button onClick={() => {
                onMarkPaid(getOrderId(order));
                onOpenChange(false);
              }}>
                Mark as Paid
              </Button>
            )}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
