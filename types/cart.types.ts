import { ProductResult } from "@/types/product.types";

export interface CartResult {
  totalItems: number;
  totalPrice: number;
  items: CartItemResult[];
}

export interface CartItemResult {
  id: string;
  quantity: number;
  product: ProductResult;
}
