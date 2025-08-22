import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MovieCard from "@/components/molecules/MovieCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { moviesService } from "@/services/api/moviesService";

const MoviesGrid = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await moviesService.getAll();
      setMovies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.Id}`);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadMovies} />;
  if (movies.length === 0) return <Empty />;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-white mb-2">
          Now Showing
        </h2>
        <p className="text-gray-400">
          Discover the latest movies playing in theaters near you
        </p>
      </div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {movies.map((movie, index) => (
          <motion.div
            key={movie.Id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
          >
            <MovieCard
              movie={movie}
              onClick={handleMovieClick}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default MoviesGrid;