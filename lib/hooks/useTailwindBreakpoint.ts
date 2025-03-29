import { useState, useEffect } from "react";

// Define Tailwind breakpoints as a type
export type TailwindBreakpoint =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | undefined;

// Tailwind breakpoints in pixels (you can customize these if needed)
const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

function getTailwindBreakpoint(width: number): TailwindBreakpoint {
  if (width >= breakpoints["2xl"]) {
    return "2xl";
  } else if (width >= breakpoints.xl) {
    return "xl";
  } else if (width >= breakpoints.lg) {
    return "lg";
  } else if (width >= breakpoints.md) {
    return "md";
  } else if (width >= breakpoints.sm) {
    return "sm";
  } else if (width >= breakpoints.xs) {
    // Technically always true if width >= 0, but kept for clarity
    return "xs";
  } else {
    return undefined; // Should not really happen unless width is negative, which is invalid
  }
}

function useTailwindBreakpoint(): TailwindBreakpoint {
  const [breakpoint, setBreakpoint] = useState<TailwindBreakpoint>(
    getTailwindBreakpoint(window.innerWidth)
  );

  useEffect(() => {
    function handleResize() {
      setBreakpoint(getTailwindBreakpoint(window.innerWidth));
    }

    window.addEventListener("resize", handleResize);

    // Initial check on mount (already done in useState initial value, but good practice to include)
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array means this effect runs only on mount and unmount

  return breakpoint;
}

export default useTailwindBreakpoint;
