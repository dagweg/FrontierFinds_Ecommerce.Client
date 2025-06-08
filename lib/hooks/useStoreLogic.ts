"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import { useProductsStore } from "@/lib/zustand/useProductsStore";
import { ProductsResult, CategoryResult } from "@/types/product.types";

interface FilterState {
  searchQuery: string;
  selectedCategories: number[];
  sortBy: string;
  minPrice: number;
  maxPrice: number;
}

export function useStoreLogic() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { apiBaseUrl } = useEnvStore();
  const productsStore = useProductsStore();

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Products and categories state
  const [products, setProducts] = useState<ProductsResult>({
    totalCount: 0,
    totalFetchedCount: 0,
    products: [],
    minPriceValueInCents: 0,
    maxPriceValueInCents: 100000,
  });

  const [categories, setCategories] = useState<CategoryResult[]>([]);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: searchParams.get("search") || "",
    selectedCategories: searchParams.get("category")
      ? categories
          .filter(
            (c) =>
              c.name.toLowerCase() ===
              searchParams.get("category")?.toLowerCase()
          )
          .map((c) => c.id)
      : [],
    sortBy: searchParams.get("sort") || "featured",
    minPrice: 0,
    maxPrice: 1000,
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/products/categories`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);

          // Set initial category filter if category param exists
          const categoryParam = searchParams.get("category");
          if (categoryParam) {
            const matchingCategory = data.categories.find(
              (c: CategoryResult) =>
                c.name.toLowerCase() === categoryParam.toLowerCase()
            );
            if (matchingCategory) {
              setFilters((prev) => ({
                ...prev,
                selectedCategories: [matchingCategory.id],
              }));
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [apiBaseUrl, searchParams]);

  // Fetch products when filters change
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      params.append("pageNumber", page.toString());
      params.append("pageSize", "12");

      if (filters.searchQuery.trim()) {
        params.append("searchQuery", filters.searchQuery);
      }

      if (filters.selectedCategories.length > 0) {
        filters.selectedCategories.forEach((categoryId) => {
          params.append("categoryIds", categoryId.toString());
        });
      }

      if (filters.sortBy !== "featured") {
        params.append("sortBy", filters.sortBy);
      }

      if (filters.minPrice > 0) {
        params.append("minPrice", (filters.minPrice * 100).toString());
      }

      if (filters.maxPrice < 1000) {
        params.append("maxPrice", (filters.maxPrice * 100).toString());
      }

      const response = await fetch(
        `${apiBaseUrl}/products?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl, page, filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter handlers
  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: value }));
    setPage(1);
  };

  const handleCategoryToggle = (categoryId: number) => {
    setFilters((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter((id) => id !== categoryId)
        : [...prev.selectedCategories, categoryId],
    }));
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setFilters((prev) => ({ ...prev, sortBy: value }));
    setPage(1);
  };

  const handleMinPriceChange = (value: number) => {
    setFilters((prev) => ({ ...prev, minPrice: value }));
    setPage(1);
  };

  const handleMaxPriceChange = (value: number) => {
    setFilters((prev) => ({ ...prev, maxPrice: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: "",
      selectedCategories: [],
      sortBy: "featured",
      minPrice: 0,
      maxPrice: 1000,
    });
    setPage(1);
  };

  const getSelectedCategoryNames = () => {
    return categories
      .filter((cat) => filters.selectedCategories.includes(cat.id))
      .map((cat) => cat.name);
  };

  const handleRemoveCategory = (categoryName: string) => {
    const categoryId = categories.find((c) => c.name === categoryName)?.id;
    if (categoryId) handleCategoryToggle(categoryId);
  };

  const getActiveFiltersCount = () => {
    return filters.selectedCategories.length + (filters.searchQuery ? 1 : 0);
  };

  return {
    // State
    page,
    isLoading,
    showFilters,
    products,
    categories,
    filters,

    // Handlers
    setPage,
    setShowFilters,
    handleSearchChange,
    handleCategoryToggle,
    handleSortChange,
    handleMinPriceChange,
    handleMaxPriceChange,
    clearFilters,
    getSelectedCategoryNames,
    handleRemoveCategory,
    getActiveFiltersCount,
  };
}
