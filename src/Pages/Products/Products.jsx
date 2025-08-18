import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { FaHeart } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import Loading from "../../components/Loading/Loading";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAxiosSecure from "../../hooks/useAxiosSecure";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const PRODUCTS_PER_PAGE = 8; // 4x2 grid

const Products = () => {
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["all-products", debouncedSearch, page],
    queryFn: async () => {
      const url = `/products?status=active&page=${page}&limit=${PRODUCTS_PER_PAGE}${
        debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ""
      }`;
      const res = await axiosPublic.get(url);
      return res.data;
    },
    keepPreviousData: true,
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

  const products = data?.products || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) setPage(pageNum);
  };

  return (
    <section className="px-4 md:px-8 lg:px-16 py-10 dark:bg-gray-900 bg-gray-50 min-h-screen transition">
      {/* Search bar */}
      <div className="mb-6 text-center">
        <input
          type="text"
          placeholder="Search by tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full max-w-xs mx-auto dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
      </div>

      <h2 className="text-3xl font-bold mb-2 text-center text-primary dark:text-white">
        🛍 All Products
      </h2>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
        Discover what our community has built
      </p>

      {isLoading ? (
        <Loading />
      ) : products.length === 0 ? (
        <p className="text-center py-10 text-gray-500 dark:text-gray-400">
          No products found.
        </p>
      ) : (
        <>
          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => {
              const isOwner = user?.email === product.ownerEmail;
              const hasVoted = product.voters?.includes(user?.email);

              return (
                <div
                  key={product._id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-transform duration-300 hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-5 space-y-3">
                    <h3
                      className="text-lg font-bold text-gray-800 dark:text-white text-center hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                      onClick={() =>
                        navigate(`/product-details/${product._id}`)
                      }
                    >
                      {product.name}
                    </h3>
                    <p className="text-center text-gray-500 dark:text-gray-300 text-sm">
                      by{" "}
                      <span className="font-medium">{product.ownerName}</span>
                    </p>

                    <p className="text-gray-600 dark:text-gray-200 text-sm text-center line-clamp-2">
                      {product.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                      {product.tags?.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Upvote Button */}
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={() => handleUpvote(product)}
                        disabled={isOwner || hasVoted}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white transition ${
                          isOwner || hasVoted
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-md hover:shadow-lg"
                        }`}
                      >
                        <FaHeart />
                        {product.votes || 0} Upvotes
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="btn btn-sm dark:btn-neutral"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                className={`btn btn-sm ${
                  page === i + 1
                    ? "btn-primary"
                    : "btn-outline dark:btn-outline dark:border-gray-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="btn btn-sm dark:btn-neutral"
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default Products;
