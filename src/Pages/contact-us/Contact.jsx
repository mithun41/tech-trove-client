import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    e.target.reset();
    toast.success("message sent successfully");
  };
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Map */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg"
        >
          <iframe
            title="location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.903322640901!2d90.39150947531886!3d23.750885389003747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b6d293c0fb%3A0x4b0f3a7e2c4b2e11!2sDhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
            className="w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>

        {/* Right: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white p-8 rounded-xl shadow-lg flex flex-col justify-between h-[500px]"
        >
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
              Contact Us
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  rows="4"
                  placeholder="Write your message..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                ></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg transition"
              >
                Send Message
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
