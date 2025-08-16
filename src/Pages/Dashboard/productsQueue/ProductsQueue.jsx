import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaCheckCircle, FaTimesCircle, FaEye, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router";

const ProductsQueue = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const {
    data: products = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["review-products"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products");
      return res.data;
    },
  });

  const handleAccept = async (id) => {
    const confirm = await Swal.fire({
      title: "Accept Product?",
      text: "Are you sure you want to accept this product?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Accept",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/products/status/${id}`, {
          status: "active",
        });
        if (res.data?.modifiedCount) {
          Swal.fire("Accepted!", "Product has been accepted.", "success");
          refetch();
        }
      } catch (err) {
        Swal.fire("Error", "Failed to accept product.", err);
      }
    }
  };

  const handleReject = async (id) => {
    const confirm = await Swal.fire({
      title: "Reject Product?",
      text: "Are you sure you want to reject this product?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/products/status/${id}`, {
          status: "pending",
        });
        if (res.data?.modifiedCount) {
          Swal.fire("Rejected", "Product has been rejected.", "info");
          refetch();
        }
      } catch (err) {
        Swal.fire("Error", "Failed to reject product.", err);
      }
    }
  };

  const handleFeature = async (id, currentStatus) => {
    const action = currentStatus ? "unfeature" : "feature";

    const confirm = await Swal.fire({
      title: `${action === "feature" ? "Feature" : "Unfeature"} Product?`,
      text: `Are you sure you want to ${action} this product?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/products/feature/${id}`, {
          isFeatured: !currentStatus,
        });

        if (res.data?.modifiedCount) {
          Swal.fire(
            `${action === "feature" ? "Featured" : "Unfeatured"}!`,
            `Product has been ${action}d.`,
            "success"
          );
          refetch();
        }
      } catch (err) {
        Swal.fire("Error", "Failed to update feature status.", err);
      }
    }
  };

  // const handleView = (product) => {
  //   Swal.fire({
  //     title: product.name,
  //     html: `
  //       <img src="${product.image}" alt="${
  //       product.name
  //     }" style="width: 100%; border-radius: 8px; margin-bottom: 10px;" />
  //       <p><strong>Owner:</strong> ${product.ownerName}</p>
  //       <p><strong>Email:</strong> ${product.ownerEmail}</p>
  //       <p><strong>Status:</strong> ${product.status}</p>
  //       <p><strong>Votes:</strong> ${product.votes}</p>
  //       <p><strong>Description:</strong></p>
  //       <p>${product.description}</p>
  //       <p><strong>Tags:</strong> ${product.tags?.join(", ")}</p>
  //       <p><strong>External Link:</strong> <a href="${
  //         product.externalLink
  //       }" target="_blank">${product.externalLink}</a></p>
  //     `,
  //     width: 600,
  //   });
  // };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center text-primary">
        Product Review Queue
      </h2>

      {isLoading ? (
        <div className="text-center text-gray-500 py-10">
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No pending products found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200 text-base font-semibold">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Feature</th>
                <th>Owner</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product._id}>
                  <th>{index + 1}</th>
                  <td>{product.name}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        className={`btn btn-sm ${
                          product.isFeatured
                            ? "btn-outline"
                            : "btn-warning text-white"
                        }`}
                        onClick={() =>
                          handleFeature(product._id, product.isFeatured)
                        }
                        title={
                          product.isFeatured ? "Unfeature" : "Make Featured"
                        }
                      >
                        <FaStar
                          className={
                            product.isFeatured
                              ? "text-yellow-500"
                              : "text-white"
                          }
                        />
                      </button>

                      {product.isFeatured ? (
                        <span className="badge badge-success text-white text-xs whitespace-nowrap">
                          Featured
                        </span>
                      ) : (
                        <span className="badge badge-warning text-white text-xs whitespace-nowrap">
                          Not Featured
                        </span>
                      )}
                    </div>
                  </td>

                  <td>
                    <div className="flex items-center gap-2">
                      <img
                        src={product.ownerImage}
                        className="w-8 h-8 rounded-full"
                        alt={product.ownerName}
                      />
                      <span>{product.ownerName}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge capitalize ${
                        product.status === "pending"
                          ? "badge-warning"
                          : product.status === "active"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="flex justify-center gap-2 ">
                    <button
                      className="btn btn-sm btn-info text-white"
                      onClick={() =>
                        navigate(`/product-details/${product._id}`)
                      }
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="btn btn-sm btn-success text-white"
                      onClick={() => handleAccept(product._id)}
                      title="Accept"
                      disabled={product.status === "accepted"}
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      className="btn btn-sm btn-error text-white"
                      onClick={() => handleReject(product._id)}
                      title="Reject"
                      disabled={product.status === "rejected"}
                    >
                      <FaTimesCircle />
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

export default ProductsQueue;
