
import React from 'react';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductStatCardProps {
  title: string;
  value: number | string;
  unit?: string;
  change?: number;
  graph?: React.ReactNode;
}

const ProductStatCard = ({
  title,
  value,
  unit = '',
  change,
  graph
}: ProductStatCardProps) => {
  return (
    <div className="stat-card">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="flex items-baseline mt-1">
        <span className="text-2xl font-bold">{value}</span>
        {unit && <span className="ml-1 text-sm text-gray-500">{unit}</span>}
        
        {typeof change === 'number' && (
          <div className={cn(
            "flex items-center ml-2 px-1.5 py-0.5 text-xs rounded",
            change > 0 
              ? "text-green-700 bg-green-50" 
              : "text-red-700 bg-red-50"
          )}>
            {change > 0 ? (
              <ArrowUpIcon className="w-3 h-3 mr-0.5" />
            ) : (
              <ArrowDownIcon className="w-3 h-3 mr-0.5" />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      
      {graph && (
        <div className="mt-3">
          {graph}
        </div>
      )}
    </div>
  );
};

export default ProductStatCard;
