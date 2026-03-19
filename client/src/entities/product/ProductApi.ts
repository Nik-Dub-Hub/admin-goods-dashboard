import type { ApiResponse, Product } from "./types";

class ProductApi {
  // 🔥 Универсальный метод с поддержкой сортировки, пагинации и поиска
  static async getProducts(
    limit = 30,
    skip = 0,
    sortBy?: string, // 🔥 DummyJSON: sortBy
    order: "asc" | "desc" = "asc", // 🔥 DummyJSON: order
    select?: string,
    searchQuery?: string, // 🔥 DummyJSON: q
  ): Promise<ApiResponse<Product>> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      skip: skip.toString(),
    });

    if (select) params.append("select", select);
    if (sortBy) {
      params.append("sortBy", sortBy); // ✅ DummyJSON
      params.append("order", order); // ✅ DummyJSON
    }
    if (searchQuery) {
      params.append("q", searchQuery); // ✅ Поиск
    }

    // 🔥 DummyJSON логика: search использует отдельный endpoint
    const url = searchQuery
      ? `https://dummyjson.com/products/search?${params}`
      : `https://dummyjson.com/products?${params}`;

    const response = await fetch(url);
    return response.json();
  }

  // 🔥 Устаревшие методы (можно удалить позже)
  static async searchProducts(
    query: string,
    limit = 30,
  ): Promise<ApiResponse<Product>> {
    return this.getProducts(limit, 0, undefined, undefined, undefined, query);
  }

  static async getProductsSorted(
    sortBy: string,
    order: "asc" | "desc" = "asc",
    limit = 30,
  ): Promise<ApiResponse<Product>> {
    return this.getProducts(limit, 0, sortBy, order);
  }

  static async getCategories(): Promise<string[]> {
    const response = await fetch("https://dummyjson.com/products/categories");
    return response.json();
  }
}

export default ProductApi;
