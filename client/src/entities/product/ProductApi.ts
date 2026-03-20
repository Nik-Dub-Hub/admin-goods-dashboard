import type { ApiResponse, Product } from "./types";

class ProductApi {
  static async getProducts(
    limit = 30,
    skip = 0,
    sortBy?: string,
    order: "asc" | "desc" = "asc",
    select?: string,
    searchQuery?: string,
  ): Promise<ApiResponse<Product>> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      skip: skip.toString(),
    });

    if (select) params.append("select", select);
    if (sortBy) {
      params.append("sortBy", sortBy);
      params.append("order", order);
    }
    if (searchQuery) {
      params.append("q", searchQuery);
    }

    const url = searchQuery
      ? `https://dummyjson.com/products/search?${params}`
      : `https://dummyjson.com/products?${params}`;

    const response = await fetch(url);
    return response.json();
  }

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
