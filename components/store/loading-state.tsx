"use client";

import { CircleDashed } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({
  message = "Loading product...",
}: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <CircleDashed className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
