import Title from "@/components/custom/title";
import Link from "next/link";
export default function NotFound() {
  return (
    <div className="w-full  flex flex-col items-center h-screen py-20">
      <Title text="404" tag="h1" className="text-5xl" />
      <p>Could not find requested resource</p>
      <p>
        Return{" "}
        <Link className="underline" href="/">
          Home
        </Link>
      </p>
    </div>
  );
}
