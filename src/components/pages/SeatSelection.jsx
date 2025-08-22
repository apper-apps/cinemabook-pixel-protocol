import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { seatService } from "@/services/api/seatService";
import { moviesService } from "@/services/api/moviesService";
import { cn } from "@/utils/cn";
const SeatSelection = () => {
const { id: movieId, theaterId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { theater, showtime, movie: movieData } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movie, setMovie] = useState(movieData || null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [processing, setProcessing] = useState(false);

const seatCategories = {
    Premium: { 
      price: 25, 
      color: "text-yellow-400", 
      bgColor: "bg-yellow-500/20",
      description: "Premium seats with best view"
    },
    Gold: { 
      price: 18, 
      color: "text-orange-400", 
      bgColor: "bg-orange-500/20",
      description: "Great seats with excellent view"
    },
    Silver: { 
      price: 12, 
      color: "text-gray-400", 
      bgColor: "bg-gray-500/20",
      description: "Standard seats"
    }
  };

useEffect(() => {
    loadData();
  }, [movieId, theaterId]);

  const loadData = async () => {
    if (!theater || !showtime) {
      setError("Missing theater or showtime information");
      setLoading(false);
      toast.error("Missing booking information. Please start over.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const promises = [];
      
      // Load movie data if not already provided
      if (!movie) {
        promises.push(moviesService.getById(parseInt(movieId)));
      }
      
      // Load seats data
      promises.push(seatService.getSeatsForTheater(parseInt(theaterId)));
      
      const results = await Promise.all(promises);
      
      if (!movie) {
        setMovie(results[0]);
        setSeats(results[1]);
      } else {
        setSeats(results[0]);
      }
      
      toast.success("Seat layout loaded successfully");
    } catch (err) {
      console.error("Error loading seat data:", err);
      setError(err.message || "Failed to load seat information");
      toast.error("Failed to load seat information");
    } finally {
      setLoading(false);
    }
  };

const handleSeatClick = (seat) => {
    if (seat.isBooked) {
      toast.error(`Seat ${seat.row}${seat.number} is already booked`);
      return;
    }

    if (!seat.isAvailable) {
      toast.warning(`Seat ${seat.row}${seat.number} is not available`);
      return;
    }

    const seatId = `${seat.row}-${seat.number}`;
    const isSelected = selectedSeats.find(s => `${s.row}-${s.number}` === seatId);
    
    if (isSelected) {
      setSelectedSeats(prev => prev.filter(s => `${s.row}-${s.number}` !== seatId));
      toast.info(`Seat ${seat.row}${seat.number} deselected`);
    } else {
      if (selectedSeats.length >= 8) {
        toast.error("Maximum 8 seats can be selected at once");
        return;
      }
      setSelectedSeats(prev => [...prev, { ...seat }]);
      toast.success(`${seat.category} seat ${seat.row}${seat.number} selected ($${seatCategories[seat.category].price})`);
    }
  };

const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => {
      const categoryPrice = seatCategories[seat.category]?.price || 12;
      return total + categoryPrice;
    }, 0);
  };

  const getSeatCountByCategory = () => {
    return selectedSeats.reduce((acc, seat) => {
      acc[seat.category] = (acc[seat.category] || 0) + 1;
      return acc;
    }, {});
  };

const handleBookNow = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    const totalPrice = getTotalPrice();
    toast.success(`Proceeding to booking confirmation for ${selectedSeats.length} seat(s)`);
    
    navigate(`/movie/${movieId}/theaters/${theaterId}/confirm`, {
      state: {
        theater,
        showtime,
        selectedSeats,
        movie,
        totalPrice
      }
    });
  };

const getSeatStatus = (seat) => {
    const seatId = `${seat.row}-${seat.number}`;
    const isSelected = selectedSeats.find(s => `${s.row}-${s.number}` === seatId);
    
    if (seat.isBooked) return "booked";
    if (isSelected) return "selected";
    if (!seat.isAvailable) return "unavailable";
    return "available";
  };

  const getSeatClasses = (seat) => {
    const status = getSeatStatus(seat);
    const category = seatCategories[seat.category] || seatCategories.Silver;
    
    const baseClasses = "w-8 h-8 sm:w-9 sm:h-9 rounded-lg border-2 flex items-center justify-center text-xs font-bold cursor-pointer transition-all duration-200 transform";
    
    switch (status) {
      case "booked":
        return cn(baseClasses, "bg-red-600 border-red-500 text-white cursor-not-allowed opacity-50 hover:opacity-70");
      case "selected":
        return cn(baseClasses, "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/50 scale-110");
      case "unavailable":
        return cn(baseClasses, "bg-gray-800 border-gray-600 text-gray-500 cursor-not-allowed opacity-50");
      case "available":
      default:
        const colorClass = category === seatCategories.Premium ? "bg-yellow-600 border-yellow-500 hover:bg-yellow-500" :
                           category === seatCategories.Gold ? "bg-orange-600 border-orange-500 hover:bg-orange-500" :
                           "bg-green-600 border-green-500 hover:bg-green-500";
        return cn(baseClasses, colorClass, "text-white hover:scale-110 hover:shadow-md");
    }
  };

if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!theater || !showtime) {
    return <Error message="Missing theater or showtime information" onRetry={() => navigate(-1)} />;
  }

  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const sortedRows = Object.keys(groupedSeats).sort();
  const seatCountByCategory = getSeatCountByCategory();
  return (
<div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            Back to Showtimes
          </Button>
          
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Select Your Seats</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-gray-300">
              <div className="flex items-center gap-2">
                <ApperIcon name="Film" size={18} className="text-primary flex-shrink-0" />
                <span className="font-medium truncate">{movie?.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="MapPin" size={16} className="text-gray-400 flex-shrink-0" />
                <span className="truncate">{theater.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Clock" size={16} className="text-gray-400 flex-shrink-0" />
                <span>{showtime.time}</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded-lg border-2 border-green-500 flex-shrink-0"></div>
              <span className="text-sm text-gray-300">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded-lg border-2 border-blue-400 flex-shrink-0"></div>
              <span className="text-sm text-gray-300">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded-lg border-2 border-red-500 flex-shrink-0"></div>
              <span className="text-sm text-gray-300">Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-800 rounded-lg border-2 border-gray-600 flex-shrink-0"></div>
              <span className="text-sm text-gray-300">Unavailable</span>
            </div>
          </div>

          {/* Seat Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            {Object.entries(seatCategories).map(([category, info]) => (
              <motion.div 
                key={category} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * Object.keys(seatCategories).indexOf(category) }}
                className="bg-surface rounded-xl p-4 border border-gray-700 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn("font-semibold text-lg", info.color)}>{category}</span>
                  <Badge variant="primary" className="text-sm font-bold">
                    ${info.price}
                  </Badge>
                </div>
                <p className="text-xs text-gray-400">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Theater Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8 border border-gray-700"
        >
          {/* Screen */}
          <div className="mb-8 sm:mb-12">
            <div className="w-full h-3 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mb-3"></div>
            <p className="text-center text-gray-400 text-sm font-semibold tracking-wider">SCREEN</p>
          </div>

          {/* Seats */}
          <div className="space-y-2 sm:space-y-3 max-w-5xl mx-auto overflow-x-auto">
            {sortedRows.map((row, rowIndex) => {
              const rowSeats = groupedSeats[row].sort((a, b) => a.number - b.number);
              return (
                <motion.div
                  key={row}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * rowIndex }}
                  className="flex items-center justify-center gap-1 sm:gap-2 min-w-max"
                >
                  {/* Row Label */}
                  <div className="w-6 sm:w-8 flex justify-center flex-shrink-0">
                    <span className="text-gray-400 font-bold text-sm sm:text-base">{row}</span>
                  </div>

                  {/* Seats */}
                  <div className="flex gap-1">
                    {rowSeats.map((seat, index) => {
                      // Add gap in middle for aisle
                      const showAisle = index === Math.floor(rowSeats.length / 2);
                      return (
                        <React.Fragment key={`${seat.row}-${seat.number}`}>
                          {showAisle && <div className="w-3 sm:w-4"></div>}
                          <motion.button
                            whileHover={{ 
                              scale: seat.isBooked || !seat.isAvailable ? 1 : 1.15,
                              rotate: seat.isBooked || !seat.isAvailable ? 0 : [0, -2, 2, 0]
                            }}
                            whileTap={{ scale: seat.isBooked || !seat.isAvailable ? 1 : 0.9 }}
                            className={getSeatClasses(seat)}
                            onClick={() => handleSeatClick(seat)}
                            disabled={seat.isBooked || !seat.isAvailable}
                            title={`${seat.category} seat ${seat.row}${seat.number} - $${seatCategories[seat.category]?.price || 12}`}
                          >
                            {seat.number}
                          </motion.button>
                        </React.Fragment>
                      );
                    })}
                  </div>
                  
                  {/* Row Label (Right side) */}
                  <div className="w-6 sm:w-8 flex justify-center flex-shrink-0">
                    <span className="text-gray-400 font-bold text-sm sm:text-base">{row}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Booking Summary */}
        {selectedSeats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-2xl p-4 sm:p-6 border border-primary/20 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <ApperIcon name="ShoppingCart" size={24} className="text-primary" />
              <h3 className="text-xl sm:text-2xl font-bold text-white">Booking Summary</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Selected Seats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 font-medium">Selected Seats</span>
                  <Badge variant="primary" className="text-sm">
                    {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-bold text-white flex items-center gap-1",
                        seat.category === 'Premium' ? 'bg-yellow-600' :
                        seat.category === 'Gold' ? 'bg-orange-600' : 'bg-green-600'
                      )}
                    >
                      {seat.row}{seat.number}
                      <button
                        onClick={() => handleSeatClick(seat)}
                        className="hover:bg-black/20 rounded-full p-0.5 ml-1"
                        title="Remove seat"
                      >
                        <ApperIcon name="X" size={12} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <h4 className="text-gray-300 font-medium">Price Breakdown</h4>
                
                <div className="space-y-2">
                  {Object.entries(seatCountByCategory).map(([category, count]) => (
                    <div key={category} className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">
                        {count}x {category} (${seatCategories[category].price} each)
                      </span>
                      <span className="text-white font-medium">
                        ${count * seatCategories[category].price}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary">${getTotalPrice()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedSeats([]);
                  toast.info("All seats deselected");
                }}
                className="flex items-center justify-center gap-2"
              >
                <ApperIcon name="RotateCcw" size={16} />
                Clear Selection
              </Button>
              <Button
                variant="primary"
                onClick={handleBookNow}
                disabled={processing}
                className="flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ApperIcon name="ArrowRight" size={16} />
                    Continue (${getTotalPrice()})
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SeatSelection;