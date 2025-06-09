"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export function Logo({
  size = "md",
  className,
  gradientFrom = "from-indigo-500",
  gradientTo = "to-indigo-900",
}: LogoProps) {
  const sizeClasses = {
    sm: "text-lg space-y-[-12px]",
    md: "text-2xl space-y-[-20px]",
    lg: "text-4xl space-y-[-32px]",
    xl: "text-6xl space-y-[-48px]",
  };

  return (
    <span
      className={cn(
        `bg-gradient-to-r ${gradientFrom} ${gradientTo} rotate-180 bg-clip-text text-transparent font-futurex whitespace-nowrap flex items-center h-fit`,
        sizeClasses[size],
        className
      )}
    >
      <span className={cn("flex flex-col", sizeClasses[size])}>
        <span>&lt;&gt;&gt;</span>
        <span>&lt;&gt;&gt;</span>
        <span>U</span>
      </span>
    </span>
  );
}

export default Logo;

// Logo variants for different contexts
export function LogoHorizontal({
  size = "md",
  className,
  gradientFrom = "from-indigo-500",
  gradientTo = "to-indigo-900",
}: LogoProps) {
  const sizeClasses = {
    sm: "text-lg gap-2",
    md: "text-2xl gap-3",
    lg: "text-4xl gap-4",
    xl: "text-6xl gap-6",
  };

  return (
    <div className={cn("flex items-center", sizeClasses[size], className)}>
      <Logo size={size} gradientFrom={gradientFrom} gradientTo={gradientTo} />
      <span
        className={cn(
          `bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent font-bold`,
          size === "sm"
            ? "text-lg"
            : size === "md"
            ? "text-2xl"
            : size === "lg"
            ? "text-4xl"
            : "text-6xl"
        )}
      >
        FrontierFinds
      </span>
    </div>
  );
}

// Animated logo variant
export function LogoAnimated({
  size = "md",
  className,
  gradientFrom = "from-indigo-500",
  gradientTo = "to-indigo-900",
}: LogoProps) {
  return (
    <div className={cn("group cursor-pointer", className)}>
      <Logo
        size={size}
        gradientFrom={gradientFrom}
        gradientTo={gradientTo}
        className="group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 ease-out"
      />
    </div>
  );
}

// Logo with background
export function LogoWithBackground({
  size = "md",
  className,
  gradientFrom = "from-indigo-500",
  gradientTo = "to-indigo-900",
  bgVariant = "solid",
}: LogoProps & { bgVariant?: "solid" | "gradient" | "glass" }) {
  const bgClasses = {
    solid:
      "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
    gradient:
      "bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950",
    glass:
      "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50",
  };

  const paddingClasses = {
    sm: "p-2",
    md: "p-3",
    lg: "p-4",
    xl: "p-6",
  };

  return (
    <div
      className={cn(
        "rounded-xl shadow-lg",
        bgClasses[bgVariant],
        paddingClasses[size],
        className
      )}
    >
      <Logo size={size} gradientFrom={gradientFrom} gradientTo={gradientTo} />
    </div>
  );
}
