"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ActiveFiltersProps {
  searchQuery: string;
  selectedCategoryNames: string[];
  onRemoveSearch: () => void;
  onRemoveCategory: (categoryName: string) => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  searchQuery,
  selectedCategoryNames,
  onRemoveSearch,
  onRemoveCategory,
  onClearAll,
}: ActiveFiltersProps) {
  const hasActiveFilters = searchQuery || selectedCategoryNames.length > 0;

  if (!hasActiveFilters) return null;

  return (
    <div className="mt-4 flex items-center gap-2 flex-wrap">
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Active filters:
      </span>

      {searchQuery && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Search: "{searchQuery}"
          <X className="w-3 h-3 cursor-pointer" onClick={onRemoveSearch} />
        </Badge>
      )}

      {selectedCategoryNames.map((categoryName) => (
        <Badge
          key={categoryName}
          variant="secondary"
          className="flex items-center gap-1"
        >
          {categoryName}
          <X
            className="w-3 h-3 cursor-pointer"
            onClick={() => onRemoveCategory(categoryName)}
          />
        </Badge>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-xs"
      >
        Clear all
      </Button>
    </div>
  );
}
