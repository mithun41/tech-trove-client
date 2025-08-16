// --- ProductDetails.jsx ---

import { useParams, useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Loading from "../../components/Loading/Loading";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product-details", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products/${id}`);
      return res.data;
    },
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews?productId=${id}`);
      return res.data;
    },
  });

  const handleUpvote = async () => {
    if (!user) return navigate("/login");
    const res = await axiosSecure.patch(`/products/upvote/${id}`, {
      voterEmail: user.email,
    });
    if (res.data.modifiedCount > 0) {
      queryClient.invalidateQueries(["product-details", id]);
    }
  };

  const handleReport = async () => {
    if (!user) return navigate("/login");
    const res = await axiosPublic.patch(`/products/report/${id}`, {
      reporterEmail: user.email,
    });
    if (res.data.modifiedCount > 0) {
      Swal.fire("Reported", "Product has been reported.", "info");
      queryClient.invalidateQueries(["product-details", id]);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const reviewData = {
      productId: id,
      reviewerName: user.displayName,
      reviewerImage: user.photoURL,
      description: review,
      rating: Number(rating),
      createdAt: new Date(),
    };
    const res = await axiosSecure.post("/reviews", reviewData);
    if (res.data.insertedId) {
      setReview("");
      setRating(5);
      queryClient.invalidateQueries(["reviews", id]);
      Swal.fire("Success", "Review submitted", "success");
    }
  };

  if (isLoading) return <Loading />;
  const isOwner = user?.email === product?.ownerEmail;
  const hasVoted = product?.voters?.includes(user?.email);
  const hasReported = product?.reporters?.includes(user?.email);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-white bg-[#0f111b]">
      <div className="grid md:grid-cols-2 gap-8">
        <img
          src={product.image}
          alt={product.name}
          className=" object-cover  mx-auto border-2"
        />
        <div className="space-y-3">
          <h2 className="text-3xl font-bold">{product.name}</h2>
          <p>{product.description}</p>
          <div className="flex gap-2 flex-wrap">
            {product.tags?.map((tag, i) => (
              <span key={i} className="badge badge-outline">
                #{tag}
              </span>
            ))}
          </div>
          <p>
            <strong>Added By:</strong> {product.ownerName}
          </p>
          <p>
            <strong>Votes:</strong> {product.votes || 0}
          </p>
          <p>
            <strong>Reports:</strong> {product.reportCount || 0}
          </p>
          <p>
            <strong>Published:</strong>{" "}
            {new Date(product.createdAt).toLocaleDateString()}
          </p>
          <div className="flex gap-3 mt-4">
            <a
              href={product.externalLink}
              target="_blank"
              className="btn btn-primary"
            >
              Visit Site
            </a>
            <button
              onClick={handleUpvote}
              disabled={!user || isOwner || hasVoted}
              className={`btn bg-pink-600 text-white ${
                (!user || isOwner || hasVoted) &&
                "opacity-50 cursor-not-allowed"
              }`}
            >
              <FaHeart />
              Like ({product.votes})
            </button>
            <button
              onClick={handleReport}
              disabled={!user || isOwner || hasReported}
              className={`btn btn-outline ${
                hasReported || isOwner ? "bg-gray-400 cursor-not-allowed" : ""
              }`}
            >
              Report Product
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12 ">
        <h3 className="text-2xl font-bold mb-4">Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <div key={r._id} className="bg-gray-800 p-4 rounded">
                <div className="flex gap-3 items-center mb-2">
                  <img
                    src={r.reviewerImage}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{r.reviewerName}</p>
                    <p className="text-yellow-400">⭐ {r.rating}</p>
                  </div>
                </div>
                <p>{r.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Review */}
      {user && (
        <form
          onSubmit={handleReviewSubmit}
          className="mt-10 space-y-4 text-black dark:text-white"
        >
          <h3 className="text-xl font-bold text-white">Post a Review</h3>
          <input
            type="text"
            value={user.displayName}
            readOnly
            className="input input-bordered w-full text-black dark:text-white"
          />
          <input
            type="text"
            value={user.photoURL}
            readOnly
            className="input input-bordered w-full"
          />
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="textarea textarea-bordered w-full"
            placeholder="Write your review..."
            required
          />
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="select select-bordered w-full"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Star
              </option>
            ))}
          </select>
          <button
            disabled={!user || isOwner}
            type="submit"
            className={`btn btn-primary ${
              isOwner && "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
};

export default ProductDetails;
