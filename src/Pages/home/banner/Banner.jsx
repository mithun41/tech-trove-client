import { motion } from "framer-motion";
import { Link } from "react-router";
import banner1 from "../../../assets/tech.jpg";
import banner2 from "../../../assets/banner2.jpg";

export default function Banner() {
  return (
    <div
      className="relative min-h-[100vh] bg-cover bg-center bg-no-repeat flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-16 py-12"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80)",
      }}
    >
      {/* ✅ Black Overlay only on background */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* ✅ Main content stays above */}
      {/* Left Text */}
      <div className="z-10 text-white max-w-xl space-y-6 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
          Discover the Best Tech Tools & Products
        </h1>
        <p className="text-lg md:text-xl font-medium drop-shadow-sm text-gray-200">
          Explore trending AI apps, dev tools, SaaS platforms, mobile apps, and
          more — all in one place.
        </p>
        <Link to="/products">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="mt-4 bg-gradient-to-r from-[#03A0E8] to-[#E7AD01] hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-full shadow-xl font-semibold transition-all"
          >
            Explore Products
          </motion.button>
        </Link>
      </div>

      {/* Right Animated Images (no overlay here) */}
      <div className="z-10 relative w-full md:w-[40%] h-[300px] md:h-[400px] mt-12 md:mt-0 flex items-center justify-center">
        <motion.img
          src={banner1}
          alt="AI App"
          className="w-[300px] h-[300px] object-cover rounded-xl shadow-lg absolute top-0 right-6"
          animate={{ y: [-50, -20, -50] }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut",
          }}
        />
        <motion.img
          src={banner2}
          alt="Tech Dashboard"
          className="w-[250px] h-[250px] object-cover rounded-xl shadow-lg absolute bottom-0 left-6"
          animate={{ y: [30, 0, 30] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
