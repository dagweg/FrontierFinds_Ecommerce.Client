"use client";
import Title from "@/components/custom/title";
import { IconCancel } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

function CheckoutCancelled() {
  return (
    <div className="h-screen ">
      <div className="bg-white mx-auto mt-32  w-[500px] p-12 rounded-lg shadow-xl border-[1px]">
        <div className="inline-flex gap-3 items-center">
          <IconCancel size={30} />{" "}
          <Title text="Checkout Cancelled" className="text-2xl" />
        </div>
        <div className=" text-lg  text-neutral-600 ">
          <p>
            The initiated checkout has been cancelled, to try again please head
            back to the checkout page.
          </p>

          <p className="mt-12">
            Return to{" "}
            <Link
              href={"/checkout"}
              className="text-black underline underline-offset-2"
            >
              {" "}
              Checkout page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CheckoutCancelled;
