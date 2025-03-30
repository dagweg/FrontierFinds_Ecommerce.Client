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

  return (
    <div
      className={clsx({
        "cursor-pointer overflow-hidden relative    border-[1px] bg-white  border-neutral-200 hover:border-[1px] hover:shadow-lg hover:border-neutral-300 active:ring-4 ring-neutral-200   duration-100  mx-auto  p-4 group":
          true,
        "w-full h-60 flex items-end": variant === "full",
        "max-w-sm h-[400px] w-[300px] grid grid-cols-1 grid-rows-2": isCompact,
      })}
    >
      <div className={cn("h-full", isCompact && "")}>
        <Image
          src={
            productResult.images.thumbnail.url ??
            "https://imgur.com/N8xhNK3.jpg"
          }
          alt=""
          width={200}
          height={200}
          className={clsx({
            "opacity-100 h-full object-contain object-center  top-0": true,
            "mx-auto h-[200]": isCompact,
          })}
          style={{
            objectFit: "contain",
          }}
        ></Image>
      </div>
      {/* <div className=" w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-neutral-100 bg-neutral-200  opacity-60"></div> */}
      <div
        className={cn(
          "text content relative z-10 p-4 flex flex-col w-full h-full",
          isCompact && "justify-end"
        )}
      >
        <div
          onClick={() => router.push(`/store/${productResult.slug}`)}
          className={cn(
            "font-bold text-xl md:text-2xl text-black hover:text-blue-800",
            isCompact && "!text-lg"
          )}
        >
          {productResult.productName.slice(0, isCompact ? 20 : 50)}...
        </div>
        <div className="flex items-center gap-1">
          <RatingDisplay rating={productResult.averageRating} starSize={15} />
          <span className="text-xs">
            ({productResult.totalReviews} Reviews)
          </span>
        </div>
        {!isCompact && (
          <p className="font-normal text-sm text-black mt-3">
            {productResult.productDescription.slice(0, 200) ||
              "No description available."}
          </p>
        )}
        <PriceTag
          priceValue={productResult.priceValueInCents}
          fontWeight="bold"
          originalPriceValue={productResult.priceValueInCents + 1000}
          isOnSale={true}
        />
        {!isCompact && !isMyProduct && isLoggedIn && (
          <div className="w-full flex justify-end text-xs gap-3">
            <Button
              className="h-[25px]"
              variant={"ghost"}
              onClick={() => {
                cartStore.addToCart(productResult.productId);
              }}
              disabled={cartItems.some(
                (item) => item.id === productResult.productId
              )}
            >
              <IconBasketPlus />
              Add to Cart
            </Button>
            {user && (
              <span className="inline-flex items-center gap-1">
                / <User2Icon size={15} /> {user.firstName + " " + user.lastName}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

export const ProductCardLoader = ({
  variant,
}: {
  variant: "compact" | "full";
}) => {
  return (
    <Skeleton
      className={clsx({
        "bg-neutral-100 rounded-3xl": true,
        "w-full h-60 flex items-end ": variant === "full",
        "max-w-sm h-96": variant === "compact",
      })}
    >
      <div className="h-full flex items-center ">
        <Skeleton
          className={clsx({
            "aspect-square bg-neutral-200 h-[200px] m-3 rounded-3xl": true,
            "mx-auto  ": variant === "compact",
          })}
        />
      </div>
      <div className="text content relative z-10 p-4 flex flex-col w-full gap-3">
        <Skeleton className="w-[300px] h-4" />
        <div className="inline-flex gap-2">
          <Skeleton className=" w-[100px] h-4" />
          <Skeleton className=" w-[100px] h-4" />
        </div>
        <Skeleton className="w-[450px] h-4" />
        <Skeleton className="w-[700px] h-4" />
        <Skeleton className="w-[50px] h-4" />
      </div>
    </Skeleton>
  );
};
