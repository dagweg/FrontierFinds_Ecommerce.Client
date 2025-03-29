"use client";
import Button from "@/components/custom/button";
import { HoverBorderGradientButton } from "@/components/custom/hover-border-gradient-button";
import { useSession } from "@/components/providers/session-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/zustand/useCartStore";
import { useProductsStore } from "@/lib/zustand/useProductsStore";
import { IconBasket, IconBrowser } from "@tabler/icons-react";
import { isPossibleNumber } from "libphonenumber-js";
import {
  DollarSign,
  GalleryVerticalEnd,
  LaptopMinimal,
  List,
  LogOut,
  SearchIcon,
  Settings,
  ShoppingBasket,
  Store,
  StoreIcon,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, {
  ChangeEvent,
  ChangeEventHandler,
  KeyboardEvent,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

function Navbar() {
  const router = useRouter();

  const productsStore = useProductsStore();
  const cartStore = useCartStore();
  const pathname = usePathname();

  const [query, setQuery] = useState<string>("");

  const {
    isLoggedIn,
    userSessionInfo: { email, firstName, lastName },
  } = useSession();

  const [avatarContext, setAvatarContext] = useState({
    isOpen: false,
  });

  const searchParams = useSearchParams();

  const handleAvatarClick = () => {
    setAvatarContext({ ...avatarContext, isOpen: !avatarContext.isOpen }); //toggle
  };

  const handleSearchBoxSubmit = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      const params = new URLSearchParams(searchParams);

      if (query.trim() === "") {
        params.delete("q");
      } else params.set("q", query.trim());

      router.push(`/store?${params.toString()}`);
    }
  };

  useEffect(() => {
    if (isLoggedIn) cartStore.initializeCart();
  }, []);

  const handleSearchBoxChange = (e: ChangeEvent<HTMLInputElement>) => {
    let q = e.target.value;

    setQuery(q);
  };

  return (
    <section className="border-b-2 bg-white sticky top-0 z-[50] h-[80px]">
      <nav className="flex justify-between p-4  mx-auto h-full items-center">
        <Link
          href={"/"}
          className="text-xl  font-bold dark:text-white text-center ml-4 focus:outline-none inline-flex items-center gap-3"
        >
          <Image
            src={"/favicon-main.png"}
            width={200}
            height={100}
            alt=""
            className="rounded-sm  invert-[1] w-[50px]"
          />
          <span className="font-platypi">Frontier Finds</span>
        </Link>

        <div className="flex justify-between  items-center relative w-fit  ">
          <div className="flex justify-left  items-center relative w-fit ">
            <SearchIcon className="absolute left-5 scale-75 opacity-85" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearchBoxChange(e)}
              onKeyDown={(e) => handleSearchBoxSubmit(e)}
              placeholder={"Search Products"}
              className="p-3 px-16 pl-[50px] border rounded-full w-[500px]  focus:ring-2 ring-neutral-200  outline-neutral-400 ring-offset-0 outline-offset-[3px] duration-150"
            />
          </div>
        </div>
        <div className="flex justify-center items-center gap-5">
          <Link
            href={`/store`}
            className={cn(
              " px-4 py-1 ",
              pathname.includes("store") && "bg-neutral-100  rounded-full"
            )}
          >
            Store
          </Link>
          {isLoggedIn && (
            <Link
              href={`/cart`}
              className={cn(
                " px-4 py-1  flex items-center gap-2 relative",
                pathname.includes("cart") && "bg-neutral-100  rounded-full"
              )}
            >
              <span className="z-10">Cart</span>

              <span
                className={cn(
                  !cartStore.isLoading && cartStore.cart.notSeenCount > 0
                    ? "scale-[0.8]"
                    : "scale-0",
                  "bg-red-500 text-white rounded-full aspect-square p-1 w-6  h-6 flex items-center justify-center text-sm font-platypi absolute top-[-8px] right-[-5px] duration-100"
                )}
              >
                {cartStore.cart.notSeenCount}
              </span>
            </Link>
          )}
          {isLoggedIn ? (
            <>
              <div className="relative  ">
                <Menubar className="!rounded-full">
                  <MenubarMenu>
                    <MenubarTrigger className="!overflow-hidden cursor-pointer group duration-300 ring-neutral-200">
                      <Avatar
                        onClick={handleAvatarClick}
                        className="w-10 h-10 group-focus:ring-2 ring-neutral-200"
                      >
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>
                          {firstName[0] + lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                    </MenubarTrigger>
                    <MenubarContent>
                      <div className="w-full p-2 inline-flex flex-col text-sm">
                        <span className="font-bold">
                          {firstName + " " + lastName}
                        </span>
                        <span className="text-xs">{email}</span>
                      </div>
                      <MenubarItem onClick={() => router.push("/my-products")}>
                        <div className="relative">
                          <LaptopMinimal size={15} />{" "}
                          <User
                            size={10}
                            className="absolute bg-white rounded-full right-0 bottom-0"
                          />
                        </div>{" "}
                        My Products
                      </MenubarItem>
                      <MenubarItem onClick={() => router.push("/my-purchases")}>
                        <div className="relative">
                          <GalleryVerticalEnd size={15}></GalleryVerticalEnd>{" "}
                          <DollarSign
                            size={10}
                            className="absolute bg-white rounded-full right-0 bottom-0"
                          />
                        </div>
                        Purchases
                      </MenubarItem>
                      <MenubarItem onClick={() => router.push("/settings")}>
                        <div className="relative">
                          <Settings size={15} />{" "}
                        </div>
                        Settings
                      </MenubarItem>
                      <MenubarItem onClick={() => router.push("/profile")}>
                        <div className="relative">
                          <User size={15} />{" "}
                        </div>
                        Profile
                      </MenubarItem>
                      <MenubarSeparator />
                      {/* <MenubarSub>
                        <MenubarSubTrigger>Share</MenubarSubTrigger>
                        <MenubarSubContent>
                        <MenubarItem>Email link</MenubarItem>
                        <MenubarItem>Messages</MenubarItem>
                        <MenubarItem>Notes</MenubarItem>
                        </MenubarSubContent>
                        <MenubarSeparator />
                        </MenubarSub> */}
                      <MenubarItem
                        onClick={() => router.push("/accounts/logout")}
                      >
                        {" "}
                        <LogOut size={15} />
                        Logout
                      </MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>

                {/* {avatarContext.isOpen && (
                  <Link
                    href={`/accounts/logout`}
                    className="hover:bg-neutral-100 p-2 rounded-md px-3 absolute flex items-center gap-2"
                  >
                    Logout <LogOut />
                  </Link>
                )} */}
              </div>
            </>
          ) : (
            <Link href={`/accounts/signup`}>
              <HoverBorderGradientButton text="Sign Up" logo={<></>} />
            </Link>
          )}
        </div>
      </nav>
    </section>
  );
}

export default Navbar;
