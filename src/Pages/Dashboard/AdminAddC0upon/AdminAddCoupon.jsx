import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const AdminAddCoupon = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const axiosSecure = useAxiosSecure();
  const [editingCoupon, setEditingCoupon] = useState(null);

  const {
    data: coupons = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/coupons");
      return res.data;
    },
  });

  const onSubmit = async (data) => {
    const couponData = {
      code: data.code.toUpperCase(),
      description: data.description,
      discount: parseFloat(data.discount),
      expiry: data.expiry,
    };

    try {
      const res = await axiosSecure.post("/coupons", couponData);
      if (res.data.insertedId) {
        Swal.fire("Success", "Coupon added successfully!", "success");
        reset();
        refetch();
      }
    } catch (err) {
      Swal.fire("Error", "Failed to add coupon", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the coupon!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      const res = await axiosSecure.delete(`/coupons/${id}`);
      if (res.data.deletedCount > 0) {
        Swal.fire("Deleted!", "Coupon has been deleted.", "success");
        refetch();
      }
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;

    const updatedCoupon = {
      code: form.code.value.toUpperCase(),
      description: form.description.value,
      discount: parseFloat(form.discount.value),
      expiry: form.expiry.value,
    };

    try {
      const res = await axiosSecure.patch(
        `/coupons/${editingCoupon._id}`,
        updatedCoupon
      );
      if (res.data.modifiedCount > 0) {
        Swal.fire("Success", "Coupon updated successfully!", "success");
        setEditingCoupon(null);
        refetch();
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update", "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-black">
        🎫 Add New Coupon
      </h2>

      {/* Coupon List as Cards */}
      {/* Coupon Cards in Grid Format */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {isLoading ? (
          <p>Loading coupons...</p>
        ) : coupons.length === 0 ? (
          <p className="text-gray-500">No coupons created yet.</p>
        ) : (
          coupons.map((coupon) => (
            <div
              key={coupon._id}
              className="bg-white shadow-lg border border-gray-200 rounded-lg p-5 hover:shadow-xl transition-all"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-primary uppercase">
                  {coupon.code}
                </h3>
                <p className="text-sm text-gray-600">{coupon.description}</p>
                <p className="text-sm text-gray-600">
                  Discount:{" "}
                  <span className="font-semibold">{coupon.discount}%</span>
                </p>
                <p className="text-sm text-gray-500">
                  Expiry: {coupon.expiry?.slice(0, 10)}
                </p>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  className="btn btn-sm btn-info"
                  onClick={() => handleEdit(coupon)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => handleDelete(coupon._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Coupon Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Coupon Code</label>
          <input
            {...register("code", { required: true })}
            type="text"
            placeholder="e.g. SAVE50"
            className="w-full input input-bordered"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Expiry Date</label>
          <input
            {...register("expiry", { required: true })}
            type="date"
            className="w-full input input-bordered"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            {...register("description", { required: true })}
            className="w-full textarea textarea-bordered"
            placeholder="Short description"
          ></textarea>
        </div>

        <div>
          <label className="block font-medium mb-1">Discount Amount (%)</label>
          <input
            {...register("discount", {
              required: true,
              min: 1,
              max: 100,
            })}
            type="number"
            placeholder="e.g. 25"
            className="w-full input input-bordered"
          />
        </div>

        <button className="btn btn-primary w-full">Add Coupon</button>
      </form>

      {/* Edit Modal */}
      {editingCoupon && (
        <>
          <input
            type="checkbox"
            id="edit-modal"
            className="modal-toggle"
            checked
            readOnly
          />
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Edit Coupon</h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <input
                  name="code"
                  defaultValue={editingCoupon.code}
                  className="w-full input input-bordered"
                />
                <input
                  name="expiry"
                  type="date"
                  defaultValue={editingCoupon.expiry?.slice(0, 10)}
                  className="w-full input input-bordered"
                />
                <textarea
                  name="description"
                  defaultValue={editingCoupon.description}
                  className="w-full textarea textarea-bordered"
                ></textarea>
                <input
                  name="discount"
                  type="number"
                  defaultValue={editingCoupon.discount}
                  className="w-full input input-bordered"
                />
                <div className="modal-action">
                  <button type="submit" className="btn btn-success">
                    Update
                  </button>
                  <button
                    onClick={() => setEditingCoupon(null)}
                    type="button"
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAddCoupon;
