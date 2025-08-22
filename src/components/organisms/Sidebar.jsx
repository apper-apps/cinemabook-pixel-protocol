import React from "react";
import { motion } from "framer-motion";
import NavigationItem from "@/components/molecules/NavigationItem";

const Sidebar = ({ isOpen, onClose }) => {
  const navigationItems = [
    { to: "/", icon: "Film", label: "Movies" },
    { to: "/theaters", icon: "MapPin", label: "Theaters" },
    { to: "/bookings", icon: "Ticket", label: "My Bookings" }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-60 bg-secondary shadow-xl">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent">
            CinemaBook
          </h1>
          <p className="text-sm text-gray-400 mt-1">Your movie companion</p>
        </div>
        
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.to}
              to={item.to}
              icon={item.icon}
            >
              {item.label}
            </NavigationItem>
          ))}
        </nav>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="absolute left-0 top-0 h-full w-80 bg-secondary shadow-2xl"
          >
            <div className="p-6 border-b border-gray-700">
              <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent">
                CinemaBook
              </h1>
              <p className="text-sm text-gray-400 mt-1">Your movie companion</p>
            </div>
            
            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => (
                <NavigationItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  onClick={onClose}
                >
                  {item.label}
                </NavigationItem>
              ))}
            </nav>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Sidebar;