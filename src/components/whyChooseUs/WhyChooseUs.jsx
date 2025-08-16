import { motion } from "framer-motion";
import { FaBolt, FaUsers, FaStar } from "react-icons/fa";

const features = [
  {
    icon: <FaBolt size={28} className="text-indigo-600" />,
    title: "Fast & Easy Access",
    desc: "Explore trending AI apps, tools, and software with a few clicks.",
  },
  {
    icon: <FaUsers size={28} className="text-green-600" />,
    title: "Community Driven",
    desc: "Products are ranked by real user votes and engagement.",
  },
  {
    icon: <FaStar size={28} className="text-yellow-500" />,
    title: "Top Quality Tools",
    desc: "Handpicked and reviewed tech products to boost your workflow.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-base-100">
      <div className="max-w-7xl mx-auto px-4 ">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold dark:text-white text-[#E7AD01] mb-2">
            Why Choose <span className="text-primary">TechTrove?</span>
          </h2>
          <p className="text-gray-500 dark:text-white">
            Discover what makes us the go-to hub for modern tech tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200 text-center"
            >
              <div className="mb-4 flex justify-center">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
