"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input-ace";
import { Button } from "@/components/ui/button";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import Link from "next/link";
import Image from "next/image";
import { LabelInputContainer } from "@/components/ui/label-input-container";
import { usePhoneNumber } from "@/lib/hooks/usePhoneNumber";
import { useSession } from "@/components/providers/session-provider";
import { AuroraBackground } from "@/components/ui/aurora-background";
import {
  IconUser,
  IconMail,
  IconLock,
  IconPhone,
  IconMapPin,
  IconArrowRight,
  IconArrowLeft,
  IconShoppingBag,
  IconEye,
  IconEyeOff,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import Logo from "@/components/custom/logo";

export default function SignUp() {
  const router = useRouter();
  const { isLoggedIn } = useSession();
  const { apiBaseUrl } = useEnvStore((state) => state);

  if (isLoggedIn) router.push("/");

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const totalSteps = 3;

  // Form data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

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

  // Password strength validation
  const validatePassword = (pass: string) => {
    const requirements = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /\d/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    };
    return requirements;
  };

  const passwordRequirements = validatePassword(password);
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  // Step validation
  const isStep1Valid =
    firstName.trim() !== "" && lastName.trim() !== "" && email.trim() !== "";
  const isStep2Valid =
    phoneNumber.trim() !== "" &&
    isPasswordValid &&
    password === confirmPassword &&
    agreeToTerms;
  const isStep3Valid = country !== "" && city.trim() !== "";

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(null);
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Personal Information
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Let's start with your basic information
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <LabelInputContainer error={errors?.FirstName?.[0]}>
          <Label
            htmlFor="firstname"
            className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <IconUser className="w-4 h-4 mr-2" />
            First Name
          </Label>
          <Input
            id="firstname"
            placeholder="John"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1"
          />
        </LabelInputContainer>

        <LabelInputContainer error={errors?.LastName?.[0]}>
          <Label
            htmlFor="lastname"
            className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <IconUser className="w-4 h-4 mr-2" />
            Last Name
          </Label>
          <Input
            id="lastname"
            placeholder="Doe"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1"
          />
        </LabelInputContainer>
      </div>

      <LabelInputContainer error={errors?.Email?.[0]}>
        <Label
          htmlFor="email"
          className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <IconMail className="w-4 h-4 mr-2" />
          Email Address
        </Label>
        <Input
          id="email"
          placeholder="john.doe@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1"
        />
      </LabelInputContainer>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Security & Contact
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Secure your account and add contact information
        </p>
      </div>

      <LabelInputContainer error={errors?.PhoneNumber?.[0]}>
        <Label
          htmlFor="phone"
          className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <IconPhone className="w-4 h-4 mr-2" />
          Phone Number
        </Label>
        <div className="relative">
          <Input
            id="phone"
            placeholder="Enter international format number"
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            className="mt-1 pr-12"
          />
          {flagEmoji && (
            <Image
              src={flagEmoji}
              width={24}
              height={24}
              alt="Country flag"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            />
          )}
        </div>
      </LabelInputContainer>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LabelInputContainer error={errors?.Password?.[0]}>
          <Label
            htmlFor="password"
            className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <IconLock className="w-4 h-4 mr-2" />
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              placeholder="Create a strong password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showPassword ? (
                <IconEyeOff className="w-5 h-5" />
              ) : (
                <IconEye className="w-5 h-5" />
              )}
            </button>
          </div>
        </LabelInputContainer>

        <LabelInputContainer error={errors?.ConfirmPassword?.[0]}>
          <Label
            htmlFor="cpassword"
            className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <IconLock className="w-4 h-4 mr-2" />
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="cpassword"
              placeholder="Confirm your password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showConfirmPassword ? (
                <IconEyeOff className="w-5 h-5" />
              ) : (
                <IconEye className="w-5 h-5" />
              )}
            </button>
          </div>
        </LabelInputContainer>
      </div>

      {password && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
        >
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Password Requirements
          </h4>
          <div className="space-y-2">
            {[
              { key: "length", label: "At least 8 characters" },
              { key: "uppercase", label: "One uppercase letter" },
              { key: "lowercase", label: "One lowercase letter" },
              { key: "number", label: "One number" },
              { key: "special", label: "One special character" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center">
                {passwordRequirements[
                  key as keyof typeof passwordRequirements
                ] ? (
                  <IconCheck className="w-4 h-4 text-green-500 mr-2" />
                ) : (
                  <IconX className="w-4 h-4 text-red-500 mr-2" />
                )}
                <span
                  className={cn(
                    "text-sm",
                    passwordRequirements[
                      key as keyof typeof passwordRequirements
                    ]
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-600 dark:text-gray-400"
                  )}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {confirmPassword && password !== confirmPassword && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 text-sm flex items-center"
        >
          <IconX className="w-4 h-4 mr-1" />
          Passwords do not match
        </motion.div>
      )}

      <div className="flex items-center">
        <input
          type="checkbox"
          id="terms"
          checked={agreeToTerms}
          onChange={(e) => setAgreeToTerms(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          htmlFor="terms"
          className="ml-2 text-sm text-gray-600 dark:text-gray-400"
        >
          I agree to the{" "}
          <Link
            href="/terms"
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 underline"
          >
            Privacy Policy
          </Link>
        </label>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Address Information
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Where would you like your orders shipped?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LabelInputContainer>
          <Label
            htmlFor="country"
            className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <IconMapPin className="w-4 h-4 mr-2" />
            Country
          </Label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="et">Ethiopia</option>
            <option value="us">United States</option>
            <option value="ca">Canada</option>
            <option value="uk">United Kingdom</option>
          </select>
        </LabelInputContainer>

        <LabelInputContainer>
          <Label
            htmlFor="city"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            City
          </Label>
          <Input
            id="city"
            placeholder="Addis Ababa"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1"
          />
        </LabelInputContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LabelInputContainer>
          <Label
            htmlFor="state"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            State/Region
          </Label>
          <Input
            id="state"
            placeholder="Addis Ababa"
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="mt-1"
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label
            htmlFor="zipcode"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Zip Code
          </Label>
          <Input
            id="zipcode"
            placeholder="1000"
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="mt-1"
          />
        </LabelInputContainer>
      </div>

      <LabelInputContainer>
        <Label
          htmlFor="street"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Street Address
        </Label>
        <Input
          id="street"
          placeholder="123 Main Street"
          type="text"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="mt-1"
        />
      </LabelInputContainer>
    </motion.div>
  );

  return (
    <AuroraBackground>
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4">
        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4 space-x-2">
            <Logo />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FrontierFinds
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Join thousands of satisfied customers
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full font-semibold",
                  step === currentStep
                    ? "bg-blue-600 text-white"
                    : step < currentStep
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                )}
              >
                {step < currentStep ? <IconCheck className="w-5 h-5" /> : step}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
              initial={{ width: "0%" }}
              animate={{
                width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Personal Info</span>
            <span>Security</span>
            <span>Address</span>
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-800/50 shadow-2xl p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Create Your Account
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Step {currentStep} of {totalSteps}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {currentStep === 1 && <div key="step1">{renderStep1()}</div>}
              {currentStep === 2 && <div key="step2">{renderStep2()}</div>}
              {currentStep === 3 && <div key="step3">{renderStep3()}</div>}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center px-6 py-3"
              >
                <IconArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && !isStep1Valid) ||
                    (currentStep === 2 && !isStep2Valid)
                  }
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3"
                >
                  Next
                  <IconArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!isStep3Valid || isLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Create Account
                      <IconArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  )}
                </Button>
              )}
            </motion.div>
          </form>

          {/* Sign In Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/accounts/signin"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors"
              >
                Sign in instead
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            By creating an account, you agree to our{" "}
            <Link
              href="/terms"
              className="underline hover:text-gray-700 dark:hover:text-gray-200"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline hover:text-gray-700 dark:hover:text-gray-200"
            >
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </div>
    </AuroraBackground>
  );
}
