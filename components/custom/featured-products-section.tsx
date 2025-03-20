import Carousel from "@/components/custom/carousel";
import ProductCard from "@/components/custom/product-card";
import Title from "@/components/custom/title";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ProductResult } from "@/types/product.types";
import { motion } from "framer-motion";
import React from "react";

function FeaturedProductsSection() {
  const mockProducts: ProductResult[] = [
    {
      productId: "prod-001",
      productName: "Smartphone X100",
      productDescription:
        "Latest smartphone with advanced camera and long battery life.",
      stockQuantity: 50,
      priceValueInCents: 69999,
      priceCurrency: "USD",
      images: {
        thumbnail: {
          url: "https://example.com/images/smartphone-x100-thumb.jpg",
        },
        leftImage: {
          url: "https://example.com/images/smartphone-x100-left.jpg",
        },
        rightImage: {
          url: "https://example.com/images/smartphone-x100-right.jpg",
        },
        frontImage: {
          url: "https://example.com/images/smartphone-x100-front.jpg",
        },
        backImage: {
          url: "https://example.com/images/smartphone-x100-back.jpg",
        },
        topImage: { url: "https://example.com/images/smartphone-x100-top.jpg" },
        bottomImage: {
          url: "https://example.com/images/smartphone-x100-bottom.jpg",
        },
      },
      tags: [{ id: "electronics", name: "Electronics" }],
      sellerId: "seller123",
    },
    {
      productId: "prod-002",
      productName: "4K Ultra HD TV",
      productDescription:
        "Experience stunning visuals with this 4K Ultra HD television.",
      stockQuantity: 20,
      priceValueInCents: 129999,
      priceCurrency: "USD",
      images: {
        thumbnail: { url: "https://example.com/images/4k-tv-thumb.jpg" },
        leftImage: { url: "https://example.com/images/4k-tv-left.jpg" },
        rightImage: { url: "https://example.com/images/4k-tv-right.jpg" },
        frontImage: { url: "https://example.com/images/4k-tv-front.jpg" },
        backImage: { url: "https://example.com/images/4k-tv-back.jpg" },
        topImage: { url: "https://example.com/images/4k-tv-top.jpg" },
        bottomImage: { url: "https://example.com/images/4k-tv-bottom.jpg" },
      },
      tags: [{ id: "electronics", name: "Electronics" }],
      sellerId: "seller456",
    },
    {
      productId: "prod-003",
      productName: "Men's Casual Shirt",
      productDescription:
        "Comfortable and stylish casual shirt for everyday wear.",
      stockQuantity: 100,
      priceValueInCents: 2999,
      priceCurrency: "USD",
      images: {
        thumbnail: { url: "https://example.com/images/casual-shirt-thumb.jpg" },
        leftImage: null,
        rightImage: null,
        frontImage: {
          url: "https://example.com/images/casual-shirt-front.jpg",
        },
        backImage: { url: "https://example.com/images/casual-shirt-back.jpg" },
        topImage: null,
        bottomImage: null,
      },
      tags: [{ id: "clothing", name: "Clothing" }],
      sellerId: "seller789",
    },
    {
      productId: "prod-004",
      productName: "Women's Summer Dress",
      productDescription:
        "Lightweight summer dress perfect for sunny days and events.",
      stockQuantity: 80,
      priceValueInCents: 4599,
      priceCurrency: "USD",
      images: {
        thumbnail: { url: "https://example.com/images/summer-dress-thumb.jpg" },
        leftImage: { url: "https://example.com/images/summer-dress-left.jpg" },
        rightImage: {
          url: "https://example.com/images/summer-dress-right.jpg",
        },
        frontImage: {
          url: "https://example.com/images/summer-dress-front.jpg",
        },
        backImage: { url: "https://example.com/images/summer-dress-back.jpg" },
        topImage: null,
        bottomImage: null,
      },
      tags: [{ id: "clothing", name: "Clothing" }],
      sellerId: "seller789",
    },
    {
      productId: "prod-005",
      productName: "Mystery Novel: The Hidden Truth",
      productDescription:
        "A gripping mystery novel that will keep you on the edge of your seat.",
      stockQuantity: 150,
      priceValueInCents: 1599,
      priceCurrency: "USD",
      images: {
        thumbnail: {
          url: "https://example.com/images/mystery-novel-thumb.jpg",
        },
        leftImage: null,
        rightImage: null,
        frontImage: {
          url: "https://example.com/images/mystery-novel-front.jpg",
        },
        backImage: null,
        topImage: null,
        bottomImage: null,
      },
      tags: [{ id: "books", name: "Books" }],
      sellerId: "seller321",
    },
    {
      productId: "prod-006",
      productName: "Science Fiction Epic",
      productDescription:
        "An award-winning science fiction novel full of adventure and intrigue.",
      stockQuantity: 120,
      priceValueInCents: 1899,
      priceCurrency: "USD",
      images: {
        thumbnail: { url: "https://example.com/images/scifi-novel-thumb.jpg" },
        leftImage: { url: "https://example.com/images/scifi-novel-left.jpg" },
        rightImage: { url: "https://example.com/images/scifi-novel-right.jpg" },
        frontImage: { url: "https://example.com/images/scifi-novel-front.jpg" },
        backImage: { url: "https://example.com/images/scifi-novel-back.jpg" },
        topImage: null,
        bottomImage: null,
      },
      tags: [{ id: "books", name: "Books" }],
      sellerId: "seller321",
    },
  ];

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <section className="bg-gray-100 w-full mx-auto">
          <div className="bg-gradient-to-r from-neutral-100 via-neutral-50 to-neutral-100 min-h-[500px] flex flex-col  p-10">
            <Title text="Featured Products" tag="h1" className="text-3xl" />
            <Carousel className="h-full" slidesPerView={1}>
              <div className=" p-1 text-center h-full">
                <Title text="Top Laptops" tag="h2" className="text-xl mb-3" />
                <div className="grid grid-cols-3 gap-4">
                  <ProductCard
                    key={mockProducts[0].productId}
                    productResult={mockProducts[0]}
                  />
                  <ProductCard
                    key={mockProducts[1].productId}
                    productResult={mockProducts[1]}
                  />
                  <ProductCard
                    key={`${mockProducts[1].productId}-duplicate`}
                    productResult={mockProducts[1]}
                  />
                </div>
              </div>
            </Carousel>
          </div>
        </section>
      </motion.div>
    </AuroraBackground>
  );
}

export default FeaturedProductsSection;
