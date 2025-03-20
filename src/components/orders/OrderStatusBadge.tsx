import React from 'react';
import { File, Package, Truck, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Order, OrderStatus } from '@/lib/types';

interface OrderStatusBadgeProps {
  order: Order;
}

export function OrderStatusBadge({ order }: OrderStatusBadgeProps) {
  const { status, paymentCondition, dispatchDate } = order;
  
  // Check if payment pending badge should be displayed
  const shouldShowPaymentPending = () => {
    if (status !== 'dispatched' || !dispatchDate) return false;
    
    const now = new Date();
    
    switch (paymentCondition) {
      case 'immediate':
        return true;
      case '15days':
        // Check if 15 days have passed since dispatch
        const fifteenDaysLater = new Date(dispatchDate);
        fifteenDaysLater.setDate(fifteenDaysLater.getDate() + 15);
        return now >= fifteenDaysLater;
      case '30days':
        // Check if 30 days have passed since dispatch
        const thirtyDaysLater = new Date(dispatchDate);
        thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
        return now >= thirtyDaysLater;
      default:
        return false;
    }
  };
  
  const renderStatusBadge = () => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <span className="mr-1">●</span> Pending
          </Badge>
        );
      case 'dc':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Package className="h-3 w-3 mr-1" /> DC Generated
          </Badge>
        );
      case 'invoice':
        return (
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            <File className="h-3 w-3 mr-1" /> Invoice Generated
          </Badge>
        );
      case 'dispatched':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Truck className="h-3 w-3 mr-1" /> Dispatched
          </Badge>
        );
    }
  };
  
  return (
    <div className="flex gap-2 flex-wrap">
      {renderStatusBadge()}
      
      {shouldShowPaymentPending() && (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <DollarSign className="h-3 w-3 mr-1" /> Payment Pending
        </Badge>
      )}
    </div>
  );
}
