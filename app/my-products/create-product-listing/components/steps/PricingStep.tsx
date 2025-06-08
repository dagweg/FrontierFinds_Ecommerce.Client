"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LabelInputContainer } from "@/components/ui/label-input-container";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "motion/react";
import { DollarSign } from "lucide-react";
import { CreateListingForm, ValidationErrors } from "../types";

interface PricingStepProps {
  listing: CreateListingForm;
  setListing: React.Dispatch<React.SetStateAction<CreateListingForm>>;
  errors: ValidationErrors;
}

export function PricingStep({ listing, setListing, errors }: PricingStepProps) {
  const formatPriceDisplay = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  const handlePriceChange = (value: string) => {
    const numericValue = parseFloat(value) || 0;
    const cents = Math.round(numericValue * 100);
    setListing((prev) => ({
      ...prev,
      priceValueInCents: cents,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader className="flex flex-row items-center gap-2 pb-4">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-green-700 dark:text-green-300">
            Pricing & Inventory
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LabelInputContainer error={errors.PriceValueInCents?.[0]}>
              <Label htmlFor="price" className="text-base font-medium">
                Price <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="h-12 text-base pl-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
                  value={formatPriceDisplay(listing.priceValueInCents)}
                  onChange={(e) => handlePriceChange(e.target.value)}
                />
              </div>
            </LabelInputContainer>

            <LabelInputContainer error={errors.PriceCurrency?.[0]}>
              <Label htmlFor="currency" className="text-base font-medium">
                Currency <span className="text-red-500">*</span>
              </Label>
              <Select
                value={listing.priceCurrency}
                onValueChange={(value) =>
                  setListing((prev) => ({
                    ...prev,
                    priceCurrency: value,
                  }))
                }
              >
                <SelectTrigger className="h-12 text-base bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD (C$)</SelectItem>
                </SelectContent>
              </Select>
            </LabelInputContainer>

            <LabelInputContainer error={errors.StockQuantity?.[0]}>
              <Label htmlFor="stock" className="text-base font-medium">
                Stock Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="stock"
                type="number"
                min="1"
                placeholder="1"
                className="h-12 text-base bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
                value={listing.stockQuantity}
                onChange={(e) =>
                  setListing((prev) => ({
                    ...prev,
                    stockQuantity: parseInt(e.target.value) || 1,
                  }))
                }
              />
            </LabelInputContainer>
          </div>

          {/* Price Preview */}
          {listing.priceValueInCents > 0 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price Preview
              </h3>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: listing.priceCurrency || "USD",
                }).format(listing.priceValueInCents / 100)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
