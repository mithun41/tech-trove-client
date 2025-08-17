import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto text-center space-y-8">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold "
        >
          About <span className="text-[#03B7E8]">Tech </span>
          <span className="text-[#E7AD01]">Trove</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Tech Trove is a modern platform where you can **discover, share, and
          explore** the best tech products from around the world — including AI
          apps, developer tools, SaaS platforms, and more.
        </motion.p>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Mission */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold text-blue-600">Our Mission</h3>
            <p className="mt-3 text-gray-600 text-sm leading-relaxed">
              To connect tech enthusiasts, creators, and developers in one place
              — helping new products gain visibility and users discover the next
              big innovation.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold text-purple-600">
              What We Offer
            </h3>
            <p className="mt-3 text-gray-600 text-sm leading-relaxed">
              Explore trending tech tools, vote for your favorites, leave
              reviews, and even grab exclusive coupons. Moderators and admins
              ensure quality and fairness on the platform.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold text-pink-600">Our Vision</h3>
            <p className="mt-3 text-gray-600 text-sm leading-relaxed">
              To become the go-to hub for discovering innovative tech solutions,
              empowering startups and developers while inspiring the tech
              community worldwide.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
