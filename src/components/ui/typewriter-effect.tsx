
"use client";
import React, { useState, useEffect } from "react";

const taglines = [
  "Generate medical reports in seconds",
  "Smart documentation made simple",
  "AI-powered report automation",
  "Efficient medical documentation",
  "Streamline your reporting workflow",
  "Professional reports instantly"
];

export const TypewriterEffect = () => {
  const [currentTagline, setCurrentTagline] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = taglines[currentTagline];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(current.substring(0, text.length + 1));
        if (text.length === current.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setText(current.substring(0, text.length - 1));
        if (text.length === 0) {
          setIsDeleting(false);
          setCurrentTagline((prev) => (prev + 1) % taglines.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [text, currentTagline, isDeleting]);

  return (
    <span className="text-secondary min-h-[1.5em] inline-block">
      {text}
      <span className="animate-pulse">|</span>
    </span>
  );
};
