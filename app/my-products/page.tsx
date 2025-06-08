"use client";
import { PaginationGenerator } from "@/components/custom/pagination-generator";
import ProductCard, {
  ProductCardLoader,
} from "@/components/custom/product-card";
import { EmptyState } from "@/components/custom/empty-state";
import Title from "@/components/custom/title";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import { useProductsStore } from "@/lib/zustand/useProductsStore";
import { ProductResult, ProductsResult } from "@/types/product.types";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function MyProducts() {
  const router = useRouter();

  const searchParam = useSearchParams();

  const productsStore = useProductsStore();

  const { apiBaseUrl } = useEnvStore((state) => state);

  const fetchProducts = (searchParams: URLSearchParams) => {
    productsStore.setIsLoading(true);
    // ?pageNumber=${page}&pageSize=${productsStore.pageSize}
    fetch(`${apiBaseUrl}/me/products?${searchParams.toString()}`, {
      method: "GET",
      credentials: "include",
    }).then(async (r) => {
      const b = await r.json();

      if (r.ok) {
        productsStore.setProductsResult(b);
      }
      setTimeout(() => productsStore.setIsLoading(false), 300);
    });
  };

  useEffect(() => {
    fetchProducts(
      new URLSearchParams({
        pageNumber: `${page}`,
        pageSize: `${productsStore.pageSize}`,
      })
    );
  }, []);

  let filterSearchParams = new URLSearchParams();

  const [page, setPage] = useState(parseInt(searchParam.get("page") ?? "1"));

  return (
    <section className="min-h-screen">
      <div className="max-w-6xl mx-auto p-4 ">
        <div className="flex justify-between items-center">
          <Title text="My Products" className="text-3xl" />
          <div>
            <Button
              onClick={() => router.push("my-products/create-product-listing")}
            >
              Create Listing
            </Button>
          </div>
        </div>
        <section
          id="#product-search-listings"
          className=" flex flex-col gap-4 p-4 flex-1"
        >
          <div className="flex items-center justify-end gap-3">
            Sort by:
            <Select defaultValue="featured">
              <SelectTrigger className="w-[180px] h-[30px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort by</SelectLabel>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-l-t-h">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="price-h-t-l">
                    Price: High to Low
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {productsStore.isLoading ? (
            Array.from({ length: productsStore.pageSize }).map((p, i) => (
              <ProductCardLoader variant="full" key={i} />
            ))
          ) : productsStore.productsResult.products.length === 0 ? (
            <EmptyState
              type="general"
              title="No products listed yet"
              description="You don't have any products listed. Get started by creating your first listing."
              actionLabel="Create Listing"
              onAction={() => router.push("my-products/create-product-listing")}
            />
          ) : (
            productsStore.productsResult.products.map((product, i) => (
              <ProductCard key={i} productResult={product} variant="full" />
            ))
          )}
          <div>
            <PaginationGenerator
              onPageChange={(p) => setPage(p)}
              totalPages={Math.ceil(
                productsStore.productsResult.totalCount / productsStore.pageSize
              )}
              currentPage={page}
            />
          </div>
        </section>
      </div>
    </section>
  );
}

export default MyProducts;
