// components/ZoomImage.tsx
"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

interface ZoomImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  zoomFactor?: number;
  className?: string;
  containerClassName?: string;
}

const ZoomImage: React.FC<ZoomImageProps> = ({
  src,
  alt,
  width,
  height,
  zoomFactor = 2.5,
  className,
  containerClassName,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const zoomWindowSize = Math.min(width, height); // Size of the zoom window in pixels

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition({
      x: Math.max(0, Math.min(x, width)),
      y: Math.max(0, Math.min(y, height)),
    });
  };

  // Calculate the overlay position for the lens effect
  const getLensPosition = () => {
    const lensSize = 120; // Size of the lens overlay
    let left = position.x - lensSize / 2;
    let top = position.y - lensSize / 2;

    // Keep lens within image bounds
    left = Math.max(0, Math.min(left, width - lensSize));
    top = Math.max(0, Math.min(top, height - lensSize));

    return { left, top, lensSize };
  };

  const lensPos = getLensPosition();

  // Calculate the background position for the zoomed image
  const backgroundX =
    (position.x / width) * (width * zoomFactor - zoomWindowSize);
  const backgroundY =
    (position.y / height) * (height * zoomFactor - zoomWindowSize);

  return (
    <div className={`flex gap-4 ${containerClassName}`}>
      {/* Main Image Container */}
      <div
        ref={imageRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className="relative overflow-hidden cursor-crosshair border border-gray-200 rounded-lg"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`object-contain ${className}`}
        />

        {/* Lens Overlay */}
        {isZoomed && (
          <div
            className="absolute border-2 border-gray-400 bg-white bg-opacity-30 pointer-events-none"
            style={{
              width: `${lensPos.lensSize}px`,
              height: `${lensPos.lensSize}px`,
              left: `${lensPos.left}px`,
              top: `${lensPos.top}px`,
              boxShadow: "0 0 0 1000px rgba(0, 0, 0, 0.3)",
            }}
          />
        )}
      </div>

      {/* Zoom Window */}
      {isZoomed && (
        <div
          className="border border-gray-300 rounded-lg bg-white shadow-lg overflow-hidden"
          style={{
            width: `${zoomWindowSize}px`,
            height: `${zoomWindowSize}px`,
            backgroundImage: `url(${src})`,
            backgroundSize: `${width * zoomFactor}px ${height * zoomFactor}px`,
            backgroundPosition: `-${backgroundX}px -${backgroundY}px`,
            backgroundRepeat: "no-repeat",
          }}
        />
      )}
    </div>
  );
};

export default ZoomImage;
