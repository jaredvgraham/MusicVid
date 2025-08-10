import React from "react";

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className=" h-20 w-20 animate-spin rounded-full border-b-2 border-gray-700 "></div>
    </div>
  );
};
