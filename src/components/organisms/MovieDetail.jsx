import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import TheaterCard from "@/components/molecules/TheaterCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { moviesService } from "@/services/api/moviesService";
import { theatersService } from "@/services/api/theatersService";
import { bookingsService } from "@/services/api/bookingsService";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [movieData, theatersData] = await Promise.all([
        moviesService.getById(parseInt(id)),
        theatersService.getAll()
      ]);
      
      setMovie(movieData);
      setTheaters(theatersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleShowtimeSelect = (showtimeId, theater, time) => {
    setSelectedShowtime(showtimeId);
    setSelectedTheater(theater);
    setSelectedTime(time);
  };

  const handleBookTickets = async () => {
    if (!selectedShowtime) {
      toast.warning("Please select a showtime first");
      return;
    }

    try {
      const booking = {
        movieId: movie.Id.toString(),
        theaterId: selectedTheater.Id.toString(),
        showtime: selectedTime,
        seats: ["A1", "A2"], // Demo seats
        bookingDate: new Date().toISOString().split("T")[0]
      };

      await bookingsService.create(booking);
      toast.success("Tickets booked successfully!");
      navigate("/bookings");
    } catch (err) {
      toast.error("Failed to book tickets. Please try again.");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!movie) return <Error message="Movie not found" />;

  return (
    <div className="min-h-screen bg-background">
      {/* Movie Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10" />
        <div 
          className="h-96 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `linear-gradient(rgba(15, 15, 30, 0.7), rgba(15, 15, 30, 0.9)), url(${movie.poster})`
          }}
        />
        
        <div className="relative z-20 -mt-48 px-6">
          <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-shrink-0"
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-64 h-96 object-cover rounded-xl shadow-2xl border-4 border-primary/30"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 pt-16"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="mb-4"
              >
                <ApperIcon name="ArrowLeft" size={18} className="mr-2" />
                Back to Movies
              </Button>

              <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mb-4">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Badge variant="primary" className="flex items-center gap-1">
                  <ApperIcon name="Star" size={16} className="fill-current" />
                  {movie.rating}
                </Badge>
                {movie.language && (
                  <Badge variant="default" className="uppercase">
                    {movie.language}
                  </Badge>
                )}
                {movie.duration && (
                  <div className="flex items-center gap-1 text-gray-400">
                    <ApperIcon name="Clock" size={16} />
                    <span>{movie.duration}</span>
                  </div>
                )}
                {movie.releaseDate && (
                  <div className="flex items-center gap-1 text-gray-400">
                    <ApperIcon name="Calendar" size={16} />
                    <span>{new Date(movie.releaseDate).getFullYear()}</span>
                  </div>
                )}
              </div>

              {movie.genre && movie.genre.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genre.map((g, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-surface text-gray-300 rounded-full text-sm"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}

              {selectedShowtime && (
                <div className="bg-surface/50 backdrop-blur-sm p-4 rounded-lg border border-primary/30 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">Selected Showtime</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedShowtime("");
                        setSelectedTheater(null);
                        setSelectedTime("");
                      }}
                    >
                      <ApperIcon name="X" size={16} />
                    </Button>
                  </div>
                  <div className="text-gray-300">
                    <p><strong>{selectedTheater?.name}</strong></p>
                    <p className="text-sm">{selectedTheater?.location}</p>
                    <p className="text-primary font-semibold mt-2">{selectedTime}</p>
                  </div>
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                onClick={handleBookTickets}
                className="w-full sm:w-auto"
                disabled={!selectedShowtime}
              >
                <ApperIcon name="Ticket" size={20} className="mr-2" />
                {selectedShowtime ? "Book Tickets" : "Select Showtime First"}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Theaters Section */}
      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-white mb-8">
            Select Theater & Showtime
          </h2>

          <div className="space-y-6">
            {theaters.map((theater, index) => (
              <motion.div
                key={theater.Id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TheaterCard
                  theater={theater}
                  selectedShowtime={selectedShowtime}
                  onShowtimeSelect={handleShowtimeSelect}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;