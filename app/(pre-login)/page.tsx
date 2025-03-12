"use client";
import HeroSection from "@/components/custom/hero-section";
import ProductCard from "@/components/custom/product-card";
import Title from "@/components/custom/title";
import FeaturedProductsSection from "@/components/custom/featured-products-section";

export default function Home() {
  return (
    <div>
      <section className="bg-gray-100 w-full mx-auto">
        {/* <div className="bg-gradient-to-r from-neutral-100 via-neutral-50 to-neutral-100 h-[500px] flex flex-col justify-center items-center p-10">
          <Title text="Frontier Finds" tag="h1" className="text-5xl" />
          <p className="w-fit">
            Get the best and latest finds on the internet.
          </p>
        </div> */}
        <HeroSection />
      </section>
      <FeaturedProductsSection />
    </div>
  );
}
