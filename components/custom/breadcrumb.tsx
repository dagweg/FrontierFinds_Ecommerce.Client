"use client";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { capitalize } from "@/lib/utils"; // Assuming you have a capitalize utility
import { Slash } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

interface BreadcrumbDemoProps {
  pathname: string;
}

export function BreadcrumbGenerator() {
  // Split the pathname into segments
  const pathname = decodeURIComponent(usePathname());
  const segments = pathname.split("/").filter(Boolean); // Remove empty strings

  if (pathname === "/") return <></>;

  return (
    <Breadcrumb className="px-4 py-1 ">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {/* {segments.length > 0 && <BreadcrumbSeparator />}{" "} */}
        {/* Conditionally add separator after Home */}
        {segments.length > 2 ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${segments[0]}`}>
                {decodeURIComponent(capitalize(segments[0]))}
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {segments
                    .slice(1, segments.length - 1)
                    .map((segment, index) => {
                      const pathToSegment = segments
                        .slice(0, index + 2)
                        .join("/");
                      return (
                        <DropdownMenuItem key={segment}>
                          <BreadcrumbLink href={`/${pathToSegment}`}>
                            {capitalize(segment)}
                          </BreadcrumbLink>
                        </DropdownMenuItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            {/* <BreadcrumbSeparator /> */}
            <BreadcrumbItem>
              <BreadcrumbPage>
                {capitalize(segments[segments.length - 1])}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          segments.map((segment, index) => {
            const pathToSegment = segments.slice(0, index + 1).join("/");
            const isLast = index === segments.length - 1;
            return (
              <React.Fragment key={segment}>
                <BreadcrumbSeparator key={`sep-${segment}`} />
                <BreadcrumbItem key={segment}>
                  {isLast ? (
                    <BreadcrumbPage>{capitalize(segment)}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={`/${pathToSegment}`}>
                      {capitalize(segment)}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
