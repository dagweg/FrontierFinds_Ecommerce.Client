"use client";

import { motion } from "framer-motion";
import ProductCard, {
  ProductCardLoader,
} from "@/components/custom/product-card";
import { PaginationGenerator } from "@/components/custom/pagination-generator";
import { EmptyState } from "@/components/custom/empty-state";
import { ProductResult } from "@/types/product.types";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  isLoading: boolean;
  products: ProductResult[];
  totalCount: number;
  totalFetchedCount: number;
  showFilters: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

export function ProductGrid({
  isLoading,
  products,
  totalCount,
  totalFetchedCount,
  showFilters,
  currentPage,
  onPageChange,
  onClearFilters,
}: ProductGridProps) {
  const pageSize = 12;

  // Results Info
  const resultsInfo = isLoading
    ? "Loading products..."
    : `Showing ${totalFetchedCount} of ${totalCount} products`;

  // Grid classes based on filter visibility
  const gridClasses = cn(
    "grid gap-4 md:gap-6",
    showFilters
      ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 "
      : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 "
  );

  return (
    <div className="flex-1 min-w-0">
      {/* Results Info */}
      <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        {resultsInfo}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className={gridClasses}>
          {Array.from({ length: pageSize }).map((_, i) => (
            <ProductCardLoader key={i} variant="compact" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState type="products" onAction={onClearFilters} />
      ) : (
        <>
          <motion.div
            className={gridClasses}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <ProductCard productResult={product} variant="compact" />
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalCount > pageSize && (
            <div className="mt-8 flex justify-center">
              <PaginationGenerator
                currentPage={currentPage}
                totalPages={Math.ceil(totalCount / pageSize)}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
