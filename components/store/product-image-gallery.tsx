"use client";

import { ProductImageResult, ProductResult } from "@/types/product.types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import AmazonZoomImage from "@/components/custom/enhanced-zoom-image";
import { useMemo } from "react";

interface ProductImageGalleryProps {
  images: ProductResult["images"];
  selectedImage: ProductImageResult | null;
  onImageSelect: (image: ProductImageResult) => void;
  productName: string;
}

export function ProductImageGallery({
  images,
  selectedImage,
  onImageSelect,
  productName,
}: ProductImageGalleryProps) {
  const imageList = useMemo(() => {
    const list: { key: string; image: ProductImageResult; label: string }[] =
      [];

    if (images.thumbnail?.url) {
      list.push({ key: "thumbnail", image: images.thumbnail, label: "Main" });
    }

    const additionalImages = [
      { key: "frontImage", image: images.frontImage, label: "Front" },
      { key: "backImage", image: images.backImage, label: "Back" },
      { key: "leftImage", image: images.leftImage, label: "Left" },
      { key: "rightImage", image: images.rightImage, label: "Right" },
      { key: "topImage", image: images.topImage, label: "Top" },
      { key: "bottomImage", image: images.bottomImage, label: "Bottom" },
    ];

    additionalImages.forEach(({ key, image, label }) => {
      if (image?.url) {
        list.push({ key, image, label });
      }
    });

    return list;
  }, [images]);

  const fallbackImage = "https://imgur.com/zVWz723.jpg";
  return (
    <div className="w-full h-full">
      {/* Mobile Layout - Stacked */}
      <div className="flex flex-col lg:hidden gap-4">
        {/* Main Image - Mobile */}
        <div className="w-full">
          <motion.div
            key={selectedImage?.url}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative w-full"
          >
            <AmazonZoomImage
              src={selectedImage?.url || fallbackImage}
              width={320}
              height={320}
              className="object-contain"
              alt={productName}
              zoomFactor={2}
              containerClassName="w-full"
              zoomWindowSize={280}
              lensSize={80}
              showZoomText={false}
            />

            {/* Image Counter - Mobile */}
            {imageList.length > 1 && (
              <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs z-20">
                {imageList.findIndex(
                  (img) => img.image.url === selectedImage?.url
                ) + 1}{" "}
                / {imageList.length}
              </div>
            )}
          </motion.div>
        </div>

        {/* Thumbnail Strip - Mobile (Horizontal) */}
        <div className="flex gap-2 overflow-x-auto pb-2 px-1">
          {imageList.map(({ key, image, label }) => (
            <motion.div
              key={key}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200",
                selectedImage?.url === image.url
                  ? "border-blue-500 ring-2 ring-blue-500/20"
                  : "border-gray-200"
              )}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100">
                <Image
                  src={image.url || fallbackImage}
                  alt={`${productName} - ${label}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-contain p-1"
                  onClick={() => onImageSelect(image)}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Desktop Layout - Side by Side */}
      <div className="hidden lg:flex gap-4 h-full">
        {/* Thumbnail Strip - Desktop */}
        <div className="flex flex-col gap-3 w-20 lg:w-24 flex-shrink-0">
          {imageList.map(({ key, image, label }) => (
            <motion.div
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200",
                selectedImage?.url === image.url
                  ? "border-blue-500 ring-2 ring-blue-500/20"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
                <Image
                  src={image.url || fallbackImage}
                  alt={`${productName} - ${label}`}
                  width={100}
                  height={100}
                  className="w-full h-full object-contain p-2"
                  onClick={() => onImageSelect(image)}
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                {label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Image - Desktop */}
        <div className="flex-1 min-w-0">
          <motion.div
            key={selectedImage?.url}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <AmazonZoomImage
              src={selectedImage?.url || fallbackImage}
              width={450}
              height={450}
              className="object-contain"
              alt={productName}
              zoomFactor={3}
              containerClassName="w-full"
              zoomWindowSize={400}
              lensSize={120}
              showZoomText={true}
            />

            {/* Image Counter - Desktop */}
            {imageList.length > 1 && (
              <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm z-20">
                {imageList.findIndex(
                  (img) => img.image.url === selectedImage?.url
                ) + 1}{" "}
                / {imageList.length}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Mobile-friendly note */}
      <div className="mt-3 lg:hidden">
        <p className="text-xs text-gray-500 text-center">
          Tap on image to zoom • Swipe thumbnails to see more
        </p>
      </div>
    </div>
  );
}
