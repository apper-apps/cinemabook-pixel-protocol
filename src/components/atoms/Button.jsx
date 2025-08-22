import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md",
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-warning text-secondary font-semibold hover:scale-105 shadow-lg hover:shadow-xl",
    secondary: "bg-surface text-white hover:bg-opacity-80 border border-gray-600",
    ghost: "text-white hover:bg-surface hover:bg-opacity-50",
    outline: "border border-primary text-primary hover:bg-primary hover:text-secondary"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button
      className={cn(
        "rounded-lg transition-all duration-200 ease-out font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;