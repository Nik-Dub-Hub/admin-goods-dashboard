export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  sku: string;
  thumbnail: string;
  images: string[];
}

export interface ApiResponse<T = Product> {
  products: T[];
  total: number;
  skip: number;
  limit: number;
}
