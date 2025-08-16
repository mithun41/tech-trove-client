import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../../components/Loading/Loading";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const FeaturedProducts = () => {
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: products = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const res = await axiosPublic.get("/products/featured");
      return res.data;
    },
  });

  const handleUpvote = async (product) => {
    if (!user) return navigate("/login");
    try {
      const res = await axiosSecure.patch(`/products/upvote/${product._id}`, {
        voterEmail: user.email,
      });
      if (res.data?.modifiedCount > 0) refetch();
    } catch (err) {
      console.error("Upvote failed:", err);
    }
  };

  if (isLoading) return <Loading />;
  if (!products.length)
    return (
      <p className="text-center py-10 text-gray-500 dark:text-gray-400">
        No featured products found.
      </p>
    );

  return (
    <section className="py-14 max-w-7xl mx-auto px-4 lg:px-8">
      {/* Title with entrance motion */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          delay: 0.3,
          type: "tween",
          ease: "easeOut",
          duration: 0.6,
        }}
        className="text-center mb-12 px-6 py-6 rounded-lg bg-gradient-to-r from-[#03B7E8]/20 via-white to-[#E7AD01]/20 dark:via-black"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#03B7E8] to-[#E7AD01]">
          🌟 Featured Products
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mt-2">
          Curated by our top contributors
        </p>
      </motion.div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.slice(0, 6).map((product, idx) => {
          const isOwner = user?.email === product.ownerEmail;
          const hasVoted = product.voters?.includes(user?.email);

          return (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: "easeOut" }}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 15px 30px rgba(3, 183, 232, 0.3)",
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4 overflow-hidden cursor-pointer"
              onClick={() => navigate(`/product-details/${product._id}`)}
            >
              {/* Hover Overlay */}
              <motion.div
                whileHover={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-b from-transparent to-[#03B7E8]/10 rounded-2xl pointer-events-none"
              />

              {/* Header */}
              <div className="flex items-center justify-between gap-4 relative">
                <div>
                  <motion.h3
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      delay: idx * 0.15 + 0.2,
                      type: "tween",
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                    className="text-lg font-semibold text-[#03B7E8] hover:underline cursor-pointer"
                  >
                    {product.name}
                  </motion.h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    by <span className="font-medium">{product.ownerName}</span>
                  </p>
                </div>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-full border border-transparent shadow-md"
                />
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 text-center">
                {product.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap justify-center gap-2 relative">
                {product.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-full bg-[#03B7E81A] text-[#03B7E8] border border-[#03B7E8]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Upvote Button */}
              <div className="text-center flex justify-center relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card click navigation
                    handleUpvote(product);
                  }}
                  disabled={isOwner || hasVoted}
                  className={`mt-2 flex items-center justify-center gap-2 px-5 py-2 rounded-full font-semibold transition-all shadow-sm ${
                    isOwner || hasVoted
                      ? "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300 cursor-not-allowed"
                      : "bg-[#03B7E8] text-white hover:bg-[rgb(3,160,232)] hover:scale-105"
                  }`}
                >
                  <FaHeart />
                  {product.votes || 0} Upvotes
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedProducts;
