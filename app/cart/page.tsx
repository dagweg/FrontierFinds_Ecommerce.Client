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
    <section className="min-h-screen bg-neutral-100">
      <div className="max-w-[2000px] mx-auto p-4 flex gap-4">
        <div className="flex-1 max-w-[1200px] mx-auto">
          <div className="flex justify-between items-center">
            <Title text="My Cart" className="text-2xl" />
            <Button variant={"ghost"} onClick={() => store.clearCart()}>
              <Trash2 />
            </Button>
          </div>
          {store.cart.items.length === 0 ? (
            <>
              <div className="text-center text-lg  bg-neutral-100  text-neutral-600 p-12 mt-32 w-fit mx-auto rounded-xl">
                <div className="flex  flex-col gap-3 items-center ">
                  <ShoppingBasket size={50} />
                  Your cart is empty.
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                {store.isLoading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <CartItemCardLoader key={i} />
                    ))
                  : store.cart &&
                    store.cart.items &&
                    store.cart.items.length > 0 &&
                    store.cart.items.map((item, i) => (
                      <CartItemCard
                        key={i}
                        item={item}
                        onRemove={(i) => handleCartItemRemove(i)}
                      />
                    ))}
              </div>
              <PaginationGenerator
                currentPage={page}
                totalPages={store.cart.totalItems / 10}
                onPageChange={(p) => setPage(p)}
              />
            </>
          )}
        </div>
        {store.cart.items.length > 0 && (
          <div className="w-[400px] border-2 bg-white  rounded-2xl shadow-lg h-[300px] sticky top-[85px] flex flex-col p-5 mx-auto">
            {/* Cart Summary */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-4">Cart Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <PriceTag priceValue={subtotal} size="small" />
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>Discount</span>
                    <span>
                      -<PriceTag priceValue={discount} size="small" />
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <PriceTag priceValue={tax} size="small" />
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-500">Free</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <PriceTag
                    priceValue={total}
                    size="medium"
                    fontWeight="bold"
                  />
                </div>
              </div>
            </div>
            <Button className="w-full" onClick={() => router.push("/checkout")}>
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default withAuth(MyCartPage);
