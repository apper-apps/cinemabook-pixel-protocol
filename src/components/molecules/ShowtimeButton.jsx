import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const ShowtimeButton = ({ 
  time, 
  price = 12,
  availableSeats = 50,
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
          "border transition-all duration-200 flex-col items-center px-4 py-3 h-auto min-w-[100px]",
          isAvailable 
            ? isSelected 
              ? "border-primary shadow-lg shadow-primary/30" 
              : "border-gray-600 hover:border-primary"
            : "border-gray-700 bg-gray-800 text-gray-500 cursor-not-allowed opacity-50",
          className
        )}
        disabled={!isAvailable}
      >
        <span className="font-medium text-sm">{time}</span>
        <span className="text-xs opacity-80 mt-1">
          {isAvailable ? `$${price}` : "Full"}
        </span>
        {isAvailable && availableSeats < 20 && (
          <span className="text-xs text-warning mt-1">
            {availableSeats} left
          </span>
        )}
      </Button>
    </motion.div>
  );
};

export default ShowtimeButton;