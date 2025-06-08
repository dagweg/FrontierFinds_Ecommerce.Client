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
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import { useSession } from "@/components/providers/session-provider";
import { ProductResult } from "@/types/product.types";
import { UserResult, AddressResult } from "@/types/user.types";
import { Edit, Edit2, Edit3, EditIcon } from "lucide-react";

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
    <div className="h-fit min-h-screen max-w-[1800px] w-full mx-auto p-10">
      <Title text="Your Profile" className="text-2xl mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Profile Summary */}
        <Card className="md:col-span-1 border-none shadow-none">
          <CardHeader>
            <CardTitle>Profile Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {/* Profile Picture */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
              {editableUser.profileImage?.url ? (
                <Image
                  src={
                    editableUser.profileImage.url ??
                    "https://imgur.com/zVWz723.jpg"
                  }
                  alt="Profile Picture"
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div>No Image</div>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              {editableUser.firstName} {editableUser.lastName}
            </h2>
            <p className="text-gray-600">{editableUser.phoneNumber}</p>
            <p className="text-gray-500 mt-2">Joined: January 1, 2023</p>
          </CardContent>
        </Card>

        {/* Middle Column: Profile Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <Label htmlFor="firstName" className="text-right md:text-left">
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
                <Label htmlFor="lastName" className="text-right md:text-left">
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
                    onChange={(e) => handleInputChange("email", e.target.value)}
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
                    <Label htmlFor="city" className="text-right md:text-left">
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
                    <Label htmlFor="state" className="text-right md:text-left">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-4">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            {recentProducts.length > 0 ? (
              <ul className="list-none">
                {recentProducts.map((product) => (
                  <li key={product.productId} className="mb-2">
                    {product.productName} - ${product.priceValueInCents / 100}
                    {/* Add image if available */}
                    {product.images.thumbnail && (
                      <Image
                        src={
                          product.images.thumbnail.url ||
                          "https://imgur.com/zVWz723.jpg"
                        }
                        alt={"Thumb"}
                        width={50}
                        height={50}
                      />
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div>No recent products.</div>
            )}
          </CardContent>
        </Card>

        {/* Recent Purchases */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPurchases.length > 0 ? (
              <ul className="list-none">
                {recentPurchases.map((purchase) => (
                  <li key={purchase.id} className="mb-2">
                    {purchase.productName} - ${purchase.amount} -{" "}
                    {purchase.date}
                  </li>
                ))}
              </ul>
            ) : (
              <div>No recent purchases.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default YourProfile;
