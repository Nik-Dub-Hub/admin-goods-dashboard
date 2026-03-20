import React from "react";

export const ProductLoading: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <div className="text-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <div className="w-full max-w-md bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#242EDB] to-blue-600 h-2 rounded-full animate-pulse transition-all duration-1000"
              style={{ width: "60%" }}
            />
          </div>
          <div className="text-sm text-gray-500">Загрузка товаров...</div>
        </div>
      </div>
    </div>
  );
};
