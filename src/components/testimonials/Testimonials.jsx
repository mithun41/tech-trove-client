import Slider from "react-slick";
import { FaStar } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const reviews = [
  {
    name: "Alice Johnson",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    feedback:
      "Tech Trove helped me find the best gadgets easily. Highly recommend!",
  },
  {
    name: "David Lee",
    photo: "https://randomuser.me/api/portraits/men/46.jpg",
    rating: 4,
    feedback: "Great platform with detailed product reviews. Very useful!",
  },
  {
    name: "Sofia Martinez",
    photo: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 5,
    feedback:
      "I love the curated tech content. Makes shopping so much simpler!",
  },
  {
    name: "Mark Thompson",
    photo: "https://randomuser.me/api/portraits/men/12.jpg",
    rating: 4,
    feedback: "The product ratings are very accurate. Saved me a lot of time!",
  },
  {
    name: "Emma Watson",
    photo: "https://randomuser.me/api/portraits/women/25.jpg",
    rating: 5,
    feedback: "Excellent platform! User-friendly and very informative.",
  },
];

const TestimonialsSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-950 py-16 px-4 ">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            What Our Users Say
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Real reviews from our happy tech enthusiasts
          </p>
        </div>

        <Slider {...settings}>
          {reviews.map((review, idx) => (
            <div key={idx} className="px-3">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 h-full border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <img
                    src={review.photo}
                    alt={review.name}
                    className="w-14 h-14 rounded-full mr-4 border border-gray-200 dark:border-gray-600"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {review.name}
                    </h3>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {review.feedback}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default TestimonialsSlider;
