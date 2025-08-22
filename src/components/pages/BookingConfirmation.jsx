import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { bookingsService } from "@/services/api/bookingsService";
import { moviesService } from "@/services/api/moviesService";
import { cn } from "@/utils/cn";

const BookingConfirmation = () => {
  const { id: movieId, theaterId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { theater, showtime, selectedSeats, movie: movieData, totalPrice } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [movie, setMovie] = useState(movieData || null);
  const [processing, setProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const seatCategories = {
    Premium: { price: 25, color: "bg-gradient-to-r from-yellow-400 to-orange-500" },
    Gold: { price: 18, color: "bg-gradient-to-r from-yellow-300 to-yellow-500" },
    Silver: { price: 12, color: "bg-gradient-to-r from-gray-300 to-gray-500" }
  };

  useEffect(() => {
    if (!theater || !showtime || !selectedSeats || selectedSeats.length === 0) {
      toast.error("Invalid booking data. Please try again.");
      navigate(`/movie/${movieId}`);
      return;
    }

    if (!movie) {
      loadMovieData();
    }
  }, [movieId, theater, showtime, selectedSeats, movie, navigate]);

  const loadMovieData = async () => {
    try {
      setLoading(true);
      const movieData = await moviesService.getById(parseInt(movieId));
      setMovie(movieData);
    } catch (err) {
      setError("Failed to load movie details");
      toast.error("Failed to load movie details");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
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
        totalAmount: totalPrice || getTotalPrice(),
        status: "confirmed"
      };

      const newBooking = await bookingsService.create(booking);
      setBookingId(newBooking.Id);
      setBookingComplete(true);
      toast.success(`Booking confirmed successfully! Booking ID: ${newBooking.Id}`);
      
    } catch (err) {
      toast.error("Failed to confirm booking. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const getTotalPrice = () => {
    if (!selectedSeats) return 0;
    return selectedSeats.reduce((total, seat) => {
      return total + seatCategories[seat.category].price;
    }, 0);
  };

  const handleGoToBookings = () => {
    navigate("/bookings");
  };

  const handleBackToSeats = () => {
    navigate(`/movie/${movieId}/theaters/${theaterId}/seats`, {
      state: { theater, showtime }
    });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  if (!theater || !showtime || !selectedSeats || !movie) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-8">
          <ApperIcon name="AlertCircle" size={48} className="mx-auto mb-4 text-error" />
          <h2 className="text-xl font-semibold mb-2">Invalid Booking Data</h2>
          <p className="text-gray-400 mb-4">Please start the booking process again.</p>
          <Button onClick={() => navigate("/")}>
            <ApperIcon name="Home" size={16} className="mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-2xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-gradient-to-r from-success to-info rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <ApperIcon name="Check" size={40} className="text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-4 text-success">Booking Confirmed!</h1>
          <p className="text-gray-400 mb-2">Your booking has been successfully confirmed</p>
          
          <div className="bg-background rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-400">Booking ID</p>
            <p className="text-2xl font-mono font-bold text-primary">#{bookingId}</p>
          </div>
          
          <div className="space-y-2 text-left mb-8">
            <div className="flex justify-between">
              <span className="text-gray-400">Movie:</span>
              <span className="font-semibold">{movie.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Theater:</span>
              <span className="font-semibold">{theater.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Showtime:</span>
              <span className="font-semibold">{showtime.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Seats:</span>
              <span className="font-semibold">
                {selectedSeats.map(seat => `${seat.row}${seat.number}`).join(", ")}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-600 pt-2">
              <span className="text-gray-400">Total Amount:</span>
              <span className="font-bold text-primary text-lg">${getTotalPrice()}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button onClick={handleGoToBookings} className="w-full">
              <ApperIcon name="Calendar" size={16} className="mr-2" />
              View My Bookings
            </Button>
            <Button variant="ghost" onClick={() => navigate("/")} className="w-full">
              <ApperIcon name="Home" size={16} className="mr-2" />
              Back to Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Confirm Your Booking</h1>
            <p className="text-gray-400">Review your booking details before confirming</p>
          </div>
          <Button variant="ghost" onClick={handleBackToSeats}>
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Back to Seats
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Movie Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Movie Details</h3>
            
            <div className="flex gap-4 mb-4">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-20 h-28 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-1">{movie.title}</h4>
                <div className="space-y-1 text-sm text-gray-400">
                  <p>{movie.duration}</p>
                  <p>{movie.genre.join(", ")}</p>
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Star" size={14} className="text-yellow-400" />
                    <span>{movie.rating}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Theater:</span>
                <span className="font-semibold">{theater.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Showtime:</span>
                <span className="font-semibold">{showtime.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date:</span>
                <span className="font-semibold">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>

          {/* Seat Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Selected Seats</h3>
            
            <div className="space-y-3">
              {selectedSeats.map((seat, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-white",
                      seatCategories[seat.category].color
                    )}>
                      {seat.row}{seat.number}
                    </div>
                    <div>
                      <p className="font-semibold">Row {seat.row}, Seat {seat.number}</p>
                      <Badge variant="secondary" className="text-xs">
                        {seat.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${seatCategories[seat.category].price}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Booking Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Number of Seats:</span>
                <span className="font-semibold">{selectedSeats.length}</span>
              </div>
              
              {Object.entries(
                selectedSeats.reduce((acc, seat) => {
                  acc[seat.category] = (acc[seat.category] || 0) + 1;
                  return acc;
                }, {})
              ).map(([category, count]) => (
                <div key={category} className="flex justify-between text-sm">
                  <span className="text-gray-400">{category} × {count}:</span>
                  <span className="font-semibold">
                    ${seatCategories[category].price * count}
                  </span>
                </div>
              ))}
              
              <div className="border-t border-gray-600 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary">
                    ${getTotalPrice()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <Button
                onClick={handleConfirmBooking}
                disabled={processing}
                className="w-full"
              >
                {processing ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Check" size={16} className="mr-2" />
                    Confirm Booking
                  </>
                )}
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleBackToSeats}
                className="w-full"
                disabled={processing}
              >
                <ApperIcon name="Edit" size={16} className="mr-2" />
                Modify Selection
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingConfirmation;