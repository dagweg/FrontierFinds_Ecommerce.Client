import { ProductResult } from "@/types/cart.types";
import { create } from "zustand";

interface ProductsState {
  totalCount: number;
  fetchedCount: number;
  products: ProductResult[];
  addProduct: (product: ProductResult) => void;
  removeProduct: (id: string) => void;
  updateProduct: (updatedProduct: ProductResult) => void;
  setProducts: (products: ProductResult[]) => void;
  setProductsStore: (store: any) => void;
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  totalCount: 0,
  fetchedCount: 0,
  addProduct: (product: ProductResult) =>
    set((state) => ({ products: [...state.products, product] })),
  removeProduct: (id: string) =>
    set((state) => ({
      products: state.products.filter((product) => product.productId !== id),
    })),
  updateProduct: (updatedProduct: ProductResult) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.productId === updatedProduct.productId
          ? updatedProduct
          : product
      ),
    })),
  setProducts: (products: ProductResult[]) => set({ products }),
  setProductsStore: (store) => set(store),
}));
