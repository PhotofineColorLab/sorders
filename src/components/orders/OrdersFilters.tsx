
import React from 'react';
import { Plus, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OrderStatus } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  onCreateOrder
}: OrdersFiltersProps) {
  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders..."
            className="pl-8 md:w-[300px] lg:w-[400px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={onCreateOrder}>
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as OrderStatus | 'all')}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="dc">DC</TabsTrigger>
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="dispatched">Dispatched</TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  );
}