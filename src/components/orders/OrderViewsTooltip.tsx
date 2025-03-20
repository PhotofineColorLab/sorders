import React from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// This would normally come from the database, but for demo purposes
// we'll create a mock list of staff who have viewed each order
const orderViews: Record<string, { name: string; time: string }[]> = {
  'o1': [
    { name: 'Admin User', time: '2 hours ago' },
    { name: 'Sarah Johnson', time: '1 day ago' },
  ],
  'o2': [
    { name: 'Staff User', time: '3 hours ago' },
  ],
  'o3': [
    { name: 'Admin User', time: '5 hours ago' },
    { name: 'Michael Davis', time: '6 hours ago' },
    { name: 'John Smith', time: '2 days ago' },
  ],
  'o4': [
    { name: 'Sarah Johnson', time: '1 hour ago' },
  ],
  'o5': [
    { name: 'Admin User', time: '30 minutes ago' },
    { name: 'Staff User', time: '1 day ago' },
  ],
};

interface OrderViewsTooltipProps {
  orderId: string;
}

export function OrderViewsTooltip({ orderId }: OrderViewsTooltipProps) {
  const viewers = orderViews[orderId] || [];
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            className="rounded-full p-1 hover:bg-muted transition-colors"
            aria-label="View order viewing history"
          >
            <Info className="h-4 w-4 text-muted-foreground" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="p-0">
          <div className="p-2 w-56">
            <h4 className="font-medium text-sm mb-2">Viewed by</h4>
            {viewers.length > 0 ? (
              <div className="space-y-2">
                {viewers.map((viewer, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${viewer.name}`} />
                        <AvatarFallback>{viewer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{viewer.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{viewer.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No views yet</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}