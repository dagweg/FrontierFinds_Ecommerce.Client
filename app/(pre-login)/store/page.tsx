"use client";

import {
  SearchSortBar,
  ActiveFilters,
  FilterSidebar,
  ProductGrid,
  StoreHeader,
} from "@/components/custom/store";
import { useStoreLogic } from "@/lib/hooks/useStoreLogic";

function StorePage() {
  const {
    page,
    isLoading,
    showFilters,
    products,
    categories,
    filters,
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
  } = useStoreLogic();
  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <StoreHeader />

        {/* Search and Filters Bar */}
        <SearchSortBar
          searchQuery={filters.searchQuery}
          sortBy={filters.sortBy}
          showFilters={showFilters}
          activeFiltersCount={getActiveFiltersCount()}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {/* Active Filters */}
        <ActiveFilters
          searchQuery={filters.searchQuery}
          selectedCategoryNames={getSelectedCategoryNames()}
          onRemoveSearch={() => handleSearchChange("")}
          onRemoveCategory={handleRemoveCategory}
          onClearAll={clearFilters}
        />

        <div className="flex flex-col xl:flex-row gap-6">
          {/* Sidebar Filters */}
          {showFilters && (
            <FilterSidebar
              categories={categories}
              selectedCategories={filters.selectedCategories}
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              onCategoryToggle={handleCategoryToggle}
              onMinPriceChange={handleMinPriceChange}
              onMaxPriceChange={handleMaxPriceChange}
            />
          )}

          {/* Main Content */}
          <ProductGrid
            isLoading={isLoading}
            products={products.products}
            totalCount={products.totalCount}
            totalFetchedCount={products.totalFetchedCount}
            showFilters={showFilters}
            currentPage={page}
            onPageChange={setPage}
            onClearFilters={clearFilters}
          />
        </div>
      </div>
    </section>
  );
}

export default StorePage;
