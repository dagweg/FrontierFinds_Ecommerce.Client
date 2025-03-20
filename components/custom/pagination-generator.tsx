"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import clsx from "clsx";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  windowSize?: number;
  onPageChange: (page: number) => void; // Added callback prop
}

export function PaginationGenerator({
  currentPage,
  totalPages,
  windowSize = 10,
  onPageChange,
}: PaginationProps) {
  const pages: number[] = [];

  let startPage = currentPage - 5 < 1 ? 1 : currentPage - 5;
  for (let i = 0; i < windowSize; i++) {
    if (startPage + i > totalPages) break;
    pages.push(startPage + i);
  }

  const handlePageClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem className="cursor-pointer">
          <PaginationPrevious
            onClick={() => handlePageClick(currentPage - 1)}
            className={clsx(
              currentPage <= 1 && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>
        {currentPage > 2 && pages[0] !== 1 && (
          <>
            <PaginationItem className="cursor-pointer">
              <PaginationLink onClick={() => handlePageClick(1)}>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}
        {pages.map((p) => (
          <PaginationItem
            key={p}
            className={clsx(
              currentPage === p && "bg-neutral-200 rounded-md",
              "cursor-pointer"
            )}
          >
            <PaginationLink onClick={() => handlePageClick(p)}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        {currentPage < totalPages - 1 &&
          pages[pages.length - 1] !== totalPages && (
            <>
              <PaginationItem className="cursor-pointer">
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem className="cursor-pointer">
                <PaginationLink onClick={() => handlePageClick(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageClick(currentPage + 1)}
            className={clsx(
              currentPage >= totalPages && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
