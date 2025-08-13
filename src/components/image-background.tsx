"use client";

import { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface ImageBackgroundProps {
  src?: string;
  className?: string;
  opacity?: number; // optional overlay opacity 0..1
}

export function ImageBackground({ src = "/image4.png", className, opacity = 1 }: ImageBackgroundProps) {
  const style: CSSProperties = {
    backgroundImage: `url(${src})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  return (
    <div className={cn("fixed inset-0 z-0 pointer-events-none", className)}>
      <div className="absolute inset-0" style={style} />
      {opacity < 1 && (
        <div
          className="absolute inset-0 bg-white"
          style={{ opacity: 1 - opacity }}
        />
      )}
    </div>
  );
}


