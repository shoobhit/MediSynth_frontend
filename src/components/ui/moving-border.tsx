
"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const Button = ({
  borderRadius = "1.75rem",
  children,
  className,
  ...props
}: {
  borderRadius?: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <button
      className={cn(
        "relative inline-flex h-11 items-center justify-center overflow-hidden px-6 transition-all",
        "before:absolute before:inset-0 before:transition-transform before:duration-500",
        "before:bg-gradient-to-r before:from-primary before:via-accent before:to-primary before:bg-[length:200%_100%]",
        "hover:before:translate-x-[-10%] before:animate-shimmer",
        className
      )}
      style={{ borderRadius }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};
