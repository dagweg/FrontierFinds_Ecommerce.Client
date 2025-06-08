"use client";

import { useState } from "react";
import { ProductResult, ProductReviewsResult } from "@/types/product.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CircleDashed } from "lucide-react";
import RatingComponent from "@/components/custom/rating-component";
import Reviews from "@/app/(pre-login)/store/[slug]/reviews";

interface ProductDetailsTabsProps {
  product: ProductResult;
  reviews: ProductReviewsResult;
  setReviews: (reviews: ProductReviewsResult) => void;
  review: {
    rating: number;
    description: string;
    productId: string;
    submitLoading: boolean;
  };
  setReview: (review: any) => void;
  isLoggedIn: boolean;
  isMyProduct: boolean;
  onReviewSubmit: () => void;
  productSlug: string;
}

export function ProductDetailsTabs({
  product,
  reviews,
  setReviews,
  review,
  setReview,
  isLoggedIn,
  isMyProduct,
  onReviewSubmit,
  productSlug,
}: ProductDetailsTabsProps) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specifications">Specifications</TabsTrigger>
        <TabsTrigger value="reviews">
          Reviews ({reviews.totalCount})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-8">
        <Card>
          <CardContent className="pt-6">
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                {product.productDescription || "No description available."}
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="specifications" className="mt-8">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">SKU:</span>
                  <span className="text-gray-600">
                    {product.productId.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Stock:</span>
                  <span className="text-gray-600">
                    {product.stockQuantity} units
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Currency:</span>
                  <span className="text-gray-600">{product.priceCurrency}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">
                    Average Rating:
                  </span>
                  <span className="text-gray-600">
                    {product.averageRating}/5
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">
                    Total Reviews:
                  </span>
                  <span className="text-gray-600">{product.totalReviews}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reviews" className="mt-8">
        <div className="space-y-8">
          {/* Review Form */}
          {isLoggedIn && !isMyProduct && (
            <Card>
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating
                  </label>
                  <RatingComponent
                    onRatingChange={(rating) =>
                      setReview({ ...review, rating })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <Textarea
                    placeholder="Share your thoughts about this product..."
                    className="min-h-[120px]"
                    value={review.description}
                    onChange={(e) =>
                      setReview({
                        ...review,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <Button
                  onClick={onReviewSubmit}
                  disabled={
                    review.submitLoading ||
                    review.rating === 0 ||
                    !review.description.trim()
                  }
                  className="w-full"
                >
                  {review.submitLoading ? (
                    <>
                      Submitting{" "}
                      <CircleDashed className="w-4 h-4 ml-2 animate-spin" />
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          <Reviews
            reviews={reviews}
            setReviews={setReviews}
            productSlug={productSlug}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
