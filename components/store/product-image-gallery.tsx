"use client";

import { ProductImageResult, ProductResult } from "@/types/product.types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import ZoomImage from "@/components/custom/zoom-image";
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
    <div className="flex gap-6">
      {/* Thumbnail Strip */}
      <div className="flex flex-col gap-3 w-24">
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

      {/* Main Image */}
      <div className="flex-1 sticky top-20 h-fit">
        <motion.div
          key={selectedImage?.url}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative  rounded-2xl overflow-hidden "
        >
          <ZoomImage
            src={selectedImage?.url || fallbackImage}
            width={600}
            height={600}
            className="w-full h-[600px] object-contain p-8"
            alt={productName}
            zoomFactor={2.5}
          />

          {/* Image Counter */}
          {imageList.length > 1 && (
            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {imageList.findIndex(
                (img) => img.image.url === selectedImage?.url
              ) + 1}{" "}
              / {imageList.length}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
