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
  EditIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import PriceTag from "@/components/custom/price-tag";

interface Purchase {
  // Example purchase interface
  id: string;
  productName: string;
  date: string;
  amount: number;
}
function YourProfile() {
  const session = useSession();
  const [user, setUser] = useState<UserResult | null>(null);
  const [loading, setLoading] = useState(true);
  const apiBase = useEnvStore().apiBaseUrl;
  const [recentProducts, setRecentProducts] = useState<ProductResult[]>([]); // State for recent products
  const [recentPurchases, setRecentPurchases] = useState<Purchase[]>([]); // State for recent purchases

  // Local state to manage editable fields
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
  const [changesMade, setChangesMade] = useState(false); // Track if any changes were made

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
        setEditableUser({ ...userData }); // Initialize editableUser with the fetched data

        // Fetch Recent Products (Replace with your actual API endpoint)
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
        } else {
          console.error("Failed to fetch recent products");
        }

        // Fetch Recent Purchases (Replace with your actual API endpoint)
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
        } else {
          console.error("Failed to fetch recent purchases");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [session?.userSessionInfo?.userId, apiBase]);

  // Function to toggle edit mode for a specific field
  const toggleEditMode = (field: keyof typeof editMode) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Function to handle input change
  const handleInputChange = (
    field: keyof UserResult,
    value: string,
    isAddressField: boolean = false,
    addressField: keyof AddressResult | null = null
  ) => {
    setChangesMade(true); // Mark that changes have been made

    if (isAddressField && addressField) {
      setEditableUser((prev) =>
        prev
          ? {
              ...prev,
              address: { ...prev.address, [addressField]: value },
            }
          : prev
      );
    } else {
      setEditableUser((prev) => (prev ? { ...prev, [field]: value } : prev));
    }
  };

  // Function to handle saving changes
  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const updateResponse = await fetch(
        `${apiBase}/users/${session?.userSessionInfo?.userId}`,
        {
          method: "PUT", // Or PATCH depending on your API
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editableUser), // Send the updated user data
          credentials: "include",
        }
      );

      if (!updateResponse.ok) {
        console.error(`HTTP error! status: ${updateResponse.status}`);
        return;
      }

      const updatedUserData = await updateResponse.json();
      setUser(updatedUserData); // Update the main user state
      setEditableUser({ ...updatedUserData }); // Update the editableUser state
      setEditMode(
        Object.fromEntries(
          Object.keys(editMode).map((key) => [key, false])
        ) as typeof editMode
      ); // Disable all edit modes
      setChangesMade(false); // Reset changesMade state
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!user || !editableUser) {
    return <div>Failed to load profile.</div>;
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

                {/* Profile Info */}
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {editableUser.firstName} {editableUser.lastName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {editableUser.phoneNumber}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Joined: January 1, 2023
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column: Profile Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                    <Label
                      htmlFor="firstName"
                      className="text-right md:text-left"
                    >
                      First Name:
                    </Label>
                    <div className="w-full flex items-center gap-3">
                      <Input
                        type="text"
                        id="firstName"
                        value={editableUser.firstName}
                        readOnly={!editMode.firstName}
                        className="md:col-span-2"
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                      />
                      <EditIcon
                        size={30}
                        cursor={"pointer"}
                        className="hover:bg-neutral-100 opacity-50 hover:opacity-100 duration-100 rounded-full w-[35px] h-[35px]  p-1"
                        onClick={() => toggleEditMode("firstName")}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                    <Label
                      htmlFor="lastName"
                      className="text-right md:text-left"
                    >
                      Last Name:
                    </Label>
                    <div className="w-full flex items-center gap-3">
                      <Input
                        type="text"
                        id="lastName"
                        value={editableUser.lastName}
                        readOnly={!editMode.lastName}
                        className="md:col-span-2"
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                      />
                      <EditIcon
                        size={30}
                        cursor={"pointer"}
                        className="hover:bg-neutral-100 opacity-50 hover:opacity-100 duration-100 rounded-full w-[35px] h-[35px]  p-1"
                        onClick={() => toggleEditMode("lastName")}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                    <Label htmlFor="email" className="text-right md:text-left">
                      Email:
                    </Label>
                    <div className="w-full flex items-center gap-3">
                      <Input
                        type="email"
                        id="email"
                        value={editableUser.email}
                        readOnly
                        className="md:col-span-2"
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                    <Label
                      htmlFor="phoneNumber"
                      className="text-right md:text-left"
                    >
                      Phone Number:
                    </Label>
                    <div className="w-full flex items-center gap-3">
                      <Input
                        type="text"
                        id="phoneNumber"
                        value={editableUser.phoneNumber}
                        readOnly={!editMode.phoneNumber}
                        className="md:col-span-2"
                        onChange={(e) =>
                          handleInputChange("phoneNumber", e.target.value)
                        }
                      />
                      <EditIcon
                        size={30}
                        cursor={"pointer"}
                        className="hover:bg-neutral-100 opacity-50 hover:opacity-100 duration-100 rounded-full w-[35px] h-[35px]  p-1"
                        onClick={() => toggleEditMode("phoneNumber")}
                      />
                    </div>
                  </div>

                  {editableUser.address && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                        <Label
                          htmlFor="streetAddress"
                          className="text-right md:text-left"
                        >
                          Street Address:
                        </Label>
                        <div className="w-full flex items-center gap-3">
                          <Input
                            type="text"
                            id="streetAddress"
                            value={editableUser.address.street}
                            readOnly={!editMode.street}
                            className="md:col-span-2"
                            onChange={(e) =>
                              handleInputChange(
                                "address",
                                e.target.value,
                                true,
                                "street"
                              )
                            }
                          />
                          <EditIcon
                            size={30}
                            cursor={"pointer"}
                            className="hover:bg-neutral-100 opacity-50 hover:opacity-100 duration-100 rounded-full w-[35px] h-[35px]  p-1"
                            onClick={() => toggleEditMode("street")}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                        <Label
                          htmlFor="city"
                          className="text-right md:text-left"
                        >
                          City:
                        </Label>
                        <div className="w-full flex items-center gap-3">
                          <Input
                            type="text"
                            id="city"
                            value={editableUser.address.city}
                            readOnly={!editMode.city}
                            className="md:col-span-2"
                            onChange={(e) =>
                              handleInputChange(
                                "address",
                                e.target.value,
                                true,
                                "city"
                              )
                            }
                          />
                          <EditIcon
                            size={30}
                            cursor={"pointer"}
                            className="hover:bg-neutral-100 opacity-50 hover:opacity-100 duration-100 rounded-full w-[35px] h-[35px]  p-1"
                            onClick={() => toggleEditMode("city")}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                        <Label
                          htmlFor="state"
                          className="text-right md:text-left"
                        >
                          State:
                        </Label>
                        <div className="w-full flex items-center gap-3">
                          <Input
                            type="text"
                            id="state"
                            value={editableUser.address.state}
                            readOnly={!editMode.state}
                            className="md:col-span-2"
                            onChange={(e) =>
                              handleInputChange(
                                "address",
                                e.target.value,
                                true,
                                "state"
                              )
                            }
                          />
                          <EditIcon
                            size={30}
                            cursor={"pointer"}
                            className="hover:bg-neutral-100 opacity-50 hover:opacity-100 duration-100 rounded-full w-[35px] h-[35px]  p-1"
                            onClick={() => toggleEditMode("state")}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                        <Label
                          htmlFor="zipCode"
                          className="text-right md:text-left"
                        >
                          Zip Code:
                        </Label>
                        <div className="w-full flex items-center gap-3">
                          <Input
                            type="text"
                            id="zipCode"
                            value={editableUser.address.zipCode}
                            readOnly={!editMode.zipCode}
                            className="md:col-span-2"
                            onChange={(e) =>
                              handleInputChange(
                                "address",
                                e.target.value,
                                true,
                                "zipCode"
                              )
                            }
                          />
                          <EditIcon
                            size={30}
                            cursor={"pointer"}
                            className="hover:bg-neutral-100 opacity-50 hover:opacity-100 duration-100 rounded-full w-[35px] h-[35px]  p-1"
                            onClick={() => toggleEditMode("zipCode")}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                        <Label
                          htmlFor="country"
                          className="text-right md:text-left"
                        >
                          Country:
                        </Label>
                        <div className="w-full flex items-center gap-3">
                          <Input
                            type="text"
                            id="country"
                            value={editableUser.address.country}
                            readOnly={!editMode.country}
                            className="md:col-span-2"
                            onChange={(e) =>
                              handleInputChange(
                                "address",
                                e.target.value,
                                true,
                                "country"
                              )
                            }
                          />
                          <EditIcon
                            size={30}
                            cursor={"pointer"}
                            className="hover:bg-neutral-100 opacity-50 hover:opacity-100 duration-100 rounded-full w-[35px] h-[35px]  p-1"
                            onClick={() => toggleEditMode("country")}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {changesMade && (
                  <div className="flex justify-end mt-4">
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Section: Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Products */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Recent Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentProducts.length > 0 ? (
                  <ul className="space-y-4">
                    {recentProducts.map((product) => (
                      <li
                        key={product.productId}
                        className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        {product.images.thumbnail && (
                          <div className="flex-shrink-0">
                            <Image
                              src={
                                product.images.thumbnail.url ||
                                "https://imgur.com/zVWz723.jpg"
                              }
                              alt={product.productName}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {product.productName}
                          </h4>
                          <PriceTag
                            priceValue={product.priceValueInCents}
                            size="small"
                            className="text-sm"
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No recent products.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Purchases */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Recent Purchases
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentPurchases.length > 0 ? (
                  <ul className="space-y-3">
                    {recentPurchases.map((purchase) => (
                      <li
                        key={purchase.id}
                        className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <span className="font-medium">
                          {purchase.productName}
                        </span>
                        <div className="text-right">
                          <div className="font-semibold">
                            ${purchase.amount}
                          </div>
                          <div className="text-sm text-gray-500">
                            {purchase.date}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No recent purchases.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default YourProfile;
