"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import Title from "@/components/custom/title";
import Link from "next/link";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input-ace";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import { LabelInputContainer } from "@/components/ui/label-input-container";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/providers/session-provider";

export default function SignIn() {
  const router = useRouter();

  const { isLoggedIn } = useSession();

  if (isLoggedIn) router.push("/");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<
    | {
        Email?: string[];
        Password?: string[];
      }
    | null
    | undefined
  >(null);

  const { apiBaseUrl } = useEnvStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(null);

    const loginRequest = {
      email,
      password,
    };

    // Simulate API call for demonstration purposes
    // Replace this with your actual API endpoint
    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        // Replace with your actual endpoint if needed
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginRequest),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful sign-in, e.g., redirect or store token
        location.reload();
        router.push("/store");
      } else if (response.status === 400) {
        setErrors(data.errors);
      } else if (response.status === 401) {
        console.error("Sign in failed:", data.message);
        alert("Email or Password is incorrect.");
      } else {
        console.error("Sign in failed:", response);
        alert("Sign in failed. Please try again later.");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      alert("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="flex flex-col items-center pt-10 min-h-screen dark:bg-black">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 border  bg-white dark:bg-black">
        <div className="text-2xl font-extrabold font-serif">
          <span className="font-light">Sign In</span>
        </div>

        <form className="my-8" onSubmit={handleSubmit}>
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

          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Sign in →
            <BottomGradient />
          </button>

          <div>
            Are you new here?{" "}
            <Link
              href="signup"
              className="text-neutral-500 dark:text-neutral-400"
            >
              Sign up
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
