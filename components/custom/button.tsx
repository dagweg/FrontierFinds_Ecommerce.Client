import React from "react";

function Button({
  children,
  className,
}: Readonly<{ children?: React.ReactNode; className?: string }>) {
  return (
    <div
      className={`bg-neutral-200 p-2 px-4 rounded-sm cursor-pointer  ${className}`}
    >
      {children}
    </div>
  );
}

export default Button;
