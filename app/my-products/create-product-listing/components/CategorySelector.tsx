"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Package, X, AlertCircle } from "lucide-react";
import { CategorySelectorProps } from "./types";

export function CategorySelector({
  categories,
  selectedCategories,
  onCategoryChange,
  error,
}: CategorySelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Package className="w-4 h-4" />
          Categories <span className="text-red-500">*</span>
        </Label>
        {selectedCategories.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              selectedCategories.forEach((cat) =>
                onCategoryChange(cat.name, false)
              );
            }}
            className="text-gray-500 hover:text-red-500"
          >
            <X className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Selected Categories */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {selectedCategories.map((category) => (
            <Badge
              key={category.id}
              variant="secondary"
              className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer transition-colors"
              onClick={() => onCategoryChange(category.name, false)}
            >
              {category.name}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
        {categories
          .filter((cat) => cat.parentId === null)
          .map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer",
                category.checked
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
              )}
              onClick={() => onCategoryChange(category.name, !category.checked)}
            >
              <Checkbox
                checked={category.checked}
                onCheckedChange={(checked) =>
                  onCategoryChange(category.name, checked === true)
                }
                className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
              <Label className="flex-1 cursor-pointer text-sm font-medium">
                {category.name}
              </Label>
            </motion.div>
          ))}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-red-500 text-sm flex items-center gap-1"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
