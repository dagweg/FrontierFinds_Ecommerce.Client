"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { motion } from "motion/react";
import { Tag, Plus, ChevronsUpDown, X } from "lucide-react";
import React, { useEffect } from "react";
import { ChooseSubcategoryComboboxProps } from "./types";

export function ChooseSubcategoryCombobox({
  categories,
  selectedParentCategories,
  selectedSubCategories,
  setSelectedSubCategories,
  onSubcategoriesChange,
  initialSubcategories,
  allCategoriesList,
}: ChooseSubcategoryComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const subCategories = categories
    .filter((p) => selectedParentCategories.includes(p.id))
    .flatMap((x) => x.subCategories);

  const handleSubcategorySelect = (subcategoryId: number) => {
    setSelectedSubCategories((currentValues) =>
      currentValues.includes(subcategoryId)
        ? currentValues.filter((v) => v !== subcategoryId)
        : [...currentValues, subcategoryId]
    );
  };

  useEffect(() => {
    setSelectedSubCategories([]);
  }, [allCategoriesList, setSelectedSubCategories]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <Tag className="w-4 h-4" />
        Subcategories
      </Label>

      {/* Selected Subcategories */}
      {selectedSubCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {selectedSubCategories
            .map((id) =>
              allCategoriesList
                .flatMap((c) => c.subCategories)
                .find((subCat) => subCat.id === id && subCat.id !== null)
            )
            .filter(Boolean)
            .map((subcat) => (
              <Badge
                key={subcat?.id}
                variant="outline"
                className="px-3 py-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                onClick={() => handleSubcategorySelect(subcat?.id!)}
              >
                {subcat?.name}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
        </div>
      )}

      {/* Subcategory Selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Select subcategories...
            </span>
            <ChevronsUpDown className="w-4 h-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <Command>
            <CommandInput
              placeholder="Search subcategories..."
              className="h-12 border-none bg-transparent"
            />
            <CommandList className="max-h-64">
              {subCategories.length > 0 ? (
                <CommandGroup>
                  {subCategories
                    .filter((s) => !selectedSubCategories.includes(s.id))
                    .map((subcat) => (
                      <CommandItem
                        key={subcat.id}
                        onSelect={() => handleSubcategorySelect(subcat.id)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        {subcat.name}
                      </CommandItem>
                    ))}
                </CommandGroup>
              ) : (
                <CommandEmpty className="py-6 text-center text-gray-500">
                  No subcategories found.
                </CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </motion.div>
  );
}
