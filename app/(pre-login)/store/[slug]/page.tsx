"use client";

import { useSession } from "@/components/providers/session-provider";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BreadcrumbGenerator } from "@/components/custom/breadcrumb-generator";

// Import modular components
import { ProductImageGallery } from "@/components/store/product-image-gallery";
import { ProductInfo } from "@/components/store/product-info";
import { ProductDetailsTabs } from "@/components/store/product-details-tabs";
import { RelatedProducts } from "@/components/store/related-products";
import { DeliveryInfo, SocialProof } from "@/components/store/additional-info";
import { LoadingState } from "@/components/store/loading-state";
import { useProductDetail } from "@/components/store/use-product-detail";

/**
 * Product Detail Page Component
 * Refactored into modular components for better maintainability
 */
export default function ProductDetailPage() {
  const pathname = usePathname();
  const router = useRouter();
  const slug = pathname?.split("/").pop();
  const {
    isLoggedIn,
    userSessionInfo: { userId },
  } = useSession();

  const {
    product,
    seller,
    isMyProduct,
    isLoading,
    selectedImage,
    reviews,
    review,
    setSelectedImage,
    setReview,
    setReviews,
    handleAddToCart,
    handleReviewSubmit,
  } = useProductDetail({ slug: slug || "", userId, router });

  if (isLoading) {
    return <LoadingState />;
  }

  if (!product || !product.productId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl overflow-hidden mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <ProductImageGallery
              images={product.images}
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
              productName={product.productName}
            />

            {/* Product Information */}
            <ProductInfo
              product={product}
              seller={seller}
              isMyProduct={isMyProduct}
              isLoggedIn={isLoggedIn}
              onAddToCart={handleAddToCart}
              router={router}
            />
          </div>
        </motion.div>{" "}
        {/* Product Details Tabs */}
        <ProductDetailsTabs
          product={product}
          reviews={reviews}
          setReviews={setReviews}
          review={review}
          setReview={setReview}
          isLoggedIn={isLoggedIn}
          isMyProduct={isMyProduct}
          onReviewSubmit={handleReviewSubmit}
          productSlug={slug || ""}
        />
        {/* Related Products */}
        <RelatedProducts />
        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <DeliveryInfo />
          <SocialProof />
        </div>
      </div>
    </div>
  );
}
