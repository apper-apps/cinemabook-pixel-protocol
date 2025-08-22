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
import { bookingsService } from "@/services/api/bookingsService";
import { moviesService } from "@/services/api/moviesService";
import { cn } from "@/utils/cn";

const SeatSelection = () => {
  const { id: movieId, theaterId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { theater, showtime } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movie, setMovie] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [processing, setProcessing] = useState(false);

  const seatCategories = {
    Premium: { price: 25, color: "text-yellow-400", bgColor: "bg-yellow-500/20" },
    Gold: { price: 18, color: "text-orange-400", bgColor: "bg-orange-500/20" },
    Silver: { price: 12, color: "text-gray-400", bgColor: "bg-gray-500/20" }
  };

  useEffect(() => {
    loadData();
  }, [movieId, theaterId]);

  const loadData = async () => {
    if (!theater || !showtime) {
      setError("Missing theater or showtime information");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const [movieData, seatsData] = await Promise.all([
        moviesService.getById(parseInt(movieId)),
        seatService.getSeatsForTheater(parseInt(theaterId))
      ]);
      
      setMovie(movieData);
      setSeats(seatsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load seat information");
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seat) => {
    if (seat.isBooked) {
      toast.error("This seat is already booked");
      return;
    }

    const seatId = `${seat.row}-${seat.number}`;
    const isSelected = selectedSeats.find(s => `${s.row}-${s.number}` === seatId);
    
    if (isSelected) {
      setSelectedSeats(prev => prev.filter(s => `${s.row}-${s.number}` !== seatId));
      toast.info(`Seat ${seat.row}${seat.number} deselected`);
    } else {
      if (selectedSeats.length >= 8) {
        toast.error("Maximum 8 seats can be selected");
        return;
      }
      setSelectedSeats(prev => [...prev, seat]);
      toast.success(`Seat ${seat.row}${seat.number} selected`);
    }
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => {
      return total + seatCategories[seat.category].price;
    }, 0);
  };

  const handleBookNow = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    try {
      setProcessing(true);
      
      const booking = {
        movieId: parseInt(movieId),
        movieTitle: movie.title,
        theater: theater.name,
        showtime: showtime.time,
        date: new Date().toISOString().split('T')[0],
        seats: selectedSeats.map(seat => ({
          row: seat.row,
          number: seat.number,
          category: seat.category,
          price: seatCategories[seat.category].price
        })),
        totalAmount: getTotalPrice(),
        status: "confirmed"
      };

      await bookingsService.create(booking);
      toast.success(`Booking confirmed! ${selectedSeats.length} seats booked for $${getTotalPrice()}`);
      navigate("/bookings");
      
    } catch (err) {
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const getSeatStatus = (seat) => {
    const seatId = `${seat.row}-${seat.number}`;
    const isSelected = selectedSeats.find(s => `${s.row}-${s.number}` === seatId);
    
    if (seat.isBooked) return "booked";
    if (isSelected) return "selected";
    return "available";
  };

  const getSeatClasses = (seat) => {
    const status = getSeatStatus(seat);
    const category = seatCategories[seat.category];
    
    const baseClasses = "w-8 h-8 rounded-lg border-2 flex items-center justify-center text-xs font-medium cursor-pointer transition-all duration-200 hover:scale-110";
    
    switch (status) {
      case "booked":
        return cn(baseClasses, "bg-red-600 border-red-500 text-white cursor-not-allowed opacity-70");
      case "selected":
        return cn(baseClasses, "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/50");
      case "available":
      default:
        return cn(baseClasses, "bg-green-600 border-green-500 text-white hover:bg-green-500", category.bgColor);
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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Back to Showtimes
          </Button>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Select Your Seats</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-300">
              <div className="flex items-center gap-2">
                <ApperIcon name="Film" size={20} className="text-primary" />
                <span className="font-medium">{movie?.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="MapPin" size={16} className="text-gray-400" />
                <span>{theater.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Clock" size={16} className="text-gray-400" />
                <span>{showtime.time}</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded border-2 border-green-500"></div>
              <span className="text-sm text-gray-300">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded border-2 border-blue-400"></div>
              <span className="text-sm text-gray-300">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded border-2 border-red-500"></div>
              <span className="text-sm text-gray-300">Booked</span>
            </div>
          </div>

          {/* Seat Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {Object.entries(seatCategories).map(([category, info]) => (
              <div key={category} className="bg-surface rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <span className={cn("font-semibold", info.color)}>{category}</span>
                  <Badge variant="secondary">${info.price}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Theater Layout */}
        <div className="bg-surface rounded-xl p-8 mb-8">
          {/* Screen */}
          <div className="mb-12">
            <div className="w-full h-2 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full mb-2"></div>
            <p className="text-center text-gray-400 text-sm">SCREEN</p>
          </div>

          {/* Seats */}
          <div className="space-y-4 max-w-4xl mx-auto">
            {sortedRows.map((row) => {
              const rowSeats = groupedSeats[row].sort((a, b) => a.number - b.number);
              return (
                <motion.div
                  key={row}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * parseInt(row.charCodeAt(0) - 65) }}
                  className="flex items-center justify-center gap-2"
                >
                  {/* Row Label */}
                  <div className="w-8 flex justify-center">
                    <span className="text-gray-400 font-semibold text-sm">{row}</span>
                  </div>

                  {/* Seats */}
                  <div className="flex gap-1">
                    {rowSeats.map((seat, index) => {
                      // Add gap in middle for aisle
                      const showAisle = index === Math.floor(rowSeats.length / 2);
                      return (
                        <React.Fragment key={`${seat.row}-${seat.number}`}>
                          {showAisle && <div className="w-4"></div>}
                          <motion.button
                            whileHover={{ scale: seat.isBooked ? 1 : 1.1 }}
                            whileTap={{ scale: seat.isBooked ? 1 : 0.95 }}
                            className={getSeatClasses(seat)}
                            onClick={() => handleSeatClick(seat)}
                            disabled={seat.isBooked}
                          >
                            {seat.number}
                          </motion.button>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Booking Summary */}
        {selectedSeats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-xl p-6 border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Booking Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Selected Seats:</span>
                <span className="text-white font-medium">
                  {selectedSeats.map(seat => `${seat.row}${seat.number}`).join(", ")}
                </span>
              </div>
              
              <div className="space-y-1">
                {Object.entries(
                  selectedSeats.reduce((acc, seat) => {
                    acc[seat.category] = (acc[seat.category] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([category, count]) => (
                  <div key={category} className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">{count}x {category} (${seatCategories[category].price} each)</span>
                    <span className="text-gray-300">${count * seatCategories[category].price}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-600 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-white">Total:</span>
                  <span className="text-2xl font-bold text-primary">${getTotalPrice()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="ghost"
                onClick={() => setSelectedSeats([])}
                className="flex-1"
              >
                Clear Selection
              </Button>
              <Button
                variant="primary"
                onClick={handleBookNow}
                disabled={processing}
                className="flex-1"
              >
                {processing ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ApperIcon name="CreditCard" size={16} className="mr-2" />
                    Book Now (${getTotalPrice()})
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