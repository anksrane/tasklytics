import React from "react";
import Skeleton from "./Skeleton"; // adjust import path

function TasksDueThisWeekSkeleton({ rows = 4, columns = 3 }) {
  return (
    <>
      {/* Title Skeleton */}
      <Skeleton className="h-6 w-40 mb-4" />

      {/* Table Wrapper */}
      <div className="relative rounded-lg border overflow-y-auto max-h-60">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="sticky top-0 bg-gray-700 text-xs text-gray-100 uppercase z-10">
            <tr>
              {Array.from({ length: columns }).map((_, idx) => (
                <th key={idx} className="px-2 py-3 border">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <tr key={rowIdx} className="border-b">
                {Array.from({ length: columns }).map((_, colIdx) => (
                  <td key={colIdx} className="px-2 py-3 border">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default TasksDueThisWeekSkeleton;
