import { PaginationGenerator } from "@/components/custom/pagination-generator";
import Title from "@/components/custom/title";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import { ProductReviewsResult } from "@/types/product.types";
import { IconStarFilled, IconStar } from "@tabler/icons-react";
import { useState, useEffect } from "react";

interface ReviewProps {
  productSlug: string;
  reviews: ProductReviewsResult;
  setReviews: (reviews: ProductReviewsResult) => void;
}

const Reviews = ({ productSlug, reviews, setReviews }: ReviewProps) => {
  const pageSize = 5;

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
              className={cn(
                "w-full h-[100px]    flex items-center gap-3 p-4   ",
                index < reviews.productReviews.length - 1 && "border-b-2"
              )}
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
                          <IconStarFilled key={i} size={15} color="orange" />
                        )
                      )}
                      {Array.from({
                        length: Math.ceil(5 - review.rating),
                      }).map((_, i) => (
                        <IconStar key={i} size={15} />
                      ))}
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

export default Reviews;
