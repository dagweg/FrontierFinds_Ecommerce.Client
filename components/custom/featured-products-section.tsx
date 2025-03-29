"use client";
import Carousel from "@/components/custom/carousel";
import ProductCard from "@/components/custom/product-card";
import Title from "@/components/custom/title";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { useFormField } from "@/components/ui/form";
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
  }, []);

  const bp = useTailwindBreakpoint();

  const [prodCount, setProdCount] = useState(4);

  useEffect(() => {
    console.log("Breakpoint inside useEffect:", bp); // Log breakpoint here
    setProdCount(
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
        : 1
    );
    console.log("Product Count after setProdCount:", prodCount); // Log prodCount AFTER setting it
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
      className="relative flex flex-col gap-4 items-center justify-center px-4 h-screen"
    >
      <section className="bg-gray-100 w-full mx-auto">
        <div className="bg-gradient-to-r from-neutral-100 via-neutral-50 to-neutral-100 min-h-[500px] flex flex-col  p-10">
          <Title text="Featured Products" tag="h1" className="text-3xl" />
          <Carousel className="h-full" slidesPerView={1}>
            {/* <Title text="Top Laptops" tag="h2" className="text-xl mb-3" /> */}
            {productsResult !== undefined && (
              <div className="grid grid-flow-col gap-4 w-fit mx-auto">
                {productsResult.products.slice(0, prodCount).map((product) => (
                  <ProductCard
                    key={product.productId}
                    productResult={product}
                    variant="compact"
                  />
                ))}
              </div>
            )}
            {productsResult !== undefined && (
              <div className="grid grid-flow-col gap-4 w-fit mx-auto">
                {productsResult.products
                  .slice(prodCount, 2 * prodCount)
                  .map((product) => (
                    <ProductCard
                      key={product.productId}
                      productResult={product}
                      variant="compact"
                    />
                  ))}
              </div>
            )}
            {productsResult !== undefined && (
              <div className="grid grid-flow-col gap-4 w-fit mx-auto">
                {productsResult.products
                  .slice(2 * prodCount, 3 * prodCount)
                  .map((product) => (
                    <ProductCard
                      key={product.productId}
                      productResult={product}
                      variant="compact"
                    />
                  ))}
              </div>
            )}
          </Carousel>
        </div>
      </section>
    </motion.div>
  );
}

export default FeaturedProductsSection;
