"use client";

// components/ProductCard.tsx
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Star, StarsIcon, User, User2, User2Icon } from "lucide-react";
import { ProductResult } from "@/types/product.types";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname, useRouter } from "next/navigation";
import PriceTag from "@/components/custom/price-tag";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import { Button } from "@/components/ui/button";
import { IconBasketPlus } from "@tabler/icons-react";
import { useCartStore } from "@/lib/zustand/useCartStore";
import RatingDisplay from "@/components/custom/rating-display";
import { cn } from "@/lib/utils";
import { useSession } from "@/components/providers/session-provider";
import { UserResult } from "@/types/user.types";

const ProductCard: React.FC<{
  productResult: ProductResult;
  variant?: "compact" | "full";
}> = ({ productResult, variant = "compact" }) => {
  const router = useRouter();
  const pathname = usePathname();

  const apiBaseUrl = useEnvStore().apiBaseUrl;

  const [user, setUser] = useState<UserResult>();

  const {
    isLoggedIn,
    userSessionInfo: { userId },
  } = useSession();

  const isMyProduct = productResult.sellerId === userId;

  const cartStore = useCartStore();
  const cartItems = useCartStore((s) => s.cart.items);

  useEffect(() => {
    (async () => {
      var res = await fetch(`${apiBaseUrl}/users/${productResult.sellerId}`, {
        method: "GET",
        credentials: "include",
      });

      var b = await res.json();

      if (res.ok) {
        setUser(b);
      }
    })();
  }, []);

  const isCompact = variant === "compact";
  const isInCart = cartItems.some(
    (item) => item.id === productResult.productId
  );

  return (
    <div
      className={cn(
        "group relative bg-white dark:bg-neutral-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700",
        {
          "h-[400px] sm:h-[440px] md:h-[460px] lg:h-[480px] flex flex-col":
            isCompact,
          "h-auto sm:h-[320px] flex flex-col sm:flex-row": variant === "full",
        }
      )}
    >
      {/* Image Section */}
      <div
        className={cn(
          "relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-900",
          {
            "h-[180px] sm:h-[200px] md:h-[220px] lg:h-[240px] rounded-t-2xl":
              isCompact,
            "w-full sm:w-1/2 rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl":
              variant === "full",
          }
        )}
      >
        {/* Product Image */}
        <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4">
          <Image
            src={
              productResult.images.thumbnail.url ??
              "https://imgur.com/N8xhNK3.jpg"
            }
            alt={productResult.productName}
            width={300}
            height={300}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 max-w-[150px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-none"
            sizes="(max-width: 640px) 150px, (max-width: 768px) 180px, (max-width: 1024px) 200px, 300px"
          />
        </div>{" "}
        {/* Overlay Effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] group-hover:transition-transform group-hover:duration-700 group-hover:ease-out" />
        {/* Quick Action Button */}
        {!isMyProduct && isLoggedIn && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <Button
              size="sm"
              variant={isInCart ? "default" : "outline"}
              onClick={(e) => {
                e.stopPropagation();
                cartStore.addToCart(productResult.productId);
              }}
              disabled={isInCart}
              className={cn(
                "shadow-lg backdrop-blur-sm border-0",
                isInCart
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-white/90 dark:bg-black/90 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-black"
              )}
            >
              <IconBasketPlus className="w-4 h-4" />
            </Button>
          </div>
        )}
        {/* My Product Badge */}
        {isMyProduct && (
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
              Your Product
            </span>
          </div>
        )}
      </div>
      {/* Content Section */}
      <div
        className={cn("flex flex-col p-4 sm:p-5 md:p-6 flex-1", {
          "justify-between border-t-[1px] sm:border-t-[1px]": isCompact,
          "w-full sm:w-1/2 border-t-[1px] sm:border-t-0 sm:border-l-[1px]":
            variant === "full",
        })}
      >
        {/* Product Info */}
        <div className="flex-1">
          {/* Product Name */}
          <h3
            onClick={() => router.push(`/store/${productResult.slug}`)}
            className={cn(
              "font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 cursor-pointer line-clamp-2 leading-tight",
              isCompact
                ? "text-sm sm:text-base md:text-lg mb-2"
                : "text-lg sm:text-xl mb-3"
            )}
            title={productResult.productName}
          >
            {productResult.productName}
          </h3>{" "}
          {/* Rating */}
          <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
            <RatingDisplay rating={productResult.averageRating} starSize={12} />
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              ({productResult.totalReviews})
            </span>
          </div>
          {/* Description - Show for both variants but with different line clamps */}
          <p
            className={cn(
              "text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed line-clamp-1 "
            )}
          >
            {productResult.productDescription || "No description available."}
          </p>
          {/* Price */}
          <div className="mb-3 sm:mb-4">
            <PriceTag
              priceValue={productResult.priceValueInCents}
              fontWeight="bold"
              originalPriceValue={productResult.originalPriceValueInCents}
              isOnSale={productResult.isOnSale || false}
              discountPercentage={productResult.discountPercentage}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-800">
          {/* Seller Info */}
          <div className="flex items-center gap-1 sm:gap-2">
            {user && !isMyProduct && (
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <User2Icon size={10} className="sm:w-3 sm:h-3" />
                <span className="text-xs font-medium truncate max-w-[80px] sm:max-w-[100px]">
                  {user.firstName} {user.lastName}
                </span>
              </div>
            )}
          </div>

          {/* Add to Cart Button - Compact variant */}
          {isCompact && !isMyProduct && isLoggedIn && (
            <Button
              size="sm"
              variant={isInCart ? "default" : "outline"}
              onClick={(e) => {
                e.stopPropagation();
                cartStore.addToCart(productResult.productId);
              }}
              disabled={isInCart}
              className={cn(
                "transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3",
                isInCart
                  ? "bg-green-500 hover:bg-green-600 text-white border-green-500"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
            >
              <IconBasketPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">
                {isInCart ? "Added" : "Add"}
              </span>
              <span className="sm:hidden">{isInCart ? "✓" : "+"}</span>
            </Button>
          )}
        </div>
      </div>{" "}
      {/* Hover Indicator - Elegant fade and expand from center */}
      <div className="absolute bottom-0 left-1/2 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full group-hover:left-0 transition-all duration-500 ease-out rounded-b-2xl" />
    </div>
  );
};

export default ProductCard;

export const ProductCardLoader = ({
  variant,
}: {
  variant: "compact" | "full";
}) => {
  const isCompact = variant === "compact";

  return (
    <div
      className={cn(
        "bg-white dark:bg-neutral-900 rounded-2xl shadow-sm overflow-hidden border border-neutral-200 dark:border-neutral-800",
        {
          "h-[400px] sm:h-[440px] md:h-[460px] lg:h-[480px] flex flex-col":
            isCompact,
          "h-auto sm:h-[320px] flex flex-col sm:flex-row": variant === "full",
        }
      )}
    >
      {/* Image Section Skeleton */}
      <div
        className={cn(
          "bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900",
          {
            "h-[180px] sm:h-[200px] md:h-[220px] lg:h-[240px] rounded-t-2xl":
              isCompact,
            "w-full sm:w-1/2 rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl":
              variant === "full",
          }
        )}
      >
        <div className="flex items-center justify-center h-full p-3 sm:p-4">
          <Skeleton className="w-full h-full rounded-lg bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div
        className={cn(
          "flex flex-col p-4 sm:p-5 md:p-6 flex-1 space-y-2 sm:space-y-3",
          {
            "justify-between": isCompact,
            "w-full sm:w-1/2": variant === "full",
          }
        )}
      >
        {/* Product Info Skeleton */}
        <div className="flex-1 space-y-3">
          {/* Product Name Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-4/5 bg-neutral-200 dark:bg-neutral-700" />
            <Skeleton className="h-5 w-3/5 bg-neutral-200 dark:bg-neutral-700" />
          </div>

          {/* Rating Skeleton */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-3 h-3 rounded bg-neutral-200 dark:bg-neutral-700"
                />
              ))}
            </div>
            <Skeleton className="h-3 w-8 bg-neutral-200 dark:bg-neutral-700" />
          </div>

          {/* Description Skeleton - Only for full variant */}
          {variant === "full" && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-neutral-200 dark:bg-neutral-700" />
              <Skeleton className="h-4 w-4/5 bg-neutral-200 dark:bg-neutral-700" />
              <Skeleton className="h-4 w-3/5 bg-neutral-200 dark:bg-neutral-700" />
            </div>
          )}

          {/* Price Skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16 bg-neutral-200 dark:bg-neutral-700" />
            <Skeleton className="h-4 w-12 bg-neutral-200 dark:bg-neutral-700" />
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          {/* Seller Info Skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="w-3 h-3 rounded bg-neutral-200 dark:bg-neutral-700" />
            <Skeleton className="h-3 w-16 bg-neutral-200 dark:bg-neutral-700" />
          </div>

          {/* Button Skeleton - Compact variant */}
          {isCompact && (
            <Skeleton className="h-8 w-16 rounded-md bg-neutral-200 dark:bg-neutral-700" />
          )}
        </div>
      </div>
    </div>
  );
};
