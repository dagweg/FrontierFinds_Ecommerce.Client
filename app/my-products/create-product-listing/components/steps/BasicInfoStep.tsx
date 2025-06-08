"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LabelInputContainer } from "@/components/ui/label-input-container";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "motion/react";
import { FileText } from "lucide-react";
import { CreateListingForm, ValidationErrors } from "../types";

interface BasicInfoStepProps {
  listing: CreateListingForm;
  setListing: React.Dispatch<React.SetStateAction<CreateListingForm>>;
  errors: ValidationErrors;
}

export function BasicInfoStep({
  listing,
  setListing,
  errors,
}: BasicInfoStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader className="flex flex-row items-center gap-2 pb-4">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-blue-700 dark:text-blue-300">
            Basic Product Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <LabelInputContainer error={errors.ProductName?.[0]}>
            <Label htmlFor="productName" className="text-base font-medium">
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="productName"
              placeholder="e.g., Lenovo Legion 5 Gaming Laptop"
              type="text"
              className="h-12 text-base bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
              value={listing.productName}
              onChange={(e) =>
                setListing((prev) => ({
                  ...prev,
                  productName: e.target.value,
                }))
              }
            />
          </LabelInputContainer>

          <LabelInputContainer error={errors.ProductDescription?.[0]}>
            <Label
              htmlFor="productDescription"
              className="text-base font-medium"
            >
              Product Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="productDescription"
              placeholder="Describe your product in detail. Include key features, specifications, condition, and any other relevant information..."
              className="min-h-32 text-base bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 resize-none"
              value={listing.productDescription}
              onChange={(e) =>
                setListing((prev) => ({
                  ...prev,
                  productDescription: e.target.value,
                }))
              }
            />
          </LabelInputContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
