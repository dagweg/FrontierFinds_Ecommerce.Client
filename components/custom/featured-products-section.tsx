"use client";
import Carousel from "@/components/custom/carousel";
import ProductCard from "@/components/custom/product-card";
import Title from "@/components/custom/title";
import useTailwindBreakpoint from "@/lib/hooks/useTailwindBreakpoint";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import { ProductResult, ProductsResult } from "@/types/product.types";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

function FeaturedProductsSection() {
  const [productsResult, setProductsResult] = React.useState<ProductsResult>();

  const apiBaseUrl = useEnvStore().apiBaseUrl;
  useEffect(() => {
    (async () => {
      var res = await fetch(`${apiBaseUrl}/products`, {
        method: "GET",
        credentials: "include",
      });

      var b = await res.json();

      console.log(b);
      if (res.ok) {
        setProductsResult(b);
      }
    })();
  }, [apiBaseUrl]);

  const bp = useTailwindBreakpoint();

  const [prodCount, setProdCount] = useState(4);
  useEffect(() => {
    console.log("Breakpoint inside useEffect:", bp);
    const newProdCount =
      bp === "2xl"
        ? 5
        : bp === "xl"
        ? 4
        : bp === "lg"
        ? 3
        : bp === "md"
        ? 2
        : bp === "sm" || bp === "xs"
        ? 1
        : 1;

    setProdCount(newProdCount);
    console.log("Product Count will be set to:", newProdCount);
  }, [bp]);
  return (
    <motion.div
      initial={{ opacity: 0.0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
        duration: 0.8,
        ease: "easeInOut",
      }}
      className="relative flex flex-col gap-4 items-center justify-center px-4 min-h-screen py-16"
    >
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 w-full mx-auto rounded-3xl overflow-hidden">
        <div className="relative min-h-[600px] flex flex-col p-10 lg:p-16">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          {/* Enhanced Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-12 relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
              ✨ Handpicked for You
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover our carefully curated selection of the best products from
              top brands and independent creators.
            </p>
          </motion.div>{" "}
          {/* Enhanced Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative z-10"
          >
            <Carousel className="h-full" slidesPerView={1}>
              {/* Enhanced Product Grids */}
              {productsResult !== undefined &&
                Array.from({ length: 3 }, (_, slideIndex) => (
                  <motion.div
                    key={slideIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: slideIndex * 0.1, duration: 0.5 }}
                    className="grid grid-flow-col gap-6 w-fit mx-auto"
                  >
                    {productsResult.products
                      .slice(
                        slideIndex * prodCount,
                        (slideIndex + 1) * prodCount
                      )
                      .map((product, index) => (
                        <motion.div
                          key={product.productId}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="hover-lift"
                        >
                          <ProductCard
                            productResult={product}
                            variant="compact"
                          />
                        </motion.div>
                      ))}
                  </motion.div>
                ))}
            </Carousel>
          </motion.div>
          {/* Enhanced Stats or CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap justify-center items-center gap-8 mt-12 relative z-10"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                Fast Shipping
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Free on orders over $50
              </div>
            </div>
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 hidden md:block" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                Quality Assured
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Curated by experts
              </div>
            </div>
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 hidden md:block" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                Easy Returns
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                30-day guarantee
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}

export default FeaturedProductsSection;
