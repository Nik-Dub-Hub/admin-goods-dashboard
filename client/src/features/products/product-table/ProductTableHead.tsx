import React from "react";
import { SortIcon } from "../../../shared/ui/SortIcon";

interface TableProduct {
  id: number;
  name: string;
  vendor: string;
  article: string;
  rating: number;
  price: number;
}

interface ProductTableHeadProps {
  sort: { field: keyof TableProduct | null; direction: "asc" | "desc" | null };
  onSort: (field: keyof TableProduct) => void;
  selectAll: boolean;
  onSelectAll: (checked: boolean) => void;
}

export const ProductTableHead: React.FC<ProductTableHeadProps> = ({
  sort,
  onSort,
  selectAll,
  onSelectAll,
}) => {
  return (
    <thead>
      <tr>
        <th className="px-6 py-4 text-left w-[30%]">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 cursor-pointer relative"
              onClick={(e) => {
                e.stopPropagation();
                onSelectAll(!selectAll);
              }}
            >
              <img
                src={
                  selectAll
                    ? "/icons/Checkbox-on.svg"
                    : "/icons/Checkbox-off.svg"
                }
                alt="checkbox"
                className="w-4 h-4 absolute inset-0"
              />
            </div>
            <span className="font-semibold text-gray-500 text-[14px]">
              Наименование
            </span>
          </div>
        </th>
        <th
          className="px-6 py-4 text-center w-[15%] pl-5 justify-end pr-5 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onSort("vendor")}
        >
          <div className="flex items-center justify-center gap-1">
            <span className="font-semibold text-gray-500 text-[14px]">
              Вендор
            </span>
            {sort.field === "vendor" && <SortIcon direction={sort.direction} />}
          </div>
        </th>

        <th
          className="px-6 py-4 text-center w-[15%] cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onSort("article")}
        >
          <div className="flex items-center justify-center gap-1">
            <span className="font-semibold text-gray-500 text-[14px]">
              Артикул
            </span>
            {sort.field === "article" && (
              <SortIcon direction={sort.direction} />
            )}
          </div>
        </th>

        <th
          className="px-6 py-4 text-center w-[10%] cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onSort("rating")}
        >
          <div className="flex items-center justify-center gap-1">
            <span className="font-semibold text-gray-500 text-[14px]">
              Оценка
            </span>
            {sort.field === "rating" && <SortIcon direction={sort.direction} />}
          </div>
        </th>

        <th
          className="px-6 py-4 text-center w-[10%] cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onSort("price")}
        >
          <div className="flex items-center justify-center gap-1">
            <span className="font-semibold text-gray-500 text-[14px]">
              Цена, ₽
            </span>
            {sort.field === "price" && <SortIcon direction={sort.direction} />}
          </div>
        </th>
        <th className="px-6 py-4 w-[5%]"></th>
      </tr>
    </thead>
  );
};
