"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input-ace";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import countries from "country-flag-icons/unicode"; // Import country-flag-icons
import getUnicodeFlagIcon from "country-flag-icons/unicode"; // Import country-flag-icons
import Link from "next/link";
import Image from "next/image";
import { LabelInputContainer } from "@/components/ui/label-input-container";
import { usePhoneNumber } from "@/lib/hooks/usePhoneNumber";
import { useSession } from "@/components/providers/session-provider";

export default function SignUp() {
  const router = useRouter();

  const { isLoggedIn } = useSession();

  if (isLoggedIn) router.push("/");

  const { apiBaseUrl } = useEnvStore((state) => state);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { phoneNumber, setPhoneNumber, flagEmoji, handlePhoneNumberChange } =
    usePhoneNumber();

  const [country, setCountry] = useState("et");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [street, setStreet] = useState("");
  const [zipCode, setZipCode] = useState("");

  const [errors, setErrors] = useState<
    | {
        FirstName?: string[];
        LastName?: string[];
        Email?: string[];
        Password?: string[];
        ConfirmPassword?: string[];
        PhoneNumber?: string[];
        CountryCode?: string[];
      }
    | null
    | undefined
  >(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(null);

    const registerRequest = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phoneNumber,
    };

    try {
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerRequest),
      });

      const data = await response.json();
      if (response.ok) {
        if (data.AlreadyExistsButUnverified) {
        } else {
        }
        router.push(`/accounts/verify?d=${data.token}`);
      } else if (response.status === 400) {
        setErrors(data.errors);
      } else {
        console.error("Registration failed:", response);
        alert("Registration failed. Please try again later.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Network error. Please check your connection and try again.");
    }
  };

  // const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const number = e.target.value;
  //   setPhoneNumber(number);
  //   setFlagEmoji(null);

  //   try {
  //     const phoneNumberParsed = parsePhoneNumberFromString(number);
  //     if (phoneNumberParsed && phoneNumberParsed.country) {
  //       const countryCode = phoneNumberParsed.country;
  //       const flag = getFlagEmoji(countryCode);
  //       setFlagEmoji(flag);
  //
  //     }

  //
  //   } catch (error) {
  //     // Parsing error, flag remains null
  //   }
  // };

  // const getFlagEmoji = (countryCode: string): string | null => {
  //   const countryCodeUpper = countryCode.toUpperCase();
  //   // country-flag-icons exports an object where keys are country codes
  //   // and values are the emoji flags
  //   // if (countries[countryCodeUpper as keyof typeof countries]) {
  //   //   return countries[countryCodeUpper as keyof typeof countries];
  //   // }
  //   // return null;
  //   return `http://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCodeUpper}.svg`;
  // };

  return (
    <div className="flex flex-col items-center  min-h-screen  dark:bg-black">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 border  bg-white dark:bg-black">
        <div className="text-2xl font-extrabold font-serif">
          <span className="font-light">Sign Up </span>
        </div>

        <form className="my-8" onSubmit={handleSubmit}>
          {/* ... (rest of your form, LabelInputContainer, Input components are the same) */}
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer error={errors?.FirstName?.[0]}>
              <Label htmlFor="firstname">First name</Label>
              <Input
                id="firstname"
                placeholder="Tyler"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </LabelInputContainer>
            <LabelInputContainer error={errors?.LastName?.[0]}>
              <Label htmlFor="lastname">Last name</Label>
              <Input
                id="lastname"
                placeholder="Durden"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </LabelInputContainer>
          </div>
          <LabelInputContainer className="mb-4" error={errors?.Email?.[0]}>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="projectmayhem@fc.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </LabelInputContainer>
          <div className="flex w-full">
            <LabelInputContainer
              className="mb-4 flex-1"
              error={errors?.PhoneNumber?.[0]}
            >
              <Label htmlFor="phone" className="flex items-center">
                Phonenumber
              </Label>
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
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4 ">
            <LabelInputContainer className="mb-4" error={errors?.Password?.[0]}>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </LabelInputContainer>

            <LabelInputContainer
              className="mb-4"
              error={errors?.ConfirmPassword?.[0]}
            >
              <Label htmlFor="cpassword">Confirm Password</Label>
              <Input
                id="cpassword"
                placeholder="••••••••"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </LabelInputContainer>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4 ">
            <LabelInputContainer className="mb-4">
              <Label htmlFor="country">Country</Label>
              <select
                name="country-select"
                id="country-select"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="et">Ethiopia</option>
                <option value="us">United States</option>
                <option value="ca">Canada</option>
                <option value="uk">United Kingdom</option>
              </select>
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="Addis Ababa"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                placeholder="Bole"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </LabelInputContainer>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4 ">
            <LabelInputContainer className="mb-4">
              <Label htmlFor="street">Street</Label>
              <Input
                id="street"
                placeholder="Cameroon St."
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="zipcode">Zip Code</Label>
              <Input
                id="zipcode"
                placeholder="1165"
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </LabelInputContainer>
          </div>
          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Sign up →
            <BottomGradient />
          </button>

          <div>
            Already have an account?{" "}
            <Link
              href="signin"
              className="text-neutral-500 dark:text-neutral-400"
            >
              Sign in
            </Link>
          </div>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};
