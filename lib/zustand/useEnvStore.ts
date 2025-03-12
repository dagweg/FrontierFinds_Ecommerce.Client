import { create } from "zustand";

interface EnvState {
  apiBaseUrl: string;
  isProduction: boolean;
  clientBaseUrl: string;
}

export const useEnvStore = create<EnvState>((set) => ({
  apiBaseUrl: <string>process.env.NEXT_PUBLIC_API_BASE_URL,
  isProduction: process.env.NODE_ENV === "production",
  clientBaseUrl: <string>process.env.NEXT_PUBLIC_CLIENT_BASE_URL,
}));
