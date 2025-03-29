"use client";

import { BreadcrumbGenerator } from "@/components/custom/breadcrumb-generator";
import BrowseProductsSection from "@/components/custom/featured-products-section";
import ProductCard, {
  ProductCardLoader,
} from "@/components/custom/product-card";
import Title from "@/components/custom/title";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import { useProductsStore } from "@/lib/zustand/useProductsStore";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import {
  IconAngle,
  IconSort09,
  IconSortAZ,
  IconTrash,
  IconTriangleFilled,
} from "@tabler/icons-react";
import {
  Delete,
  RemoveFormatting,
  SearchIcon,
  Trash,
  Triangle,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, {
  FormEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { PaginationGenerator } from "@/components/custom/pagination-generator";

import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CategoriesResult,
  CategoryResult,
  FilterProductsQuery,
  ProductsResult,
} from "@/types/product.types";
import { Label } from "@/components/ui/label";
import Button from "@/components/custom/button";
import { CheckboxProps, CheckedState } from "@radix-ui/react-checkbox";
import Image from "next/image";

function Store() {
  const router = useRouter();
  const searchParam = useSearchParams();

  const productsStore = useProductsStore();

  const [query, setQuery] = useState(searchParam.get("q"));

  const [page, setPage] = useState(parseInt(searchParam.get("page") ?? "1"));

  const { apiBaseUrl } = useEnvStore((state) => state);

  // const [categories, setCategories] = useState<CategoryResult[]>();

  const categoriesRef = useRef(null);

  const minPrice = 0;
  const maxPrice = productsStore.productsResult.maxPriceValueInCents / 100;

  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

  const [sideBar, setSideBar] = useState({
    isOpen: true,
  });

  const [filterEnabledSet, setFilterEnabledSet] = useState({
    price: false,
  });

  const isInitialMount = useRef(true);

  const handleCategoriesClear = () => {
    router.push("/store");
    productsStore.setCategories(
      productsStore.categories?.map((c) => ({
        ...c,
        checked: false,
        isActive: true,
        subCategories: c.subCategories.map((sc) => ({
          ...sc,
          checked: false,
          isActive: true,
        })),
      }))
    );
    handleApplyFilter();
  };

  const handleCategoryCheckClicked = (category: CategoryResult) => {
    // Toggle the clicked category
    category.checked = !category.checked;

    // Update all subcategories to match parent
    category.subCategories.forEach((x) => {
      x.checked = category.checked;
    });

    // Check if all sibling categories (same parentId) are unchecked

    let allRelatedUnchecked = !category.checked;
    if (category.parentId !== null) {
      const relatedCategories =
        productsStore.categories?.flatMap((c) =>
          c.subCategories.filter((sc) => sc.parentId == category.parentId)
        ) ?? [];

      allRelatedUnchecked = relatedCategories.every((x) => !x.checked);
    }

    productsStore.setCategories(
      productsStore.categories?.map((c) => {
        // If this is the category we clicked, don't modify isActive
        if (c.id === category.id) {
          return { ...c };
        }

        // If this is a parent category, don't modify it
        if (c.id === category.parentId) {
          return { ...c, checked: !allRelatedUnchecked };
        }

        // For all other categories:
        // If all related categories are unchecked, activate everything
        // If any related category is checked, deactivate others
        return {
          ...c,
          isActive: allRelatedUnchecked,
        };
      })
    );
  };

  const getFilterSearchParams = () => {
    let filterSearchParams = new URLSearchParams();

    filterSearchParams.set("pageNumber", `${page}`);
    filterSearchParams.set("pageSize", `${productsStore.pageSize}`);

    if (filterEnabledSet.price) {
      filterSearchParams.set("minPriceValueInCents", `${priceRange[0] * 100}`);
      filterSearchParams.set("maxPriceValueInCents", `${priceRange[1] * 100}`);
    }

    var categoryIds = productsStore.categories?.flatMap((x) =>
      x.subCategories.filter((y) => y.checked).map((y) => y.id)
    );
    categoryIds?.forEach((id) =>
      filterSearchParams.append("categoryIds", `${id}`)
    );

    return filterSearchParams;
  };

  const handleApplyFilter = () => {
    fetchProducts(getFilterSearchParams());
  };

  const fetchProducts = (searchParams?: URLSearchParams) => {
    productsStore.setIsLoading(true);
    // ?pageNumber=${page}&pageSize=${productsStore.pageSize}
    console.log(searchParams?.toString());
    fetch(`${apiBaseUrl}/products/filter?${searchParams?.toString()}`, {
      method: "GET",
      credentials: "include",
    }).then(async (r) => {
      const b: ProductsResult = await r.json();

      if (r.ok) {
        productsStore.setProductsResult(b);
        if (b.totalCount <= productsStore.pageSize) setPage(1);
      }
      setTimeout(() => productsStore.setIsLoading(false), 300);
    });
  };

  useEffect(() => {
    fetch(`${apiBaseUrl}/products/categories`, {
      method: "GET",
      credentials: "include",
    }).then(async (r) => {
      const b = await r.json();

      if (r.ok) {
        productsStore.setCategories(b.categories);
      }
    });
    fetchProducts();
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const q = searchParam.get("q");
    setQuery(q);
    let params = getFilterSearchParams();
    if (q !== null) params.set("name", q);
    console.log(params.entries().toArray());
    fetchProducts(params);
  }, [page, searchParam]);

  return (
    <div className="p-4 min-h-screen bg-neutral-100">
      <section id="#" className="flex">
        <section
          className={cn(
            "   scrollbar-hide flex gap-2 z-10 relative ",
            sideBar.isOpen &&
              "w-[250px] sticky max-h-screen h-fit  top-[105px]  md:left-0 "
          )}
        >
          <div
            className={cn(
              "bg-white border-[1px] p-2 px-5 overflow-scroll scrollbar-hide ",
              sideBar.isOpen && "block",
              !sideBar.isOpen && "hidden"
            )}
          >
            <div className="inline-flex gap-3 items-center">
              <Title text="Price" tag="h2" className="text-lg" />
              <Checkbox
                onCheckedChange={(e: CheckedState) =>
                  setFilterEnabledSet({
                    ...filterEnabledSet,
                    price: e == true,
                  })
                }
              />
            </div>
            <div
              className={cn(" gap-3", !filterEnabledSet.price && "opacity-50")}
            >
              <div className="flex items-center gap-3">
                {minPrice.toFixed(0)}
                <Slider
                  defaultValue={priceRange}
                  max={maxPrice}
                  min={minPrice}
                  step={1}
                  className={cn("w-[60%]")}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  disabled={!filterEnabledSet.price}
                />
                {maxPrice.toFixed(0)}
              </div>
              <div className="mx-auto w-fit text-sm ">
                {priceRange[0]} - {priceRange[1]}
              </div>
            </div>
            <section id="categories-section ">
              <div className="items-center flex justify-between">
                <Title text="Categories" tag="h2" className="text-lg" />
                {/* <IconTrash className="w-8 h-8 aspect-square p-1 rounded-full bg-neutral-200" /> */}
                <button
                  className="text-xs hover:underline"
                  onClick={handleCategoriesClear}
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-col gap-2 w-full" ref={categoriesRef}>
                {productsStore.categories?.map((c, i) => {
                  return (
                    c.isActive && (
                      <div key={i}>
                        <div className="flex items-center gap-2">
                          <IconTriangleFilled
                            className={cn(
                              c.expanded ? "rotate-180" : "rotate-90",
                              "w-2"
                            )}
                          />
                          <Checkbox
                            onClick={() => handleCategoryCheckClicked(c)}
                            checked={c.checked}
                          ></Checkbox>
                          <Label>{c.name}</Label>
                        </div>
                        <div className="flex  max-w-full  flex-wrap">
                          {c.subCategories.map((sc, _) => (
                            <div
                              key={_}
                              className={cn(
                                c.expanded ? "hidden" : "inline-flex",
                                "m-1 ml-6  gap-2 items-center"
                              )}
                            >
                              <Checkbox
                                onClick={() => handleCategoryCheckClicked(sc)}
                                checked={sc.checked}
                              ></Checkbox>
                              <Label>{sc.name}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
              <div className="flex justify-end mt-3">
                <Input
                  onClick={handleApplyFilter}
                  className="hover:bg-black hover:text-neutral-200 font-medium bg-neutral-100 w-fit  focus:ring-2 ring-neutral-300 duration-300 transition"
                  type="button"
                  value="Apply Filter"
                />
              </div>
            </section>
          </div>
          <div
            className="absolute  w-3 right-[-5px] h-full cursor-pointer   group"
            onClick={() => setSideBar({ ...sideBar, isOpen: !sideBar.isOpen })}
          >
            <div className="h-full w-[2px] rounded-full group-hover:bg-neutral-800  duration-100 mx-auto"></div>
          </div>
        </section>
        <section
          id="#product-search-listings"
          className=" flex flex-col p-4 flex-1"
        >
          <div className="inline-flex items-center justify-between">
            <div>
              Showing results for{" "}
              <span className="font-bold">
                {query ? `${query}` : "all products"}
              </span>
            </div>
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
          </div>
          <div className="py-4">
            {productsStore.isLoading ? (
              Array.from({ length: productsStore.pageSize }).map((p, i) => (
                <ProductCardLoader variant="full" key={i} />
              ))
            ) : productsStore.productsResult.products.length === 0 ? (
              <div className="min-h-full flex flex-col items-center py-32">
                <Image
                  src={"https://imgur.com/dVDXL8m.jpg"}
                  width={200}
                  height={200}
                  alt="Product not found."
                  className="grayscale"
                />
                <Title
                  text="Sorry, we couldn't find any products."
                  className="font-normal"
                />
              </div>
            ) : (
              productsStore.productsResult.products.map((product) => (
                <ProductCard
                  key={product.productId}
                  productResult={product}
                  variant="full"
                />
              ))
            )}
          </div>
          <div>
            <PaginationGenerator
              totalPages={Math.ceil(
                productsStore.productsResult.totalCount / productsStore.pageSize
              )}
              currentPage={page}
              onPageChange={(p) => {
                window.scrollTo(0, 0);
                setPage(p);
              }}
            />
          </div>
        </section>
      </section>
    </div>
  );
}

export default Store;
