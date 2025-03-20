import clsx from "clsx";

import React from "react";

function MyProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={clsx("min-h-screen w-full  mx-auto max-w-[2000px]")}>
      {children}
    </div>
  );
}

export default MyProductsLayout;
