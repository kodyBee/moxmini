import { Product } from "./product";

export interface PaintingOptions {
  hairColor: string;
  skinColor: string;
  accessoryColor: string;
  fabricColor: string;
  specificDetails: string;
}

export interface CartItem {
  id: string;
  product: Product;
  paintingOptions: PaintingOptions;
}
