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
}

const ZoomImage: React.FC<ZoomImageProps> = ({
  src,
  alt,
  width,
  height,
  zoomFactor = 2,
  className,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const zoomWindowSize = 200; // Size of the zoom window in pixels

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

  // Calculate zoom window position to follow mouse
  const getZoomPosition = () => {
    if (!imageRef.current) return { left: 0, top: 0 };

    const padding = 10; // Space between image and zoom window

    let left = position.x - zoomWindowSize / 2;
    let top = position.y - zoomWindowSize / 2;

    // Keep zoom window within container bounds
    if (left < 0) {
      left = padding;
    } else if (left + zoomWindowSize > width) {
      left = width - zoomWindowSize - padding;
    }

    if (top < 0) {
      top = padding;
    } else if (top + zoomWindowSize > height) {
      top = height - zoomWindowSize - padding;
    }

    return { left, top };
  };

  const zoomPos = getZoomPosition();

  // Calculate the background position for the zoomed image
  const backgroundX = position.x * zoomFactor - zoomWindowSize / 2;
  const backgroundY = position.y * zoomFactor - zoomWindowSize / 2;

  return (
    <div
      ref={imageRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden cursor-zoom-in flex"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`object-contain ${className}`}
      />
      {isZoomed && (
        <div
          className="absolute w-[200px] h-[200px] object-fill rounded-md border border-gray-200  bg-no-repeat shadow-md pointer-events-none"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: `${width * zoomFactor}px ${height * zoomFactor}px`,
            backgroundPosition: `-${backgroundX}px -${backgroundY}px`,
            left: `${zoomPos.left}px`,
            top: `${zoomPos.top}px`,
          }}
        />
      )}
    </div>
  );
};

export default ZoomImage;
