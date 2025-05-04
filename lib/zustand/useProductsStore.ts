import {
  CategoryResult,
  FilterProductsQuery,
  ProductResult,
  ProductsResult,
} from "@/types/product.types";
import { create } from "zustand";

interface ProductsState {
  // currentPage: number;
  pageSize: number;
  productsResult: ProductsResult;
  // filterQuery: FilterProductsQuery;
  categories: CategoryResult[];
  setCategories: (categories: CategoryResult[]) => void;
  setIsCategoriesLoading: (isLoading: boolean) => void;
  isCategoriesLoading: boolean;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  addProduct: (product: ProductResult) => void;
  removeProduct: (id: string) => void;
  updateProduct: (updatedProduct: ProductResult) => void;
  setProducts: (products: ProductResult[]) => void;
  setProductsResult: (store: ProductsResult) => void;
}

export const useProductsStore = create<ProductsState>((set) => ({
  // currentPage: 1,
  pageSize: 10,
  productsResult: {
    totalCount: 0,
    totalFetchedCount: 0,
    products: [],
    minPriceValueInCents: 0,
    maxPriceValueInCents: 1000,
  },
  categories: [],
  setIsCategoriesLoading: (isLoading) =>
    set((state) => ({
      ...state,
      isCategoriesLoading: isLoading,
    })),
  isCategoriesLoading: true,
  setCategories: (categories) =>
    set((state) => ({
      ...state,
      categories,
    })),
  isLoading: true,
  setIsLoading: (isLoading) =>
    set((state) => ({
      ...state,
      isLoading,
    })),
  addProduct: (product) =>
    set((state) => ({
      productsResult: {
        ...state.productsResult,
        products: [...state.productsResult.products, product],
      },
    })),
  removeProduct: (id) =>
    set((state) => ({
      productsResult: {
        ...state.productsResult,
        products: state.productsResult.products.filter(
          (product) => product.productId !== id
        ),
      },
    })),
  updateProduct: (updatedProduct) =>
    set((state) => ({
      productsResult: {
        ...state.productsResult,
        products: state.productsResult.products.map((product) =>
          product.productId === updatedProduct.productId
            ? updatedProduct
            : product
        ),
      },
    })),
  setProducts: (products) =>
    set((state) => ({
      productsResult: {
        ...state.productsResult,
        products,
      },
    })),
  setProductsResult: (result) =>
    set(() => ({
      productsResult: result,
    })),
}));
