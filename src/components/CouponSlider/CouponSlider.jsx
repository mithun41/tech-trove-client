import React from "react";
import Slider from "react-slick";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loading from "../Loading/Loading";

const CouponSlider = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch coupons using TanStack Query
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const res = await axiosPublic.get("/coupons");
      return res.data;
    },
  });

  // react-slick settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  if (isLoading) return <Loading></Loading>;

  return (
    <div className="max-w-7xl mx-auto my-12 px-4">
      <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">
        🎁 Active Coupons
      </h2>

      {coupons.length === 0 ? (
        <p className="text-center text-gray-500">No coupons available.</p>
      ) : (
        <Slider {...settings}>
          {coupons.map((coupon) => (
            <div key={coupon._id} className="px-2">
              <div className="bg-white shadow-md border border-orange-200 rounded-xl p-5 w-full h-full">
                <h3 className="text-lg font-bold text-orange-600 mb-1">
                  {coupon.title}
                </h3>
                <p className="text-2xl font-extrabold text-orange-500 mb-2">
                  {coupon.discount}% OFF
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  {coupon.description}
                </p>
                <div className="flex justify-between text-sm mb-2">
                  <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
                    Code: {coupon.code}
                  </span>
                  <span className="text-gray-400">
                    Expires: {coupon.expiry}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default CouponSlider;
