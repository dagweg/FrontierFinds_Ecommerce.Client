import { motion } from "motion/react";
import React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Link from "next/link";
import {
  ShoppingCart,
  Star,
  Sparkles,
  ArrowRight,
  Laptop,
  Smartphone,
  Headphones,
  Package,
  Gift,
} from "lucide-react";

// Floating Animation Component
const FloatingElements = () => {
  const floatingItems = [
    {
      Icon: Laptop,
      position: { top: "10%", left: "5%" },
      size: "w-7 h-7",
      delay: 0,
      color: "text-blue-300",
      bgGradient: "from-blue-500/30 via-cyan-500/20 to-purple-500/30",
    },
    {
      Icon: Smartphone,
      position: { top: "15%", right: "8%" },
      size: "w-6 h-6",
      delay: 1,
      color: "text-green-300",
      bgGradient: "from-green-500/30 via-emerald-500/20 to-teal-500/30",
    },
    {
      Icon: Headphones,
      position: { top: "75%", left: "8%" },
      size: "w-6 h-6",
      delay: 2,
      color: "text-purple-300",
      bgGradient: "from-purple-500/30 via-pink-500/20 to-indigo-500/30",
    },
    {
      Icon: Gift,
      position: { top: "80%", right: "12%" },
      size: "w-6 h-6",
      delay: 3,
      color: "text-rose-300",
      bgGradient: "from-rose-500/30 via-pink-500/20 to-red-500/30",
    },
    {
      Icon: Package,
      position: { top: "85%", left: "15%" },
      size: "w-7 h-7",
      delay: 4,
      color: "text-cyan-300",
      bgGradient: "from-cyan-500/30 via-blue-500/20 to-indigo-500/30",
    },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {floatingItems.map((item, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={item.position}
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{
            opacity: [0, 0.6, 0.4, 0.8, 0.5],
            y: [0, -15, 3, -12, 5],
            scale: [0.9, 1.05, 0.95, 1.1, 0.98],
            rotate: [0, 4, -2, 6, -1],
          }}
          transition={{
            duration: 12,
            delay: item.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          whileHover={{
            scale: 1.2,
            rotate: 8,
            y: -5,
            transition: { duration: 0.3 },
          }}
        >
          <div className="relative group">
            {" "}
            {/* Subtle layered glowing backgrounds */}
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`absolute inset-0 bg-gradient-to-r ${item.bgGradient} rounded-full blur-md -m-2`}
            />
            <motion.div
              animate={{
                rotate: [360, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-gradient-to-l from-cyan-400/20 via-purple-400/15 to-orange-400/20 rounded-full blur-sm -m-1"
            />
            {/* Icon container with subtle effects */}
            <motion.div
              className="relative p-2.5 rounded-full bg-white/12 backdrop-blur-sm border border-white/25 shadow-xl"
              whileHover={{
                scale: 1.15,
                rotate: [0, -3, 3, 0],
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              }}
              animate={{
                boxShadow: [
                  "0 0 15px rgba(255, 255, 255, 0.2)",
                  "0 0 25px rgba(255, 255, 255, 0.4)",
                  "0 0 15px rgba(255, 255, 255, 0.2)",
                ],
              }}
              transition={{
                duration: 0.4,
                boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              {" "}
              {/* Subtle inner glow */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${item.bgGradient} rounded-full`}
                animate={{ opacity: [0.15, 0.25, 0.15] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <item.Icon
                className={`${item.size} ${item.color} group-hover:text-white transition-all duration-300 relative z-10 drop-shadow-md`}
                style={{
                  filter:
                    "drop-shadow(0 0 8px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 16px currentColor)",
                }}
              />
              {/* Subtle sparkle effect on hover */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-0.5 h-0.5 bg-white rounded-full"
                    style={{
                      top: `${25 + Math.random() * 50}%`,
                      left: `${25 + Math.random() * 50}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.15,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      ))}{" "}
      {/* Optimized floating particles with reduced count and subtle effects */}
      {Array.from({ length: 8 }).map((_, index) => {
        const shapes = ["circle", "star", "diamond"];
        const colors = [
          "from-purple-400/40 to-pink-400/40",
          "from-blue-400/40 to-cyan-400/40",
          "from-orange-400/40 to-yellow-400/40",
        ];
        const shape = shapes[index % shapes.length];
        const color = colors[index % colors.length];

        return (
          <motion.div
            key={`particle-${index}`}
            className={`absolute w-2 h-2 bg-gradient-to-r ${color} opacity-40 shadow-sm`}
            style={{
              top: `${15 + Math.random() * 70}%`,
              left:
                index < 4
                  ? `${Math.random() * 15}%`
                  : `${85 + Math.random() * 15}%`,
              clipPath:
                shape === "star"
                  ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
                  : shape === "diamond"
                  ? "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
                  : "circle(50%)",
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 12 + Math.random() * 6,
              delay: Math.random() * 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
};

export default function HeroSection() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-6 items-center justify-center px-4 min-h-[calc(100vh-80px)] py-12 "
      >
        {/* Floating Elements Background */}
        <FloatingElements />
        {/* Enhanced badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-purple-300 text-black/90 text-sm font-medium mb-4 hover-lift relative z-10"
        >
          <Sparkles className="w-4 h-4 text-yellow-400" />
          Discover Amazing Products
          <Star className="w-4 h-4 text-yellow-400" />
        </motion.div>{" "}
        {/* Enhanced main title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-6xl md:text-7xl lg:text-8xl text-center leading-tight relative z-10 font-futurex-display"
        >
          <div className="text-gradient bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Frontier
          </div>
          <div className="dark:text-white text-black">Finds</div>
        </motion.div>
        {/* Enhanced subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="font-light text-base sm:text-lg md:text-xl lg:text-2xl dark:text-neutral-200 text-neutral-700 py-4 text-center max-w-3xl leading-relaxed px-4 relative z-10"
        >
          Discover extraordinary products from independent creators and
          innovative brands. Your next favorite find is just one click away.
        </motion.div>{" "}
        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-8 px-4 relative z-10"
        >
          {[
            { number: "10K+", label: "Products" },
            { number: "5K+", label: "Happy Customers" },
            { number: "100+", label: "Brands" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-xl sm:text-2xl md:text-3xl font-bold dark:text-white text-black">
                {stat.number}
              </div>
              <div className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
        {/* Enhanced CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 items-center mt-6 mx-auto w-fit px-4 max-w-md sm:max-w-none relative z-10"
        >
          <Link href={"/store"} className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-semibold rounded-full w-full sm:w-fit text-white px-6 sm:px-8 py-3 sm:py-4 inline-flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ShoppingCart className="w-4 sm:w-5 h-4 sm:h-5" />
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto border border-white/30 dark:border-white/30 dark:text-white text-black hover:bg-white/10 dark:hover:bg-white/10 font-medium rounded-full px-6 sm:px-8 py-3 sm:py-4 transition-all duration-300 backdrop-blur-sm"
          >
            Learn More
          </motion.button>
        </motion.div>{" "}
        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-8 sm:mt-12 flex flex-wrap justify-center items-center gap-4 sm:gap-6 opacity-70 px-4 relative z-10"
        >
          {[
            {
              icon: Star,
              text: "Trusted by thousands",
              iconClass: "fill-yellow-400 text-yellow-400",
            },
            {
              icon: ShoppingCart,
              text: "Free shipping available",
              iconClass: "dark:text-white text-black",
            },
            {
              icon: Sparkles,
              text: "Curated selection",
              iconClass: "text-purple-400",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2 dark:text-white/70 text-black/70 text-center"
              whileHover={{ scale: 1.05, y: -1 }}
              transition={{ duration: 0.2 }}
            >
              <item.icon className={`w-4 h-4 ${item.iconClass}`} />
              <span className="text-xs sm:text-sm">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="absolute bottom-4 sm:bottom-8 animate-bounce z-10"
        >
          <div className="w-6 h-10 border-2 border-white/30 dark:border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 dark:bg-white/60 rounded-full animate-pulse mt-2" />
          </div>
        </motion.div>
      </motion.div>
    </AuroraBackground>
  );
}
