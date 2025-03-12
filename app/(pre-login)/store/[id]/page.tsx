"use client";

import Title from "@/components/custom/title";
import { Star } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import { json } from "stream/consumers";

function ProductPage({ param }: { param: string }) {
  const pathname = usePathname();
  return (
    <div className="p-8">
      <div className="flex items-start gap-3 w-full ">
        <div className="flex gap-3">
          <div className="flex flex-col gap-3 w-[350px] h-full">
            <Image
              src="https://imgur.com/N8xhNK3.jpg"
              alt=""
              width={100}
              height={100}
              className="hover:border-blue-700 border-2 border-opacity-80 border-transparent rounded-lg"
            />
            <Image
              src="https://imgur.com/N8xhNK3.jpg"
              alt=""
              width={100}
              height={100}
              className="hover:border-blue-700 border-2 border-opacity-80 border-transparent rounded-lg"
            />
            <Image
              src="https://imgur.com/N8xhNK3.jpg"
              alt=""
              width={100}
              height={100}
              className="hover:border-blue-700 border-2 border-opacity-80 border-transparent rounded-lg"
            />
          </div>
          <Image
            alt=""
            src={"https://imgur.com/N8xhNK3.jpg"}
            width={500}
            height={500}
            className="w-[400px] object-contain aspect-square  rounded-lg"
          ></Image>
        </div>
        <div className="flex flex-col gap-3 h-full  w-full">
          <Title
            text={`${decodeURIComponent(pathname.split("/")[2])}`}
            tag="h1"
            className="text-3xl !font-medium"
          />
          <div className="flex items-center gap-1">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star className="text-neutral-400 invert" size={15} />
              ))}
            <p>1741 Ratings</p>
          </div>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, vitae
            architecto unde aliquam voluptas alias? Eaque ipsum quasi, maiores
            blanditiis est nihil sed iure ipsa porro doloribus soluta tenetur
            nisi!
          </p>
          <table className="table-auto w-[200px]">
            <tbody>
              <tr>
                <td>
                  <strong>Type</strong>
                </td>
                <td>lorem</td>
              </tr>
              <tr>
                <td>
                  <strong>Brand</strong>
                </td>
                <td>ipsum</td>
              </tr>
              <tr>
                <td>
                  <strong>Year</strong>
                </td>
                <td>2025</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
