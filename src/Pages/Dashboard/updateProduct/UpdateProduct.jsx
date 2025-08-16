import { useLoaderData, useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { WithContext as ReactTagInput } from "react-tag-input";
import { useState } from "react";
import { toast } from "react-toastify";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { useQueryClient } from "@tanstack/react-query";

const KeyCodes = {
  comma: 188,
  enter: 13,
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

export default function UpdateProduct() {
  const axios = useAxiosPublic();
  const product = useLoaderData();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [tags, setTags] = useState(
    product.tags.map((tag) => ({ id: tag, text: tag }))
  );
  const [imageUrl, setImageUrl] = useState(product.image);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: product.name,
      description: product.description,
      externalLink: product.externalLink || "",
    },
  });

  const handleDelete = (i) => setTags(tags.filter((_, index) => index !== i));
  const handleAddition = (tag) => setTags([...tags, tag]);

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
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!imageUrl) {
      toast.error("Please upload a product image.");
      return;
    }

    const updatedProduct = {
      name: data.name,
      image: imageUrl,
      description: data.description,
      tags: tags.map((tag) => tag.text),
      externalLink: data.externalLink,
    };

    try {
      const res = await axios.put(`/products/${id}`, updatedProduct);
      if (res.data.modifiedCount > 0) {
        toast.success("Product updated successfully!");
        queryClient.invalidateQueries(["my-products"]);
        navigate("/dashboard/my-products");
      } else {
        toast.info("No changes made.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg text-gray-900 dark:text-gray-100">
      <h2 className="text-3xl font-bold text-center mb-6">Update Product</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Product Name */}
        <div>
          <label className="label font-semibold dark:text-gray-200">
            Product Name
          </label>
          <input
            {...register("name", { required: true })}
            type="text"
            className="input input-bordered w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">Product name is required.</p>
          )}
        </div>

        {/* Product Image */}
        <div>
          <label className="label font-semibold dark:text-gray-200">
            Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          {uploading && (
            <p className="text-sm text-gray-400">Uploading image...</p>
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
          <label className="label font-semibold dark:text-gray-200">
            Description
          </label>
          <textarea
            {...register("description", { required: true })}
            className="textarea textarea-bordered w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            rows={4}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm">Description is required.</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="label font-semibold dark:text-gray-200">Tags</label>
          <div className="w-full bg-white dark:bg-gray-800 rounded-md border dark:border-gray-700 p-2">
            <ReactTagInput
              tags={tags}
              handleDelete={handleDelete}
              handleAddition={handleAddition}
              delimiters={delimiters}
              placeholder="Enter tags and press Enter"
              classNames={{
                tags: "flex flex-wrap gap-2",
                tag: "relative bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-white px-4 rounded-full text-sm font-medium shadow",
                remove:
                  "absolute -top-1 -right-1 bg-black text-white rounded-full w-3 h-3 flex items-center justify-center text-xs cursor-pointer",
              }}
            />
          </div>
        </div>

        {/* External Link */}
        <div>
          <label className="label font-semibold dark:text-gray-200">
            External Link
          </label>
          <input
            {...register("externalLink")}
            type="url"
            className="input input-bordered w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full text-white font-bold dark:bg-blue-600 dark:hover:bg-blue-700"
          disabled={uploading}
        >
          {uploading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
