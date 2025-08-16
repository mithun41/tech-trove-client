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

const PRODUCTS_PER_PAGE = 6;

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const isOwner = user?.email === product.ownerEmail;
              const hasVoted = product.voters?.includes(user?.email);

              return (
                <div
                  key={product._id}
                  className="rounded-xl shadow-md border dark:border-gray-700 p-5 bg-white dark:bg-gray-800 space-y-3 hover:shadow-lg transition"
                >
                  <div className="w-28 h-28 mx-auto">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-full border shadow dark:border-gray-600"
                    />
                  </div>

                  <h3
                    className="text-lg font-bold text-center text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                    onClick={() => navigate(`/product-details/${product._id}`)}
                  >
                    {product.name}
                  </h3>

                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    by <span className="font-medium">{product.ownerName}</span>
                  </p>

                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 text-center">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap justify-center gap-1 my-2">
                    {product.tags?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="badge badge-outline text-sm dark:border-gray-500 dark:text-gray-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => handleUpvote(product)}
                      disabled={isOwner || hasVoted}
                      className={`mt-2 flex items-center justify-center gap-2 mx-auto px-4 py-2 rounded-md text-white font-medium transition ${
                        isOwner || hasVoted
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-pink-600 hover:bg-pink-700"
                      }`}
                    >
                      <FaHeart />
                      {product.votes || 0} Upvotes
                    </button>
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
