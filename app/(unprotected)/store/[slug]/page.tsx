"use client";

import { PaginationGenerator } from "@/components/custom/pagination-generator";
import RatingComponent from "@/components/custom/rating-component";
import Title from "@/components/custom/title";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import { ProductResult } from "@/types/product.types";
import {
  IconBasket,
  IconCash,
  IconMoneybag,
  IconStar,
  IconStarFilled,
  IconStarHalfFilled,
  IconStarOff,
} from "@tabler/icons-react";
import { url } from "inspector";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useLayoutEffect, useState } from "react";

function ProductDetailPage() {
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
    averageRating: 0,
    priceCurrency: "ETB",
    sellerId: "",
    tags: [],
  });

  useLayoutEffect(() => {
    const fetchProduct = async () => {
      const r = await fetch(`${apiBaseUrl}/products/slug/${slug}`, {
        method: "GET",
        credentials: "include",
      });
      const b = await r.json();
      console.log(b);
      if (r.ok) {
        setProduct(b);
      } else if (r.status === 404) {
        router.push("/not-found");
      }
    };

    fetchProduct();
  }, []);

  return (
    <section className="min-h-screen ">
      <div className=" mx-auto p-4 h-full flex gap-3">
        <div className="">
          {
            <>
              {product.images.leftImage?.url && (
                <Image
                  src={product.images.leftImage.url}
                  width={500}
                  height={500}
                  className="h-[100px] w-[100px] object-contain"
                  alt="leftImage"
                />
              )}
              {product.images.rightImage?.url && (
                <Image
                  src={product.images.rightImage.url}
                  width={500}
                  height={500}
                  className="h-[100px] w-[100px] object-contain"
                  alt="rightImage"
                />
              )}
              {product.images.frontImage?.url && (
                <Image
                  src={product.images.frontImage.url}
                  width={500}
                  height={500}
                  className="h-[100px] w-[100px] object-contain"
                  alt="frontImage"
                />
              )}
              {product.images.backImage?.url && (
                <Image
                  src={product.images.backImage.url}
                  width={500}
                  height={500}
                  className="h-[100px] w-[100px] object-contain"
                  alt="backImage"
                />
              )}
              {product.images.topImage?.url && (
                <Image
                  src={product.images.topImage.url}
                  width={500}
                  height={500}
                  className="h-[100px] w-[100px] object-contain"
                  alt="topImage"
                />
              )}
              {product.images.bottomImage?.url && (
                <Image
                  src={product.images.bottomImage.url}
                  width={500}
                  height={500}
                  className="h-[100px] w-[100px] object-contain"
                  alt="bottomImage"
                />
              )}
            </>
          }
          <Image
            src={product.images.thumbnail.url ?? ""}
            width={500}
            height={500}
            className="h-[100px] w-[100px] object-contain"
            alt=""
          />
        </div>
        <div className="flex-1 p-2">
          <section className="flex justify-start h-fit  ">
            <div className="flex gap-2">
              <Image
                src={product.images.thumbnail.url ?? ""}
                width={500}
                height={500}
                className="h-[400px] w-[400px] object-contain flex-1"
                alt=""
              />
            </div>
            <div className="flex flex-col gap-3 mt-16 h-full ">
              <Title text={product.productName} className="text-3xl" />
              {product.averageRating}
              <p className="text-2xl font-medium">
                ${product.priceValueInCents / 100} {product.priceCurrency}
              </p>
              <p>{product.productDescription}</p>
              <div className="inline-flex gap-2 items-center">
                <Button className="w-[200px] bg-neutral-700">
                  <IconBasket /> Add to Cart
                </Button>
                <Button className="w-[200px]">
                  <IconCash /> Place Order
                </Button>
              </div>
            </div>
          </section>
          <section className="flex flex-col  gap-3 mt-20 max-w-4xl">
            <div className="relative flex flex-col items-end gap-4">
              <Textarea placeholder="Write a review" className="h-[150px]" />
              <div className="inline-flex items-center gap-3">
                <RatingComponent className="" />
                <Button>Submit</Button>
              </div>
            </div>
            {slug !== undefined && <Reviews productSlug={slug} />}
          </section>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailPage;

interface ReviewProps {
  productSlug: string;
}

interface ProductReviewsResult {
  productReviews: ProductReviewResult[];
  totalCount: number;
  totalFetchedCount: number;
}

interface ProductReviewResult {
  reviewer: ProductReviewUserResult;
  description: string;
  rating: number;
}

interface ProductReviewUserResult {
  id: string;
  fullname: string;
  profileImageUrl: string | null;
}

interface CreateReviewRequest {
  reviewerId: string;
  description: string;
  rating: number;
  productId: string;
}

export const Reviews = ({ productSlug }: ReviewProps) => {
  const pageSize = 5;
  const [reviews, setReviews] = useState<ProductReviewsResult>({
    productReviews: [],
    totalCount: 0,
    totalFetchedCount: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const { apiBaseUrl } = useEnvStore();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${apiBaseUrl}/products/slug/${productSlug}/reviews?pageNumber=${currentPage}&pageSize=${pageSize}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setReviews(data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [currentPage]);

  const totalPages = Math.ceil(reviews.totalCount / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div>
        <Title text="Reviews" className="text-2xl" />
        <div className="space-y-2">
          {Array.from({ length: pageSize }).map((_, index) => (
            <div
              key={index}
              className="w-full h-[76px] bg-neutral-50 animate-pulse rounded-lg border-[1px] border-neutral-200"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Title text={`Reviews (${reviews.totalCount})`} className="text-2xl" />
      <div className="space-y-2">
        {reviews.productReviews.length > 0 ? (
          reviews.productReviews.map((review, index) => (
            <div
              key={index}
              className="w-full h-[100px]  border-b-2  flex items-center gap-3 p-4   "
            >
              <Avatar className="w-14 h-14 group-focus:ring-2 ring-neutral-200">
                <AvatarImage
                  src={review.reviewer.profileImageUrl || undefined}
                />
                <AvatarFallback>
                  {review.reviewer.fullname
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col ">
                  <span className="font-semibold">
                    {review.reviewer.fullname}
                  </span>
                  <span className="text-sm text-neutral-600">
                    <div className="inline-flex items-center gap-1">
                      {Array.from({ length: Math.floor(review.rating) }).map(
                        (_, i) => (
                          <IconStarFilled key={i} size={10} />
                        )
                      )}
                      {review.rating % 1 >= 0.5 && (
                        <IconStarHalfFilled size={10} />
                      )}
                      {Array.from({
                        length: Math.floor(5 - review.rating),
                      }).map((_, i) => (
                        <IconStar key={i} size={10} />
                      ))}
                      <span className="text-xs">({review.rating})</span>
                    </div>
                  </span>
                </div>
                <p>{review.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-neutral-600">No reviews yet.</p>
        )}
        {totalPages > 1 && (
          <PaginationGenerator
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
          />
        )}
      </div>
    </div>
  );
};
