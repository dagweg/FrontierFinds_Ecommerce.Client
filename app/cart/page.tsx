import CartItemCard from "@/components/custom/cart-item-card";
import { CartItemResult } from "@/types/cart.types";
import React from "react";

const MyCartPage: React.FC = () => {
  // Mock cart data for demonstration - replace with actual data fetching
  const mockCartItem: CartItemResult = {
    id: "cart-item-1",
    quantity: 2,
    product: {
      productId: "product-1",
      productName: "Asus rog strix",
      productDescription: "Gaming laptop",
      stockQuantity: 100,
      priceValueInCents: 2500,
      priceCurrency: "USD",
      images: {
        thumbnail: {
          url: "https://imgur.com/N8xhNK3.jpg",
        }, // Replace with actual thumbnail URL
        leftImage: null,
        rightImage: null,
        frontImage: null,
        backImage: null,
        topImage: null,
        bottomImage: null,
      },
      tags: [{ id: "tag-1", name: "Electronics" }],
      sellerId: "seller-1",
    },
  };

  return (
    <section className="h-screen">
      <div className="max-w-6xl mx-auto p-4">
        <h1>Your Cart</h1>
        <CartItemCard item={mockCartItem} />
        {/* ... map over your actual cart items and render CartItemCard for each ... */}
      </div>
    </section>
  );
};

export default MyCartPage;
