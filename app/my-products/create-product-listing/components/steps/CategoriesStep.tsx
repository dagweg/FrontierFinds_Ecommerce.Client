"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";
import { Package } from "lucide-react";
import { CategoryResult } from "@/types/product.types";
import { CategorySelector } from "../CategorySelector";
import { ChooseSubcategoryCombobox } from "../SubcategoryCombobox";
import { TagsInput } from "../TagsInput";
import { CreateListingForm, ValidationErrors } from "../types";
import React from "react";

interface CategoriesStepProps {
  listing: CreateListingForm;
  setListing: React.Dispatch<React.SetStateAction<CreateListingForm>>;
  errors: ValidationErrors;
  allCategories: CategoryResult[];
  selectedCategories: CategoryResult[];
  subCategories: number[];
  setSubCategories: React.Dispatch<React.SetStateAction<number[]>>;
  onCategoryChange: (categoryName: string, isChecked: boolean) => void;
  onSubcategoriesChange: (subcategoryIds: number[]) => void;
}

export function CategoriesStep({
  listing,
  setListing,
  errors,
  allCategories,
  selectedCategories,
  subCategories,
  setSubCategories,
  onCategoryChange,
  onSubcategoriesChange,
}: CategoriesStepProps) {
  const handleTagsChange = (tags: string[]) => {
    setListing((prev) => ({
      ...prev,
      tags,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader className="flex flex-row items-center gap-2 pb-4">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <Package className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <CardTitle className="text-purple-700 dark:text-purple-300">
            Categories & Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Categories */}
          <CategorySelector
            categories={allCategories}
            selectedCategories={selectedCategories}
            onCategoryChange={onCategoryChange}
            error={errors.Categories?.[0]}
          />

          {/* Subcategories */}
          {selectedCategories.length > 0 && (
            <ChooseSubcategoryCombobox
              categories={allCategories}
              selectedParentCategories={selectedCategories.map((cat) => cat.id)}
              selectedSubCategories={subCategories}
              setSelectedSubCategories={setSubCategories}
              onSubcategoriesChange={onSubcategoriesChange}
              initialSubcategories={[]}
              allCategoriesList={allCategories}
            />
          )}

          {/* Tags */}
          <TagsInput
            tags={listing.tags}
            onTagsChange={handleTagsChange}
            error={errors.Tags?.[0]}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
