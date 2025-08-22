import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Movies from "@/components/pages/Movies";
import MovieDetails from "@/components/pages/MovieDetails";
import Theaters from "@/components/pages/Theaters";
import Bookings from "@/components/pages/Bookings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Movies />} />
          <Route path="movie/:id" element={<MovieDetails />} />
          <Route path="theaters" element={<Theaters />} />
          <Route path="bookings" element={<Bookings />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 9999 }}
      />
    </BrowserRouter>
  );
}

export default App;