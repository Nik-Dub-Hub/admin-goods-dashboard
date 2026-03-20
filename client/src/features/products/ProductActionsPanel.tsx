import React from "react";

interface ProductActionsPanelProps {
  onRefresh: () => void;
  onAddClick: () => void;
}

export const ProductActionsPanel: React.FC<ProductActionsPanelProps> = ({
  onRefresh,
  onAddClick,
}) => {
  return (
    <div className="relative h-[80px] mb-6">
      <div>
        <h2
          className="font-bold text-black leading-tight"
          style={{ fontSize: "20px", lineHeight: "20px", fontWeight: 700 }}
        >
          Все позиции
        </h2>
      </div>

      <div className="absolute right-[0px] top-[0px] flex items-center space-x-2">
        <button
          onClick={onRefresh}
          className="w-[42px] h-[42px] bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:shadow-sm transition-all"
        >
          <img
            src="/icons/ArrowsClockwise.svg"
            alt="Refresh"
            className="w-[22px] h-[22px]"
          />
        </button>

        <button
          onClick={onAddClick}
          className="w-[147px] h-[42px] bg-[#242EDB] rounded-lg flex items-center justify-center space-x-5 hover:bg-[#1e27c3] transition-all"
        >
          <img
            src="/icons/Vector.svg"
            alt="Add"
            className="w-[17px] h-[17px]"
          />
          <span
            className="text-white font-medium leading-none"
            style={{ fontSize: "14px", fontFamily: "'Cairo', sans-serif" }}
          >
            Добавить
          </span>
        </button>
      </div>
    </div>
  );
};
