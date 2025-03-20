
import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface EmptyOrdersStateProps {
  searchTerm: string;
}

export function EmptyOrdersState({ searchTerm }: EmptyOrdersStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
      <p className="text-lg font-medium text-center">No orders found</p>
      <p className="text-muted-foreground text-center mt-1">
        {searchTerm ? "Try adjusting your search." : "Create your first order to get started."}
      </p>
    </div>
  );
}
