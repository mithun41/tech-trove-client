import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loading from "../../components/Loading/Loading";

const TrendingProducts = () => {
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["trending-products"],
    queryFn: async () => {
      const res = await axiosPublic.get("/products");
      return res.data;
    },
    select: (data) => {
      const sorted = [...data].sort((a, b) => b.votes - a.votes);
      return sorted.slice(0, 6);
    },
  });

  const handleUpvote = async (product) => {
    if (!user) return navigate("/login");

    try {
      const res = await axiosSecure.patch(`/products/upvote/${product._id}`, {
        voterEmail: user.email,
      });

      if (res.data?.modifiedCount > 0) {
        refetch();
      }
    } catch (err) {
      console.error("Upvote failed:", err);
    }
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <p className="text-center text-red-500 py-10 dark:text-red-400">
        Failed to load trending products.
      </p>
    );

  return (
    <section className="my-12 max-w-7xl mx-auto px-4 lg:px-8 pb-14">
      <div className="text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            delay: 0.4,
            type: "spring",
            stiffness: 70,
            damping: 15,
          }}
          className="text-3xl font-bold text-gray-800 dark:text-white"
        >
          🔥 Trending Products
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            delay: 0.4,
            type: "spring",
            stiffness: 70,
            damping: 15,
          }}
          className="text-gray-500 mt-2 dark:text-gray-400"
        >
          Top voted products from our users
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((product, index) => {
          const isOwner = user?.email === product.ownerEmail;
          const hasVoted = product.voters?.includes(user?.email);

          return (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                delay: index * 0.05,
                duration: 0.7,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
              className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl shadow-lg hover:shadow-[0_20px_50px_-15px_rgba(255,0,128,0.4)] dark:hover:shadow-[0_20px_50px_-15px_rgba(255,255,255,0.1)] transition-shadow duration-500 overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-2xl"
              />

              <div className="p-5 flex flex-col flex-1">
                <motion.h3
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    delay: index * 0.2 + 0.2,
                    type: "spring",
                    stiffness: 70,
                    damping: 15,
                  }}
                  onClick={() => navigate(`/product-details/${product._id}`)}
                  className="text-lg font-bold hover:text-[#E7AD01] dark:text-white cursor-pointer text-pink-600 dark:hover:text-[#E7AD01] transition-colors"
                >
                  {product.name}
                </motion.h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  by <span className="font-medium">{product.ownerName}</span>
                </p>

                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  {product.description?.slice(0, 80)}...
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {product.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 px-3 py-1 rounded-full font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleUpvote(product)}
                    disabled={isOwner || hasVoted}
                    className={`w-full py-3 rounded-lg flex items-center justify-center gap-3 font-bold text-white transition-all duration-300 shadow-md ${
                      isOwner || hasVoted
                        ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#03A0E8]   to-[#E7AD01] hover:from-pink-600 hover:to-yellow-600 dark:from-[#03A0E8]  dark:to-[#E7AD01] shadow-pink-400/70"
                    }`}
                  >
                    <FaHeart />
                    {product.votes || 0} Upvotes
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default TrendingProducts;
