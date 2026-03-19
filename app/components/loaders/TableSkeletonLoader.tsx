"use client";

const TableSkeletonLoader = () => {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 rounded-md" />
      ))}
    </div>
  );
};

export default TableSkeletonLoader;