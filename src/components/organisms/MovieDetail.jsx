import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { moviesService } from "@/services/api/moviesService";
import { format } from "date-fns";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMovie = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await moviesService.getById(parseInt(id));
      setMovie(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadMovie();
    }
  }, [id]);

  const handleBackClick = () => {
    navigate("/");
  };

const handleBookTickets = () => {
    toast.success(`Finding theaters for "${movie.title}"...`);
    navigate(`/movie/${movie.Id}/theaters`);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadMovie} />;
  if (!movie) return <Error message="Movie not found" onRetry={handleBackClick} />;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Image */}
        <div className="absolute inset-0 h-[60vh] lg:h-[70vh]">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-background/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 py-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              className="flex items-center gap-2 text-white hover:text-primary hover:bg-surface/50"
            >
              <ApperIcon name="ArrowLeft" size={20} />
              Back to Movies
            </Button>
          </motion.div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              {/* Poster */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-4 xl:col-span-3 flex justify-center lg:justify-start"
              >
                <div className="relative">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-80 h-auto rounded-xl shadow-2xl ring-2 ring-primary/20"
                  />
                  <div className="absolute -top-2 -right-2">
                    <Badge variant="primary" className="flex items-center gap-1 text-base px-3 py-1">
                      <ApperIcon name="Star" size={16} className="fill-current" />
                      {movie.rating}
                    </Badge>
                  </div>
                </div>
              </motion.div>

              {/* Movie Info */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-8 xl:col-span-9 space-y-6 text-center lg:text-left"
              >
                {/* Title */}
                <h1 className="text-4xl lg:text-6xl font-display font-bold text-white leading-tight">
                  {movie.title}
                </h1>

                {/* Genres */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  {movie.genre.map((genre, index) => (
                    <Badge key={index} variant="default" className="text-sm">
                      {genre}
                    </Badge>
                  ))}
                </div>

                {/* Movie Details */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-300">
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <ApperIcon name="Clock" size={16} className="text-primary" />
                    <span>{movie.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <ApperIcon name="Calendar" size={16} className="text-primary" />
                    <span>{format(new Date(movie.releaseDate), "MMM yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <ApperIcon name="Globe" size={16} className="text-primary" />
                    <span>{movie.language}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <ApperIcon name="User" size={16} className="text-primary" />
                    <span>{movie.director}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  <Button
                    size="lg"
                    onClick={handleBookTickets}
                    className="px-8 py-3 text-lg font-semibold"
                  >
                    <ApperIcon name="Ticket" size={20} className="mr-2" />
                    Book Tickets
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 py-12 max-w-7xl mx-auto space-y-12">
        {/* Synopsis */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-display font-bold text-white mb-4">
            Synopsis
          </h2>
          <p className="text-gray-300 leading-relaxed text-lg max-w-4xl">
            {movie.synopsis}
          </p>
        </motion.section>

        {/* Cast */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-display font-bold text-white mb-4">
            Cast
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {movie.cast.map((actor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                className="bg-surface rounded-lg p-4 text-center hover:bg-surface/80 transition-colors duration-200"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="User" size={24} className="text-primary" />
                </div>
                <p className="text-white font-medium text-sm leading-tight">
                  {actor}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Director Info */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-display font-bold text-white mb-4">
            Director
          </h2>
          <div className="bg-surface rounded-lg p-6 flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <ApperIcon name="Video" size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">{movie.director}</p>
              <p className="text-gray-400 text-sm">Director</p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default MovieDetail;