import Button from "@/components/custom/button";
import { HoverBorderGradientButton } from "@/components/custom/hover-border-gradient-button";
import { IconBasket } from "@tabler/icons-react";
import { SearchIcon, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <section className="bg-gray-100">
      <nav className="flex justify-between items-center p-4  mx-auto ">
        <Link
          href={"/"}
          className="text-xl  font-bold dark:text-white text-center"
        >
          Frontier Finds
        </Link>

        <div className="flex justify-between  items-center relative w-fit  ">
          <div className="flex justify-left  items-center relative w-fit ">
            <SearchIcon className="absolute left-5 scale-75 opacity-85" />
            <input
              type="text"
              placeholder={"Search Products"}
              className="p-3 px-16 pl-[50px] border rounded-full w-[500px]"
            />
          </div>
        </div>
        <div className="flex justify-center items-center gap-3">
          <Link href={`/cart`}>
            <Button className="bg-transparent hover:bg-gray-200">
              <ShoppingBasket />
            </Button>
          </Link>
          <Link href={`/accounts/signup`}>
            <HoverBorderGradientButton text="Sign Up" logo={<></>} />
          </Link>
        </div>
      </nav>
    </section>
  );
}

export default Navbar;
