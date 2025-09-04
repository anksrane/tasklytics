import React from 'react';
import Skeleton from './Skeleton';

function PieChartSkeleton({ width = "100%", height = 200 }) {
  return (
    <div
      className="flex justify-center items-center"
      style={{ width: width, height: height }}
    >
      <Skeleton className="w-64 h-64 rounded-full" />
    </div>
  );
}

export default PieChartSkeleton;
