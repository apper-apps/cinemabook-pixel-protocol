import React from "react";

const Loading = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="bg-surface rounded-xl overflow-hidden shadow-lg animate-pulse">
          <div className="aspect-[2/3] bg-gray-700" />
          <div className="p-4 space-y-3">
            <div className="h-6 bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-700 rounded w-1/2" />
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-700 rounded w-16" />
              <div className="h-4 bg-gray-700 rounded w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;