"use client";

import { useState } from "react";
import { ProductResult } from "@/types/product.types";
import { UserResult } from "@/types/user.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
} from "lucide-react";
import { IconShoppingBag } from "@tabler/icons-react";
import Title from "@/components/custom/title";
import PriceTag from "@/components/custom/price-tag";
import RatingDisplay from "@/components/custom/rating-display";

interface ProductInfoProps {
  product: ProductResult;
  seller?: UserResult;
  isLoggedIn: boolean;
  isMyProduct: boolean;
  onAddToCart: () => void;
  router: any;
}

export function ProductInfo({
  product,
  seller,
  isLoggedIn,
  isMyProduct,
  onAddToCart,
  router,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) =>
      Math.max(1, Math.min(product.stockQuantity, prev + delta))
    );
  };

  return (
    <div className="space-y-8">
      {/* Product Title & Rating */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Title
            text={product.productName}
            className="text-4xl font-bold leading-tight"
          />
          <div className="flex items-center gap-4">
            <RatingDisplay rating={product.averageRating} starSize={20} />
            <span className="text-lg text-gray-600">
              ({product.averageRating})
            </span>
            <Separator orientation="vertical" className="h-6" />
            <button
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              onClick={() =>
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                })
              }
            >
              {product.totalReviews} reviews
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <PriceTag
            priceValue={product.priceValueInCents}
            fontWeight="bold"
            originalPriceValue={product.priceValueInCents + 1000}
            isOnSale={true}
            size="large"
            className="text-3xl"
          />
          <Badge variant="secondary" className="text-sm">
            Free shipping on orders over $50
          </Badge>
        </div>
      </div>

      {/* Product Features */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
          <Truck className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            Fast Delivery
          </span>
        </div>
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <Shield className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            Secure Payment
          </span>
        </div>
        <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
          <RotateCcw className="w-5 h-5 text-orange-600" />
          <span className="text-sm font-medium text-orange-800">
            Easy Returns
          </span>
        </div>
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {product.stockQuantity > 0 ? (
          <>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-green-700 font-medium">
              {product.stockQuantity > 10
                ? "In Stock"
                : `Only ${product.stockQuantity} left!`}
            </span>
          </>
        ) : (
          <>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-red-700 font-medium">Out of Stock</span>
          </>
        )}
      </div>

      {/* Categories & Tags */}
      {(product.categories.length > 0 ||
        (product.tags && product.tags.length > 0)) && (
        <div className="space-y-3">
          {product.categories.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Categories
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant="outline"
                    className="text-sm"
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {product.tags && product.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="text-sm">
                    #{tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {isLoggedIn && !isMyProduct && product.stockQuantity > 0 && (
        <div className="space-y-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="h-10 w-10 p-0"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stockQuantity}
                className="h-10 w-10 p-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="flex gap-3">
            <Button
              className="flex-1 h-12 text-lg font-medium"
              onClick={onAddToCart}
            >
              <IconShoppingBag className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsFavorited(!isFavorited)}
              className={cn(
                "h-12 w-12 p-0",
                isFavorited && "text-red-500 border-red-200 bg-red-50"
              )}
            >
              <Heart className={cn("w-5 h-5", isFavorited && "fill-current")} />
            </Button>
            <Button variant="outline" size="lg" className="h-12 w-12 p-0">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Buy Now Button */}
          <Button
            className="w-full h-12 text-lg font-medium bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            onClick={() => {
              // Add to cart and redirect to checkout
              onAddToCart();
              router.push("/checkout");
            }}
          >
            <IconShoppingBag className="w-5 h-5 mr-2" />
            Buy Now
          </Button>
        </div>
      )}

      {/* Seller Information */}
      {seller && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Seller Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={seller.profileImage?.url} />
                <AvatarFallback className="text-lg">
                  {seller.firstName[0] + seller.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {seller.firstName} {seller.lastName}
                  </h4>
                  <p className="text-sm text-gray-600">Member since 2020</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Products:</span>
                    <span className="font-medium ml-1">24</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-medium ml-1">4.8/5</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      `mailto:${seller.email}?subject=Inquiry from Frontier Finds&body=Hello, I am interested in...`
                    )
                  }
                >
                  Contact Seller
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
