import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const NavigationItem = ({ to, icon, children, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
          isActive
            ? "bg-gradient-to-r from-primary to-warning text-secondary font-semibold"
            : "text-gray-300 hover:text-white hover:bg-surface hover:bg-opacity-50"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <ApperIcon 
            name={icon} 
            size={20} 
            className={`transition-colors duration-200 ${
              isActive ? "text-secondary" : "group-hover:text-primary"
            }`} 
          />
          <span className="font-medium">{children}</span>
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute right-2 w-2 h-2 bg-secondary rounded-full"
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
};

export default NavigationItem;