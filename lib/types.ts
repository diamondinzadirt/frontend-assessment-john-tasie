export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviewCount?: number;
  category: string;
  brand: string;
  stock: number;
  thumbnail: string;
  images: string[];
  createdAt?: string;
}

export type CategoryType = string;
