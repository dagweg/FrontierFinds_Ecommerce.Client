import { motion } from "motion/react";
import React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Link from "next/link";
import { ShoppingCart, Star, Sparkles, ArrowRight } from "lucide-react";

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
        className="relative flex flex-col gap-6 items-center justify-center px-4 min-h-screen font-platypi"
      >
        {/* Enhanced badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-purple-300 text-black/90 text-sm font-medium mb-4 hover-lift"
        >
          <Sparkles className="w-4 h-4 text-yellow-400" />
          Discover Amazing Products
          <Star className="w-4 h-4 text-yellow-400" />
        </motion.div>

        {/* Enhanced main title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-4xl md:text-8xl lg:text-9xl font-bold text-center leading-tight"
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
          className="font-light text-lg md:text-2xl dark:text-neutral-200 text-neutral-700 py-4 text-center max-w-3xl leading-relaxed"
        >
          Discover extraordinary products from independent creators and
          innovative brands. Your next favorite find is just one click away.
        </motion.div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-8 mb-8"
        >
          {[
            { number: "10K+", label: "Products" },
            { number: "5K+", label: "Happy Customers" },
            { number: "100+", label: "Brands" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold dark:text-white text-black">
                {stat.number}
              </div>
              <div className="dark:text-neutral-400 text-neutral-600 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Enhanced CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 items-center mt-6"
        >
          <Link href={"/store"}>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-semibold rounded-full w-fit text-white px-8 py-4 inline-flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="border border-white/30 dark:border-white/30 border-black/30 dark:text-white text-black hover:bg-white/10 hover:dark:bg-white/10 hover:bg-black/10 font-medium rounded-full px-8 py-4 transition-all duration-300 backdrop-blur-sm"
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-12 flex flex-wrap justify-center items-center gap-6 opacity-70"
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
            <div
              key={index}
              className="flex items-center gap-2 dark:text-white/70 text-black/70"
            >
              <item.icon className={`w-4 h-4 ${item.iconClass}`} />
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="absolute bottom-8 animate-bounce"
        >
          <div className="w-6 h-10 border-2 border-white/30 dark:border-white/30 border-black/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 dark:bg-white/60 bg-black/60 rounded-full animate-pulse mt-2" />
          </div>
        </motion.div>
      </motion.div>
    </AuroraBackground>
  );
}
