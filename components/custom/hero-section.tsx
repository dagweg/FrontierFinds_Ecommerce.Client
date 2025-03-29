import { motion } from "motion/react";
import React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

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
        className="relative flex flex-col gap-4 items-center justify-center px-4  font-platypi"
      >
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          Frontier Finds
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          Get the latest and best deals on the internet.
        </div>
        <Link href={"/store"} className="mt-10">
          <button className="bg-black dark:bg-white  font-medium rounded-full w-fit text-white dark:text-black px-10 py-2 inline-flex items-center gap-3 hover:ring-4 duration-100 ring-neutral-300">
            <ShoppingCart /> Shop now
          </button>
        </Link>
      </motion.div>
    </AuroraBackground>
  );
}
