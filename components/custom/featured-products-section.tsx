import Carousel from "@/components/custom/carousel";
import ProductCard, { Product } from "@/components/custom/product-card";
import Title from "@/components/custom/title";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import React from "react";

function FeaturedProductsSection() {
  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Laptop Model X",
      price: 1200.0,
      description: "High-performance laptop for professionals and gamers.",
      imageSrc: "/images/laptop1.jpg",
      detailsUrl: "/products/laptop-x",
    },
    {
      id: 2,
      name: "Ergonomic Mouse Pro",
      price: 45.99,
      description: "Comfortable and precise mouse for extended use.",
      imageSrc: "/images/mouse1.jpg",
      detailsUrl: "/products/mouse-pro",
    },
    {
      id: 3,
      name: "Wireless Keyboard Elite",
      price: 89.5,
      description: "Mechanical keyboard with customizable RGB lighting.",
      imageSrc: "/images/keyboard1.jpg",
      detailsUrl: "/products/keyboard-elite",
    },
    {
      id: 4,
      name: "Gaming Headset 7.1",
      price: 75.0,
      description: "Immersive 7.1 surround sound gaming headset.",
      imageSrc: "/images/headset1.jpg",
      detailsUrl: "/products/headset-7-1",
    },
    {
      id: 5,
      name: "UltraWide Monitor",
      price: 350.0,
      description: "34-inch ultrawide monitor for enhanced productivity.",
      imageSrc: "/images/monitor1.jpg",
      detailsUrl: "/products/ultrawide-monitor",
    },
    {
      id: 6,
      name: "VR Headset Pro",
      price: 499.0,
      description:
        "Next-gen virtual reality headset for immersive experiences.",
      imageSrc: "/images/vr-headset.jpg",
      detailsUrl: "/products/vr-headset-pro",
    },
    {
      id: 7,
      name: "Smartwatch Fitness",
      price: 199.99,
      description:
        "Advanced smartwatch with fitness tracking and notifications.",
      imageSrc: "/images/smartwatch.jpg",
      detailsUrl: "/products/smartwatch-fitness",
    },
    {
      id: 8,
      name: "Bluetooth Speaker Portable",
      price: 59.0,
      description: "Compact and powerful portable Bluetooth speaker.",
      imageSrc: "/images/speaker.jpg",
      detailsUrl: "/products/bluetooth-speaker",
    },
    // Add more mock products as needed
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
                  <ProductCard product={mockProducts[0]} />
                  <ProductCard product={mockProducts[1]} />
                  <ProductCard product={mockProducts[1]} />
                </div>
              </div>
              <div className=" p-1 text-center h-full">
                <Title
                  text="Essential Accessories"
                  tag="h2"
                  className="text-xl mb-3"
                />
                <div className="grid grid-cols-3 gap-4">
                  <ProductCard product={mockProducts[2]} />
                  <ProductCard product={mockProducts[3]} />
                  <ProductCard product={mockProducts[3]} />
                </div>
              </div>
              <div className=" p-1 text-center h-full">
                <Title
                  text="Immersive Experiences"
                  tag="h2"
                  className="text-xl mb-3"
                />
                <div className="grid grid-cols-3 gap-4">
                  <ProductCard product={mockProducts[4]} />
                  <ProductCard product={mockProducts[5]} />
                  <ProductCard product={mockProducts[5]} />
                </div>
              </div>
              <div className=" p-1 text-center h-full">
                <Title
                  text="Wearable Tech & Audio"
                  tag="h2"
                  className="text-xl mb-3"
                />
                <div className="grid grid-cols-3 gap-4">
                  <ProductCard product={mockProducts[6]} />
                  <ProductCard product={mockProducts[7]} />
                  <ProductCard product={mockProducts[7]} />
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
