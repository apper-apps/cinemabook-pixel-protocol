import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import ShowtimeButton from "./ShowtimeButton";

const TheaterCard = ({ theater, selectedShowtime, onShowtimeSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl p-6 shadow-lg border border-gray-700"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{theater.name}</h3>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <ApperIcon name="MapPin" size={16} />
            <span>{theater.location}</span>
          </div>
        </div>
        {theater.amenities && (
          <div className="flex gap-2">
            {theater.amenities.includes("4DX") && (
              <span className="text-xs bg-accent text-white px-2 py-1 rounded-full font-medium">
                4DX
              </span>
            )}
            {theater.amenities.includes("IMAX") && (
              <span className="text-xs bg-primary text-secondary px-2 py-1 rounded-full font-medium">
                IMAX
              </span>
            )}
            {theater.amenities.includes("Dolby Atmos") && (
              <span className="text-xs bg-info text-white px-2 py-1 rounded-full font-medium">
                ATMOS
              </span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">Available Showtimes</h4>
        <div className="flex flex-wrap gap-2">
          {theater.showtimes.map((time, index) => (
            <ShowtimeButton
              key={index}
              time={time}
              isAvailable={Math.random() > 0.2} // Random availability for demo
              isSelected={selectedShowtime === `${theater.Id}-${time}`}
              onClick={() => onShowtimeSelect(`${theater.Id}-${time}`, theater, time)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TheaterCard;