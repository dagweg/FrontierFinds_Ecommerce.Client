// Types for the create product listing feature
import { CategoryResult } from "@/types/product.types";
import { Dispatch, SetStateAction } from "react";

export interface CreateImageRequest {
  imageFile?: File;
}

export interface CreateListingForm {
  productName: string;
  productDescription: string;
  stockQuantity: number;
  priceValueInCents: number;
  priceCurrency: string;
  thumbnail: CreateImageRequest;
  leftImage: CreateImageRequest;
  rightImage: CreateImageRequest;
  frontImage: CreateImageRequest;
  backImage: CreateImageRequest;
  topImage: CreateImageRequest;
  bottomImage: CreateImageRequest;
  categories: number[];
  tags: string[];
}

export type ImageFieldKey =
  | "thumbnail"
  | "leftImage"
  | "rightImage"
  | "frontImage"
  | "backImage"
  | "topImage"
  | "bottomImage";

export interface ValidationErrors {
  [key: string]: string[];
}

export interface DragDropUploadProps {
  field: ImageFieldKey;
  label: string;
  imageFile?: File;
  onFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ImageFieldKey
  ) => void;
  onRemove: () => void;
  error?: string;
  required?: boolean;
}

export interface CategorySelectorProps {
  categories: CategoryResult[];
  selectedCategories: CategoryResult[];
  onCategoryChange: (categoryName: string, isChecked: boolean) => void;
  error?: string;
}

export interface ChooseSubcategoryComboboxProps {
  categories: CategoryResult[];
  selectedParentCategories: number[];
  selectedSubCategories: number[];
  setSelectedSubCategories: Dispatch<SetStateAction<number[]>>;
  onSubcategoriesChange: (subcategoryIds: number[]) => void;
  initialSubcategories: number[];
  allCategoriesList: CategoryResult[];
}

export interface TagsInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  error?: string;
}

export interface Step {
  id: number;
  title: string;
  icon: any;
  description: string;
}

export interface CategoriesResult {
  categories: CategoryResult[];
}
