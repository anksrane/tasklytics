import React from "react";
import Skeleton from "./Skeleton";

export default function ChartSkeleton({
  rows = 5,
  height = 300,
  orientation = "vertical", // "vertical" | "horizontal"
}) {
  if (orientation === "horizontal") {
    return (
      <>
        <Skeleton className="h-6 w-40 mb-4" />
        <div
          className={`w-full border rounded-md p-4 space-y-3 animate-pulse`}
          style={{ height }}
        >
          {/* Chart title placeholder */}
          <Skeleton className="h-6 w-1/4 mb-4" />

          {/* Fake horizontal bars (label + bar) */}
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              {/* Fake Y-axis label */}
              <Skeleton className="h-4 w-16" />
              {/* Fake horizontal bar */}
              <Skeleton
                className={`h-6 flex-1 ${
                  i % 2 === 0 ? "w-4/6" : "w-3/6"
                }`}
              />
            </div>
          ))}
        </div>
      </>
    );
  }

  // Default = vertical bars
  return (
    <>
    <Skeleton className="h-6 w-40 mb-4" />
    <div
      className={`w-full border rounded-md p-4 space-y-3 animate-pulse`}
      style={{ height }}
    >
      {/* Chart title placeholder */}
      <Skeleton className="h-6 w-1/4 mb-4" />

      {/* Fake vertical bars */}
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-6 ${i % 2 === 0 ? "w-5/6" : "w-3/6"}`}
        />
      ))}
    </div>    
    </>
  );
}
