import Title from "@/components/custom/title";
import React from "react";

function Footer({ className }: Readonly<{ className?: string }>) {
  return (
    <div className="bg-neutral-200 ">
      <div
        className={`w-full h-[200px] grid grid-cols-3 grid-rows-1 gap-5 p-5 max-w-6xl mx-auto ${className}`}
      >
        <div>
          <Title text="Frontier Finds" tag="h1" />
          <p>Get the best and latest finds on the internet.</p>
        </div>
        <div>
          <Title text="Quick Links" tag="h1" />
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <Title text="Newsletter" tag="h1" />
          <p>Sign up to get the latest finds.</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
