"use client";

import Title from "@/components/custom/title";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import { useParams } from "next/navigation";
import { UserResult } from "@/types/user.types";
import { ProductResult } from "@/types/product.types";
import ProductCard from "@/components/custom/product-card";
import { Star, MapPin, Calendar, Package } from "lucide-react";

function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const { apiBaseUrl } = useEnvStore();

  const [user, setUser] = useState<UserResult | null>(null);
  const [userProducts, setUserProducts] = useState<ProductResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        // Fetch user profile
        const userResponse = await fetch(`${apiBaseUrl}/users/${userId}`, {
          method: "GET",
          credentials: "include",
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const userData = await userResponse.json();
        setUser(userData);

        // Fetch user's products
        const productsResponse = await fetch(
          `${apiBaseUrl}/products/user/${userId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setUserProducts(productsData.items || productsData || []);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, apiBaseUrl]);

  if (loading) {
    return (
      <div className="h-fit min-h-screen max-w-[1800px] w-full mx-auto p-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="md:col-span-2">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="h-fit min-h-screen max-w-[1800px] w-full mx-auto p-10">
        <Title text="User Profile" className="text-2xl mb-8" />
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{error || "User not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-fit min-h-screen max-w-[1800px] w-full mx-auto p-10">
      <Title text="Seller Profile" className="text-2xl mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Profile Info */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {/* Profile Picture */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
              {user.profileImage?.url ? (
                <Image
                  src={user.profileImage.url}
                  alt="Profile Picture"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-2xl">
                    {user.firstName.charAt(0)}
                    {user.lastName.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* User Info */}
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {user.firstName} {user.lastName}
            </h2>

            {user.address && (
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">
                  {user.address.city}, {user.address.country}
                </span>
              </div>
            )}

            {/* Seller Stats */}
            <div className="w-full grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {userProducts.length}
                </div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">4.8</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>

            {/* Verification Badge */}
            <div className="mt-4">
              <Badge
                variant={user.accountVerified ? "default" : "secondary"}
                className="flex items-center gap-1"
              >
                <Star className="w-3 h-3" />
                {user.accountVerified ? "Verified Seller" : "Unverified"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Products */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Products by {user.firstName}
              </CardTitle>
              <CardDescription>
                Browse all products listed by this seller
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {" "}
                  {userProducts.map((product) => (
                    <ProductCard
                      key={product.productId}
                      productResult={product}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    This seller hasn't listed any products yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Contact Seller</CardTitle>
          <CardDescription>
            Get in touch with {user.firstName} for inquiries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1">Send Message</Button>
            <Button variant="outline" className="flex-1">
              View Store
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserProfilePage;
