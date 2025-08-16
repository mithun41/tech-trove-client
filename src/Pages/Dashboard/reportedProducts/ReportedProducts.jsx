// --- ReportedProducts.jsx ---

import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaEye, FaTrash } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";

const ReportedProducts = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    data: reportedProducts = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["reported-products"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products/reported");
      return res.data;
    },
  });

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/products/${id}`);
        if (res.data?.deletedCount > 0 || res.data?.message === "Deleted") {
          await Swal.fire(
            "Deleted!",
            "Your product has been deleted.",
            "success"
          );
        }
        refetch();
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Failed to delete the product.", "error");
      }
    }
  };
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-error">
        Reported Products
      </h2>
      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : reportedProducts.length === 0 ? (
        <p className="text-center text-gray-500">No reported products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead className="bg-base-200">
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>Report Count</th>
                <th>View Details</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reportedProducts.map((product, index) => (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.reportCount || 0}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info text-white"
                      onClick={() =>
                        navigate(`/product-details/${product._id}`)
                      }
                      title="View"
                    >
                      <FaEye />
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="btn btn-sm btn-error text-white"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportedProducts;
