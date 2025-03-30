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
      className={`flex   p-4  bg-white border-[1px]  rounded-lg ${className}`}
      onClick={() => store.markItemAsSeen(item.id)}
      ref={ref}
    >
      {/* Product Image */}
      <div className="w-24 h-24 mr-4 overflow-hidden rounded-md">
        <Image
          src={
            item.product.images.thumbnail?.url ||
            "https://imgur.com/N8xhNK3.jpg"
          } // Use placeholder if no thumbnail
          alt={item.product.productName}
          className="object-contain w-full h-full"
          width={300}
          height={300}
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col justify-between flex-1 ">
        <div className="flex justify-between gap-20 items-start ">
          <div className="space-y-3 flex-1">
            <div>
              <Link
                href={`/store/${item.product.slug}`}
                className="text-xl  font-bold  text-gray-800 hover:underline underline-offset-2"
              >
                {item.product.productName}
              </Link>
              <p className="max-w-[800px]">
                {` Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illo
                excepturi vitae quis aperiam, impedit accusamus, facilis
                repudiandae veritatis, commodi quia magni dignissimos debitis.
                Asperiores obcaecati odio minus nobis saepe iusto fuga dicta
                doloribus tempore! Aliquid corporis ducimus non facilis sapiente
                cupiditate vel nam, quae, saepe cumque odit tenetur voluptate
                necessitatibus.`.slice(0, 200)}
                ...
              </p>
            </div>
            {/* Quantity */}

            <div className="flex  gap-4 items-center">
              <div className="flex items-center gap-3">
                <div
                  className="bg-neutral-800 cursor-pointer text-white p-1 rounded-full"
                  onClick={() =>
                    store.updateCart(item.id, item.quantity - store.rate)
                  }
                >
                  <Minus size={15} />
                </div>
                <span className="font-semibold mx-5">{item.quantity}</span>
                <div
                  className="bg-neutral-800 cursor-pointer text-white p-1 rounded-full"
                  onClick={() =>
                    store.updateCart(item.id, item.quantity + store.rate)
                  }
                >
                  <Plus size={15} />
                </div>
                <Input
                  type="number"
                  name=""
                  placeholder="Rate"
                  max={100}
                  className="w-[70px]"
                  value={store.rate}
                  onChange={(e) =>
                    store.setRate(
                      Math.max(1, Math.min(100, parseInt(e.target.value)))
                    )
                  }
                />
              </div>
              <div></div>
            </div>
          </div>
          {/* Price */}
          <div className="w-fit flex flex-col justify-between h-full">
            <PriceTag
              priceValue={item.product.priceValueInCents}
              originalPriceValue={item.product.priceValueInCents + 1000}
              isOnSale={true}
            />
            <div
              onClick={() => store.removeFromCart(item.id)}
              className="flex items-center gap-3 text-sm text-gray-500 group/remove cursor-pointer"
            >
              <Trash2 size={20} className="text-neutral-500" />
              <span className="group-hover/remove:underline font-bold text-neutral-800">
                Remove
              </span>
            </div>
          </div>
        </div>
      </div>
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
