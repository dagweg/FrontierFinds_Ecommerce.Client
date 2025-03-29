"use client";

import Title from "@/components/custom/title";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LabelInputContainer } from "@/components/ui/label-input-container";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronsUpDown, Check, Trash, Router } from "lucide-react";
import Image from "next/image";
import React, {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
  useLayoutEffect,
} from "react"; // Import useCallback
import { Button } from "@/components/ui/button";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
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
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { toast, Toaster, useSonner } from "sonner";
import { useRouter } from "next/navigation";
import { IconCancel } from "@tabler/icons-react";
import { ChooseSubcategoryCombobox } from "@/app/my-products/create-product-listing/choose-subcategory-combobox";

interface CreateImageRequest {
  imageFile?: File;
}

interface CreateListingForm {
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
  categories: number[]; // Changed to array of category IDs
  tags: string[];
}

type ImageFieldKey =
  | "thumbnail"
  | "leftImage"
  | "rightImage"
  | "frontImage"
  | "backImage"
  | "topImage"
  | "bottomImage";

interface ValidationErrors {
  [key: string]: string[];
}

export interface CategoryResult {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  subCategories: CategoryResult[];
  checked: boolean;
  expanded: boolean;
  isActive: boolean;
}

export interface CategoriesResult {
  categories: CategoryResult[];
}

const emptyListing: CreateListingForm = {
  productName: "",
  productDescription: "",
  stockQuantity: 1,
  priceValueInCents: 0,
  priceCurrency: "ETB",
  thumbnail: { imageFile: undefined },
  leftImage: { imageFile: undefined },
  rightImage: { imageFile: undefined },
  frontImage: { imageFile: undefined },
  backImage: { imageFile: undefined },
  topImage: { imageFile: undefined },
  bottomImage: { imageFile: undefined },
  categories: [], // categories will store IDs of categories and subcategories
  tags: [],
};

function CreateProductListingPage() {
  const env = useEnvStore();

  const [listing, setListing] = useState<CreateListingForm>(emptyListing);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [allCategories, setAllCategories] = useState<CategoryResult[]>([]);
  const [subCategories, setSubcategories] = useState<number[]>([]);

  const router = useRouter();

  let validImageTypes: string[] = [];

  useLayoutEffect(() => {
    const fetchImageMimes = async () => {
      const r = await fetch(`${env.apiBaseUrl}/images/mimes/supported`, {
        method: "GET",
        credentials: "include",
      });

      const b = await r.json();
      console.log(b);

      if (r.ok) {
        validImageTypes = b;
      } else {
        console.log("failed trying to get image mimes from server.");
      }
    };

    fetchImageMimes();
  });

  useEffect(() => {
    console.log(
      "CreateProductListingPage: useEffect [env.apiBaseUrl] - Fetching Categories"
    );
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${env.apiBaseUrl}/products/categories`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: CategoriesResult = await response.json();
        if (data && data.categories) {
          const initialCategories = data.categories.map((cat) => ({
            ...cat,
          }));
          setAllCategories(initialCategories);
          console.log(
            "CreateProductListingPage: Categories fetched and set",
            initialCategories
          );
        }
      } catch (error) {
        console.error(
          "CreateProductListingPage: Failed to fetch categories:",
          error
        );
      }
    };

    fetchCategories();
  }, [env.apiBaseUrl]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ImageFieldKey
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Check if the file's MIME type is in the validImageTypes array
      if (validImageTypes.length > 0 && !validImageTypes.includes(file.type)) {
        // File type is not supported
        let errmsg = `Unsupported file type: ${
          file.type.split("/")[1]
        }. Please upload a supported image: ${validImageTypes
          .map((i) => i.split("/")[1])
          .join(", ")}`;
        console.log(errmsg);
        setErrors((prev) => ({
          ...prev,
          [field]: [errmsg],
        }));
        e.target.value = ""; // Clear the input field
        return; // Exit early if the file type is invalid
      }

      setListing((prev) => ({
        ...prev,
        [field]: { imageFile: file },
      }));
      setErrors((prev) => ({ ...prev, [field]: [] }));
    }
  };

  const getImagePreview = (imageFile?: File) => {
    return imageFile ? URL.createObjectURL(imageFile) : "";
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {};

    // if (!listing.productName.trim()) {
    //   newErrors.ProductName = ["The ProductName field is required."];
    // }
    // if (!listing.productDescription.trim()) {
    //   newErrors.ProductDescription = [
    //     "The ProductDescription field is required.",
    //   ];
    // }
    // if (listing.stockQuantity < 1) {
    //   newErrors.StockQuantity = ["Stock quantity must be greater than 1"];
    // }
    // if (listing.priceValueInCents <= 1) {
    //   newErrors.PriceValueInCents = ["Price value must be greater than 1"];
    // }
    // if (!listing.priceCurrency) {
    //   newErrors.PriceCurrency = ["The PriceCurrency field is required."];
    // }
    // if (!listing.thumbnail.imageFile) {
    //   newErrors.Thumbnail = ["The Thumbnail field is required."];
    // }
    // if (listing.categories.length === 0) {
    //   newErrors.Categories = [
    //     "At least one Category or Subcategory is required.",
    //   ];
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(listing);
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("productName", listing.productName);
    formData.append("productDescription", listing.productDescription);
    formData.append("stockQuantity", listing.stockQuantity.toString());
    formData.append("priceValueInCents", listing.priceValueInCents.toString());
    formData.append("priceCurrency", listing.priceCurrency);
    if (listing.thumbnail.imageFile) {
      formData.append("thumbnail.imageFile", listing.thumbnail.imageFile);
    }

    allCategories
      .filter((x) => x.checked)
      .map((x) => x.id)
      .concat(subCategories)
      .forEach((categoryId) =>
        formData.append("categories[]", categoryId.toString())
      );

    listing.tags.forEach((t) => formData.append("tags[]", t));

    // Add optional images if they exist
    const optionalImages: ImageFieldKey[] = [
      "leftImage",
      "rightImage",
      "frontImage",
      "backImage",
      "topImage",
      "bottomImage",
    ];
    optionalImages.forEach((field) => {
      formData.append(`${field}.imageFile`, listing[field].imageFile!);
    });

    console.log(formData);
    try {
      const response = await fetch(`${env.apiBaseUrl}/products`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const body = await response.json();
      if (!response.ok) {
        setErrors(body.errors || {});
        console.log(body);
        console.log("ERROR OCCURED");
        toast("An error occured", {
          description: body.detail,
          icon: <IconCancel size={24} />,
        });
      } else {
        // setListing(emptyListing);
        toast("Product has been created", {
          description: "Product created successfully",
          icon: <Check size={24} />,
          action: {
            label: "View Product",
            onClick: () => router.push(`/my-products/${body.slug}`),
          },
        });
        console.log("Product created successfully");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (categoryName: string, isChecked: boolean) => {
    console.log(
      `CreateProductListingPage: handleCategoryChange - Category: ${categoryName}, Checked: ${isChecked}`
    );

    // Update allCategories state
    const updatedAllCategories = allCategories.map((cat) => {
      if (cat.name === categoryName) {
        return { ...cat, checked: isChecked };
      }
      return cat;
    });
    setAllCategories(updatedAllCategories);
    console.log(
      "CreateProductListingPage: setAllCategories - updatedCategories:",
      updatedAllCategories
    );

    // Directly derive selected category IDs from the updatedAllCategories
    const selectedCategoryIds: number[] = [];
    updatedAllCategories.forEach((cat) => {
      // Use updatedAllCategories here
      if (cat.checked) {
        selectedCategoryIds.push(cat.id);
        if (cat.subCategories) {
          cat.subCategories.forEach((subCat) => {
            selectedCategoryIds.push(subCat.id);
          });
        }
      }
    });
    console.log(
      "CreateProductListingPage: Categories before setListing:",
      listing.categories,
      "New Categories to set:",
      selectedCategoryIds
    );
    setListing((prevListing) => {
      const newListing = { ...prevListing, categories: selectedCategoryIds };
      console.log(
        "CreateProductListingPage: setListing - categories:",
        newListing.categories
      );
      return newListing;
    });
  };

  // Use useCallback for onSubcategoriesChange
  const handleSubcategoriesChange = useCallback(
    (subcategoryIds: number[]) => {
      console.log(
        "CreateProductListingPage: handleSubcategoriesChange - subcategoryIds:",
        subcategoryIds
      );
      setListing((prevListing) => {
        const newCategories = [
          ...prevListing.categories.filter(
            (catId) =>
              !allCategories
                .flatMap((c) => c.subCategories)
                .map((sc) => sc.id)
                .includes(catId)
          ),
          ...subcategoryIds,
        ];
        const newListing = { ...prevListing, categories: newCategories };
        console.log(
          "CreateProductListingPage: setListing - categories (from subcategories):",
          newListing.categories
        );
        return newListing;
      });
    },
    [allCategories]
  ); // Dependencies for useCallback -  `allCategories` might be needed if filtering logic relies on it.

  return (
    <section className="h-screen min-h-fit bg-white p-8">
      <Toaster />
      <div className="max-w-[1800px] mx-auto p-4 flex flex-col">
        <Title text="Create Product Listing" className="text-3xl" />
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <LabelInputContainer className="mb-4" error={errors.ProductName?.[0]}>
            <Label htmlFor="productName">Product Name *</Label>
            <Input
              id="productName"
              placeholder="Lenovo Legion 5 Gaming Laptop"
              type="text"
              className="w-[500px]"
              value={listing.productName}
              onChange={(e) =>
                setListing((prev) => ({ ...prev, productName: e.target.value }))
              }
            />
          </LabelInputContainer>

          <LabelInputContainer
            className="mb-4"
            error={errors.ProductDescription?.[0]}
          >
            <Label htmlFor="productDescription">Product Description *</Label>
            <Textarea
              id="productDescription"
              placeholder="13th Gen Intel Core i7-13650HX..."
              className="h-[100px]"
              value={listing.productDescription}
              onChange={(e) =>
                setListing((prev) => ({
                  ...prev,
                  productDescription: e.target.value,
                }))
              }
            />
          </LabelInputContainer>

          <div className="inline-flex gap-5">
            <LabelInputContainer
              className="mb-4"
              error={errors.StockQuantity?.[0]}
            >
              <Label htmlFor="stockQuantity">Stock Quantity</Label>
              <Input
                id="stockQuantity"
                type="number"
                className="w-[100px]"
                value={listing.stockQuantity}
                onChange={(e) =>
                  setListing((prev) => ({
                    ...prev,
                    stockQuantity: Math.max(1, Number(e.target.value)),
                  }))
                }
              />
            </LabelInputContainer>
            <LabelInputContainer
              className="mb-4"
              error={errors.PriceValueInCents?.[0]}
            >
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                min={0}
                className="w-[200px]"
                value={listing.priceValueInCents / 100}
                onChange={(e) =>
                  setListing((prev) => ({
                    ...prev,
                    priceValueInCents: Math.max(
                      1,
                      Number(e.target.value) * 100
                    ),
                  }))
                }
              />
            </LabelInputContainer>
            <LabelInputContainer
              className="mb-4"
              error={errors.PriceCurrency?.[0]}
            >
              <Label htmlFor="priceCurrency">Price Currency</Label>
              <Select
                value={listing.priceCurrency}
                onValueChange={(value) =>
                  setListing((prev) => ({ ...prev, priceCurrency: value }))
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="ETB">ETB</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </LabelInputContainer>
          </div>

          {/* Categories Selection */}
          <div className="flex justify-start gap-3 items-center">
            <Label className="mb-2 block">Categories *</Label>
            <Trash
              size={15}
              onClick={() =>
                setAllCategories(
                  allCategories.map((c) => ({
                    ...c,
                    checked: false,
                  }))
                )
              }
            />
          </div>
          <div className="mb-4 grid grid-cols-3 gap-4 border rounded-md p-4">
            {allCategories
              .filter((cat) => cat.parentId === null)
              .map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={category.checked}
                    onCheckedChange={(checked: CheckedState) => {
                      handleCategoryChange(category.name, checked === true);
                    }}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            {errors.Categories &&
              errors.Categories.map((error, index) => (
                <p key={index} className="text-red-500 text-sm">
                  {error}
                </p>
              ))}
          </div>

          {/* Subcategories Selection */}
          <LabelInputContainer className="mb-4" error={errors.Categories?.[0]}>
            <div className="flex justify-start gap-3 items-center">
              <Label htmlFor="subcategories">Subcategories</Label>
              <Trash size={15} onClick={() => setSubcategories([])} />
            </div>
            <ChooseSubcategoryCombobox
              setSelectedSubCategories={setSubcategories}
              selectedSubCategories={subCategories}
              categories={allCategories}
              selectedParentCategories={allCategories
                .filter((cat) => cat.checked && cat.parentId === null)
                .map((cat) => cat.id)}
              onSubcategoriesChange={handleSubcategoriesChange} // Use useCallback function
              initialSubcategories={listing.categories.filter((catId) =>
                allCategories
                  .flatMap((c) => c.subCategories)
                  .map((sc) => sc.id)
                  .includes(catId)
              )}
              allCategoriesList={allCategories}
            />
            {errors.Categories &&
              errors.Categories.map((error, index) => (
                <p key={index} className="text-red-500 text-sm">
                  {error}
                </p>
              ))}
          </LabelInputContainer>

          {/* Thumbnail Image Upload */}
          <LabelInputContainer
            error={errors.Thumbnail?.[0]}
            className="my-6 w-[300px] h-[200px] relative"
          >
            <Label htmlFor="thumbnail">Thumbnail Image *</Label>
            {listing.thumbnail.imageFile ? (
              <>
                <div
                  onClick={() =>
                    setListing({
                      ...listing,
                      thumbnail: { imageFile: undefined },
                    })
                  }
                  className="absolute right-0 top-0 hover:bg-neutral-200 p-2 rounded-full cursor-pointer active:ring-2 ring-neutral-300"
                >
                  <Trash size={15} />
                </div>
                <Image
                  src={getImagePreview(listing.thumbnail.imageFile)}
                  width={300}
                  height={200}
                  alt="Thumbnail preview"
                  className="w-full h-full object-contain"
                />
              </>
            ) : (
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                className="w-full h-full"
                onChange={(e) => handleFileChange(e, "thumbnail")}
              />
            )}
          </LabelInputContainer>

          {/* Additional Images */}
          <div className="w-full overflow-scroll scrollbar-hide">
            <div className="flex gap-5 w-fit overflow-scroll">
              {(
                [
                  { id: "leftImage", label: "Left Image" },
                  { id: "rightImage", label: "Right Image" },
                  { id: "frontImage", label: "Front Image" },
                  { id: "backImage", label: "Back Image" },
                  { id: "topImage", label: "Top Image" },
                  { id: "bottomImage", label: "Bottom Image" },
                ] as const
              ).map((image) => (
                <LabelInputContainer
                  key={image.id}
                  error={errors[image.id]?.[0]}
                  className="my-6 w-[300px] h-[200px] relative"
                >
                  <Label htmlFor={image.id}>{image.label}</Label>
                  {listing[image.id].imageFile ? (
                    <>
                      <div
                        onClick={() =>
                          setListing({
                            ...listing,
                            [image.id]: { imageFile: undefined },
                          })
                        }
                        className="absolute right-0 top-0 hover:bg-neutral-200 p-2 rounded-full cursor-pointer active:ring-2 ring-neutral-300"
                      >
                        <Trash size={15} />
                      </div>
                      <Image
                        src={getImagePreview(listing[image.id].imageFile)}
                        width={300}
                        height={200}
                        alt={`${image.label} preview`}
                        className="w-full h-full object-contain"
                      />
                    </>
                  ) : (
                    <Input
                      id={image.id}
                      type="file"
                      accept="image/*"
                      className="w-full h-full"
                      onChange={(e) => handleFileChange(e, image.id)}
                    />
                  )}
                </LabelInputContainer>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex gap-3">
              <Label htmlFor="tags">Tags (Optional)</Label>{" "}
              <Trash
                size={15}
                onClick={() => setListing({ ...listing, tags: [] })}
              />
            </div>
            <br />
            {listing.tags.map((t) => (
              <div
                className="inline-block mx-1 ring-2 ring-transparent hover:opacity-25 bg-neutral-200  px-4 h-6 cursor-pointer rounded-md"
                onClick={() => {
                  setListing((prev) => ({
                    ...prev,
                    tags: prev.tags.filter((tag) => tag !== t),
                  }));
                }}
              >
                #{t}
              </div>
            ))}

            <LabelInputContainer
              error={errors.Tags?.[0]}
              className="my-6  relative"
            >
              <Input
                type="text"
                placeholder="Tags"
                onChange={(e) => {
                  if (e.target.value[e.target.value.length - 1] === ",") {
                    setListing((prev) => {
                      let tag = e.target.value
                        .slice(0, -1)
                        .trim()
                        .split(" ")
                        .join("-");
                      if (prev.tags.includes(tag)) return prev; // don't add duplicates
                      return {
                        ...prev,
                        tags: [...prev.tags, tag],
                      };
                    });
                    e.target.value = "";
                  }
                }}
              />
            </LabelInputContainer>
          </div>

          <div className="flex gap-3 justify-between items-center">
            <Button
              type="button"
              disabled={isSubmitting}
              className="w-[300px] p-5 self-start my-10 bg-neutral-200"
              variant={"secondary"}
              onClick={() => setListing(emptyListing)}
            >
              Clear
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-[300px] p-5 self-start my-10"
            >
              {isSubmitting ? "Submitting..." : "Submit Product"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CreateProductListingPage;
