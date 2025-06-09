"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ProductResult } from "@/types/product.types";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import ProductCard, {
  ProductCardLoader,
} from "@/components/custom/product-card";

interface RelatedProductsProps {
  currentProduct: ProductResult;
}

export function RelatedProducts({ currentProduct }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<ProductResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiBaseUrl } = useEnvStore();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!currentProduct.categories.length) return;

      setIsLoading(true);
      setError(null);

      try {
        // Extract category IDs from the current product
        const categoryIds = currentProduct.categories.map((cat) => cat.id);

        // Create search parameters for fetching related products
        const params = new URLSearchParams();
        params.append("pageNumber", "1");
        params.append("pageSize", "8"); // Fetch more to filter out current product

        // Add category filters
        categoryIds.forEach((categoryId) => {
          params.append("categoryIds", categoryId.toString());
        });

        const response = await fetch(
          `${apiBaseUrl}/products?${params.toString()}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Filter out the current product and limit to 4 products
          const filteredProducts = data.products
            .filter(
              (product: ProductResult) =>
                product.productId !== currentProduct.productId
            )
            .slice(0, 4);

          setRelatedProducts(filteredProducts);
        } else {
          setError("Failed to fetch related products");
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
        setError("An error occurred while fetching related products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProduct, apiBaseUrl]);

  // Don't render if no categories or if there are no related products and not loading
  if (
    !currentProduct.categories.length ||
    (!isLoading && relatedProducts.length === 0 && !error)
  ) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-20"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <Sparkles className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            You Might Also Like
          </h2>
          <Sparkles className="w-8 h-8 text-purple-600" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Discover more amazing products from the same categories
        </motion.p>
      </div>

      {error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? // Show loading cards
              Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={`loader-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCardLoader variant="compact" />
                </motion.div>
              ))
            : // Show actual related products
              relatedProducts.map((product, index) => (
                <motion.div
                  key={product.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <ProductCard productResult={product} variant="compact" />
                </motion.div>
              ))}
        </div>
      )}
    </motion.div>
  );
}
