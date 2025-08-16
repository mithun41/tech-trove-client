import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";
import Loading from "../../../components/Loading/Loading";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminStatistics = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch main stats
  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-stats");
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  const pieData = {
    labels: [
      "Accepted Products",
      "Pending Products",
      "All Products",
      "Reviews",
      "Users",
    ],
    datasets: [
      {
        label: "Site Data",
        data: [
          stats.acceptedProducts,
          stats.pendingProducts,
          stats.totalProducts,
          stats.totalReviews,
          stats.totalUsers,
        ],
        backgroundColor: [
          "#4CAF50",
          "#FF9800",
          "#2196F3",
          "#E91E63",
          "#9C27B0",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <section className="px-4 py-10 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
        📊 Admin Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-5 rounded-xl shadow-xl text-center"
        >
          <h3 className="text-3xl font-bold">{stats.totalUsers}</h3>
          <p className="text-sm">Total Users</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-5 rounded-xl shadow-xl text-center"
        >
          <h3 className="text-3xl font-bold">{stats.totalProducts}</h3>
          <p className="text-sm">Total Products</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-5 rounded-xl shadow-xl text-center"
        >
          <h3 className="text-3xl font-bold">{stats.totalReviews}</h3>
          <p className="text-sm">Total Reviews</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-5 rounded-xl shadow-xl text-center"
        >
          <h3 className="text-3xl font-bold">{stats.totalSubscribed || 0}</h3>
          <p className="text-sm">Subscribed Users</p>
        </motion.div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-10">
        <h3 className="text-xl font-semibold mb-4 text-center">
          📈 Site Overview
        </h3>
        <Pie data={pieData} />
      </div>
    </section>
  );
};

export default AdminStatistics;
