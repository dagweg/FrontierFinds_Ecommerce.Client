// components/Carousel.js
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Carousel = ({
  children,
  className,
  slidesPerView = 1,
}: {
  children: React.ReactNode;
  className?: string;
  slidesPerView?: number;
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef(null);

  const slidesCount = React.Children.count(children);
  const slideWidthPercentage = 100 / slidesPerView;

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prevSlide) => {
      const next = (prevSlide + 1) % slidesCount;

      return next;
    });
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prevSlide) => {
      const prev = (prevSlide - 1 + slidesCount) % slidesCount;

      return prev;
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const transformValue = `translateX(-${currentSlide * slideWidthPercentage}%)`;

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Carousel Container */}
      <div
        className="relative flex transition-transform duration-300 ease-out w-full h-full"
        style={{ transform: transformValue }} // Use the variable here
        ref={carouselRef}
      >
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            className="flex-shrink-0 h-full"
            style={{ width: `${slideWidthPercentage}%` }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2 focus:outline-none"
        aria-label="Previous Slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2 focus:outline-none"
        aria-label="Next Slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default Carousel;
