"use client";

import { useEnvStore } from "@/lib/zustand/useEnvStore";
import React, { createContext, useContext, useEffect, useState } from "react";

interface SessionContextType {
  isLoggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { apiBaseUrl } = useEnvStore();

  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch(`${apiBaseUrl}/auth/authorize`, {
        credentials: "include",
      });
      setIsLoggedIn(res.ok);
    };

    checkSession();
  }, []);

  return (
    <SessionContext.Provider value={{ isLoggedIn, setLoggedIn: setIsLoggedIn }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
