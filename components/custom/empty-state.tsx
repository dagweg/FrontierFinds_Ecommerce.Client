"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Search, Package, ShoppingBag, Filter } from "lucide-react";

interface EmptyStateProps {
  type?: "products" | "search" | "cart" | "general";
  title?: string;
  description?: string;
  image?: string;
  actionLabel?: string;
  onAction?: () => void;
  showIcon?: boolean;
  className?: string;
}

const presets = {
  products: {
    icon: Package,
    title: "No products found",
    description:
      "We couldn't find any products matching your criteria. Try adjusting your filters or search terms.",
    actionLabel: "Clear Filters",
    image: "https://imgur.com/dVDXL8m.jpg",
  },
  search: {
    icon: Search,
    title: "No search results",
    description:
      "We couldn't find anything matching your search. Try different keywords or browse our categories.",
    actionLabel: "Clear Search",
    image: "https://imgur.com/dVDXL8m.jpg",
  },
  cart: {
    icon: ShoppingBag,
    title: "Your cart is empty",
    description:
      "Looks like you haven't added any items to your cart yet. Start shopping to fill it up!",
    actionLabel: "Start Shopping",
    image: "https://imgur.com/dVDXL8m.jpg",
  },
  general: {
    icon: Package,
    title: "Nothing here yet",
    description:
      "There's nothing to show at the moment. Check back later or try a different action.",
    actionLabel: "Try Again",
    image: "https://imgur.com/dVDXL8m.jpg",
  },
};

export function EmptyState({
  type = "general",
  title,
  description,
  image,
  actionLabel,
  onAction,
  showIcon = true,
  className = "",
}: EmptyStateProps) {
  const preset = presets[type];
  const IconComponent = preset.icon;

  const displayTitle = title || preset.title;
  const displayDescription = description || preset.description;
  const displayActionLabel = actionLabel || preset.actionLabel;
  const displayImage = image || preset.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
    >
      {/* Icon or Image */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-6"
      >
        {displayImage ? (
          <div className="relative">
            <Image
              src={displayImage}
              width={160}
              height={160}
              alt={displayTitle}
              className="mx-auto grayscale opacity-60 hover:opacity-80 transition-opacity duration-300"
            />
            {showIcon && (
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <IconComponent className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
        ) : (
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center shadow-inner">
            <IconComponent className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
        )}
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-2xl font-semibold text-gray-900 dark:text-white mb-3"
      >
        {displayTitle}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="text-gray-600 dark:text-gray-400 mb-6 max-w-md leading-relaxed"
      >
        {displayDescription}
      </motion.p>

      {/* Action Button */}
      {onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Button
            onClick={onAction}
            variant="outline"
            className="hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300"
          >
            {displayActionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default EmptyState;
