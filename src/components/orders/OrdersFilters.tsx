import React from 'react';
import { Search, RefreshCw, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderStatus } from '@/lib/types';

interface OrdersFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTab: OrderStatus | 'all';
  setActiveTab: (tab: OrderStatus | 'all') => void;
  onRefresh: () => void;
  onCreateOrder: () => void;
}

export function OrdersFilters({
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  onRefresh,
  onCreateOrder,
}: OrdersFiltersProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            className="shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={onCreateOrder}>
          <Plus className="h-4 w-4 mr-2" />
          New Order
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as OrderStatus | 'all')}>
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="dc">DC Generated</TabsTrigger>
          <TabsTrigger value="invoice">Invoice Generated</TabsTrigger>
          <TabsTrigger value="dispatched">Dispatched</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}