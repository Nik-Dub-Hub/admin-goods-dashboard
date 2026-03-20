import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import {
  setProducts,
  setTotal,
  setPage,
  setSearchQuery,
  setSort,
  setLoading,
  toggleProduct,
  selectAll,
} from "../../app/store/slices/productsSlice";
import ProductApi from "../../entities/product/ProductApi";
import { ProductHeader } from "../../features/products/ProductHeader";
import { ProductActionsPanel } from "../../features/products/ProductActionsPanel";
import { ProductLoading } from "../../features/products/ProductLoading";
import { ProductTable } from "../../features/products/ProductTable";
import { AddProductModal } from "../../features/products/add-product-modal/AddProductModal";

interface Product {
  id: number;
  name: string;
  vendor: string;
  article: string;
  rating: number;
  price: number;
}


interface NewProductForm {
  name: string;
  vendor: string;
  article: string;
  price: string;
}

const API_FIELD_MAP: Partial<Record<keyof Product, string>> = {
  name: "title",
  vendor: "brand",
  article: "sku",
  rating: "rating",
  price: "price",
};

const PER_PAGE = 20;

interface ApiProduct {
  id: number;
  title?: string;
  brand?: string;
  sku?: string;
  rating?: number;
  price?: number;
}

export default function ProductsPage() {

  const dispatch = useAppDispatch();
  const {
    products,
    loading,
    total,
    page,
    searchQuery,
    sort,
    selectedProducts,
  } = useAppSelector((state) => state.products);

  const masterRef = useRef<HTMLDivElement>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);


  const mapProduct = (product: ApiProduct): Product => ({
    id: product.id,
    name: product.title ?? "Без названия",
    vendor: product.brand ?? "Без бренда",
    article: product.sku ?? `SKU-${product.id}`,
    rating: product.rating ?? 0,
    price: product.price ?? 0,
  });

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const handleSubmit = (productData: NewProductForm) => {
    console.log("Новый товар:", productData);
    setTimeout(() => {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        closeAddModal();
      }, 2000);
    }, 500);
  };

  const handleRefresh = () => {
    dispatch(setSearchQuery(""));
    dispatch(setPage(1));
  };

  const handleSearchChange = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const toggleProductLocal = (productId: number) => {
    dispatch(toggleProduct(productId));
  };

  const toggleSelectAllLocal = (checked: boolean) => {
    dispatch(selectAll(checked));
  };

  const handleSort = (field: keyof Product) => {
    const apiField = API_FIELD_MAP[field];
    if (!apiField) return;

    dispatch(
      setSort({
        field,
        direction:
          sort.field === field && sort.direction === "asc" ? "desc" : "asc",
      }),
    );
  };

  const loadProducts = async () => {
    try {
      dispatch(setLoading(true));
      const skip = (page - 1) * PER_PAGE;
      const sortBy = sort.field ? API_FIELD_MAP[sort.field] : undefined;

      const response = await ProductApi.getProducts(
        PER_PAGE,
        skip,
        sortBy,
        (sort.direction as "asc" | "desc") || "asc",
        undefined,
        searchQuery.trim() || undefined,
      );

      dispatch(
        setProducts(
          response.products.map((product: ApiProduct) => mapProduct(product)),
        ),
      );
      dispatch(setTotal(response.total || response.products.length));
    } catch (error) {
      console.error("ОШИБКА API:", error);
      dispatch(setProducts([]));
      dispatch(setTotal(0));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page, searchQuery, sort]);

  useEffect(() => {
    const element = masterRef.current;
    if (element) {
      const allSelected =
        products.length > 0 && selectedProducts.length === products.length;
      const someSelected = products.some((p) =>
        selectedProducts.includes(p.id),
      );

      element.dataset.indeterminate = (someSelected && !allSelected).toString();
    }
  }, [products, selectedProducts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F3F3] py-5">
        <ProductHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
        <div className="bg-white rounded-lg p-8">
          <ProductActionsPanel
            onRefresh={handleRefresh}
            onAddClick={openAddModal}
          />
          <ProductLoading />
        </div>
      </div>
    );
  }

  const isSelectAll =
    products.length > 0 && selectedProducts.length === products.length;

  return (
    <div className="min-h-screen bg-[#F3F3F3] py-5">
      <ProductHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <div className="bg-white rounded-lg p-8">
        <ProductActionsPanel
          onRefresh={handleRefresh}
          onAddClick={openAddModal}
        />

        <ProductTable
          products={products}
          selectedProducts={selectedProducts as number[]} 
          selectAll={isSelectAll}
          total={total}
          page={page}
          perPage={PER_PAGE}
          sort={sort}
          onSort={handleSort}
          onPageChange={handlePageChange}
          onSelectAll={toggleSelectAllLocal}
          onToggleProduct={toggleProductLocal}
          masterRef={masterRef}
        />
      </div>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onProductSubmit={handleSubmit}
      />

      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div
            className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl 
            border-l-4 border-green-600 flex items-center space-x-3 max-w-sm"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">Товар успешно добавлен!</span>
          </div>
        </div>
      )}
    </div>
  );
}
