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
import { unprotectedPaths } from "@/middleware";
import { Slash } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

interface BreadcrumbDemoProps {
  pathname: string;
}

export function BreadcrumbGenerator() {
  // Split the pathname into segments
  const pathname = decodeURIComponent(usePathname() ?? "");
  const segments = pathname.split("/").filter(Boolean); // Remove empty strings

  if (segments.length <= 1 || segments[0] === "profile") return <></>;

  const MakeReadable = (s: string) => {
    let res = s
      .trim()
      .split("-")
      .map((x) => capitalize(x))
      .join(" ");
    if (res.length > 20) {
      res = res.slice(0, 20) + "...";
    }
    return res;
  };

  return (
    <Breadcrumb className="px-4 py-1 bg-white">
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
                            {MakeReadable(segment)}
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
                {MakeReadable(segments[segments.length - 1])}
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
                    <BreadcrumbPage>{MakeReadable(segment)}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={`/${pathToSegment}`}>
                      {MakeReadable(segment)}
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
