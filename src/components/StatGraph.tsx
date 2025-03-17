
import React from 'react';

interface StatGraphProps {
  type: 'income' | 'spending';
}

const StatGraph = ({ type }: StatGraphProps) => {
  // This is a simplified version - in a real app you'd use a charting library like recharts
  return (
    <div className="w-full h-16 relative overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 100 30">
        {type === 'income' ? (
          <path
            d="M0,15 Q10,10 20,15 T40,20 T60,5 T80,15 T100,10"
            fill="none"
            stroke="rgba(59, 130, 246, 0.5)"
            strokeWidth="1.5"
          />
        ) : (
          <path
            d="M0,15 Q20,25 30,15 T50,5 T70,20 T90,10 T100,15"
            fill="none"
            stroke="rgba(239, 68, 68, 0.5)"
            strokeWidth="1.5"
          />
        )}
        
        <path
          d={type === 'income' 
            ? "M0,30 Q10,25 20,30 T40,35 T60,20 T80,30 T100,25 V30 H0 Z" 
            : "M0,30 Q20,40 30,30 T50,20 T70,35 T90,25 T100,30 V30 H0 Z"}
          fill={type === 'income' ? "rgba(59, 130, 246, 0.1)" : "rgba(239, 68, 68, 0.1)"}
        />
      </svg>
    </div>
  );
};

export default StatGraph;
