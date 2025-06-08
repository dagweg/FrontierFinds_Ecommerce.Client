"use client";

import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CategoryResult } from "@/types/product.types";

interface FilterSidebarProps {
  categories: CategoryResult[];
  selectedCategories: number[];
  minPrice: number;
  maxPrice: number;
  onCategoryToggle: (categoryId: number) => void;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
}

export function FilterSidebar({
  categories,
  selectedCategories,
  minPrice,
  maxPrice,
  onCategoryToggle,
  onMinPriceChange,
  onMaxPriceChange,
}: FilterSidebarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full xl:w-64 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm h-fit xl:sticky xl:top-4"
    >
      <h3 className="font-semibold mb-4">Filters</h3>

      {/* Categories */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-3 block">Categories</Label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => onCategoryToggle(category.id)}
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="text-sm cursor-pointer"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-3 block">
          Price Range ($)
        </Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice || ""}
            onChange={(e) => onMinPriceChange(Number(e.target.value) || 0)}
            className="w-20"
          />
          <span className="self-center">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice || ""}
            onChange={(e) => onMaxPriceChange(Number(e.target.value) || 1000)}
            className="w-20"
          />
        </div>
      </div>
    </motion.div>
  );
}
