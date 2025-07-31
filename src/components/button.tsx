"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Button component props interface
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "primary" | "secondary";
    size?: "sm" | "md" | "lg";
}

// Button component for various actions liek login and sign up
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "md", ...props }, ref) => {
        // Different style variants
        const variantStyles = {
            default: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100",
            outline: "bg-transparent border border-gray-300 hover:bg-gray-100",
            primary: "bg-primary text-white hover:bg-primary-dark",
            secondary: "bg-black text-white hover:bg-gray-800",
        };

        // Different size variations
        const sizeStyles = {
            sm: "py-1 px-3 text-sm",
            md: "py-2 px-4",
            lg: "py-3 px-6 text-lg",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";