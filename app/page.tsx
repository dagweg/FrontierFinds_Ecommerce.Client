"use client";
import HeroSection from "@/components/custom/hero-section";
import FeaturedProductsSection from "@/components/custom/featured-products-section";
import CategoryShowcase from "@/components/custom/category-showcase";
import WhyChooseUs from "@/components/custom/why-choose-us";
import TestimonialsSection from "@/components/custom/testimonials-section";
import NewsletterSection from "@/components/custom/newsletter-section";
import CallToActionSection from "@/components/custom/cta-section";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products Section */}

      <FeaturedProductsSection />

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Newsletter Signup */}
      <NewsletterSection />

      {/* Call to Action */}
      <CallToActionSection />
    </div>
  );
}
