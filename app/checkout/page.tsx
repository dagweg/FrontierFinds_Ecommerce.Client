"use client";

import React, { useState, useEffect } from "react";
import { useCartStore } from "@/lib/zustand/useCartStore";
import PriceTag from "@/components/custom/price-tag";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CartItemResult } from "@/types/cart.types";
import { useRouter } from "next/navigation";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import parsePhoneNumberFromString from "libphonenumber-js";
import { usePhoneNumber } from "@/lib/hooks/usePhoneNumber";
import Image from "next/image";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useSession } from "@/components/providers/session-provider";
import {
  Circle,
  ShoppingBasket,
  LoaderCircle,
  Truck,
  CreditCard,
  MapPin,
  Mail,
  Phone,
  User,
  Lock,
} from "lucide-react";
import Link from "next/link";
import withAuth from "@/lib/decorators/withAuth";
import { IconBrandStripeFilled } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { LabelInputContainer } from "@/components/ui/label-input-container";

const Checkout: React.FC = () => {
  const store = useCartStore();
  const router = useRouter();
  const apiBaseUrl = useEnvStore().apiBaseUrl;
  const session = useSession();
  const { phoneNumber, setPhoneNumber, flagEmoji, handlePhoneNumberChange } =
    usePhoneNumber();

  // State for shipping address
  const [shippingAddress, setShippingAddress] = useState({
    street: "123 Main St",
    city: "San Jose",
    state: "CA",
    zipCode: "95131",
    country: "United States",
    email: "johndoe@example.com",
  });

  // State for billing address
  const [billingAddress, setBillingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  // State for payment information
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardHolderName: "",
  });

  // State for "same as shipping" checkbox
  const [sameAsShipping, setSameAsShipping] = useState(true);

  // State for form errors (client-side and server-side)
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    store.initializeCart();
  }, []);

  // Calculate cart summary values
  const calculateSummary = () => {
    if (!store.cart || !store.cart.items || store.cart.items.length === 0) {
      return { subtotal: 0, discount: 0, tax: 0, total: 0, itemCount: 0 };
    }

    let subtotal = 0;
    let discount = 0;
    let itemCount = 0;
    store.cart.items.forEach((item: CartItemResult) => {
      const itemPrice = item.product.priceValueInCents;
      const originalPrice =
        item.product.originalPriceValueInCents ||
        item.product.priceValueInCents;
      const itemSubtotal = (itemPrice / 100) * item.quantity;
      subtotal += itemSubtotal;
      itemCount += item.quantity;

      // Calculate discount if product is on sale
      if (
        item.product.isOnSale &&
        item.product.originalPriceValueInCents &&
        item.product.originalPriceValueInCents > itemPrice
      ) {
        const itemDiscount =
          ((item.product.originalPriceValueInCents - itemPrice) / 100) *
          item.quantity;
        discount += itemDiscount;
      }
    });

    const taxRate = 0.08;
    const tax = (subtotal - discount) * taxRate;
    const total = subtotal - discount + tax;

    return {
      subtotal: Math.round(subtotal * 100),
      discount: Math.round(discount * 100),
      tax: Math.round(tax * 100),
      total: Math.round(total * 100),
      itemCount,
    };
  };

  const { subtotal, discount, tax, total, itemCount } = calculateSummary();

  // Handle shipping address change
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Handle billing address change
  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
  };
  // Handle payment info change with formatting
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
      if (formattedValue.length > 19)
        formattedValue = formattedValue.slice(0, 19);
    }

    // Format expiry date
    if (name === "expiry") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2");
      if (formattedValue.length > 5)
        formattedValue = formattedValue.slice(0, 5);
    }

    // Format CVV (numbers only)
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "");
    }

    setPaymentInfo((prev) => ({ ...prev, [name]: formattedValue }));
  };

  // Check form completion for progress steps
  const isShippingComplete = () => {
    return (
      shippingAddress.street &&
      shippingAddress.city &&
      shippingAddress.state &&
      shippingAddress.zipCode &&
      shippingAddress.country &&
      shippingAddress.email &&
      phoneNumber
    );
  };

  const isBillingComplete = () => {
    if (sameAsShipping) return true;
    return (
      billingAddress.street &&
      billingAddress.city &&
      billingAddress.state &&
      billingAddress.zipCode &&
      billingAddress.country
    );
  };

  const isPaymentComplete = () => {
    return (
      paymentInfo.cardHolderName &&
      paymentInfo.cardNumber &&
      paymentInfo.expiry &&
      paymentInfo.cvv
    );
  };
  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Shipping Address validation
    if (!shippingAddress.street)
      newErrors["ShippingAddress.street"] = "Street is required";
    if (!shippingAddress.city)
      newErrors["ShippingAddress.city"] = "City is required";
    if (!shippingAddress.state)
      newErrors["ShippingAddress.state"] = "State is required";
    if (!shippingAddress.zipCode)
      newErrors["ShippingAddress.zipCode"] = "ZIP code is required";
    if (!shippingAddress.country)
      newErrors["ShippingAddress.country"] = "Country is required";
    if (!shippingAddress.email)
      newErrors["ShippingAddress.email"] = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(shippingAddress.email))
      newErrors["ShippingAddress.email"] = "Invalid email format";
    if (!phoneNumber)
      newErrors["ShippingAddress.phone"] = "Phone number is required";

    // Billing Address validation (if not same as shipping)
    if (!sameAsShipping) {
      if (!billingAddress.street)
        newErrors["BillingAddress.street"] = "Street is required";
      if (!billingAddress.city)
        newErrors["BillingAddress.city"] = "City is required";
      if (!billingAddress.state)
        newErrors["BillingAddress.state"] = "State is required";
      if (!billingAddress.zipCode)
        newErrors["BillingAddress.zipCode"] = "ZIP code is required";
      if (!billingAddress.country)
        newErrors["BillingAddress.country"] = "Country is required";
    }

    // Payment Information validation
    if (!paymentInfo.cardHolderName)
      newErrors["PaymentInfo.cardHolderName"] = "Cardholder name is required";
    if (!paymentInfo.cardNumber)
      newErrors["PaymentInfo.cardNumber"] = "Card number is required";
    else if (paymentInfo.cardNumber.replace(/\s/g, "").length < 13)
      newErrors["PaymentInfo.cardNumber"] = "Invalid card number";
    if (!paymentInfo.expiry)
      newErrors["PaymentInfo.expiry"] = "Expiry date is required";
    else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiry))
      newErrors["PaymentInfo.expiry"] = "Invalid expiry format (MM/YY)";
    if (!paymentInfo.cvv) newErrors["PaymentInfo.cvv"] = "CVV is required";
    else if (paymentInfo.cvv.length < 3)
      newErrors["PaymentInfo.cvv"] = "Invalid CVV";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      const parsedPhone = parsePhoneNumberFromString(phoneNumber);
      const formattedPhoneNumber =
        parsedPhone?.formatInternational() || phoneNumber;
      const orderData = {
        shippingAddress: {
          ...shippingAddress,
          phone: formattedPhoneNumber,
        },
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
        paymentInformation: paymentInfo,
        totalAmountInCents: total,
      };
      const response = await fetch(`${apiBaseUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        window.location.href = result.redirectUrl;
      } else {
        const errorData = await response.json();
        setServerError(errorData.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setServerError(
        "Failed to connect to the server. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const form = useForm();

  if (store.cart?.items?.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBasket className="w-12 h-12 text-gray-400 dark:text-gray-600" />
            </div>
            <div className="absolute -top-1 -right-8 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">0</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Nothing to checkout
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your cart is empty. Add some items to your cart before proceeding to
            checkout.
          </p>
          <Link
            href="/store"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-8">
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="max-w-7xl mx-auto px-4">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Checkout
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Complete your order in just a few simple steps
              </p>
            </div>

            {serverError && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6">
                <div className="flex items-center">
                  <Circle className="w-5 h-5 mr-2" />
                  {serverError}
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Section: Forms */}
              <div className="lg:col-span-2 space-y-8">
                {" "}
                {/* Progress Steps */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      {/* Shipping Step */}
                      <div className="flex items-center">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200",
                            isShippingComplete()
                              ? "bg-green-600 text-white"
                              : "bg-blue-600 text-white"
                          )}
                        >
                          {isShippingComplete() ? "✓" : "1"}
                        </div>
                        <span
                          className={cn(
                            "ml-3 text-sm font-medium transition-colors duration-200",
                            isShippingComplete()
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-900 dark:text-white"
                          )}
                        >
                          Shipping
                        </span>
                      </div>

                      {/* Progress Line 1 */}
                      <div
                        className={cn(
                          "w-12 h-0.5 transition-colors duration-200",
                          isShippingComplete() && isBillingComplete()
                            ? "bg-green-400"
                            : isShippingComplete()
                            ? "bg-blue-400"
                            : "bg-gray-300 dark:bg-gray-600"
                        )}
                      ></div>

                      {/* Payment Step */}
                      <div className="flex items-center">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200",
                            isPaymentComplete()
                              ? "bg-green-600 text-white"
                              : isShippingComplete() && isBillingComplete()
                              ? "bg-blue-600 text-white"
                              : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                          )}
                        >
                          {isPaymentComplete() ? "✓" : "2"}
                        </div>
                        <span
                          className={cn(
                            "ml-3 text-sm font-medium transition-colors duration-200",
                            isPaymentComplete()
                              ? "text-green-600 dark:text-green-400"
                              : isShippingComplete() && isBillingComplete()
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-500 dark:text-gray-400"
                          )}
                        >
                          Payment
                        </span>
                      </div>

                      {/* Progress Line 2 */}
                      <div
                        className={cn(
                          "w-12 h-0.5 transition-colors duration-200",
                          isShippingComplete() &&
                            isBillingComplete() &&
                            isPaymentComplete()
                            ? "bg-green-400"
                            : "bg-gray-300 dark:bg-gray-600"
                        )}
                      ></div>

                      {/* Review Step */}
                      <div className="flex items-center">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200",
                            isShippingComplete() &&
                              isBillingComplete() &&
                              isPaymentComplete()
                              ? "bg-blue-600 text-white"
                              : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                          )}
                        >
                          3
                        </div>
                        <span
                          className={cn(
                            "ml-3 text-sm font-medium transition-colors duration-200",
                            isShippingComplete() &&
                              isBillingComplete() &&
                              isPaymentComplete()
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-500 dark:text-gray-400"
                          )}
                        >
                          {" "}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Status Summary */}
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <span className="text-gray-600 dark:text-gray-400">
                            Items:
                          </span>
                          <span className="ml-1 font-medium text-gray-900 dark:text-white">
                            {itemCount}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 dark:text-gray-400">
                            Total:
                          </span>
                          <span className="ml-1 font-medium text-gray-900 dark:text-white">
                            <PriceTag priceValue={total} size="small" />
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={cn(
                            "text-xs font-medium transition-colors duration-200",
                            isShippingComplete() &&
                              isBillingComplete() &&
                              isPaymentComplete()
                              ? "text-green-600 dark:text-green-400"
                              : "text-yellow-600 dark:text-yellow-400"
                          )}
                        >
                          {isShippingComplete() &&
                          isBillingComplete() &&
                          isPaymentComplete()
                            ? "Ready to checkout"
                            : `Step ${
                                isShippingComplete()
                                  ? isBillingComplete()
                                    ? isPaymentComplete()
                                      ? 3
                                      : 2
                                    : 2
                                  : 1
                              } of 3`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Shipping Address */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {" "}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Shipping Address
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Where should we deliver your order?
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="shippingStreet"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Street Address
                        </Label>
                        <Input
                          id="shippingStreet"
                          name="street"
                          value={shippingAddress.street}
                          onChange={handleShippingChange}
                          className={cn(
                            "transition-colors duration-200",
                            errors["ShippingAddress.street"]
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                          )}
                          placeholder="123 Main Street"
                        />
                        {errors["ShippingAddress.street"] && (
                          <p className="text-red-500 text-sm flex items-center mt-1">
                            <Circle className="w-3 h-3 mr-1" />
                            {errors["ShippingAddress.street"]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="shippingCity"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          City
                        </Label>
                        <Input
                          id="shippingCity"
                          name="city"
                          value={shippingAddress.city}
                          onChange={handleShippingChange}
                          className={cn(
                            "transition-colors duration-200",
                            errors["ShippingAddress.city"]
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                          )}
                          placeholder="San Francisco"
                        />
                        {errors["ShippingAddress.city"] && (
                          <p className="text-red-500 text-sm flex items-center mt-1">
                            <Circle className="w-3 h-3 mr-1" />
                            {errors["ShippingAddress.city"]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="shippingState"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          State
                        </Label>
                        <Input
                          id="shippingState"
                          name="state"
                          value={shippingAddress.state}
                          onChange={handleShippingChange}
                          className={cn(
                            "transition-colors duration-200",
                            errors["ShippingAddress.state"]
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                          )}
                          placeholder="CA"
                        />
                        {errors["ShippingAddress.state"] && (
                          <p className="text-red-500 text-sm flex items-center mt-1">
                            <Circle className="w-3 h-3 mr-1" />
                            {errors["ShippingAddress.state"]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="shippingZipCode"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          ZIP Code
                        </Label>
                        <Input
                          id="shippingZipCode"
                          name="zipCode"
                          value={shippingAddress.zipCode}
                          onChange={handleShippingChange}
                          className={cn(
                            "transition-colors duration-200",
                            errors["ShippingAddress.zipCode"]
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                          )}
                          placeholder="94102"
                        />
                        {errors["ShippingAddress.zipCode"] && (
                          <p className="text-red-500 text-sm flex items-center mt-1">
                            <Circle className="w-3 h-3 mr-1" />
                            {errors["ShippingAddress.zipCode"]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="shippingCountry"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Country
                        </Label>
                        <Input
                          id="shippingCountry"
                          name="country"
                          value={shippingAddress.country}
                          onChange={handleShippingChange}
                          className={cn(
                            "transition-colors duration-200",
                            errors["ShippingAddress.country"]
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                          )}
                          placeholder="United States"
                        />
                        {errors["ShippingAddress.country"] && (
                          <p className="text-red-500 text-sm flex items-center mt-1">
                            <Circle className="w-3 h-3 mr-1" />
                            {errors["ShippingAddress.country"]}
                          </p>
                        )}
                      </div>{" "}
                      <div className="space-y-2">
                        <Label
                          htmlFor="shippingEmail"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Email Address
                        </Label>
                        <Input
                          id="shippingEmail"
                          name="email"
                          type="email"
                          value={shippingAddress.email}
                          onChange={handleShippingChange}
                          className={cn(
                            "transition-colors duration-200",
                            errors["ShippingAddress.email"]
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                          )}
                          placeholder="john@example.com"
                        />
                        {errors["ShippingAddress.email"] && (
                          <p className="text-red-500 text-sm flex items-center mt-1">
                            <Circle className="w-3 h-3 mr-1" />
                            {errors["ShippingAddress.email"]}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="mt-6 space-y-2">
                      {" "}
                      <Label
                        htmlFor="phone"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Phone Number
                      </Label>
                      <div className="flex items-center space-x-2">
                        <LabelInputContainer
                          className="mb-4 flex-1"
                          error={errors?.PhoneNumber?.[0]}
                        >
                          <div className="relative grid grid-rows-1 w-full ">
                            <Input
                              id="phone"
                              placeholder="Enter international format number "
                              className="!w-full "
                              type="tel"
                              value={phoneNumber}
                              onChange={handlePhoneNumberChange}
                            />

                            {flagEmoji && (
                              <Image
                                src={flagEmoji}
                                width={30}
                                height={30}
                                alt=""
                                className="absolute right-4  h-full"
                              />
                            )}
                          </div>
                        </LabelInputContainer>
                      </div>
                      {errors["ShippingAddress.phone"] && (
                        <p className="text-red-500 text-sm flex items-center mt-1">
                          <Circle className="w-3 h-3 mr-1" />
                          {errors["ShippingAddress.phone"]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {/* Billing Address Toggle */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center space-x-3">
                    {" "}
                    <Checkbox
                      id="sameAsShipping"
                      checked={sameAsShipping}
                      onCheckedChange={(checked) =>
                        setSameAsShipping(checked === true)
                      }
                      className="border-gray-300 dark:border-gray-600"
                    />
                    <Label
                      htmlFor="sameAsShipping"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      Billing address is the same as shipping address
                    </Label>
                  </div>
                </div>
                {/* Billing Address (if different) */}
                {!sameAsShipping && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {" "}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Billing Address
                          </h2>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Where should we send your invoice?
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="billingStreet"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Street Address
                          </Label>
                          <Input
                            id="billingStreet"
                            name="street"
                            value={billingAddress.street}
                            onChange={handleBillingChange}
                            className={cn(
                              "transition-colors duration-200",
                              errors["BillingAddress.street"]
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500"
                            )}
                            placeholder="123 Main Street"
                          />
                          {errors["BillingAddress.street"] && (
                            <p className="text-red-500 text-sm flex items-center mt-1">
                              <Circle className="w-3 h-3 mr-1" />
                              {errors["BillingAddress.street"]}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="billingCity"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            City
                          </Label>
                          <Input
                            id="billingCity"
                            name="city"
                            value={billingAddress.city}
                            onChange={handleBillingChange}
                            className={cn(
                              "transition-colors duration-200",
                              errors["BillingAddress.city"]
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500"
                            )}
                            placeholder="San Francisco"
                          />
                          {errors["BillingAddress.city"] && (
                            <p className="text-red-500 text-sm flex items-center mt-1">
                              <Circle className="w-3 h-3 mr-1" />
                              {errors["BillingAddress.city"]}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="billingState"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            State
                          </Label>
                          <Input
                            id="billingState"
                            name="state"
                            value={billingAddress.state}
                            onChange={handleBillingChange}
                            className={cn(
                              "transition-colors duration-200",
                              errors["BillingAddress.state"]
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500"
                            )}
                            placeholder="CA"
                          />
                          {errors["BillingAddress.state"] && (
                            <p className="text-red-500 text-sm flex items-center mt-1">
                              <Circle className="w-3 h-3 mr-1" />
                              {errors["BillingAddress.state"]}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="billingZipCode"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            ZIP Code
                          </Label>
                          <Input
                            id="billingZipCode"
                            name="zipCode"
                            value={billingAddress.zipCode}
                            onChange={handleBillingChange}
                            className={cn(
                              "transition-colors duration-200",
                              errors["BillingAddress.zipCode"]
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500"
                            )}
                            placeholder="94102"
                          />
                          {errors["BillingAddress.zipCode"] && (
                            <p className="text-red-500 text-sm flex items-center mt-1">
                              <Circle className="w-3 h-3 mr-1" />
                              {errors["BillingAddress.zipCode"]}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="billingCountry"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Country
                          </Label>
                          <Input
                            id="billingCountry"
                            name="country"
                            value={billingAddress.country}
                            onChange={handleBillingChange}
                            className={cn(
                              "transition-colors duration-200",
                              errors["BillingAddress.country"]
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500"
                            )}
                            placeholder="United States"
                          />
                          {errors["BillingAddress.country"] && (
                            <p className="text-red-500 text-sm flex items-center mt-1">
                              <Circle className="w-3 h-3 mr-1" />
                              {errors["BillingAddress.country"]}
                            </p>
                          )}
                        </div>
                      </div>{" "}
                    </div>
                  </div>
                )}
                {/* Payment Information */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {" "}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Payment Information
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Secure payment processing with Stripe
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        {" "}
                        <Label
                          htmlFor="cardHolderName"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Cardholder Name
                        </Label>
                        <Input
                          id="cardHolderName"
                          name="cardHolderName"
                          value={paymentInfo.cardHolderName}
                          onChange={handlePaymentChange}
                          className={cn(
                            "transition-colors duration-200",
                            errors["PaymentInfo.cardHolderName"]
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500"
                          )}
                          placeholder="John Doe"
                        />
                        {errors["PaymentInfo.cardHolderName"] && (
                          <p className="text-red-500 text-sm flex items-center mt-1">
                            <Circle className="w-3 h-3 mr-1" />
                            {errors["PaymentInfo.cardHolderName"]}
                          </p>
                        )}
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label
                          htmlFor="cardNumber"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Card Number
                        </Label>{" "}
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          value={paymentInfo.cardNumber}
                          onChange={handlePaymentChange}
                          className={cn(
                            "transition-colors duration-200",
                            errors["PaymentInfo.cardNumber"]
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500"
                          )}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                        {errors["PaymentInfo.cardNumber"] && (
                          <p className="text-red-500 text-sm flex items-center mt-1">
                            <Circle className="w-3 h-3 mr-1" />
                            {errors["PaymentInfo.cardNumber"]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="expiry"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Expiry Date
                        </Label>{" "}
                        <Input
                          id="expiry"
                          name="expiry"
                          value={paymentInfo.expiry}
                          onChange={handlePaymentChange}
                          className={cn(
                            "transition-colors duration-200",
                            errors["PaymentInfo.expiry"]
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500"
                          )}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        {errors["PaymentInfo.expiry"] && (
                          <p className="text-red-500 text-sm flex items-center mt-1">
                            <Circle className="w-3 h-3 mr-1" />
                            {errors["PaymentInfo.expiry"]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        {" "}
                        <Label
                          htmlFor="cvv"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          CVV
                        </Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          value={paymentInfo.cvv}
                          onChange={handlePaymentChange}
                          className={cn(
                            "transition-colors duration-200",
                            errors["PaymentInfo.cvv"]
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500"
                          )}
                          placeholder="123"
                          maxLength={4}
                        />
                        {errors["PaymentInfo.cvv"] && (
                          <p className="text-red-500 text-sm flex items-center mt-1">
                            <Circle className="w-3 h-3 mr-1" />
                            {errors["PaymentInfo.cvv"]}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Security Notice */}
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                      <div className="flex items-start space-x-3">
                        <IconBrandStripeFilled className="w-6 h-6 text-green-600 dark:text-green-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-300">
                            Secure Payment
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            Your payment is processed securely through Stripe.
                            We never store your card details.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section: Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Order Summary
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {itemCount} item{itemCount !== 1 ? "s" : ""} in your
                        order
                      </p>
                    </div>

                    {/* Order Items Preview */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {store.cart.items
                          .slice(0, 3)
                          .map((item: CartItemResult, index: number) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3"
                            >
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                <Image
                                  src={
                                    item.product.images.thumbnail.url ||
                                    "/placeholder-product.jpg"
                                  }
                                  alt={item.product.productName}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">
                                    {item.quantity}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {item.product.productName}
                                </p>
                                <div className="flex items-center justify-between">
                                  <PriceTag
                                    priceValue={item.product.priceValueInCents}
                                    originalPriceValue={
                                      item.product.originalPriceValueInCents
                                    }
                                    isOnSale={item.product.isOnSale || false}
                                    discountPercentage={
                                      item.product.discountPercentage
                                    }
                                    size="small"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        {store.cart.items.length > 3 && (
                          <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
                            +{store.cart.items.length - 3} more item
                            {store.cart.items.length - 3 !== 1 ? "s" : ""}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">
                            Subtotal
                          </span>
                          <PriceTag priceValue={subtotal} size="small" />
                        </div>

                        {discount > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">
                              Discount
                            </span>
                            <div className="flex items-center text-green-600 dark:text-green-400">
                              <span className="text-sm">-</span>
                              <PriceTag priceValue={discount} size="small" />
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">
                            Tax (8%)
                          </span>
                          <PriceTag priceValue={tax} size="small" />
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">
                            Shipping
                          </span>
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            Free
                          </span>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                              Total
                            </span>
                            <PriceTag
                              priceValue={total}
                              size="medium"
                              fontWeight="bold"
                            />
                          </div>
                        </div>
                      </div>{" "}
                      {/* Checkout Button */}
                      <Button
                        className={cn(
                          "w-full mt-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl",
                          isShippingComplete() &&
                            isBillingComplete() &&
                            isPaymentComplete()
                            ? "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                            : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        )}
                        onClick={handlePlaceOrder}
                        disabled={
                          isSubmitting ||
                          !isShippingComplete() ||
                          !isBillingComplete() ||
                          !isPaymentComplete()
                        }
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <LoaderCircle className="w-5 h-5 animate-spin mr-2" />
                            Processing Order...
                          </div>
                        ) : !isShippingComplete() ||
                          !isBillingComplete() ||
                          !isPaymentComplete() ? (
                          <div className="flex items-center justify-center">
                            <Circle className="w-5 h-5 mr-2" />
                            Complete All Steps First
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <IconBrandStripeFilled className="w-6 h-6 mr-2" />
                            Complete Order with Stripe
                          </div>
                        )}
                      </Button>
                      {/* Progress Indicator */}
                      {(!isShippingComplete() ||
                        !isBillingComplete() ||
                        !isPaymentComplete()) && (
                        <div className="text-center mt-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {!isShippingComplete() &&
                              "Complete shipping information • "}
                            {!isBillingComplete() &&
                              "Complete billing information • "}
                            {!isPaymentComplete() &&
                              "Complete payment information • "}
                          </p>
                        </div>
                      )}
                      <div className="text-center mt-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Your payment information is secure and encrypted
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default withAuth(Checkout);
