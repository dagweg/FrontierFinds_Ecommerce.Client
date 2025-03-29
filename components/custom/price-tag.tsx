import { cn } from "@/lib/utils";
import React from "react";

interface PriceTagProps {
  priceValue: number; // Price in cents
  currency?: string;
  size?: "small" | "medium" | "large";
  color?: string;
  fontWeight?: "normal" | "bold" | "light";
  isOnSale?: boolean;
  originalPriceValue?: number; // Original price in cents
  discountPercentage?: number;
  className?: string;
}

const PriceTag: React.FC<PriceTagProps> = ({
  priceValue,
  currency = "$",
  size = "medium",
  color,
  fontWeight = "normal",
  isOnSale = false,
  originalPriceValue,
  discountPercentage,
  className = "",
}) => {
  // Convert cents to dollars
  const price = priceValue / 100;
  const originalPrice = originalPriceValue
    ? originalPriceValue / 100
    : undefined;

  // Validation
  if (isOnSale && originalPrice === undefined) {
    console.error(
      "PriceTag: originalPriceValue is required when isOnSale is true"
    );
    return <div className="price-error">Invalid Price Configuration</div>;
  }

  if (isOnSale && originalPrice! <= price) {
    console.warn("PriceTag: originalPrice should be greater than sale price");
  }

  if (
    discountPercentage &&
    (discountPercentage < 0 || discountPercentage > 100)
  ) {
    console.error("PriceTag: discountPercentage must be between 0 and 100");
    return <div className="price-error">Invalid Discount</div>;
  }

  // Styling
  const baseFontSize = size === "small" ? 0.8 : size === "large" ? 1.5 : 1;
  const style = {
    color: color,
    fontWeight: fontWeight,
  };

  // Calculate discount percentage if not explicitly provided
  const effectiveDiscountPercentage =
    discountPercentage !== undefined
      ? Math.round(discountPercentage) // Use provided value, rounded
      : isOnSale && originalPrice
      ? Math.round(((originalPrice - price) / originalPrice) * 100) // Calculate and round
      : 0;

  // Split price into whole and decimal parts
  const priceWhole = Math.floor(price);
  const priceDecimal = Math.round((price % 1) * 100)
    .toString()
    .padStart(2, "0");
  const originalWhole = originalPrice ? Math.floor(originalPrice) : null;
  const originalDecimal = originalPrice
    ? Math.round((originalPrice % 1) * 100)
        .toString()
        .padStart(2, "0")
    : null;

  return (
    <div className={`price-tag w-fit ${className}`} style={style}>
      {isOnSale && originalPrice && (
        <div
          className="original-price"
          style={{
            color: "gray",
            fontSize: `${baseFontSize * 0.8}rem`,
            marginBottom: "0.25rem",
          }}
        >
          <span style={{ textDecoration: "line-through" }}>
            {currency}
            {originalWhole}
            <sup>{originalDecimal}</sup>
          </span>
          {effectiveDiscountPercentage > 0 && (
            <span
              style={{
                marginLeft: "0.5rem",
                fontWeight: "bold",
              }}
              className={cn("rounded-full px-2 bg-red-500 text-white")}
            >
              -{effectiveDiscountPercentage}%{" "}
            </span>
          )}
        </div>
      )}
      <div
        className="current-price"
        style={{
          fontSize: `${baseFontSize}rem`,
          lineHeight: 1,
        }}
      >
        <span>
          {currency}
          {priceWhole}
          <span
            style={{
              fontSize: `${baseFontSize * 0.6}rem`,
              verticalAlign: "super",
            }}
          >
            {priceDecimal}
          </span>
        </span>
      </div>
    </div>
  );
};

export default PriceTag;
