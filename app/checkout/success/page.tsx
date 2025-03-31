"use client";
import Title from "@/components/custom/title";
import { useCartStore } from "@/lib/zustand/useCartStore";
import { IconCancel } from "@tabler/icons-react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

function CheckoutSuccess() {
  const cartStore = useCartStore();

  // Clear the cart after successful checkout

  useEffect(() => {
    cartStore.clearCart();
  }, []);

  return (
    <div className="h-screen ">
      <div className="bg-white border-green-500 mx-auto mt-32  w-[500px] p-12 rounded-lg shadow-xl border-[1px]">
        <div className="inline-flex gap-3 items-center">
          <CheckCircle color="green" size={30} />{" "}
          <Title text="Checkout Successful" className="text-2xl" />
        </div>
        <div className=" text-lg  text-neutral-600 ">
          <p>
            The initiated checkout has been completed successfully. You can now
            keep track of your order until it arrives at your location.
          </p>

          <p className="mt-12">
            Goto{" "}
            <Link
              href={"/my-purchases"}
              className="text-black underline underline-offset-2"
            >
              {" "}
              My Purchases
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccess;
