"use client";

import Reviews from "@/app/(pre-login)/store/[slug]/reviews";
import { PaginationGenerator } from "@/components/custom/pagination-generator";
import PriceTag from "@/components/custom/price-tag";
import RatingComponent from "@/components/custom/rating-component";
import RatingDisplay from "@/components/custom/rating-display";
import Title from "@/components/custom/title";
import ZoomImage from "@/components/custom/zoom-image";
import { useSession } from "@/components/providers/session-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/zustand/useCartStore";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import {
  ProductImageResult,
  ProductResult,
  ProductReviewsResult,
} from "@/types/product.types";
import {
  IconBasket,
  IconCash,
  IconCircleFilled,
  IconMoneybag,
  IconStar,
  IconStarFilled,
  IconStarHalfFilled,
  IconStarOff,
} from "@tabler/icons-react";
import { url } from "inspector";
import { Circle, CircleDashed, ExternalLink, StarIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useLayoutEffect, useState } from "react";

function ProductDetailPage() {
  const pathname = usePathname();
  const router = useRouter();
  const slug = pathname?.split("/").pop();

  const { apiBaseUrl } = useEnvStore();

  const {
    isLoggedIn,
    userSessionInfo: { userId },
  } = useSession();

  const [selectedImage, setSelectedImage] =
    useState<ProductImageResult | null>();

  const [seller, setSeller] = useState<UserResult>();

  const [isMyProduct, setIsMyProduct] = useState(false);

  const cartStore = useCartStore();

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
    totalReviews: 0,
  });

  const [review, setReview] = useState({
    rating: 0,
    description: "",
    productId: product.productId,
    submitLoading: false,
  });

  const [reviews, setReviews] = useState<ProductReviewsResult>({
    productReviews: [],
    totalCount: 0,
    totalFetchedCount: 0,
  });

  const handleAddToCart = () => {
    cartStore.addToCart(product.productId);
  };

  const handleReviewSubmit = () => {
    if (review.rating > 0 && review.description.trim() !== "") {
      setReview({ ...review, submitLoading: true });
      fetch(`${apiBaseUrl}/products/review`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
      }).then(async (r) => {
        const b = await r.json();

        if (r.ok) {
          setReview({ ...review, rating: 0, description: "" });
          setReviews({
            ...reviews,
            productReviews: [...reviews.productReviews, b],
          });
        } else {
          alert("Failed to submit review");
        }
        setReview({ ...review, submitLoading: false });
      });
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const r = await fetch(`${apiBaseUrl}/products/slug/${slug}`, {
        method: "GET",
        credentials: "include",
      });
      const b = await r.json();

      if (r.ok) {
        setProduct(b);
        fetchSeller(b.sellerId);
        setIsMyProduct(b.sellerId === userId);
        setSelectedImage(b.images.thumbnail);
        setReview({ ...review, productId: b.productId });
      } else if (r.status === 404) {
        router.push("/not-found");
      }
    };

    const fetchSeller = async (sellerId: string) => {
      const r = await fetch(`${apiBaseUrl}/users/${sellerId}`, {
        method: "GET",
        credentials: "include",
      });
      const b = await r.json();

      if (r.ok) {
        setSeller(b);
      }
    };

    fetchProduct();
  }, []);

  return (
    <section className="min-h-screen bg-white">
      <div className=" mx-auto p-4 h-full flex gap-3">
        <div className="">
          {
            <>
              {product.images.leftImage?.url && (
                <Image
                  src={product.images.leftImage.url}
                  onClick={() => setSelectedImage(product.images.leftImage)}
                  width={500}
                  height={500}
                  className="h-[100px] w-[100px] object-contain hover:ring-4 duration-100 ring-neutral-300 cursor-pointer active:ring-2 rounded-lg"
                  alt="leftImage"
                />
              )}
              {product.images.rightImage?.url && (
                <Image
                  src={product.images.rightImage.url}
                  onClick={() => setSelectedImage(product.images.rightImage)}
                  width={500}
                  height={500}
                  className="h-[100px] w-[100px] object-contain hover:ring-4 duration-100 ring-neutral-300 cursor-pointer active:ring-2 rounded-lg"
                  alt="rightImage"
                />
              )}
              {product.images.frontImage?.url && (
                <Image
                  src={product.images.frontImage.url}
                  onClick={() => setSelectedImage(product.images.frontImage)}
                  width={500}
                  height={500}
                  className="h-[100px] w-[100px] object-contain hover:ring-4 duration-100 ring-neutral-300 cursor-pointer active:ring-2 rounded-lg"
                  alt="frontImage"
                />
              )}
              {product.images.backImage?.url && (
                <Image
                  src={product.images.backImage.url}
                  onClick={() => setSelectedImage(product.images.backImage)}
                  width={500}
                  height={500}
                  className="h-[100px] w-[100px] object-contain hover:ring-4 duration-100 ring-neutral-300 cursor-pointer active:ring-2 rounded-lg"
                  alt="backImage"
                />
              )}
              {product.images.topImage?.url && (
                <Image
                  src={product.images.topImage.url}
                  onClick={() => setSelectedImage(product.images.topImage)}
                  width={500}
                  height={500}
                  className="h-[100px] w-[100px] object-contain hover:ring-4 duration-100 ring-neutral-300 cursor-pointer active:ring-2 rounded-lg"
                  alt="topImage"
                />
              )}
              {product.images.bottomImage?.url && (
                <Image
                  src={product.images.bottomImage.url}
                  onClick={() => setSelectedImage(product.images.bottomImage)}
                  width={500}
                  height={500}
                  className="h-[100px] w-[100px] object-contain hover:ring-4 duration-100 ring-neutral-300 cursor-pointer active:ring-2 rounded-lg"
                  alt="bottomImage"
                />
              )}
            </>
          }

          {product.images.thumbnail?.url && (
            <Image
              src={product.images.thumbnail?.url}
              onClick={() => setSelectedImage(product.images.thumbnail)}
              width={500}
              height={500}
              className="h-[100px] w-[100px] object-contain hover:ring-4 duration-100 ring-neutral-300 cursor-pointer active:ring-2 rounded-lg"
              alt=""
            />
          )}
        </div>
        <div className="flex-1 p-2 ">
          <section className="flex justify-start h-fit  gap-3">
            <div className="flex-1 flex gap-4">
              <div className="sticky top-[85px] h-fit">
                <ZoomImage
                  src={selectedImage?.url ?? "https://imgur.com/zVWz723.jpg"}
                  width={500}
                  height={500}
                  className="h-[400px] w-[400px] object-contain flex-1"
                  alt=""
                />
              </div>

              <div className="flex flex-col gap-3 pt-16 flex-1 h-full">
                <Title text={product.productName} className="text-3xl" />
                <span className="text-sm text-neutral-600">
                  <div className="inline-flex items-center gap-3">
                    <RatingDisplay rating={product.averageRating} />
                    <span className="">({product.averageRating})</span>
                    <IconCircleFilled size={5} color="black" />
                    <span
                      className="hover:underline underline-offset-2 cursor-pointer  "
                      onClick={() =>
                        window.scrollTo({
                          top: document.body.scrollHeight,
                        })
                      }
                    >
                      {reviews.totalCount} reviews
                    </span>
                  </div>
                </span>
                <PriceTag
                  priceValue={product.priceValueInCents}
                  fontWeight="bold"
                  originalPriceValue={product.priceValueInCents + 1000}
                  isOnSale={true}
                  size="large"
                />
                <p>{product.productDescription}</p>
                {isLoggedIn && !isMyProduct && (
                  <div className="inline-flex gap-2 items-center">
                    <Button className="w-[200px] " onClick={handleAddToCart}>
                      <IconBasket /> Add to Cart
                    </Button>
                  </div>
                )}
              </div>
            </div>
            {/* {seller && (
              <>
                <div className="w-[300px] border-2  h-fit flex flex-col p-5 mx-auto">
                  <h2 className="text-lg font-semibold mb-4">
                    Seller Information
                  </h2>
                  <div className="flex gap-2">
                    <Avatar className="w-12 h-12 group-focus:ring-2 ring-neutral-200">
                      <AvatarImage src={seller?.profileImage?.url} />
                      <AvatarFallback>
                        {seller?.firstName[0] + seller?.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span
                        onClick={() =>
                          router.push(`/profile/${seller?.userId}`)
                        }
                        className="font-semibold inline-flex items-center gap-2 hover:underline cursor-pointer"
                        title="View Profile"
                      >
                        {seller?.firstName + seller?.lastName}
                        <ExternalLink size={15} />
                      </span>
                      <span className="text-sm text-neutral-600">
                        {seller?.email}
                      </span>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-col justify-between h-[100px]">
                    <div>
                      <h3>Total Sales: 12,110</h3>
                      <h3>Seller rating: 4.8/5</h3>
                    </div>
                    <Button
                      variant={"link"}
                      className="w-fit self-end"
                      onClick={() =>
                        router.push(
                          `mailto:${seller.email}?subject=Inquiry from Frontier Finds&body=Hello, I am interested in...`
                        )
                      }
                    >
                      Contact Seller
                    </Button>
                  </div>
                </div>
              </>
            )} */}
          </section>
          <section className="flex flex-col  gap-3 mt-20 max-w-4xl">
            <div className="relative flex flex-col items-end gap-4">
              <Textarea
                placeholder="Write a review"
                className="h-[150px]"
                value={review.description}
                onChange={(e) =>
                  setReview({ ...review, description: e.target.value })
                }
              />
              <div className="inline-flex items-center gap-3">
                <RatingComponent
                  className=""
                  onRatingChange={(r) => setReview({ ...review, rating: r })}
                />
                <Button onClick={handleReviewSubmit}>
                  {!review.submitLoading ? (
                    <span>Submit</span>
                  ) : (
                    <>
                      Submitting <CircleDashed className="animate-spin" />
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div>
              {slug !== undefined && (
                <Reviews
                  reviews={reviews}
                  setReviews={setReviews}
                  productSlug={slug}
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailPage;
