// usePhoneNumber.ts
import React, { useState, useCallback, useEffect, useRef } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";

interface UsePhoneNumberReturn {
  phoneNumber: string;
  flagEmoji: string | null;
  handlePhoneNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
}

const getFlagEmoji = (countryCode: string): string | null => {
  const countryCodeUpper = countryCode.toUpperCase();
  // Return the SVG URL for the flag
  return `http://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCodeUpper}.svg`;
};

export const usePhoneNumber = (
  initialPhoneNumber: string = "+115514859406"
): UsePhoneNumberReturn => {
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [flagEmoji, setFlagEmoji] = useState<string | null>(null);
  const [flagImage, setFlagImage] = useState<React.ReactNode | null>(null);

  // Parse the initial phone number to set the flag on mount
  useEffect(() => {
    try {
      const phoneNumberParsed = parsePhoneNumberFromString(initialPhoneNumber);
      if (phoneNumberParsed && phoneNumberParsed.country) {
        const countryCode = phoneNumberParsed.country;
        const flag = getFlagEmoji(countryCode);
        setFlagEmoji(flag);
      }
    } catch (error) {
      // Parsing error, flag remains null
    }
  }, [initialPhoneNumber]);

  const handlePhoneNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const number = e.target.value;
      setPhoneNumber(number);
      setFlagEmoji(null);

      try {
        const phoneNumberParsed = parsePhoneNumberFromString(number);
        if (phoneNumberParsed && phoneNumberParsed.country) {
          const countryCode = phoneNumberParsed.country;
          const flag = getFlagEmoji(countryCode);
          setFlagEmoji(flag);
        }
      } catch (error) {
        // Parsing error, flag remains null
      }
    },
    []
  );

  return {
    phoneNumber,
    flagEmoji,
    handlePhoneNumberChange,
    setPhoneNumber,
  };
};
