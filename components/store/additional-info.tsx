"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Truck, MapPin, Eye, Check } from "lucide-react";

export function DeliveryInfo() {
  return (
    <Card>
      <CardContent className="pt-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-blue-600" />
          Delivery Information
        </h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Standard Delivery:</span>
            <span className="font-medium">3-5 business days</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Express Delivery:</span>
            <span className="font-medium">1-2 business days</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Free Shipping:</span>
            <span className="font-medium">Orders over $50</span>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 text-xs">Ships worldwide</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SocialProof() {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
              >
                U{i}
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              Recently purchased by 23+ customers
            </p>
            <p className="text-xs text-gray-600">
              Join thousands of satisfied customers
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>127 people viewing</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="w-3 h-3 text-green-600" />
            <span>Verified seller</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
