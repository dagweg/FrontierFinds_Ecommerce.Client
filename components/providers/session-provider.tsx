"use client";

import { useEnvStore } from "@/lib/zustand/useEnvStore";
import React, { createContext, useContext, useEffect, useState } from "react";

interface UserSessionInfo {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface SessionContextType {
  userSessionInfo: UserSessionInfo;
  setUserSessionInfo: (value: UserSessionInfo) => void;
  isLoggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userSessionInfo, setUserSessionInfo] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  const { apiBaseUrl } = useEnvStore();

  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch(`${apiBaseUrl}/auth/authorize`, {
        credentials: "include",
      });
      setIsLoggedIn(res.ok);
      if (res.ok) {
        const b = await res.json();
        setUserSessionInfo(b);
      }
    };

    checkSession();
  }, []);

  return (
    <SessionContext.Provider
      value={{
        isLoggedIn,
        setLoggedIn: setIsLoggedIn,
        setUserSessionInfo,
        userSessionInfo,
      }}
    >
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
