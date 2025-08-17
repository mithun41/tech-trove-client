import React from "react";
import FeaturedProducts from "../featureProducts/FeaturedProducts";
import TrendingProducts from "../../TrendingProducts/TrendingProducts";
import TopContributors from "../../../components/TopContributors/TopContributors";
import Banner from "../banner/Banner";
import CouponSlider from "../../../components/CouponSlider/CouponSlider";
import WhyChooseUs from "../../../components/whyChooseUs/WhyChooseUs";
import Newsletter from "../../../components/Newsletter/Newsletter";
const Home = () => {
  return (
    <div>
      <Banner></Banner>

      <FeaturedProducts></FeaturedProducts>
      <TrendingProducts></TrendingProducts>
      <Newsletter></Newsletter>
      <TopContributors></TopContributors>
      <WhyChooseUs></WhyChooseUs>
      <CouponSlider></CouponSlider>
    </div>
  );
};

export default Home;
