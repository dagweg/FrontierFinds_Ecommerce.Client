"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CategoryResult } from "@/types/product.types";
import {
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "cmdk";
import { ChevronsUpDown, Command } from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

interface ChooseSubcategoryComboboxProps {
  categories: CategoryResult[];
  selectedParentCategories: number[];
  selectedSubCategories: number[];
  setSelectedSubCategories: Dispatch<SetStateAction<number[]>>;
  onSubcategoriesChange: (subcategoryIds: number[]) => void;
  initialSubcategories: number[];
  allCategoriesList: CategoryResult[];
}

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
  const [subCategories, setSubCategories] = useState<CategoryResult[]>([]);

  const handleSubcategorySelect = (subcategoryId: number) => {
    setSelectedSubCategories((currentValues) =>
      currentValues.includes(subcategoryId)
        ? currentValues.filter((v) => v !== subcategoryId)
        : [...currentValues, subcategoryId]
    );
  };

  useEffect(() => {
    setSubCategories(
      categories
        .filter((p) => selectedParentCategories.includes(p.id))
        .flatMap((x) => x.subCategories)
    );
  }, []);

  useEffect(() => {
    setSelectedSubCategories([]);
  }, [allCategoriesList]);

  return (
    <div className="flex flex-col gap-3">
      <div className="space-y-1 max-w-full">
        {selectedSubCategories.length > 0 &&
          selectedSubCategories
            .map((id) =>
              allCategoriesList
                .flatMap((c) => c.subCategories)
                .find((subCat) => subCat.id === id && subCat.id !== null)
            )
            .map((c) => (
              <div
                className="inline-block mx-1 ring-2 ring-transparent hover:opacity-25 bg-black text-white px-4 h-6 cursor-pointer rounded-full "
                onClick={() => handleSubcategorySelect(c?.id!)}
              >
                {c?.name}
              </div>
            ))}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] justify-between"
          >
            Select subcategories...
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search subcategory..." className="h-9" />
            <CommandList>
              {subCategories.length > 0 ? (
                subCategories
                  .filter((s) => !selectedSubCategories.includes(s.id))
                  .map((s) => (
                    <CommandItem onSelect={() => handleSubcategorySelect(s.id)}>
                      {s.name}
                    </CommandItem>
                  ))
              ) : (
                <CommandEmpty>No subcategory found.</CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
