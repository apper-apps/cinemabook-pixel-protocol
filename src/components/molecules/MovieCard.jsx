import React from "react";
import { motion } from "framer-motion";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const MovieCard = ({ movie, onClick }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.03,
        boxShadow: "0 20px 40px rgba(245, 197, 24, 0.3)"
      }}
      whileTap={{ scale: 0.98 }}
      className="bg-surface rounded-xl overflow-hidden shadow-lg cursor-pointer group transition-all duration-300"
      onClick={() => onClick(movie)}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        <div className="absolute top-3 right-3">
          <Badge variant="primary" className="flex items-center gap-1">
            <ApperIcon name="Star" size={14} className="fill-current" />
            {movie.rating}
          </Badge>
        </div>
        <div className="absolute top-3 left-3">
          {movie.language && (
            <Badge variant="default" className="uppercase text-xs">
              {movie.language}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {movie.title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-400">
          {movie.genre && movie.genre.length > 0 && (
            <>
              <span className="truncate">{movie.genre.join(", ")}</span>
              {movie.duration && <span>•</span>}
            </>
          )}
          {movie.duration && (
            <div className="flex items-center gap-1">
              <ApperIcon name="Clock" size={14} />
              <span>{movie.duration}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1 text-primary text-sm font-medium">
            <ApperIcon name="MapPin" size={14} />
            <span>Book Now</span>
          </div>
          <ApperIcon name="ChevronRight" size={18} className="text-gray-400 group-hover:text-primary transition-colors duration-200" />
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;