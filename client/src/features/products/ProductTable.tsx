import React from "react";
import { PaginationInfo } from "../../shared/ui/pagination/PaginationInfo/PaginationInfo";
import { PaginationControls } from "../../shared/ui/pagination/PaginationControls/PaginationControls";
import { ProductTableBody } from "./product-table/ProductTableBody";
import { ProductTableHead } from "./product-table/ProductTableHead";

interface TableProduct {
  id: number;
  name: string;
  vendor: string;
  article: string;
  rating: number;
  price: number;
}

interface ProductTableProps {
  products: TableProduct[];
  selectedProducts: Set<number>;
  selectAll: boolean;
  total: number;
  page: number;
  perPage: number;
  sort: { field: keyof TableProduct | null; direction: "asc" | "desc" | null };
  onSort: (field: keyof TableProduct) => void;
  onPageChange: (page: number) => void;
  onSelectAll: (checked: boolean) => void;
  onToggleProduct: (id: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  selectedProducts,
  selectAll,
  total,
  page,
  perPage,
  sort,
  onSort,
  onPageChange,
  onSelectAll,
  onToggleProduct,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-fixed [&_th]:px-3 [&_td]:px-3">
        <ProductTableHead
          sort={sort}
          onSort={onSort}
          selectAll={selectAll}
          onSelectAll={onSelectAll}
        />
        <ProductTableBody
          products={products}
          selectedProducts={selectedProducts}
          onToggleProduct={onToggleProduct}
        />
      </table>
      <div className="flex justify-between items-center mt-6 px-3 py-4 border-t">
        <PaginationInfo total={total} page={page} perPage={perPage} />
        <PaginationControls
          total={total}
          page={page}
          perPage={perPage}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};