"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import {
  Eye,
  Package,
  DollarSign,
  Tag,
  Images,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import { CreateListingForm, ImageFieldKey } from "./types";
import { CategoryResult } from "@/types/product.types";

interface ProductPreviewProps {
  listing: CreateListingForm;
  selectedCategories: CategoryResult[];
  subCategories: number[];
  allCategories: CategoryResult[];
}

export function ProductPreview({
  listing,
  selectedCategories,
  subCategories,
  allCategories,
}: ProductPreviewProps) {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: listing.priceCurrency || "USD",
    }).format(cents / 100);
  };

  const getSelectedSubcategories = () => {
    return subCategories
      .map((id) =>
        allCategories
          .flatMap((c) => c.subCategories)
          .find((subCat) => subCat.id === id)
      )
      .filter(Boolean);
  };

  const getAdditionalImages = () => {
    const imageFields: ImageFieldKey[] = [
      "leftImage",
      "rightImage",
      "frontImage",
      "backImage",
      "topImage",
      "bottomImage",
    ];

    return imageFields.map((field) => listing[field].imageFile).filter(Boolean);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader className="flex flex-row items-center gap-2 pb-4">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-green-700 dark:text-green-300">
            Product Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Title and Description */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {listing.productName || "Product Name"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {listing.productDescription || "Product description..."}
            </p>
          </div>

          {/* Price and Stock */}
          <div className="flex items-center gap-4 text-lg">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatPrice(listing.priceValueInCents)}
            </span>
            <Badge variant="outline" className="text-sm">
              {listing.stockQuantity} in stock
            </Badge>
          </div>

          {/* Main Image */}
          {listing.thumbnail.imageFile && (
            <div className="relative h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <Image
                src={URL.createObjectURL(listing.thumbnail.imageFile)}
                alt="Product thumbnail"
                fill
                className="object-contain"
              />
              <Badge className="absolute top-2 left-2 bg-blue-500">
                Main Image
              </Badge>
            </div>
          )}

          {/* Additional Images */}
          {getAdditionalImages().length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Images className="w-4 h-4" />
                Additional Images ({getAdditionalImages().length})
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {getAdditionalImages().map((file, index) => (
                  <div
                    key={index}
                    className="relative h-20 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden"
                  >
                    <Image
                      src={URL.createObjectURL(file!)}
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {selectedCategories.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((category) => (
                  <Badge
                    key={category.id}
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Subcategories */}
          {getSelectedSubcategories().length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Subcategories
              </h3>
              <div className="flex flex-wrap gap-2">
                {getSelectedSubcategories().map((subcat) => (
                  <Badge
                    key={subcat?.id}
                    variant="outline"
                    className="border-purple-300 text-purple-700 dark:border-purple-600 dark:text-purple-300"
                  >
                    {subcat?.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {listing.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {listing.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Ready Status */}
          <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-700 dark:text-green-300 font-medium">
              Your product is ready to be published!
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
