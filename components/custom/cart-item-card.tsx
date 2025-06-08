"use client";
import PriceTag from "@/components/custom/price-tag";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/lib/zustand/useCartStore";
import { CartItemResult } from "@/types/cart.types";
import { Minus, Plus, Trash, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useInView } from "react-intersection-observer";

interface CartItemCardProps {
  item: CartItemResult;
  onRemove: (itemId: string) => void;
  className?: string;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onRemove,
  className,
}) => {
  const totalPriceForItem =
    (item.product.priceValueInCents * item.quantity) / 100; // Assuming price is in cents, converting to dollars for display

  const store = useCartStore();

  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 1,
    root: null,
    onChange: (inView, entry) => {
      if (inView && !item.seen) store.markItemAsSeen(item.id);
    },
  });
  return (
    <div
      className={`flex p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover-lift ${className} ${
        !item.seen
          ? "ring-2 ring-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10"
          : ""
      }`}
      onClick={() => store.markItemAsSeen(item.id)}
      ref={ref}
    >
      {/* Enhanced Product Image */}
      <div className="w-28 h-28 mr-6 overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-700 group relative">
        <Image
          src={
            item.product.images.thumbnail?.url ||
            "https://imgur.com/N8xhNK3.jpg"
          }
          alt={item.product.productName}
          className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
          width={300}
          height={300}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Enhanced Product Details */}
      <div className="flex flex-col justify-between flex-1">
        <div className="flex justify-between gap-8 items-start">
          <div className="space-y-4 flex-1">
            {/* Product Name and Description */}
            <div className="space-y-2">
              <Link
                href={`/store/${item.product.slug}`}
                className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 hover:underline underline-offset-2 line-clamp-1"
              >
                {item.product.productName}
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                {item.product.productDescription ||
                  "High-quality product with excellent features and reliable performance. Perfect for your needs with great value for money."}
              </p>
            </div>

            {/* Enhanced Quantity Controls */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-full p-1">
                <button
                  className="bg-gray-800 dark:bg-gray-600 hover:bg-gray-900 dark:hover:bg-gray-500 text-white p-2 rounded-full transition-all duration-200 hover-scale disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() =>
                    store.updateCart(
                      item.id,
                      Math.max(1, item.quantity - store.rate)
                    )
                  }
                  disabled={item.quantity <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className="font-bold text-lg min-w-[3rem] text-center text-gray-900 dark:text-white">
                  {item.quantity}
                </span>
                <button
                  className="bg-gray-800 dark:bg-gray-600 hover:bg-gray-900 dark:hover:bg-gray-500 text-white p-2 rounded-full transition-all duration-200 hover-scale"
                  onClick={() =>
                    store.updateCart(item.id, item.quantity + store.rate)
                  }
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Rate:
                </span>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="Rate"
                  className="w-20 h-9 text-center border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={store.rate}
                  onChange={(e) =>
                    store.setRate(
                      Math.max(1, Math.min(100, parseInt(e.target.value) || 1))
                    )
                  }
                />
              </div>
            </div>
          </div>

          {/* Enhanced Price and Actions */}
          <div className="flex flex-col items-end justify-between h-full space-y-4">
            <div className="text-right">
              {" "}
              <PriceTag
                priceValue={item.product.priceValueInCents}
                originalPriceValue={item.product.originalPriceValueInCents}
                isOnSale={item.product.isOnSale || false}
                discountPercentage={item.product.discountPercentage}
              />
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Total:{" "}
                <span className="font-bold text-gray-900 dark:text-white">
                  ${totalPriceForItem.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => store.removeFromCart(item.id)}
              className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 group/remove cursor-pointer transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg"
            >
              <Trash2 size={16} className="group-hover/remove:animate-bounce" />
              <span className="font-medium group-hover/remove:underline">
                Remove
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* New item indicator */}
      {!item.seen && (
        <div className="absolute top-2 right-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default CartItemCard;

export const CartItemCardLoader = () => {
  return (
    <div className="flex border-b-2 shadow-sm p-4 mb-4">
      {/* Product Image Skeleton */}
      <div className="w-24 h-24 mr-4 overflow-hidden rounded-md">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Product Details Skeleton */}
      <div className="flex flex-col justify-between flex-1">
        <div className="flex justify-between gap-20 items-start">
          <div className="space-y-3">
            <div>
              <Skeleton className="w-40 h-6 mb-2" /> {/* Title */}
              <Skeleton className="w-full h-4 mb-1" />{" "}
              {/* Description Line 1 */}
              <Skeleton className="w-3/4 h-4 mb-1" /> {/* Description Line 2 */}
              <Skeleton className="w-1/2 h-4 mb-1" /> {/* Description Line 3 */}
            </div>

            {/* Quantity Skeleton */}
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-4 h-4 mx-5" />
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>

            {/* Remove Button Skeleton */}
            <div>
              <div className="flex items-center gap-3">
                <Skeleton className="w-5 h-5" />
                <Skeleton className="w-16 h-4" />
              </div>
            </div>
          </div>

          {/* Price Skeleton */}
          <div>
            <Skeleton className="w-20 h-8" />
          </div>
        </div>
      </div>
    </div>
  );
};
