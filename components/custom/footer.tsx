"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

function Footer({ className }: Readonly<{ className?: string }>) {
  return (
    <div className="bg-transparent  mb-0 border-t-[1px] shadow-2xl bg-white ">
      <div
        className={`w-full h-[50px] flex justify-center items-center gap-20 my-1  mx-auto ${className}`}
      >
        <div className="text-center space-y-1 flex items-center justify-between w-full text-xs">
          <Link
            href={"/"}
            className="  font-bold dark:text-white text-center ml-4 focus:outline-none inline-flex items-center gap-3"
          >
            <Image
              src={"/favicon-main.png"}
              width={200}
              height={100}
              alt=""
              className="rounded-sm  invert-[1] w-[20px]"
            />
            <span className="font-platypi ">Frontier Finds Ltd.</span>
          </Link>
          <p>
            Frontier Finds&reg; Ltd., an Ethiopian company. All rights reserved
            &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
