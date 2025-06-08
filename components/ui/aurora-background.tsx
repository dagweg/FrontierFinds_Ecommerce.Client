"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col  h-[100vh] items-center justify-center bg-zinc-50 dark:bg-zinc-900  text-slate-950 transition-bg",
          className
        )}
        {...props}
      >
        {" "}
        <div className="absolute inset-0 overflow-hidden">
          {/* Aurora Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />

          {/* Animated Aurora Effects */}
          <div className="absolute inset-0">
            {/* Primary Aurora Blob */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-aurora-float" />

            {/* Secondary Aurora Blob */}
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/25 to-pink-500/25 rounded-full blur-3xl animate-aurora-drift" />

            {/* Tertiary Aurora Blob */}
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-gradient-to-bl from-cyan-300/20 to-blue-500/20 rounded-full blur-2xl animate-aurora-pulse" />

            {/* Moving Particles */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-aurora-sparkle" />
              <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-aurora-twinkle" />
              <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-aurora-glow" />
              <div className="absolute top-1/6 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-aurora-fade" />
            </div>
          </div>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/20 dark:from-transparent dark:via-black/10 dark:to-black/30" />

          {/* Radial Gradient Overlay */}
          {showRadialGradient && (
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-white/30 dark:to-black/50" />
          )}
        </div>
        {children}
      </div>
    </main>
  );
};
