"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";

export function RelatedProducts() {
  return (
    <div className="mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          You Might Also Like
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover more amazing products from our curated collection
        </p>
      </div>

      {/* Related Products Grid - This would typically fetch related products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
          >
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                Related Product {item}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Great quality product that complements your selection
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">$99.99</span>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
