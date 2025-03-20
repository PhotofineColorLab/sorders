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

interface OrderViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  formatCurrency: (value: number) => string;
}

export function OrderViewDialog({
  isOpen,
  onOpenChange,
  order,
  onStatusChange,
  formatCurrency
}: OrderViewDialogProps) {
  if (!order) return null;

  const getPaymentConditionText = (condition?: string) => {
    switch (condition) {
      case 'immediate':
        return 'Immediate';
      case '15days':
        return '> 15 Days';
      case '30days':
        return '> 30 Days';
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Order ID</p>
              <p className="text-sm text-muted-foreground">#{order.id}</p>
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
              <p className="text-sm mt-1"><OrderStatusBadge order={order} /></p>
            </div>
            <div>
              <p className="text-sm font-medium">Payment Condition</p>
              <p className="text-sm text-muted-foreground">
                {getPaymentConditionText(order.paymentCondition)}
              </p>
            </div>
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
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
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
          <Select
            defaultValue={order.status}
            onValueChange={(value) => {
              onStatusChange(order.id, value as OrderStatus);
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
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
