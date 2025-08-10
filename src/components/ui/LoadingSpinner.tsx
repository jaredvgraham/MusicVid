import React from "react";

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-gray-900"></div>
    </div>
  );
};
