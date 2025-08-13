"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface GridBackgroundProps {
  className?: string;
}

export function GridBackground({ className }: GridBackgroundProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <div className={cn("fixed inset-0 z-[-2]", className)}>
      {/* Light background */}
      <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900" />
      
      {/* Container for margin guidelines */}
      <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-full w-full flex justify-between">
          {/* Left margin */}
          <div className="h-full w-px bg-gray-400/50 dark:bg-gray-600/50" />
          {/* Right margin */}
          <div className="h-full w-px bg-gray-400/50 dark:bg-gray-600/50" />
        </div>
      </div>
    </div>
  );
}