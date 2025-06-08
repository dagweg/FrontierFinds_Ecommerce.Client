// Utility functions for the create product listing feature

import { CreateListingForm, ValidationErrors } from "./types";

export const validateForm = (
  listing: CreateListingForm,
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>
): boolean => {
  const newErrors: ValidationErrors = {};

  if (!listing.productName.trim()) {
    newErrors.ProductName = ["The ProductName field is required."];
  }
  if (!listing.productDescription.trim()) {
    newErrors.ProductDescription = [
      "The ProductDescription field is required.",
    ];
  }
  if (listing.stockQuantity < 1) {
    newErrors.StockQuantity = ["Stock quantity must be greater than 1"];
  }
  if (listing.priceValueInCents <= 1) {
    newErrors.PriceValueInCents = ["Price value must be greater than 1"];
  }
  if (!listing.priceCurrency) {
    newErrors.PriceCurrency = ["The PriceCurrency field is required."];
  }
  if (!listing.thumbnail.imageFile) {
    newErrors.Thumbnail = ["The Thumbnail field is required."];
  }
  if (listing.categories.length === 0) {
    newErrors.Categories = [
      "At least one Category or Subcategory is required.",
    ];
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

export const createFormData = (
  listing: CreateListingForm,
  allCategories: any[],
  subCategories: number[]
) => {
  const formData = new FormData();
  formData.append("productName", listing.productName);
  formData.append("productDescription", listing.productDescription);
  formData.append("stockQuantity", listing.stockQuantity.toString());
  formData.append("priceValueInCents", listing.priceValueInCents.toString());
  formData.append("priceCurrency", listing.priceCurrency);

  if (listing.thumbnail.imageFile) {
    formData.append("thumbnail.imageFile", listing.thumbnail.imageFile);
  }

  // Add categories
  allCategories
    .filter((x) => x.checked)
    .map((x) => x.id)
    .concat(subCategories)
    .forEach((categoryId) =>
      formData.append("categories[]", categoryId.toString())
    );

  // Add tags
  listing.tags.forEach((t) => formData.append("tags[]", t));

  // Add optional images
  const optionalImages = [
    "leftImage",
    "rightImage",
    "frontImage",
    "backImage",
    "topImage",
    "bottomImage",
  ];

  optionalImages.forEach((field) => {
    const imageFile = listing[field as keyof CreateListingForm] as any;
    if (imageFile?.imageFile) {
      formData.append(`${field}.imageFile`, imageFile.imageFile);
    }
  });

  return formData;
};

export const isValidImageType = (
  file: File,
  validImageTypes: string[]
): boolean => {
  return validImageTypes.length === 0 || validImageTypes.includes(file.type);
};

export const getImageTypeError = (
  file: File,
  validImageTypes: string[]
): string => {
  return `Unsupported file type: ${
    file.type.split("/")[1]
  }. Please upload a supported image: ${validImageTypes
    .map((i) => i.split("/")[1])
    .join(", ")}`;
};
