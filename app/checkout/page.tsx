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
import { Form, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useSession } from "@/components/providers/session-provider";
import { ShoppingBasket } from "lucide-react";
import Link from "next/link";
import withAuth from "@/lib/decorators/withAuth";

const Checkout: React.FC = () => {
  const store = useCartStore();
  const router = useRouter();

  const apiBaseUrl = useEnvStore().apiBaseUrl;

  const session = useSession();

  const { phoneNumber, setPhoneNumber, flagEmoji, handlePhoneNumberChange } =
    usePhoneNumber();

  // State for shipping address
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    email: "",
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
        item.product.priceValueInCents || item.product.priceValueInCents;
      const itemSubtotal = (itemPrice / 100) * item.quantity;
      subtotal += itemSubtotal;
      itemCount += item.quantity;

      // if (item.product.isOnSale && originalPrice > itemPrice) {
      //   const itemDiscount =
      //     ((originalPrice - itemPrice) / 100) * item.quantity;
      //   discount += itemDiscount;
      // }
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

  // Handle form input changes
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [`ShippingAddress.${name}`]: "" }));
    setServerError(null);
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [`BillingAddress.${name}`]: "" }));
    setServerError(null);
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [`PaymentInformation.${name}`]: "" }));
    setServerError(null);
  };

  // Validate form (client-side)
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
    else if (!/^\d{5}(-\d{4})?$/.test(shippingAddress.zipCode))
      newErrors["ShippingAddress.zipCode"] = "Invalid ZIP code format";
    if (!shippingAddress.country)
      newErrors["ShippingAddress.country"] = "Country is required";
    if (!shippingAddress.email)
      newErrors["ShippingAddress.email"] = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(shippingAddress.email))
      newErrors["ShippingAddress.email"] = "Invalid email format";
    if (!phoneNumber)
      newErrors["ShippingAddress.phone"] = "Phone number is required";
    else if (!/^\d{10}$/.test(phoneNumber.replace(/\D/g, "")))
      newErrors["ShippingAddress.phone"] = "Phone number must be 10 digits";

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
      else if (!/^\d{5}(-\d{4})?$/.test(billingAddress.zipCode))
        newErrors["BillingAddress.zipCode"] = "Invalid ZIP code format";
      if (!billingAddress.country)
        newErrors["BillingAddress.country"] = "Country is required";
    }

    // Payment Information validation
    if (!paymentInfo.cardNumber)
      newErrors["PaymentInformation.cardNumber"] = "Card number is required";
    else if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\D/g, "")))
      newErrors["PaymentInformation.cardNumber"] =
        "Card number must be 16 digits";
    if (!paymentInfo.expiry)
      newErrors["PaymentInformation.expiry"] = "Expiry date is required";
    else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentInfo.expiry))
      newErrors["PaymentInformation.expiry"] = "Invalid expiry date (MM/YY)";
    if (!paymentInfo.cvv)
      newErrors["PaymentInformation.cvv"] = "CVV is required";
    else if (!/^\d{3,4}$/.test(paymentInfo.cvv))
      newErrors["PaymentInformation.cvv"] = "CVV must be 3 or 4 digits";
    if (!paymentInfo.cardHolderName)
      newErrors["PaymentInformation.cardHolderName"] =
        "Cardholder name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle order placement
  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setServerError(null);
    setErrors({});

    // Prepare the order data
    const orderData = {
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country,
        email: shippingAddress.email,
        phone: phoneNumber,
      },
      billingAddress: sameAsShipping ? shippingAddress : billingAddress,
      paymentInformation: {
        cardNumber: paymentInfo.cardNumber,
        expiry: paymentInfo.expiry,
        cvv: paymentInfo.cvv,
        cardHolderName: paymentInfo.cardHolderName,
      },
      products: store.cart.items.map((item: CartItemResult) => ({
        productId: item.product.productId,
        quantity: item.quantity,
        price: item.product.priceValueInCents,
      })),
    };

    try {
      const response = await fetch(`${apiBaseUrl}/orders`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle server-side errors
        if (result.errors) {
          const newErrors: { [key: string]: string } = {};
          Object.keys(result.errors).forEach((key) => {
            newErrors[key] = result.errors[key][0]; // Take the first error message
          });
          setErrors(newErrors);
        }
        setServerError(
          result.detail || "An error occurred while placing the order."
        );
        setIsSubmitting(false);
        return;
      }

      // Success
      store.clearCart();
      router.push("/order-confirmation");
    } catch (error) {
      setServerError(
        "Failed to connect to the server. Please try again later."
      );
      setIsSubmitting(false);
    }
  };

  const form = useForm();

  if (store.cart.items.length == 0) {
    return (
      <div className="text-center text-lg h-screen w-full   text-neutral-600 p-12  mx-auto rounded-xl">
        <div className="flex  flex-col gap-3 items-center mt-32 ">
          <ShoppingBasket size={50} />
          Your cart is empty. <br />
          <strong>Nothing to checkout.</strong>
          <Link
            href={"/store"}
            className="bg-neutral-500 p-1 rounded-full px-5  text-white mt-10"
          >
            Return to store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen  py-8">
      <Form {...form}>
        <form>
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            {serverError && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                {serverError}
              </div>
            )}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Section: Shipping, Billing, and Payment Forms */}
              <div className="flex-1 space-y-8">
                {/* Shipping Address */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">
                    Shipping Address
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shippingStreet">Street</Label>
                      <Input
                        id="shippingStreet"
                        name="street"
                        value={shippingAddress.street}
                        onChange={handleShippingChange}
                        className={
                          errors["ShippingAddress.street"]
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors["ShippingAddress.street"] && (
                        <p className="text-red-500 text-sm">
                          {errors["ShippingAddress.street"]}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="shippingCity">City</Label>
                      <Input
                        id="shippingCity"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleShippingChange}
                        className={
                          errors["ShippingAddress.city"] ? "border-red-500" : ""
                        }
                      />
                      {errors["ShippingAddress.city"] && (
                        <p className="text-red-500 text-sm">
                          {errors["ShippingAddress.city"]}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="shippingState">State</Label>
                      <Input
                        id="shippingState"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleShippingChange}
                        className={
                          errors["ShippingAddress.state"]
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors["ShippingAddress.state"] && (
                        <p className="text-red-500 text-sm">
                          {errors["ShippingAddress.state"]}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="shippingZipCode">ZIP Code</Label>
                      <Input
                        id="shippingZipCode"
                        name="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={handleShippingChange}
                        className={
                          errors["ShippingAddress.zipCode"]
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors["ShippingAddress.zipCode"] && (
                        <p className="text-red-500 text-sm">
                          {errors["ShippingAddress.zipCode"]}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="shippingCountry">Country</Label>
                      <Input
                        id="shippingCountry"
                        name="country"
                        value={shippingAddress.country}
                        onChange={handleShippingChange}
                        className={
                          errors["ShippingAddress.country"]
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors["ShippingAddress.country"] && (
                        <p className="text-red-500 text-sm">
                          {errors["ShippingAddress.country"]}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="shippingEmail">Email</Label>
                      <Input
                        id="shippingEmail"
                        name="email"
                        type="email"
                        value={
                          shippingAddress.email == ""
                            ? session.userSessionInfo.email
                            : shippingAddress.email
                        }
                        onChange={handleShippingChange}
                        className={
                          errors["ShippingAddress.email"]
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors["ShippingAddress.email"] && (
                        <p className="text-red-500 text-sm">
                          {errors["ShippingAddress.email"]}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="shippingPhone">Phone</Label>
                      <div className="relative">
                        {flagEmoji && (
                          <Image
                            src={flagEmoji}
                            width={30}
                            height={30}
                            alt=""
                            className="absolute right-4  h-full"
                          />
                        )}
                        <Input
                          id="shippingPhone"
                          name="phone"
                          value={phoneNumber}
                          onChange={handlePhoneNumberChange}
                          className={
                            errors["ShippingAddress.phone"]
                              ? "border-red-500"
                              : ""
                          }
                        />
                      </div>
                      {errors["ShippingAddress.phone"] && (
                        <p className="text-red-500 text-sm">
                          {errors["ShippingAddress.phone"]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Billing Address */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">
                    Billing Address
                  </h2>
                  <div className="flex items-center mb-4">
                    <Checkbox
                      id="sameAsShipping"
                      checked={sameAsShipping}
                      onCheckedChange={(checked) =>
                        setSameAsShipping(checked as boolean)
                      }
                    />
                    <Label htmlFor="sameAsShipping" className="ml-2">
                      Same as shipping address
                    </Label>
                  </div>
                  {!sameAsShipping && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="billingStreet">Street</Label>
                        <Input
                          id="billingStreet"
                          name="street"
                          value={billingAddress.street}
                          onChange={handleBillingChange}
                          className={
                            errors["BillingAddress.street"]
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors["BillingAddress.street"] && (
                          <p className="text-red-500 text-sm">
                            {errors["BillingAddress.street"]}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="billingCity">City</Label>
                        <Input
                          id="billingCity"
                          name="city"
                          value={billingAddress.city}
                          onChange={handleBillingChange}
                          className={
                            errors["BillingAddress.city"]
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors["BillingAddress.city"] && (
                          <p className="text-red-500 text-sm">
                            {errors["BillingAddress.city"]}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="billingState">State</Label>
                        <Input
                          id="billingState"
                          name="state"
                          value={billingAddress.state}
                          onChange={handleBillingChange}
                          className={
                            errors["BillingAddress.state"]
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors["BillingAddress.state"] && (
                          <p className="text-red-500 text-sm">
                            {errors["BillingAddress.state"]}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="billingZipCode">ZIP Code</Label>
                        <Input
                          id="billingZipCode"
                          name="zipCode"
                          value={billingAddress.zipCode}
                          onChange={handleBillingChange}
                          className={
                            errors["BillingAddress.zipCode"]
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors["BillingAddress.zipCode"] && (
                          <p className="text-red-500 text-sm">
                            {errors["BillingAddress.zipCode"]}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="billingCountry">Country</Label>
                        <Input
                          id="billingCountry"
                          name="country"
                          value={billingAddress.country}
                          onChange={handleBillingChange}
                          className={
                            errors["BillingAddress.country"]
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors["BillingAddress.country"] && (
                          <p className="text-red-500 text-sm">
                            {errors["BillingAddress.country"]}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Information */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">
                    Payment Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="cardHolderName">Cardholder Name</Label>
                      <Input
                        id="cardHolderName"
                        name="cardHolderName"
                        value={paymentInfo.cardHolderName}
                        onChange={handlePaymentChange}
                        className={
                          errors["PaymentInformation.cardHolderName"]
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors["PaymentInformation.cardHolderName"] && (
                        <p className="text-red-500 text-sm">
                          {errors["PaymentInformation.cardHolderName"]}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentChange}
                        placeholder="1234 5678 9012 3456"
                        className={
                          errors["PaymentInformation.cardNumber"]
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors["PaymentInformation.cardNumber"] && (
                        <p className="text-red-500 text-sm">
                          {errors["PaymentInformation.cardNumber"]}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        name="expiry"
                        value={paymentInfo.expiry}
                        onChange={handlePaymentChange}
                        placeholder="MM/YY"
                        className={
                          errors["PaymentInformation.expiry"]
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors["PaymentInformation.expiry"] && (
                        <p className="text-red-500 text-sm">
                          {errors["PaymentInformation.expiry"]}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        value={paymentInfo.cvv}
                        onChange={handlePaymentChange}
                        placeholder="123"
                        className={
                          errors["PaymentInformation.cvv"]
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors["PaymentInformation.cvv"] && (
                        <p className="text-red-500 text-sm">
                          {errors["PaymentInformation.cvv"]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section: Order Summary */}
              <div className="w-full lg:w-[400px] bg-white p-6 rounded-lg shadow-xl border-2 h-fit sticky  top-[85px] z-[10]">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                {store.cart &&
                store.cart.items &&
                store.cart.items.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {store.cart.items.map(
                        (item: CartItemResult, index: number) => (
                          <div key={index} className="flex justify-between">
                            <span>
                              {item.product.productName} (x{item.quantity})
                            </span>
                            <PriceTag
                              priceValue={
                                item.product.priceValueInCents * item.quantity
                              }
                              size="small"
                            />
                          </div>
                        )
                      )}
                    </div>
                    <div className="border-t my-4"></div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal ({itemCount} items)</span>
                        <PriceTag priceValue={subtotal} size="small" />
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-red-500">
                          <span>Discount</span>
                          <span>
                            -<PriceTag priceValue={discount} size="small" />
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Tax (8%)</span>
                        <PriceTag priceValue={tax} size="small" />
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="text-green-500">Free</span>
                      </div>
                      <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                        <span>Total</span>
                        <PriceTag
                          priceValue={total}
                          size="medium"
                          fontWeight="bold"
                        />
                      </div>
                    </div>
                    <Button
                      className="w-full mt-6"
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Placing Order..." : "Place Order"}
                    </Button>
                  </>
                ) : (
                  <p className="text-gray-500">Your cart is empty.</p>
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default withAuth(Checkout);
