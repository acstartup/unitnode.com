"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface TypingAnimationProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursorHeight?: string;
}

export function TypingAnimation({
  text,
  className = "",
  speed = 30,
  delay = 500,
  cursorHeight = "h-18",
}: TypingAnimationProps) {
  const [displayText, setDisplayText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset if text changes
    setDisplayText("");
    setIsTypingComplete(false);
    
    // Clear any existing intervals/timeouts
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    // Initial delay before typing starts
    timeoutRef.current = setTimeout(() => {
      let index = 0;
      
      // Start typing animation
      intervalRef.current = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.substring(0, index + 1));
          index++;
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsTypingComplete(true);
        }
      }, speed);
    }, delay);

    // Cleanup function
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed, delay]);

  return (
    <div className={`relative ${className}`}>
      <h1 className="inline-block whitespace-nowrap">
        {displayText}
        {!isTypingComplete && (
          <motion.span
            className={`inline-block w-1 ${cursorHeight} bg-primary ml-1 align-middle`}
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, repeatType: "reverse" }}
          />
        )}
      </h1>
    </div>
  );
}