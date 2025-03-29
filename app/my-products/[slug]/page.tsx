"use client";

import Title from "@/components/custom/title";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import { ProductResult } from "@/types/product.types";
import { url } from "inspector";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useLayoutEffect } from "react";

function MyProduct() {
  const pathname = usePathname();
  const router = useRouter();
  const slug = pathname.split("/").pop();

  const { apiBaseUrl } = useEnvStore();

  const [product, setProduct] = React.useState<ProductResult>({
    productId: "",
    productName: "",
    productDescription: "",
    priceValueInCents: 0,
    stockQuantity: 0,
    categories: [],
    slug: "",
    images: {
      thumbnail: {
        url: null,
      },
      backImage: null,
      bottomImage: null,
      frontImage: null,
      leftImage: null,
      rightImage: null,
      topImage: null,
    },
    priceCurrency: "ETB",
    sellerId: "",
    tags: [],
    averageRating: 0,
    totalReviews: 0,
  });

  useLayoutEffect(() => {
    const fetchProduct = async () => {
      const r = await fetch(`${apiBaseUrl}/products/slug/${slug}`, {
        method: "GET",
        credentials: "include",
      });
      const b = await r.json();

      if (r.ok) {
        setProduct(b);
      } else if (r.status === 404) {
        router.push("/not-found");
      }
    };

    fetchProduct();
  }, []);

  return (
    <section className="min-h-screen h-screen">
      <div className="max-w-6xl mx-auto p-4 h-full ">
        <div className="flex justify-start h-full  ">
          <Image
            src={product.images.thumbnail.url ?? ""}
            width={500}
            height={500}
            className="h-[400px] w-[400px] object-contain"
            alt=""
          />
          <div className="flex flex-col gap-3 mt-16 h-full ">
            <Title text={product.productName} className="text-3xl" />
            <p className="text-2xl font-medium">
              ${product.priceValueInCents / 100} {product.priceCurrency}
            </p>
            <p>{product.productDescription}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MyProduct;
