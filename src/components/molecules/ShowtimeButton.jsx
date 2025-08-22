import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const ShowtimeButton = ({ 
  time, 
  isAvailable = true, 
  isSelected = false, 
  onClick,
  className 
}) => {
  const handleClick = () => {
    if (isAvailable && onClick) {
      onClick(time);
    }
  };

  return (
    <motion.div whileTap={{ scale: isAvailable ? 0.95 : 1 }}>
      <Button
        variant={isSelected ? "primary" : isAvailable ? "ghost" : "secondary"}
        size="sm"
        onClick={handleClick}
        className={cn(
          "border transition-all duration-200",
          isAvailable 
            ? isSelected 
              ? "border-primary shadow-lg shadow-primary/30" 
              : "border-gray-600 hover:border-primary"
            : "border-gray-700 bg-gray-800 text-gray-500 cursor-not-allowed opacity-50",
          className
        )}
        disabled={!isAvailable}
      >
        {time}
        {!isAvailable && <span className="ml-1 text-xs">(Full)</span>}
      </Button>
    </motion.div>
  );
};

export default ShowtimeButton;