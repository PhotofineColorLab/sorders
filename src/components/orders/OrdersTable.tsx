import React from 'react';
import { format } from 'date-fns';
import { Loader2, MoreHorizontal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderViewsTooltip } from './OrderViewsTooltip';
import { Order, OrderStatus } from '@/lib/types';

interface OrdersTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onDeleteOrder: (order: Order) => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  isUpdateLoading: boolean;
  formatCurrency: (value: number) => string;
}

export function OrdersTable({
  orders,
  onViewOrder,
  onDeleteOrder,
  onStatusChange,
  isUpdateLoading,
  formatCurrency
}: OrdersTableProps) {
  return (
    <div className="rounded-md border-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="transition-all hover:bg-muted/50">
              <TableCell className="font-medium">#{order.id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>
                {format(new Date(order.createdAt), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell><OrderStatusBadge order={order} /></TableCell>
              <TableCell>{formatCurrency(order.total)}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <OrderViewsTooltip orderId={order.id} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onViewOrder(order)}
                      >
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                      <DropdownMenuItem
                        disabled={order.status === 'pending' || isUpdateLoading}
                        onClick={() => onStatusChange(order.id, 'pending')}
                      >
                        {isUpdateLoading && <Loader2 className="h-3 w-3 mr-2 animate-spin" />}
                        Mark as Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={order.status === 'dc' || isUpdateLoading}
                        onClick={() => onStatusChange(order.id, 'dc')}
                      >
                        {isUpdateLoading && <Loader2 className="h-3 w-3 mr-2 animate-spin" />}
                        Generate DC
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={order.status === 'invoice' || isUpdateLoading}
                        onClick={() => onStatusChange(order.id, 'invoice')}
                      >
                        {isUpdateLoading && <Loader2 className="h-3 w-3 mr-2 animate-spin" />}
                        Generate Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={order.status === 'dispatched' || isUpdateLoading}
                        onClick={() => onStatusChange(order.id, 'dispatched')}
                      >
                        {isUpdateLoading && <Loader2 className="h-3 w-3 mr-2 animate-spin" />}
                        Mark as Dispatched
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDeleteOrder(order)}
                      >
                        Delete Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
