"use client";

import CartItemCard, {
  CartItemCardLoader,
} from "@/components/custom/cart-item-card";
import { PaginationGenerator } from "@/components/custom/pagination-generator";
import PriceTag from "@/components/custom/price-tag";
import Title from "@/components/custom/title";
import { Button } from "@/components/ui/button";
import withAuth from "@/lib/decorators/withAuth";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/zustand/useCartStore";
import { useProductsStore } from "@/lib/zustand/useProductsStore";
import { CartItemResult } from "@/types/cart.types";
import { IconBasket } from "@tabler/icons-react";
import { ShoppingBasket, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const MyCartPage: React.FC = () => {
  const store = useCartStore();
  const [page, setPage] = useState(1);

  useEffect(() => {
    store.initializeCart();
  }, []);

  const handleCartItemRemove = (itemId: string) => {};

  const router = useRouter();

  // Calculate cart summary values
  const calculateSummary = () => {
    if (!store.cart || !store.cart.items || store.cart.items.length === 0) {
      return { subtotal: 0, discount: 0, tax: 0, total: 0 };
    }

    // Calculate subtotal and discount
    let subtotal = 0;
    let discount = 0;
    store.cart.items.forEach((item: CartItemResult) => {
      const itemPrice = item.product.priceValueInCents;
      const originalPrice =
        item.product.originalPriceValueInCents ||
        item.product.priceValueInCents;
      const itemSubtotal = (itemPrice / 100) * item.quantity; // Convert cents to dollars
      subtotal += itemSubtotal;

      // Calculate discount if product is on sale
      if (
        item.product.isOnSale &&
        item.product.originalPriceValueInCents &&
        item.product.originalPriceValueInCents > itemPrice
      ) {
        const itemDiscount =
          ((item.product.originalPriceValueInCents - itemPrice) / 100) *
          item.quantity;
        discount += itemDiscount;
      }
    });

    // Calculate tax (8% of subtotal after discount)
    const taxRate = 0.08;
    const tax = (subtotal - discount) * taxRate;

    // Calculate total (subtotal - discount + tax)
    const total = subtotal - discount + tax;

    return {
      subtotal: Math.round(subtotal * 100), // Convert back to cents for PriceTag
      discount: Math.round(discount * 100),
      tax: Math.round(tax * 100),
      total: Math.round(total * 100),
    };
  };

  const { subtotal, discount, tax, total } = calculateSummary();
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Title
                text="Shopping Cart"
                className="text-3xl font-bold text-gray-900 dark:text-white"
              />
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {store.cart?.items?.length || 0} item
                {(store.cart?.items?.length || 0) !== 1 ? "s" : ""} in your cart
              </p>
            </div>
            {store.cart?.items?.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => store.clearCart()}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            )}
          </div>
        </div>

        {store.cart?.items?.length === 0 ? (
          /* Empty Cart State */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
                <ShoppingBasket className="w-12 h-12 text-gray-400 dark:text-gray-600" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">0</span>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
              Looks like you haven't added any items to your cart yet. Start
              shopping to fill it up!
            </p>
            <Button
              onClick={() => router.push("/store")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <IconBasket className="w-5 h-5 mr-2" />
              Continue Shopping
            </Button>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {store.isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <CartItemCardLoader key={i} />
                  ))
                : store.cart.items.map((item, i) => (
                    <div
                      key={`${item.id}-${i}`}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
                    >
                      <CartItemCard
                        item={item}
                        onRemove={() => handleCartItemRemove(item.id)}
                      />
                    </div>
                  ))}

              {/* Pagination if needed */}
              {store.cart.totalItems > 10 && (
                <div className="flex justify-center pt-6">
                  <PaginationGenerator
                    currentPage={page}
                    totalPages={Math.ceil(store.cart.totalItems / 10)}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Order Summary
                    </h3>
                  </div>

                  {/* Summary Details */}
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">
                          Subtotal
                        </span>
                        <PriceTag priceValue={subtotal} size="small" />
                      </div>

                      {discount > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">
                            Discount
                          </span>
                          <div className="flex items-center text-green-600 dark:text-green-400">
                            <span className="text-sm">-</span>
                            <PriceTag priceValue={discount} size="small" />
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">
                          Tax (8%)
                        </span>
                        <PriceTag priceValue={tax} size="small" />
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">
                          Shipping
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          Free
                        </span>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            Total
                          </span>
                          <PriceTag
                            priceValue={total}
                            size="medium"
                            fontWeight="bold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <div className="p-6 pt-0">
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                      onClick={() => router.push("/checkout")}
                    >
                      Proceed to Checkout
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full mt-3 border-gray-300 dark:border-gray-600"
                      onClick={() => router.push("/store")}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default withAuth(MyCartPage);
