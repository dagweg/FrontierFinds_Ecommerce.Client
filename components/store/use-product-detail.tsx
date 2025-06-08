"use client";

import { useEffect, useState } from "react";
import {
  ProductImageResult,
  ProductResult,
  ProductReviewsResult,
} from "@/types/product.types";
import { UserResult } from "@/types/user.types";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import { useCartStore } from "@/lib/zustand/useCartStore";

interface UseProductDetailProps {
  slug: string;
  userId: string;
  router: any;
}

export function useProductDetail({
  slug,
  userId,
  router,
}: UseProductDetailProps) {
  const { apiBaseUrl } = useEnvStore();
  const cartStore = useCartStore();

  // State management
  const [selectedImage, setSelectedImage] = useState<ProductImageResult | null>(
    null
  );
  const [seller, setSeller] = useState<UserResult>();
  const [isMyProduct, setIsMyProduct] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [product, setProduct] = useState<ProductResult>({
    productId: "",
    productName: "",
    productDescription: "",
    priceValueInCents: 0,
    stockQuantity: 0,
    categories: [],
    slug: "",
    images: {
      thumbnail: { url: null },
      backImage: null,
      bottomImage: null,
      frontImage: null,
      leftImage: null,
      rightImage: null,
      topImage: null,
    },
    averageRating: 0,
    priceCurrency: "ETB",
    sellerId: "",
    tags: [],
    totalReviews: 0,
  });

  const [review, setReview] = useState({
    rating: 0,
    description: "",
    productId: product.productId,
    submitLoading: false,
  });

  const [reviews, setReviews] = useState<ProductReviewsResult>({
    productReviews: [],
    totalCount: 0,
    totalFetchedCount: 0,
  });

  // Handlers
  const handleAddToCart = () => {
    cartStore.addToCart(product.productId);
  };

  const handleReviewSubmit = async () => {
    if (review.rating > 0 && review.description.trim() !== "") {
      setReview({ ...review, submitLoading: true });

      try {
        const response = await fetch(`${apiBaseUrl}/products/review`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(review),
        });

        const result = await response.json();

        if (response.ok) {
          setReview({ ...review, rating: 0, description: "" });
          setReviews({
            ...reviews,
            productReviews: [...reviews.productReviews, result],
            totalCount: reviews.totalCount + 1,
          });
        } else {
          alert("Failed to submit review");
        }
      } catch (error) {
        alert("Error submitting review");
      } finally {
        setReview({ ...review, submitLoading: false });
      }
    }
  };

  // Data fetching
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${apiBaseUrl}/products/slug/${slug}`, {
          method: "GET",
          credentials: "include",
        });
        const productData = await response.json();

        if (response.ok) {
          setProduct(productData);
          setIsMyProduct(productData.sellerId === userId);
          setSelectedImage(productData.images.thumbnail);
          setReview((prev) => ({ ...prev, productId: productData.productId }));

          if (productData.sellerId) {
            fetchSeller(productData.sellerId);
          }
        } else if (response.status === 404) {
          router.push("/not-found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSeller = async (sellerId: string) => {
      try {
        const response = await fetch(`${apiBaseUrl}/users/${sellerId}`, {
          method: "GET",
          credentials: "include",
        });
        const sellerData = await response.json();

        if (response.ok) {
          setSeller(sellerData);
        }
      } catch (error) {
        console.error("Error fetching seller:", error);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug, apiBaseUrl, userId, router]);

  return {
    // State
    product,
    selectedImage,
    seller,
    isMyProduct,
    isLoading,
    review,
    reviews,
    // Setters
    setSelectedImage,
    setReview,
    setReviews,
    // Handlers
    handleAddToCart,
    handleReviewSubmit,
  };
}
