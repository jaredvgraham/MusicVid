import React from "react";

export const LoadingSpinner = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  console.log("LoadingSpinner", children);
  return (
    <div className="relative inline-flex items-center justify-center">
      <div className="h-20 w-20 animate-spin rounded-full border-b-2 border-gray-700"></div>
      {children && (
        <div className="absolute text-xs font-medium text-white/80">
          {children}
        </div>
      )}
    </div>
  );
};
