export interface Product {
  sku: string;
  name: string;
  material?: string;
  tags?: string[];
  category?: string[];
  images?: Array<{ URL?: string }>;
  price?: string;
  description?: string;
  [key: string]: any;
}

export interface FeaturedProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}
