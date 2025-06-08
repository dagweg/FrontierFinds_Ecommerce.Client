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
import { capitalize } from "@/lib/utils";
import { ChevronDown, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

// Configuration for path exclusions and customizations
const BREADCRUMB_CONFIG = {
  excludedPaths: ["profile"],
  minSegmentsToShow: 2,
  maxVisibleSegments: 3,
  maxLabelLength: 25,
  homeLabel: "Home",
  homeIcon: true,
} as const;

// Route name mappings for better display names
const ROUTE_MAPPINGS: Record<string, string> = {
  "my-products": "My Products",
  "my-purchases": "My Purchases",
  "create-product-listing": "Create Listing",
  "pre-login": "Browse",
  postlogin: "Account",
  signin: "Sign In",
  signup: "Sign Up",
  verify: "Verify Account",
  checkout: "Checkout",
  success: "Success",
  cancel: "Cancelled",
  cart: "Shopping Cart",
  store: "Store",
  settings: "Settings",
  accounts: "Account",
};

interface BreadcrumbSegment {
  label: string;
  href: string;
  isLast: boolean;
}

interface BreadcrumbGeneratorProps {
  className?: string;
  showHomeIcon?: boolean;
  maxSegments?: number;
  excludedPaths?: readonly string[];
}

/**
 * Enhanced Breadcrumb Generator Component
 * Provides intelligent breadcrumb navigation with collapsible middle segments
 */
export function BreadcrumbGenerator({
  className = "px-4 py-2  backdrop-blur-sm border-b border-gray-100 max-w-7xl mx-auto w-full",
  showHomeIcon = BREADCRUMB_CONFIG.homeIcon,
  maxSegments = BREADCRUMB_CONFIG.maxVisibleSegments,
  excludedPaths = BREADCRUMB_CONFIG.excludedPaths,
}: BreadcrumbGeneratorProps = {}) {
  const pathname = usePathname();

  // Memoized breadcrumb segments processing
  const breadcrumbSegments = useMemo(() => {
    if (!pathname) return [];

    const decodedPath = decodeURIComponent(pathname);
    const segments = decodedPath.split("/").filter(Boolean);

    // Early return for excluded paths or insufficient segments
    if (
      segments.length < BREADCRUMB_CONFIG.minSegmentsToShow ||
      excludedPaths.some((path) => segments.includes(path))
    ) {
      return [];
    }

    return segments.map((segment, index) => ({
      label: formatSegmentLabel(segment),
      href: `/${segments.slice(0, index + 1).join("/")}`,
      isLast: index === segments.length - 1,
    }));
  }, [pathname, excludedPaths]);

  // Don't render if no segments
  if (breadcrumbSegments.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb navigation" className={className}>
      <Breadcrumb>
        <BreadcrumbList>
          {/* Home Link */}
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {showHomeIcon && <Home className="h-4 w-4" />}
              {BREADCRUMB_CONFIG.homeLabel}
            </BreadcrumbLink>
          </BreadcrumbItem>

          {/* Dynamic Breadcrumb Segments */}
          {renderBreadcrumbSegments(breadcrumbSegments, maxSegments)}
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  );
}

/**
 * Formats a URL segment into a readable label
 */
function formatSegmentLabel(segment: string): string {
  // Check for custom mapping first
  if (ROUTE_MAPPINGS[segment]) {
    return ROUTE_MAPPINGS[segment];
  }

  // Process kebab-case and underscore-case
  let formatted = segment
    .trim()
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => capitalize(word.toLowerCase()))
    .join(" ");

  // Handle URL encoded characters
  formatted = decodeURIComponent(formatted);

  // Truncate if too long
  if (formatted.length > BREADCRUMB_CONFIG.maxLabelLength) {
    formatted =
      formatted.slice(0, BREADCRUMB_CONFIG.maxLabelLength - 3) + "...";
  }

  return formatted;
}

/**
 * Renders breadcrumb segments with intelligent collapsing
 */
function renderBreadcrumbSegments(
  segments: BreadcrumbSegment[],
  maxSegments: number
): React.ReactNode {
  if (segments.length === 0) return null;

  // If we have few segments, show them all
  if (segments.length <= maxSegments) {
    return segments.map((segment, index) => (
      <React.Fragment key={segment.href}>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {segment.isLast ? (
            <BreadcrumbPage className="font-medium text-gray-900">
              {segment.label}
            </BreadcrumbPage>
          ) : (
            <BreadcrumbLink
              href={segment.href}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {segment.label}
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
      </React.Fragment>
    ));
  }

  // For many segments, show first, ellipsis, and last
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];
  const middleSegments = segments.slice(1, -1);

  return (
    <>
      {/* First segment */}
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink
          href={firstSegment.href}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          {firstSegment.label}
        </BreadcrumbLink>
      </BreadcrumbItem>

      {/* Collapsed middle segments */}
      {middleSegments.length > 0 && (
        <>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:bg-gray-100 rounded px-2 py-1 transition-colors">
                <BreadcrumbEllipsis className="h-4 w-4" />
                <ChevronDown className="h-3 w-3" />
                <span className="sr-only">Show hidden breadcrumbs</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {middleSegments.map((segment) => (
                  <DropdownMenuItem key={segment.href} asChild>
                    <BreadcrumbLink
                      href={segment.href}
                      className="w-full text-gray-700 hover:text-gray-900"
                    >
                      {segment.label}
                    </BreadcrumbLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
        </>
      )}

      {/* Last segment (current page) */}
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage className="font-medium text-gray-900">
          {lastSegment.label}
        </BreadcrumbPage>
      </BreadcrumbItem>
    </>
  );
}
