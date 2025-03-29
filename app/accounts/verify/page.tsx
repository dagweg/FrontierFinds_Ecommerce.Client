"use client";
import { InputOtp } from "@/components/custom/input-otp";
import Title from "@/components/custom/title";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import NotFound from "@/app/not-found";
import { Button } from "@/components/ui/button";
import { useOtpStore } from "@/lib/zustand/useOtpStore";
import { Check, Loader } from "lucide-react";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import { useTime, useTimer } from "react-timer-hook";

function VerifyAccount() {
  const param = useSearchParams();

  const tknP = param.get("d"); // token param

  if (tknP === null || tknP.trim() === "") notFound();

  try {
    const router = useRouter();
    const tkn = jwtDecode(tknP);

    const {
      otp,
      setOtpSuccess,
      otpSuccess,
      setOtp,
      setOtpResendSuccess,
      otpResendSuccess,
      otpWaitSeconds,
      setOtpWaitSeconds,
      otpResendTimerRunning,
      setOtpResendTimerRunning,
    } = useOtpStore();
    const { apiBaseUrl } = useEnvStore();

    // resendBtnref
    const resendBtnRef = React.useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
      if (otp.length === 6) {
        //

        if (resendBtnRef.current) {
          resendBtnRef.current.disabled = true;
        }

        var request = {
          otp,
          userId: (tkn as any).sub,
        };

        (async () => {
          // Send OTP to server
          const response = await fetch(`${apiBaseUrl}/auth/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
          });

          const d = await response.json();

          if (response.ok) {
            setOtpSuccess(true);
            setTimeout(() => {
              router.push("/accounts/signin");
            }, 2500);
          } else {
            alert("Invalid Otp Provided");
            setOtpSuccess(false);
            setTimeout(() => setOtpSuccess(null), 2000);
            setOtp("");
          }
        })();
      } else {
        if (resendBtnRef.current) {
          resendBtnRef.current.disabled = false;
        }
      }
    }, [otp]);

    useEffect(() => {
      if (resendBtnRef.current)
        if (otpResendTimerRunning) resendBtnRef.current.disabled = true;
        else resendBtnRef.current.disabled = false;
    }, [otpResendTimerRunning]);

    const handleVerify = async () => {
      var request = {
        UserId: (tkn as any).sub,
      };

      const res = await fetch(`${apiBaseUrl}/auth/verify/resendOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      const data = await res.json();

      //

      setOtpResendSuccess(data.isSuccess);
      setOtpWaitSeconds(data.waitSeconds);

      if (res.ok) {
        setOtpResendTimerRunning(true);
        alert("OTP sent successfully.");
      } else {
        alert("Failed to send OTP.");
      }
    };

    return (
      <section className="w-full h-screen ">
        <div className="max-w-lg mx-auto  flex flex-col items-center gap-3 h-full py-32">
          <Title text="Verify Account" tag="h1" className="text-5xl" />
          <p className="text-center ">
            We&apos;ve sent a One-Time-Password to your email at{" "}
            <strong>{(tkn as any).email}</strong>. Please check your email and
            input the password to verify your account.
          </p>
          <div className="mt-8 w-full flex flex-col gap-10 items-center">
            <InputOtp />
            <Button
              onClick={handleVerify}
              className="mx-auto"
              ref={resendBtnRef}
            >
              <OtpButtonContent />
            </Button>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    notFound();
  }
}

export default VerifyAccount;

const CountdownTimer = ({
  waitSeconds,
}: {
  waitSeconds: number;
}): ReactNode => {
  let expiryTimestamp = new Date();

  const { setOtpResendTimerRunning } = useOtpStore();

  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + waitSeconds);

  const { seconds } = useTimer({
    expiryTimestamp,
    onExpire: () => setOtpResendTimerRunning(false),
  });

  return <>Wait for: {seconds}</>;
};

const OtpButtonContent = (): ReactNode => {
  const ostore = useOtpStore();

  if (ostore.otpResendTimerRunning)
    return <CountdownTimer waitSeconds={ostore.otpWaitSeconds} />;

  return <>Resend</>;
};
