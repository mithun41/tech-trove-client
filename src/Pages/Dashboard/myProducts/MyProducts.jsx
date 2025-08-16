import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import Loading from "../../../components/Loading/Loading";

export default function MyProducts() {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  // ✅ Fetch user's products
  const {
    data: products = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-products", user?.email],
    // enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosPublic.get(`/products?email=${user.email}`);
      return res.data;
    },
  });
  // ✅ Delete handler using SweetAlert and manual axios
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
        const res = await axiosPublic.delete(`/products/${id}`);
        if (res.data?.deletedCount > 0 || res.data?.message === "Deleted") {
          await Swal.fire(
            "Deleted!",
            "Your product has been deleted.",
            "success"
          );
          refetch();
        }
      } catch (err) {
        Swal.fire("Error!", "Failed to delete the product.", err);
      }
    }
  };

  if (isLoading) return <Loading></Loading>;

  return (
    <div className=" p-6">
      <h2 className="text-2xl font-bold mb-6">My Products</h2>

      {products.length === 0 ? (
        <p className="text-gray-500">You haven't added any products yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Votes</th>
                <th>Status</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.votes || 0}</td>
                  <td>
                    <span
                      className={`badge ${
                        product.status === "accepted"
                          ? "badge-success"
                          : product.status === "rejected"
                          ? "badge-error"
                          : "badge-warning"
                      }`}
                    >
                      {product.status || "pending"}
                    </span>
                  </td>
                  <td>
                    <Link to={`/dashboard/update-product/${product._id}`}>
                      <button className="btn btn-sm btn-info text-white">
                        Update
                      </button>
                    </Link>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="btn btn-sm btn-error text-white"
                    >
                      Delete
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
}
