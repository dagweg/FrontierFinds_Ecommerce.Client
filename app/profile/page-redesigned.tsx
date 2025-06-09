"use client";

import Title from "@/components/custom/title";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import { useSession } from "@/components/providers/session-provider";
import { ProductResult } from "@/types/product.types";
import { UserResult, AddressResult } from "@/types/user.types";
import {
  Edit,
  Save,
  X,
  User,
  MapPin,
  Phone,
  Mail,
  Package,
  ShoppingBag,
  Calendar,
  Camera,
  Settings,
  Star,
  TrendingUp,
  DollarSign,
  Eye,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import PriceTag from "@/components/custom/price-tag";

interface Purchase {
  id: string;
  productName: string;
  amount: number;
  date: string;
}

function YourProfileRedesigned() {
  const session = useSession();
  const [user, setUser] = useState<UserResult | null>(null);
  const [loading, setLoading] = useState(true);
  const apiBase = useEnvStore().apiBaseUrl;
  const [recentProducts, setRecentProducts] = useState<ProductResult[]>([]);
  const [recentPurchases, setRecentPurchases] = useState<Purchase[]>([]);
  const [editableUser, setEditableUser] = useState<UserResult | null>(null);
  const [editMode, setEditMode] = useState({
    firstName: false,
    lastName: false,
    phoneNumber: false,
    street: false,
    city: false,
    state: false,
    zipCode: false,
    country: false,
  });
  const [changesMade, setChangesMade] = useState(false);

  // Fetch user data and related information
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Fetch User Data
        const userResponse = await fetch(
          `${apiBase}/users/${session?.userSessionInfo?.userId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!userResponse.ok) {
          console.error(`HTTP error! status: ${userResponse.status}`);
          return;
        }

        const userData = await userResponse.json();
        setUser(userData);
        setEditableUser({ ...userData });

        // Fetch Recent Products
        const productsResponse = await fetch(
          `${apiBase}/products/user/${session?.userSessionInfo?.userId}/recent`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (productsResponse.ok) {
          const productData = await productsResponse.json();
          setRecentProducts(productData);
        }

        // Fetch Recent Purchases
        const purchasesResponse = await fetch(
          `${apiBase}/purchases/user/${session?.userSessionInfo?.userId}/recent`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (purchasesResponse.ok) {
          const purchaseData = await purchasesResponse.json();
          setRecentPurchases(purchaseData);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [session?.userSessionInfo?.userId, apiBase]);

  const handleInputChange = (
    field: string,
    value: string,
    isAddress = false,
    addressField?: string
  ) => {
    if (!editableUser) return;

    setChangesMade(true);
    if (isAddress && addressField && editableUser.address) {
      setEditableUser({
        ...editableUser,
        address: {
          ...editableUser.address,
          [addressField]: value,
        },
      });
    } else {
      setEditableUser({
        ...editableUser,
        [field]: value,
      });
    }
  };

  const toggleEditMode = (field: keyof typeof editMode) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSaveChanges = async () => {
    if (!editableUser) return;

    try {
      const response = await fetch(
        `${apiBase}/users/${session?.userSessionInfo?.userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(editableUser),
        }
      );

      if (response.ok) {
        setUser(editableUser);
        setChangesMade(false);
        // Reset all edit modes
        setEditMode({
          firstName: false,
          lastName: false,
          phoneNumber: false,
          street: false,
          city: false,
          state: false,
          zipCode: false,
          country: false,
        });
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!editableUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Failed to load profile data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Title
            text="Your Profile"
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2"
          />
          <p className="text-gray-600 dark:text-gray-300">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column: Profile Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
                <div className="absolute inset-0 bg-black/20" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 text-white hover:bg-white/20"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              <CardContent className="relative pt-0 pb-6">
                {/* Profile Picture */}
                <div className="relative -mt-16 mb-4 flex justify-center">
                  <div className="relative w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden bg-white dark:bg-gray-700">
                    {editableUser?.profileImage?.url ? (
                      <Image
                        src={editableUser.profileImage.url}
                        alt="Profile Picture"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                        <span className="text-white text-3xl font-bold">
                          {editableUser?.firstName?.charAt(0)}
                          {editableUser?.lastName?.charAt(0)}
                        </span>
                      </div>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 shadow-lg"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* User Info */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {editableUser?.firstName} {editableUser?.lastName}
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{editableUser?.email}</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    <User className="w-3 h-3 mr-1" />
                    Active Member
                  </Badge>
                </div>

                <Separator className="mb-6" />

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                  >
                    <Package className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {recentProducts.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Products Listed
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  >
                    <ShoppingBag className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {recentPurchases.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Total Purchases
                    </div>
                  </motion.div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Package className="w-4 h-4 mr-2" />
                    My Products
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column: Account Details & Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Account Information */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="firstName"
                        value={editableUser.firstName}
                        readOnly={!editMode.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className={cn(
                          "transition-all duration-200",
                          editMode.firstName
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : ""
                        )}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleEditMode("firstName")}
                        className="p-2"
                      >
                        {editMode.firstName ? (
                          <Save className="w-4 h-4" />
                        ) : (
                          <Edit className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="lastName"
                        value={editableUser.lastName}
                        readOnly={!editMode.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className={cn(
                          "transition-all duration-200",
                          editMode.lastName
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : ""
                        )}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleEditMode("lastName")}
                        className="p-2"
                      >
                        {editMode.lastName ? (
                          <Save className="w-4 h-4" />
                        ) : (
                          <Edit className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      value={editableUser.email}
                      readOnly
                      className="bg-gray-50 dark:bg-gray-700"
                    />
                    <Badge variant="secondary">Verified</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <Input
                      id="phoneNumber"
                      value={editableUser.phoneNumber || ""}
                      readOnly={!editMode.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      className={cn(
                        "transition-all duration-200",
                        editMode.phoneNumber
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : ""
                      )}
                      placeholder="Add your phone number"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleEditMode("phoneNumber")}
                      className="p-2"
                    >
                      {editMode.phoneNumber ? (
                        <Save className="w-4 h-4" />
                      ) : (
                        <Edit className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Save Changes Button */}
                <AnimatePresence>
                  {changesMade && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex justify-end pt-4 border-t"
                    >
                      <Button
                        onClick={handleSaveChanges}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Products */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Recent Products
                  </CardTitle>
                  <CardDescription>
                    Your latest product listings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentProducts.length > 0 ? (
                    <div className="space-y-4">
                      {recentProducts.slice(0, 3).map((product) => (
                        <motion.div
                          key={product.productId}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                            {product.images.thumbnail?.url ? (
                              <Image
                                src={product.images.thumbnail.url}
                                alt={product.productName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 dark:text-white truncate">
                              {product.productName}
                            </h4>
                            <PriceTag
                              priceValue={product.priceValueInCents}
                              fontWeight="normal"
                              originalPriceValue={
                                product.originalPriceValueInCents
                              }
                              isOnSale={product.isOnSale || false}
                              discountPercentage={product.discountPercentage}
                            />
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      ))}
                      {recentProducts.length > 3 && (
                        <Button variant="outline" className="w-full">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View All Products
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No products listed yet
                      </p>
                      <Button variant="outline" className="mt-4">
                        <Package className="w-4 h-4 mr-2" />
                        List Your First Product
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Purchases */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Recent Purchases
                  </CardTitle>
                  <CardDescription>
                    Your latest orders and purchases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentPurchases.length > 0 ? (
                    <div className="space-y-4">
                      {recentPurchases.slice(0, 3).map((purchase) => (
                        <motion.div
                          key={purchase.id}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                              <ShoppingBag className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {purchase.productName}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {purchase.date}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              ${purchase.amount}
                            </p>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                      {recentPurchases.length > 3 && (
                        <Button variant="outline" className="w-full">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View All Purchases
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No purchases yet
                      </p>
                      <Button variant="outline" className="mt-4">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Start Shopping
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default YourProfileRedesigned;
