import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { theatersService } from "@/services/api/theatersService";

const TheatersList = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTheaters = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await theatersService.getAll();
      setTheaters(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTheaters();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTheaters} />;
  if (theaters.length === 0) return <Empty title="No theaters found" description="Check back later for theater listings" />;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-white mb-2">
          Movie Theaters
        </h2>
        <p className="text-gray-400">
          Find the perfect theater for your movie experience
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {theaters.map((theater, index) => (
          <motion.div
            key={theater.Id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface rounded-xl p-6 shadow-lg border border-gray-700 hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">{theater.name}</h3>
                <div className="flex items-center gap-2 text-gray-400 mb-3">
                  <ApperIcon name="MapPin" size={16} />
                  <span>{theater.location}</span>
                </div>
              </div>
              
              {theater.amenities && theater.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2 ml-4">
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
                {theater.showtimes.map((time, timeIndex) => (
                  <span
                    key={timeIndex}
                    className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm border border-gray-600"
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Car" size={14} />
                    <span>Parking</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Coffee" size={14} />
                    <span>Concessions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Wheelchair" size={14} />
                    <span>Accessible</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TheatersList;