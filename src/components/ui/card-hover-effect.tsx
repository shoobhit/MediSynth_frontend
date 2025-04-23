
"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link?: string;
  }[];
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item.title + idx}
          className="relative group block p-2 h-full w-full"
        >
          <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-lg px-8 py-12 shadow-xl transition-colors hover:shadow-2xl group-hover:scale-105 duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 opacity-0 group-hover:opacity-50 transition-opacity" />
            <div className="relative text-center">
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors mt-4">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
