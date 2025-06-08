"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";
import { Images } from "lucide-react";
import { DragDropUpload } from "../DragDropUpload";
import { CreateListingForm, ValidationErrors, ImageFieldKey } from "../types";

interface ImagesStepProps {
  listing: CreateListingForm;
  setListing: React.Dispatch<React.SetStateAction<CreateListingForm>>;
  errors: ValidationErrors;
  onFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ImageFieldKey
  ) => void;
  onRemoveImage: (field: ImageFieldKey) => void;
}

export function ImagesStep({
  listing,
  setListing,
  errors,
  onFileChange,
  onRemoveImage,
}: ImagesStepProps) {
  const imageFields: Array<{
    key: ImageFieldKey;
    label: string;
    required: boolean;
    description: string;
  }> = [
    {
      key: "thumbnail",
      label: "Main Product Image",
      required: true,
      description: "This will be the primary image shown in listings",
    },
    {
      key: "frontImage",
      label: "Front View",
      required: false,
      description: "Front view of the product",
    },
    {
      key: "backImage",
      label: "Back View",
      required: false,
      description: "Back view of the product",
    },
    {
      key: "leftImage",
      label: "Left Side View",
      required: false,
      description: "Left side view of the product",
    },
    {
      key: "rightImage",
      label: "Right Side View",
      required: false,
      description: "Right side view of the product",
    },
    {
      key: "topImage",
      label: "Top View",
      required: false,
      description: "Top view of the product",
    },
    {
      key: "bottomImage",
      label: "Bottom View",
      required: false,
      description: "Bottom view of the product",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader className="flex flex-row items-center gap-2 pb-4">
          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
            <Images className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          </div>
          <CardTitle className="text-orange-700 dark:text-orange-300">
            Product Images
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-sm text-gray-600 dark:text-gray-400 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Image Guidelines
            </h3>
            <ul className="space-y-1 text-blue-700 dark:text-blue-300">
              <li>• Use high-quality images with good lighting</li>
              <li>• Show the product from multiple angles</li>
              <li>• Avoid watermarks or text overlays</li>
              <li>• Supported formats: PNG, JPG, WEBP (max 10MB)</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {imageFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <DragDropUpload
                  field={field.key}
                  label={field.label}
                  imageFile={listing[field.key].imageFile}
                  onFileChange={onFileChange}
                  onRemove={() => onRemoveImage(field.key)}
                  error={errors[field.key]?.[0]}
                  required={field.required}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {field.description}
                </p>
              </div>
            ))}
          </div>

          {/* Image Count Summary */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Required images:
                </span>
                <span className="ml-2 font-medium">
                  {
                    imageFields.filter(
                      (f) => f.required && listing[f.key].imageFile
                    ).length
                  }{" "}
                  / {imageFields.filter((f) => f.required).length}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Total images:
                </span>
                <span className="ml-2 font-medium">
                  {imageFields.filter((f) => listing[f.key].imageFile).length} /{" "}
                  {imageFields.length}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
