import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const colors = [
  "from-pink-400 to-red-500",
  "from-green-400 to-teal-500",
  "from-purple-400 to-indigo-500",
  "from-yellow-400 to-orange-500",
  "from-cyan-400 to-blue-500",
  "from-rose-400 to-pink-500",
];

// const cardVariants = {
//   offscreen: { opacity: 0, y: 40 },
//   onscreen: {
//     opacity: 1,
//     y: 0,
//     transition: { type: "spring", bounce: 0.3, duration: 0.7 },
//   },
// };

const TopContributors = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: contributors = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["topContributors"],
    queryFn: async () => {
      const res = await axiosSecure.get("/top-contributors");
      return res.data;
    },
  });

  if (isLoading)
    return <p className="text-center py-10">Loading contributors...</p>;
  if (error)
    return (
      <p className="text-center py-10 text-red-500">
        Failed to load contributors
      </p>
    );

  return (
    <section className="my-12 max-w-7xl mx-auto px-4 lg:px-8">
      <motion.h2
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          delay: 0.3,
          type: "spring",
          stiffness: 70,
          damping: 15,
        }}
        className="text-4xl font-extrabold mb-10 text-center text-[#03A0E8] tracking-wide dark:text-white"
      >
        🏆 Top Contributors
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {contributors.map((user, index) => (
          <motion.div
            key={user.email}
            className={`rounded-3xl p-6 bg-gradient-to-tr shadow-lg cursor-pointer select-none
    text-white
    ${colors[index % colors.length]}
  `}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            whileHover={{
              scale: 1.04,
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
              transition: { duration: 0.3 },
            }}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full p-1 bg-white bg-opacity-30">
                <img
                  src={user.image || "https://via.placeholder.com/80"}
                  alt={user.name}
                  className="w-24 h-24 rounded-full border-4 border-white border-opacity-60 object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold drop-shadow-md">
                {user.name}
              </h3>
              <p className="text-sm drop-shadow-sm">{user.email}</p>
              <div className="flex items-center gap-3 text-xl font-bold">
                <FaHeart className="text-pink-300 drop-shadow" />
                <span className="drop-shadow">
                  {user.totalUpvotes || 0} Upvotes
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TopContributors;
