"use client";

import React, {
  useState,
  useCallback,
  useLayoutEffect,
  useEffect,
} from "react";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle,
  FileText,
  DollarSign,
  Package,
  Images,
  Eye,
  ArrowRight,
  Trash,
  ShoppingCart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Import components
import {
  CreateListingForm,
  ValidationErrors,
  Step,
  ImageFieldKey,
  CategoriesResult,
} from "./components/types";
import { StepNavigation } from "./components/StepNavigation";
import { ProductPreview } from "./components/ProductPreview";
import { validateForm, createFormData } from "./components/utils";

// Import step components
import { BasicInfoStep } from "./components/steps/BasicInfoStep";
import { PricingStep } from "./components/steps/PricingStep";
import { CategoriesStep } from "./components/steps/CategoriesStep";
import { ImagesStep } from "./components/steps/ImagesStep";

const emptyListing: CreateListingForm = {
  productName: "",
  productDescription: "",
  stockQuantity: 1,
  priceValueInCents: 0,
  priceCurrency: "USD",
  thumbnail: { imageFile: undefined },
  leftImage: { imageFile: undefined },
  rightImage: { imageFile: undefined },
  frontImage: { imageFile: undefined },
  backImage: { imageFile: undefined },
  topImage: { imageFile: undefined },
  bottomImage: { imageFile: undefined },
  categories: [],
  tags: [],
};

function CreateProductListingPage() {
  const env = useEnvStore();
  const router = useRouter();

  const [listing, setListing] = useState<CreateListingForm>(emptyListing);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [subCategories, setSubcategories] = useState<number[]>([]);

  let validImageTypes: string[] = [];
  // Steps configuration
  const steps = [
    {
      id: 1,
      title: "Basic Info",
      icon: FileText,
      description: "Product name and description",
    },
    {
      id: 2,
      title: "Pricing",
      icon: DollarSign,
      description: "Set price and inventory",
    },
    {
      id: 3,
      title: "Categories",
      icon: Package,
      description: "Choose categories and tags",
    },
    {
      id: 4,
      title: "Images",
      icon: Images,
      description: "Upload product images",
    },
    { id: 5, title: "Review", icon: Eye, description: "Review and publish" },
  ];

  const totalSteps = steps.length;

  // Step Navigation
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

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
          console.log("Categories fetched and set", initialCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
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
        e.target.value = "";
        return;
      }

      setListing((prev) => ({
        ...prev,
        [field]: { imageFile: file },
      }));
      setErrors((prev) => ({ ...prev, [field]: [] }));
    }
  };

  const handleRemoveImage = (field: ImageFieldKey) => {
    setListing((prev) => ({
      ...prev,
      [field]: { imageFile: undefined },
    }));
    setErrors((prev) => ({ ...prev, [field]: [] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(listing);
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (!validateForm(listing, setErrors)) {
      setIsSubmitting(false);
      return;
    }

    const formData = createFormData(listing, allCategories, subCategories);

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
        });
      } else {
        toast("Product has been created", {
          description: "Product created successfully",
          icon: <CheckCircle size={24} />,
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
      `handleCategoryChange - Category: ${categoryName}, Checked: ${isChecked}`
    );

    // Update allCategories state
    const updatedAllCategories = allCategories.map((cat) => {
      if (cat.name === categoryName) {
        return { ...cat, checked: isChecked };
      }
      return cat;
    });
    setAllCategories(updatedAllCategories);

    // Directly derive selected category IDs from the updatedAllCategories
    const selectedCategoryIds: number[] = [];
    updatedAllCategories.forEach((cat) => {
      if (cat.checked) {
        selectedCategoryIds.push(cat.id);
        if (cat.subCategories) {
          cat.subCategories.forEach((subCat: any) => {
            selectedCategoryIds.push(subCat.id);
          });
        }
      }
    });

    setListing((prevListing) => {
      const newListing = { ...prevListing, categories: selectedCategoryIds };
      console.log("setListing - categories:", newListing.categories);
      return newListing;
    });
  };

  // Use useCallback for onSubcategoriesChange
  const handleSubcategoriesChange = useCallback(
    (subcategoryIds: number[]) => {
      console.log(
        "handleSubcategoriesChange - subcategoryIds:",
        subcategoryIds
      );
      setListing((prevListing) => {
        const newCategories = [
          ...prevListing.categories.filter(
            (catId) =>
              !allCategories
                .flatMap((c) => c.subCategories)
                .map((sc: any) => sc.id)
                .includes(catId)
          ),
          ...subcategoryIds,
        ];
        const newListing = { ...prevListing, categories: newCategories };
        console.log(
          "setListing - categories (from subcategories):",
          newListing.categories
        );
        return newListing;
      });
    },
    [allCategories]
  );

  const handleSubmitWrapper = () => {
    const mockEvent = { preventDefault: () => {} } as React.FormEvent;
    handleSubmit(mockEvent);
  };

  // Get selected categories for display
  const selectedCategories = allCategories.filter((cat) => cat.checked);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Toaster />

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Create Product Listing
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Add your product to reach thousands of potential buyers
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                Step {currentStep} of {totalSteps}
              </Badge>
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          </div>{" "}
          {/* Step Navigation */}
          <div className="mt-8">
            <StepNavigation
              steps={steps}
              currentStep={currentStep}
              onStepChange={goToStep}
              canGoNext={currentStep < totalSteps}
              canGoPrev={currentStep > 1}
              onNext={nextStep}
              onPrev={prevStep}
              isLastStep={currentStep === totalSteps}
              onSubmit={handleSubmitWrapper}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-8"
              >
                <BasicInfoStep
                  listing={listing}
                  setListing={setListing}
                  errors={errors}
                />
              </motion.div>
            )}

            {/* Step 2: Pricing */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-8"
              >
                <PricingStep
                  listing={listing}
                  setListing={setListing}
                  errors={errors}
                />
              </motion.div>
            )}

            {/* Step 3: Categories */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-8"
              >
                {" "}
                <CategoriesStep
                  listing={listing}
                  setListing={setListing}
                  errors={errors}
                  allCategories={allCategories}
                  selectedCategories={selectedCategories}
                  subCategories={subCategories}
                  setSubCategories={setSubcategories}
                  onCategoryChange={handleCategoryChange}
                  onSubcategoriesChange={handleSubcategoriesChange}
                />
              </motion.div>
            )}

            {/* Step 4: Images */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-8"
              >
                {" "}
                <ImagesStep
                  listing={listing}
                  setListing={setListing}
                  errors={errors}
                  onFileChange={handleFileChange}
                  onRemoveImage={handleRemoveImage}
                />
              </motion.div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-8"
              >
                {" "}
                <ProductPreview
                  listing={listing}
                  selectedCategories={selectedCategories}
                  subCategories={subCategories}
                  allCategories={allCategories}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 h-12 px-6"
            >
              Previous
            </Button>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setListing(emptyListing)}
                className="h-12 px-6 text-gray-600 hover:text-red-600"
              >
                Clear All
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 h-12 px-8 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish Product"
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProductListingPage;
