import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuClick }) => {
  return (
    <header className="lg:hidden bg-secondary shadow-lg border-b border-gray-700 sticky top-0 z-40">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="p-2"
          >
            <ApperIcon name="Menu" size={24} />
          </Button>
          <div>
            <h1 className="text-xl font-display font-bold bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent">
              CinemaBook
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="p-2">
            <ApperIcon name="Search" size={20} />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <ApperIcon name="Bell" size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;