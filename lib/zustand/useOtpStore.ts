import { create } from "zustand";

interface OtpState {
  otp: string;
  setOtp: (otp: string) => void;
  clearOtp: () => void;
  otpSuccess: boolean | null;
  setOtpSuccess: (success: boolean | null) => void;
  otpResendSuccess: boolean;
  setOtpResendSuccess: (success: boolean) => void;
  otpWaitSeconds: number;
  setOtpWaitSeconds: (seconds: number) => void;
  otpResendTimerRunning: boolean;
  setOtpResendTimerRunning: (running: boolean) => void;
}

export const useOtpStore = create<OtpState>((set) => ({
  otp: "",
  setOtp: (otp) => set({ otp }),
  clearOtp: () => set({ otp: "" }),
  otpSuccess: null,
  setOtpSuccess: (otpSuccess) => set({ otpSuccess }),
  otpResendSuccess: true,
  setOtpResendSuccess: (otpResendSuccess) => set({ otpResendSuccess }),
  otpWaitSeconds: 0,
  setOtpWaitSeconds: (otpWaitSeconds) => set({ otpWaitSeconds }),
  otpResendTimerRunning: false,
  setOtpResendTimerRunning: (otpResendTimerRunning) =>
    set({ otpResendTimerRunning }),
}));
