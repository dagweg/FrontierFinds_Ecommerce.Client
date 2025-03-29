import { ProductResult } from "@/types/product.types";

export interface CartResult {
  totalItemsFetched: number;
  totalItems: number;
  totalPrice: number;
  items: CartItemResult[];
  notSeenCount: number;
}

export interface CartItemResult {
  id: string;
  quantity: number;
  product: ProductResult;
  seen: boolean;
}
