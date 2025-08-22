import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { bookingsService } from "@/services/api/bookingsService";
import { moviesService } from "@/services/api/moviesService";
import { theatersService } from "@/services/api/theatersService";

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [enrichedBookings, setEnrichedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [bookingsData, moviesData, theatersData] = await Promise.all([
        bookingsService.getAll(),
        moviesService.getAll(),
        theatersService.getAll()
      ]);

      // Enrich bookings with movie and theater details
      const enriched = bookingsData.map(booking => {
        const movie = moviesData.find(m => m.Id.toString() === booking.movieId);
        const theater = theatersData.find(t => t.Id.toString() === booking.theaterId);
        return {
          ...booking,
          movie,
          theater
        };
      });

      setBookings(bookingsData);
      setEnrichedBookings(enriched);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingsService.delete(bookingId);
      toast.success("Booking cancelled successfully");
      loadBookings(); // Reload the list
    } catch (err) {
      toast.error("Failed to cancel booking");
    }
  };

  const isUpcoming = (bookingDate, showtime) => {
    const bookingDateTime = new Date(`${bookingDate}T${showtime}`);
    return bookingDateTime > new Date();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadBookings} />;
  if (enrichedBookings.length === 0) {
    return (
      <Empty 
        title="No bookings found" 
        description="You haven't booked any movies yet. Start browsing to make your first booking!"
        actionLabel="Browse Movies"
        onAction={() => window.location.href = "/"}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-white mb-2">
          My Bookings
        </h2>
        <p className="text-gray-400">
          Manage your movie tickets and booking history
        </p>
      </div>

      <div className="space-y-6">
        {enrichedBookings.map((booking, index) => (
          <motion.div
            key={booking.Id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface rounded-xl shadow-lg border border-gray-700 overflow-hidden hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row">
              {/* Movie Poster */}
              {booking.movie && (
                <div className="w-full lg:w-48 h-48 lg:h-auto">
                  <img
                    src={booking.movie.poster}
                    alt={booking.movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Booking Details */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {booking.movie?.title || "Movie Title"}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <ApperIcon name="MapPin" size={16} />
                      <span>{booking.theater?.name || "Theater Name"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <ApperIcon name="Navigation" size={14} />
                      <span>{booking.theater?.location || "Location"}</span>
                    </div>
                  </div>
                  
                  <Badge 
                    variant={isUpcoming(booking.bookingDate, booking.showtime) ? "success" : "default"}
                  >
                    {isUpcoming(booking.bookingDate, booking.showtime) ? "Upcoming" : "Past"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                      <ApperIcon name="Calendar" size={14} />
                      <span>Date</span>
                    </div>
                    <p className="text-white font-semibold">{booking.bookingDate}</p>
                  </div>
                  
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                      <ApperIcon name="Clock" size={14} />
                      <span>Time</span>
                    </div>
                    <p className="text-white font-semibold">{booking.showtime}</p>
                  </div>
                  
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                      <ApperIcon name="Users" size={14} />
                      <span>Seats</span>
                    </div>
<p className="text-white font-semibold">
                    {Array.isArray(booking.seats) ? booking.seats.join(", ") : "N/A"}
                  </p>
                  </div>
                  
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                      <ApperIcon name="Hash" size={14} />
                      <span>Booking ID</span>
                    </div>
                    <p className="text-white font-semibold">#{booking.Id}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {isUpcoming(booking.bookingDate, booking.showtime) && (
                    <>
                      <Button variant="outline" size="sm">
                        <ApperIcon name="Download" size={16} className="mr-2" />
                        Download Ticket
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleCancelBooking(booking.Id)}
                        className="text-error hover:bg-error/10"
                      >
                        <ApperIcon name="X" size={16} className="mr-2" />
                        Cancel Booking
                      </Button>
                    </>
                  )}
                  {!isUpcoming(booking.bookingDate, booking.showtime) && (
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="Star" size={16} className="mr-2" />
                      Rate Movie
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BookingsList;