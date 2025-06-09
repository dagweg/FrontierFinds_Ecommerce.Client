"use client";
import Button from "@/components/custom/button";
import { HoverBorderGradientButton } from "@/components/custom/hover-border-gradient-button";
import Logo from "@/components/custom/logo";
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
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState<boolean>(false);

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
      const params = new URLSearchParams(searchParams ?? "");

      if (query.trim() === "") {
        params.delete("q");
      } else params.set("q", query.trim());

      router.push(`/store?${params.toString()}`);
    }
  };

  useEffect(() => {
    if (isLoggedIn) cartStore.initializeCart();
  }, [isLoggedIn]);

  const handleSearchBoxChange = (e: ChangeEvent<HTMLInputElement>) => {
    let q = e.target.value;

    setQuery(q);
  };
  return (
    <section className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-[50] h-[80px] transition-all duration-200">
      <nav className="flex justify-between p-4 mx-auto h-full items-center max-w-7xl">
        {" "}
        {/* Enhanced Logo */}{" "}
        <Link
          href={"/"}
          className="text-xl font-bold dark:text-white text-center ml-4 focus:outline-none inline-flex items-center gap-3  group transition-all duration-200 flex-shrink-0 min-w-fit"
        >
          <Logo
            size="md"
            className="group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        {/* Enhanced Search Bar */}
        <div className="hidden md:flex justify-center items-center relative w-fit max-w-lg mx-4 flex-1">
          <div className="flex justify-center items-center relative w-full group">
            <SearchIcon className="absolute left-4 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" />

            <input
              type="text"
              value={query}
              onChange={(e) => handleSearchBoxChange(e)}
              onKeyDown={(e) => handleSearchBoxSubmit(e)}
              placeholder="Search amazing products..."
              className="w-full p-3 pl-12 pr-4 border border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:shadow-md focus:shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none" />
          </div>
        </div>{" "}
        {/* Enhanced Navigation Links */}
        <div className="flex justify-center items-center gap-6">
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsMobileSearchOpen(true)}
            className="md:hidden px-4 py-2 rounded-full font-medium transition-all duration-200 hover-scale relative overflow-hidden group text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
          >
            <SearchIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>

          {/* Store Link */}
          <Link
            href={`/store`}
            className={cn(
              "px-4 py-2 rounded-full font-medium transition-all duration-200 hover-scale relative overflow-hidden group",
              pathname?.includes("store")
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <Store className="w-4 h-4 inline-block mr-2" />
            <span className="hidden sm:inline">Store</span>
            {pathname?.includes("store") && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
            )}
          </Link>

          {/* Cart Link */}
          {isLoggedIn && (
            <Link
              href={`/cart`}
              className={cn(
                "px-4 py-2 rounded-full font-medium transition-all duration-200 hover-scale relative overflow-hidden group flex items-center gap-2",
                pathname?.includes("cart")
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <ShoppingBasket className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>

              {/* Enhanced cart badge */}
              <span
                className={cn(
                  !cartStore.isLoading && cartStore.cart.notSeenCount > 0
                    ? "scale-100 opacity-100"
                    : "scale-0 opacity-0",
                  "bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full aspect-square w-5 h-5 flex items-center justify-center text-xs font-bold absolute -top-1 -right-1 transition-all duration-200 animate-pulse"
                )}
              >
                {cartStore.cart.notSeenCount}
              </span>
              {pathname?.includes("cart") && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
              )}
            </Link>
          )}

          {/* User Section */}
          {isLoggedIn ? (
            <div className="relative">
              <Menubar className="border-0 bg-transparent">
                <MenubarMenu>
                  <MenubarTrigger className="!overflow-hidden cursor-pointer group duration-300 border-0 bg-transparent p-0 hover:bg-transparent focus:bg-transparent">
                    <div className="relative">
                      <Avatar className="w-10 h-10 ring-2 ring-transparent group-hover:ring-blue-200 dark:group-hover:ring-blue-800 transition-all duration-200 hover-lift">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                          {firstName[0] + lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </MenubarTrigger>
                  <MenubarContent className="w-56 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl overflow-hidden">
                    {/* User Info Header */}
                    <div className="w-full p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-100 dark:border-gray-700">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {firstName + " " + lastName}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {email}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <MenubarItem
                        onClick={() => router.push("/my-products")}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        <div className="relative p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <LaptopMinimal
                            size={16}
                            className="text-blue-600 dark:text-blue-400"
                          />
                        </div>
                        <span className="font-medium">My Products</span>
                      </MenubarItem>

                      <MenubarItem
                        onClick={() => router.push("/my-purchases")}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        <div className="relative p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <GalleryVerticalEnd
                            size={16}
                            className="text-green-600 dark:text-green-400"
                          />
                        </div>
                        <span className="font-medium">Purchases</span>
                      </MenubarItem>

                      <MenubarItem
                        onClick={() => router.push("/settings")}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        <div className="relative p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <Settings
                            size={16}
                            className="text-purple-600 dark:text-purple-400"
                          />
                        </div>
                        <span className="font-medium">Settings</span>
                      </MenubarItem>

                      <MenubarItem
                        onClick={() => router.push("/profile")}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        <div className="relative p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <User
                            size={16}
                            className="text-gray-600 dark:text-gray-400"
                          />
                        </div>
                        <span className="font-medium">Profile</span>
                      </MenubarItem>
                    </div>

                    <MenubarSeparator className="bg-gray-200 dark:bg-gray-700" />

                    <div className="p-2">
                      <MenubarItem
                        onClick={() => router.push("/accounts/logout")}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer text-red-600 dark:text-red-400"
                      >
                        <div className="relative p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                          <LogOut
                            size={16}
                            className="text-red-600 dark:text-red-400"
                          />
                        </div>
                        <span className="font-medium">Logout</span>
                      </MenubarItem>
                    </div>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
          ) : (
            <Link href={`/accounts/signup`} className="hover-scale">
              <HoverBorderGradientButton text="Sign Up" logo={<></>} />
            </Link>
          )}
        </div>{" "}
      </nav>

      {/* Mobile Search Bar - appears when icon is clicked */}
      {isMobileSearchOpen && (
        <div className="md:hidden px-4 pb-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center relative w-full group">
            <SearchIcon className="absolute left-4 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" />

            <input
              type="text"
              value={query}
              onChange={(e) => handleSearchBoxChange(e)}
              onKeyDown={(e) => handleSearchBoxSubmit(e)}
              onBlur={() => !query && setIsMobileSearchOpen(false)}
              autoFocus
              placeholder="Search products..."
              className="w-full p-3 pl-12 pr-12 border border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            />
            <button
              onClick={() => {
                setIsMobileSearchOpen(false);
                setQuery("");
              }}
              className="absolute right-3 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Navbar;
