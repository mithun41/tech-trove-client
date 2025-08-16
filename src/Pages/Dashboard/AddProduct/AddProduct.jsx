import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { WithContext as ReactTagInput } from "react-tag-input";
import { useState } from "react";
import { toast } from "react-toastify";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const KeyCodes = {
  comma: 188,
  enter: 13,
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

export default function AddProduct() {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tags, setTags] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleDelete = (i) => setTags(tags.filter((_, index) => index !== i));
  const handleAddition = (tag) => setTags([...tags, tag]);

  // ✅ Product Count
  const { data: productCount = 0, isLoading: isProductLoading } = useQuery({
    queryKey: ["productCount", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosPublic.get(`/products/count?email=${user.email}`);
      return res.data.count;
    },
  });

  // ✅ Subscription Status
  const { data: isSubscribed = false, isLoading: isUserLoading } = useQuery({
    queryKey: ["userSubscriptionStatus", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data.subscriptionStatus === "verified";
    },
  });

  const loadingStatus = isProductLoading || isUserLoading;

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    const uploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_upload_key
    }`;

    try {
      setUploading(true);
      const res = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });
      const imgData = await res.json();
      if (imgData.success) {
        setImageUrl(imgData.data.display_url);
      } else {
        toast.error("Image upload failed!");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!isSubscribed && productCount >= 1) {
      toast.error("You can only add one product without a subscription.");
      return;
    }

    if (!imageUrl) {
      toast.error("Please upload a product image.");
      return;
    }

    const product = {
      name: data.name,
      image: imageUrl,
      description: data.description,
      ownerName: user.displayName,
      ownerEmail: user.email,
      ownerImage: user.photoURL,
      status: "pending",
      isFeatured: false,
      tags: tags.map((tag) => tag.text),
      externalLink: data.externalLink,
      createdAt: new Date(),
      votes: 0,
    };

    try {
      const res = await axiosPublic.post("/products", product);
      if (res.data.insertedId) {
        toast.success("Product added successfully!");
        queryClient.invalidateQueries(["products"]);
        navigate("/dashboard/my-products");
        reset();
        setTags([]);
        setImageUrl(null);
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Add New Product
      </h2>

      {!loadingStatus && !isSubscribed && productCount >= 1 && (
        <div className="text-red-500 text-center font-medium mb-4">
          You’ve reached your product limit. Please subscribe to add more.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Product Name */}
        <div>
          <label className="label font-semibold text-gray-800 dark:text-gray-200">
            Product Name
          </label>
          <input
            {...register("name", { required: true })}
            type="text"
            placeholder="Enter product name"
            className="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">Product name is required.</p>
          )}
        </div>

        {/* Product Image */}
        <div>
          <label className="label font-semibold text-gray-800 dark:text-gray-200">
            Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
          {uploading && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Uploading image...
            </p>
          )}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Uploaded preview"
              className="w-32 h-32 object-cover mt-2 border rounded"
            />
          )}
        </div>

        {/* Description */}
        <div>
          <label className="label font-semibold text-gray-800 dark:text-gray-200">
            Description
          </label>
          <textarea
            {...register("description", { required: true })}
            placeholder="Write a short description"
            className="textarea textarea-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
            rows={4}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm">Description is required.</p>
          )}
        </div>

        {/* Owner Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label font-semibold text-gray-800 dark:text-gray-200">
              Owner Name
            </label>
            <input
              value={user?.displayName || ""}
              readOnly
              className="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>
          <div>
            <label className="label font-semibold text-gray-800 dark:text-gray-200">
              Owner Email
            </label>
            <input
              value={user?.email || ""}
              readOnly
              className="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>
          <div>
            <label className="label font-semibold text-gray-800 dark:text-gray-200">
              Owner Image
            </label>
            <input
              value={user?.photoURL || ""}
              readOnly
              className="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="label font-semibold text-gray-800 dark:text-gray-200">
            Tags
          </label>
          <div className="w-full bg-white dark:bg-gray-800 rounded-md border p-2 dark:border-gray-700">
            <ReactTagInput
              tags={tags}
              handleDelete={handleDelete}
              handleAddition={handleAddition}
              delimiters={delimiters}
              placeholder="Enter tags and press Enter"
            />
          </div>
        </div>

        {/* External Link */}
        <div>
          <label className="label font-semibold text-gray-800 dark:text-gray-200">
            External Link
          </label>
          <input
            {...register("externalLink")}
            type="url"
            placeholder="Website or landing page URL"
            className="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full text-white font-bold dark:bg-blue-600 dark:hover:bg-blue-700"
          disabled={uploading || (!isSubscribed && productCount >= 1)}
        >
          {uploading ? "Please wait..." : "Submit Product"}
        </button>
      </form>
    </div>
  );
}
