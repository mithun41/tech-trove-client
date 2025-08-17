import React from "react";
import FeaturedProducts from "../featureProducts/FeaturedProducts";
import TrendingProducts from "../../TrendingProducts/TrendingProducts";
import TopContributors from "../../../components/TopContributors/TopContributors";
import Banner from "../banner/Banner";
import CouponSlider from "../../../components/CouponSlider/CouponSlider";
import WhyChooseUs from "../../../components/whyChooseUs/WhyChooseUs";
import Newsletter from "../../../components/Newsletter/Newsletter";
import Testimonials from "../../../components/testimonials/Testimonials";
const Home = () => {
  return (
    <div>
      <Banner></Banner>

      <FeaturedProducts></FeaturedProducts>
      <TrendingProducts></TrendingProducts>
      <Newsletter></Newsletter>
      <CouponSlider></CouponSlider>
      <TopContributors></TopContributors>
      <WhyChooseUs></WhyChooseUs>
      <Testimonials></Testimonials>
    </div>
  );
};

export default Home;
