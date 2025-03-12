"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import { useOtpStore } from "@/lib/zustand/useOtpStore";
import clsx from "clsx";
import { useRef, useState } from "react";

export function InputOtp() {
  const { otp, setOtp, setOtpSuccess, otpSuccess } = useOtpStore();
  const { apiBaseUrl } = useEnvStore();

  const otpRef = useRef<HTMLInputElement | null>(null);

  const handleOtpChange = async (inp: string) => {
    setOtp(inp);
    if (inp.length === 6) {
      otpRef.current?.blur();
    }
  };

  return (
    <InputOTP
      maxLength={6}
      value={otp ?? ""}
      onChange={(inp) => handleOtpChange(inp)}
      ref={otpRef}
    >
      <InputOTPGroup>
        <InputOTPSlot
          className={clsx(
            otpSuccess === null
              ? "!border-neutral-400"
              : otpSuccess
              ? "!border-green-500"
              : "!border-red-500"
          )}
          index={0}
        />
        <InputOTPSlot
          className={clsx(
            otpSuccess === null
              ? "!border-neutral-400"
              : otpSuccess
              ? "!border-green-500"
              : "!border-red-500"
          )}
          index={1}
        />
        <InputOTPSlot
          className={clsx(
            otpSuccess === null
              ? "!border-neutral-400"
              : otpSuccess
              ? "!border-green-500"
              : "!border-red-500"
          )}
          index={2}
        />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot
          className={clsx(
            otpSuccess === null
              ? "!border-neutral-400"
              : otpSuccess
              ? "!border-green-500"
              : "!border-red-500"
          )}
          index={3}
        />
        <InputOTPSlot
          className={clsx(
            otpSuccess === null
              ? "!border-neutral-400"
              : otpSuccess
              ? "!border-green-500"
              : "!border-red-500"
          )}
          index={4}
        />
        <InputOTPSlot
          className={clsx(
            otpSuccess === null
              ? "!border-neutral-400"
              : otpSuccess
              ? "!border-green-500"
              : "!border-red-500"
          )}
          index={5}
        />
      </InputOTPGroup>
    </InputOTP>
  );
}
