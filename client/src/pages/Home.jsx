import React from "react";
import Hero from "../components/Hero";
import FeaturedDestination from "../components/FeaturedDestination";
import Offers from "../components/Offers";
import Testimonial from "../components/Testimonial";
import NewsLetter from "../components/NewsLetter";
import RecommendedHotel from "../components/RecommendedHotel";

const Home = () => {
  return (
    <>
      <Hero />
      <RecommendedHotel />
      <FeaturedDestination />
      <Offers />
      <Testimonial />
      <NewsLetter />
    </>
  );
};

export default Home;
