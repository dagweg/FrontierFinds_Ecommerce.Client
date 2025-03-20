"use client";
import { CartItemResult } from "@/types/cart.types";
import { Minus, Plus, Trash, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";

interface CartItemCardProps {
  item: CartItemResult;
  onRemove: (itemId: string) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onRemove }) => {
  const { product, quantity } = item;
  const totalPriceForItem = (product.priceValueInCents * quantity) / 100; // Assuming price is in cents, converting to dollars for display

  return (
    <div className="flex border-b-2  shadow-sm p-4 mb-4 ">
      {/* Product Image */}
      <div className="w-24 h-24 mr-4 overflow-hidden rounded-md">
        <Image
          src={product.images.thumbnail?.url || "https://imgur.com/N8xhNK3.jpg"} // Use placeholder if no thumbnail
          alt={product.productName}
          className="object-contain w-full h-full"
          width={300}
          height={300}
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col justify-between flex-1 ">
        <div className="flex justify-between gap-20 items-start ">
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {product.productName}
              </h3>
              <p className="">
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
            <div className="flex items-center gap-3">
              <div className="bg-blue-800 cursor-pointer text-white p-1 rounded-full">
                <Minus size={15} />
              </div>
              <span className="font-semibold mx-5">{quantity}</span>
              <div className="bg-blue-800 cursor-pointer text-white p-1 rounded-full">
                <Plus size={15} />
              </div>
            </div>
            <div>
              <div
                onClick={() => onRemove(item.id)}
                className="flex items-center gap-3 text-sm text-gray-500 group/remove cursor-pointer"
              >
                <Trash2 size={20} className="text-neutral-500" />
                <span className="group-hover/remove:underline font-bold text-neutral-800">
                  Remove
                </span>
              </div>
            </div>
          </div>
          {/* Price */}
          <div>
            <span className="font-bold text-neutral-600 text-lg">
              {
                product.priceCurrency === "USD"
                  ? "$"
                  : product.priceCurrency /* Basic currency symbol, improve for production */
              }
              {totalPriceForItem.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
