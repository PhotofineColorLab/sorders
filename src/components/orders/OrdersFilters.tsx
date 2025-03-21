import React from 'react';
import { Search, RefreshCw, Plus, Calendar, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderStatus } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface OrdersFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTab: OrderStatus | 'all';
  setActiveTab: (tab: OrderStatus | 'all') => void;
  dateRange: { from?: Date; to?: Date };
  setDateRange: (range: { from?: Date; to?: Date }) => void;
  onRefresh: () => void;
  onCreateOrder: () => void;
}

export function OrdersFilters({
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  dateRange,
  setDateRange,
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
          
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Filter by Date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="range"
                selected={{
                  from: dateRange.from,
                  to: dateRange.to,
                }}
                onSelect={setDateRange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          {/* Display selected date range as badges */}
          {dateRange.from && (
            <Badge variant="outline" className="flex gap-1 items-center">
              {dateRange.from && format(dateRange.from, 'MMM dd, yyyy')}
              {dateRange.to && ` - ${format(dateRange.to, 'MMM dd, yyyy')}`}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setDateRange({ from: undefined, to: undefined })}
              />
            </Badge>
          )}
          
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