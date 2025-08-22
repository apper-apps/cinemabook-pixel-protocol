import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { moviesService } from "@/services/api/moviesService";
import { theatersService } from "@/services/api/theatersService";
import ApperIcon from "@/components/ApperIcon";
import Theaters from "@/components/pages/Theaters";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import TheaterCard from "@/components/molecules/TheaterCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const MovieTheaterSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [movieData, theatersData] = await Promise.all([
        moviesService.getById(parseInt(id)),
        theatersService.getByMovieId(parseInt(id))
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

  const handleShowtimeSelect = (showtimeId, theater, showtime) => {
    setSelectedShowtime(showtimeId);
    setSelectedTheater({ theater, showtime });
  };

const handleProceedToBooking = () => {
    if (!selectedTheater) {
      toast.error("Please select a showtime first");
      return;
    }

    navigate(`/movie/${id}/theaters/${selectedTheater.theater.Id}/seats`, {
      state: {
        theater: selectedTheater.theater,
        showtime: selectedTheater.showtime
      }
    });
  };

  const handleBackClick = () => {
    navigate(`/movie/${id}`);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!movie) return <Error message="Movie not found" onRetry={handleBackClick} />;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-surface/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              className="flex items-center gap-2"
            >
              <ApperIcon name="ArrowLeft" size={16} />
              Back to Movie
            </Button>
          </div>
          
          <div className="flex items-start gap-6">
            <div className="w-24 h-36 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-display font-bold text-white mb-2">
                Select Theater & Showtime
              </h1>
              <h2 className="text-xl text-primary font-semibold mb-3">
                {movie.title}
              </h2>
              
              <div className="flex items-center gap-4 text-sm text-gray-400">
                {movie.genre && movie.genre.length > 0 && (
                  <>
                    <span>{movie.genre.join(", ")}</span>
                    <span>•</span>
                  </>
                )}
                {movie.duration && (
                  <>
                    <span>{movie.duration}</span>
                    <span>•</span>
                  </>
                )}
                <div className="flex items-center gap-1">
                  <ApperIcon name="Star" size={14} className="fill-current text-primary" />
                  <span>{movie.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Theaters List */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">
            Available Theaters ({theaters.length})
          </h3>
          <p className="text-gray-400">
            Choose your preferred theater and showtime
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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

        {/* Proceed Button */}
        {selectedTheater && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-xl p-6 border border-primary/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-white mb-1">
                  Selected: {selectedTheater.theater.name}
                </h4>
                <p className="text-gray-400 text-sm">
                  {selectedTheater.showtime.time} • ${selectedTheater.showtime.price} per ticket • {selectedTheater.showtime.availableSeats} seats available
                </p>
              </div>
              
              <Button
                variant="primary"
                size="lg"
                onClick={handleProceedToBooking}
                className="flex items-center gap-2"
              >
                Proceed to Seats
                <ApperIcon name="ArrowRight" size={16} />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MovieTheaterSelection;