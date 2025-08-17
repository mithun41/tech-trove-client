import { motion } from "framer-motion";
import { MdOutlineMailOutline } from "react-icons/md";
import { toast } from "react-toastify";

export default function Newsletter() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    toast.success("Subscribed Successfully");
    e.target.reset();
  };

  return (
    <section className="relative py-20 px-6 md:px-12 bg-gradient-to-r from-[#03B7E8] via-[#03A0C8] to-[#0284B3] text-white overflow-hidden">
      {/* Background overlay pattern */}
      <div className="absolute inset-0 opacity-15 bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/dots.png')]"></div>

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-extrabold leading-tight mb-6"
        >
          Stay Updated with <span className="text-[#E7AD01]">Tech Trove</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto mb-10"
        >
          Subscribe to our newsletter and never miss out on trending tech tools,
          product launches, and exclusive insights.
        </motion.p>

        {/* Form */}
        <motion.form
          onSubmit={handleSubscribe}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <div className="relative w-full md:w-2/3">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="w-full px-6 py-4 rounded-full text-gray-900 bg-white/90 shadow-lg border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-[#E7AD01] focus:border-[#E7AD01] transition"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <MdOutlineMailOutline size={25} />
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full md:w-auto px-8 py-4 rounded-full bg-[#E7AD01] text-gray-900 font-semibold shadow-lg hover:bg-[#f3bc28] transition"
          >
            Subscribe
          </motion.button>
        </motion.form>

        {/* Bottom text */}
        <p className=" text-gray-200 mt-6">
          🔒 We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
