"use client";

import { BreadcrumbGenerator } from "@/components/custom/breadcrumb";
import BrowseProductsSection from "@/components/custom/featured-products-section";
import ProductCard from "@/components/custom/product-card";
import Title from "@/components/custom/title";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import { useProductsStore } from "@/lib/zustand/useProductsStore";
import { IconSort09, IconSortAZ } from "@tabler/icons-react";
import { SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useLayoutEffect, useState } from "react";

function Store() {
  const pathname = usePathname();

  const productsStore = useProductsStore();

  const { apiBaseUrl } = useEnvStore((state) => state);

  useEffect(() => {
    fetch(`${apiBaseUrl}/products`, {
      method: "GET",
      credentials: "include",
    }).then(async (r) => {
      const b = await r.json();
      console.log(b);
      if (r.ok) {
        productsStore.setProductsStore(b.products);
        console.log(productsStore);
      }
    });
  }, []);

  return (
    <div className="p-10">
      <section id="#main-content" className="flex gap-8">
        <section className="w-[250px] h-screen bg-neutral-50 rounded-lg border p-2 px-5">
          <div>
            <Title text="Price" tag="h2" className="text-lg" />
            <div className="flex items-center gap-3">
              0
              <input type="range" name="" id="" />
              1000
            </div>
            <Title text="Categories" tag="h2" className="text-lg" />
            <div>
              <input
                type="checkbox"
                id="laptops"
                name="laptops"
                value="laptops"
              />
              <label htmlFor="laptops">Laptops</label>
            </div>
          </div>
        </section>
        <section
          id="#product-search-listings"
          className=" flex flex-col gap-4 p-4 flex-1"
        >
          <div>
            Sort by
            <select name="sort-by" id="sort-by">
              <option value="Featured">Featured</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
            </select>
          </div>
          {productsStore.products.map((product) => (
            <ProductCard
              key={product.productId}
              productResult={product}
              variant="full"
            />
          ))}
        </section>
      </section>
    </div>
  );
}

export default Store;
