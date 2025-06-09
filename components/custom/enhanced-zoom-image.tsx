"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface EnhancedZoomImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  zoomFactor?: number;
  className?: string;
  containerClassName?: string;
  lensSize?: number;
  zoomWindowSize?: number;
  showZoomText?: boolean;
}

const EnhancedZoomImage: React.FC<EnhancedZoomImageProps> = ({
  src,
  alt,
  width = 500,
  height = 500,
  zoomFactor = 2.5,
  className = "",
  containerClassName = "",
  lensSize = 120,
  zoomWindowSize = 400,
  showZoomText = true,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!isMobile) {
      setIsZoomed(true);
    }
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) {
      setIsZoomed(false);
    }
  }, [isMobile]);

  const handleTouchStart = useCallback(() => {
    if (isMobile) {
      setIsZoomed(true);
    }
  }, [isMobile]);

  const handleTouchEnd = useCallback(() => {
    if (isMobile) {
      setTimeout(() => setIsZoomed(false), 2000); // Auto-hide after 2 seconds on mobile
    }
  }, [isMobile]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!imageRef.current || isMobile) return;

      const rect = imageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setPosition({
        x: Math.max(0, Math.min(x, width)),
        y: Math.max(0, Math.min(y, height)),
      });
    },
    [width, height, isMobile]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!imageRef.current || !isMobile) return;

      const rect = imageRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      setPosition({
        x: Math.max(0, Math.min(x, width)),
        y: Math.max(0, Math.min(y, height)),
      });
    },
    [width, height, isMobile]
  );

  // Calculate the lens position
  const getLensPosition = useCallback(() => {
    let left = position.x - lensSize / 2;
    let top = position.y - lensSize / 2;

    // Keep lens within image bounds
    left = Math.max(0, Math.min(left, width - lensSize));
    top = Math.max(0, Math.min(top, height - lensSize));

    return { left, top };
  }, [position.x, position.y, lensSize, width, height]);

  const lensPos = getLensPosition();

  // Calculate the background position for the zoomed image
  const getZoomPosition = useCallback(() => {
    const backgroundX =
      (position.x / width) * (width * zoomFactor - zoomWindowSize);
    const backgroundY =
      (position.y / height) * (height * zoomFactor - zoomWindowSize);

    return {
      backgroundX: Math.max(
        0,
        Math.min(backgroundX, width * zoomFactor - zoomWindowSize)
      ),
      backgroundY: Math.max(
        0,
        Math.min(backgroundY, height * zoomFactor - zoomWindowSize)
      ),
    };
  }, [position.x, position.y, width, height, zoomFactor, zoomWindowSize]);

  const { backgroundX, backgroundY } = getZoomPosition();

  return (
    <div className={`flex gap-4 lg:gap-6 ${containerClassName}`}>
      {/* Main Image Container */}
      <div className="relative flex-shrink-0">
        <div
          ref={imageRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          className={`relative overflow-hidden cursor-crosshair border border-gray-200 rounded-lg shadow-sm transition-all duration-200 ${
            isZoomed
              ? "shadow-lg border-blue-300"
              : "hover:shadow-md hover:border-gray-300"
          }`}
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`object-contain transition-opacity duration-200 ${className}`}
            onLoad={() => setIsImageLoaded(true)}
            priority
          />

          {/* Loading overlay */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
              <div className="text-gray-400 text-sm">Loading...</div>
            </div>
          )}

          {/* Lens Overlay */}
          <AnimatePresence>
            {isZoomed && isImageLoaded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="absolute border-2 border-blue-400 bg-white bg-opacity-20 pointer-events-none rounded-sm"
                style={{
                  width: `${lensSize}px`,
                  height: `${lensSize}px`,
                  left: `${lensPos.left}px`,
                  top: `${lensPos.top}px`,
                  boxShadow: "0 0 0 1000px rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(1px)",
                }}
              />
            )}
          </AnimatePresence>

          {/* Zoom instruction text */}
          {showZoomText && !isZoomed && isImageLoaded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded"
            >
              {isMobile ? "Touch to zoom" : "Hover to zoom"}
            </motion.div>
          )}
        </div>
      </div>

      {/* Zoom Window - Only show on desktop */}
      <AnimatePresence>
        {isZoomed && isImageLoaded && !isMobile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="border border-gray-300 rounded-lg bg-white shadow-xl overflow-hidden flex-shrink-0 hidden lg:block"
            style={{
              width: `${zoomWindowSize}px`,
              height: `${zoomWindowSize}px`,
              backgroundImage: `url(${src})`,
              backgroundSize: `${width * zoomFactor}px ${
                height * zoomFactor
              }px`,
              backgroundPosition: `-${backgroundX}px -${backgroundY}px`,
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Zoom window label */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              Zoomed View
            </div>
            {/* Optional: Add a subtle inner shadow for depth */}
            <div className="absolute inset-0 shadow-inner pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedZoomImage;
