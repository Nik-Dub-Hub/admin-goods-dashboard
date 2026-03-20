import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Product {
  id: number;
  name: string;
  vendor: string;
  article: string;
  rating: number;
  price: number;
}

type SortDirection = "asc" | "desc" | null;
interface SortState {
  field: keyof Product | null;
  direction: SortDirection;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  total: number;
  page: number;
  searchQuery: string;
  sort: SortState;
  selectedProducts: number[];
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  total: 0,
  page: 1,
  searchQuery: "",
  sort: { field: null, direction: null },
  selectedProducts: [],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.page = 1;
    },
    setSort: (state, action: PayloadAction<SortState>) => {
      state.sort = action.payload;
      state.page = 1; 
    },
    toggleProduct: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const index = state.selectedProducts.indexOf(id);
      if (index > -1) {
        state.selectedProducts.splice(index, 1);
      } else {
        state.selectedProducts.push(id);
      }
    },
    selectAll: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.selectedProducts = state.products.map((p) => p.id);
      } else {
        state.selectedProducts = [];
      }
    },
    clearSelection: (state) => {
      state.selectedProducts = [];
    },
  },
});

export const {
  setLoading,
  setProducts,
  setTotal,
  setPage,
  setSearchQuery,
  setSort,
  toggleProduct,
  selectAll,
  clearSelection,
} = productsSlice.actions;
export default productsSlice.reducer;
