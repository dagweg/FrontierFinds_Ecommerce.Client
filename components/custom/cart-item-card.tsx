"use client";
import { CartItemResult } from "@/types/cart.types";
import Image from "next/image";
import React from "react";

interface CartItemCardProps {
  item: CartItemResult;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { product, quantity } = item;
  const totalPriceForItem = (product.priceValueInCents * quantity) / 100; // Assuming price is in cents, converting to dollars for display

  return (
    <div className="flex border rounded-lg shadow-sm p-4 mb-4">
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
      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {product.productName}
          </h3>
          <p className="text-gray-600 text-sm">
            {product.productDescription.substring(0, 100)}...
          </p>{" "}
          {/* Limit description length */}
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Quantity */}
          <div className="flex items-center">
            <span className="text-gray-700 mr-2">Quantity:</span>
            <span className="font-semibold">{quantity}</span>
          </div>

          {/* Price */}
          <div>
            <span className="text-gray-700 mr-1">Price:</span>
            <span className="font-semibold text-indigo-600">
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
