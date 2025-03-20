import Title from "@/components/custom/title";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Footer({ className }: Readonly<{ className?: string }>) {
  return (
    <div className="border-2 m-2 mb-0 rounded-3xl rounded-b-none">
      <div
        className={`w-full h-fit flex justify-center gap-20 my-1  mx-auto ${className}`}
      >
        <div className="text-center space-y-1 text-[0.7vw]">
          <p>
            Frontier Finds&reg;, an Ethiopian company. All rights reserved
            &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
