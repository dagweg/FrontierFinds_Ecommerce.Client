import { cn } from "@/lib/utils";

export const LabelInputContainer = ({
  children,
  className,
  error,
}: {
  children: React.ReactNode;
  className?: string;
  error?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
