import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading/Loading";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [loadingUserId, setLoadingUserId] = useState(null);

  // Fetch users
  const {
    data: users = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const updateRole = async (userId, role) => {
    try {
      setLoadingUserId(userId);
      const res = await axiosSecure.patch(`/users/${userId}/role`, { role });
      if (res.data.modifiedCount > 0) {
        toast.success(`Role updated to ${role}`);
        refetch();
      } else {
        toast.warn("No changes were made.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role.");
    } finally {
      setLoadingUserId(null);
    }
  };

  if (isLoading) return <Loading></Loading>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <div className="overflow-x-auto">
        <table className="table w-full border border-gray-200">
          <thead className="bg-gray-100 dark:text-black">
            <tr>
              <th>#</th>
              <th>User Name</th>
              <th>User Email</th>
              <th>Make User</th>
              <th>Make Moderator</th>
              <th>Make Admin</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user._id} className="hover">
                <td>{idx + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.role === "user" ? (
                    <span className="text-green-600 font-medium">User</span>
                  ) : (
                    <button
                      disabled={loadingUserId === user._id}
                      onClick={() => updateRole(user._id, "user")}
                      className="btn btn-sm bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Make User
                    </button>
                  )}
                </td>
                <td>
                  {user.role === "moderator" ? (
                    <span className="text-green-600 font-medium">
                      Moderator
                    </span>
                  ) : (
                    <button
                      disabled={loadingUserId === user._id}
                      onClick={() => updateRole(user._id, "moderator")}
                      className="btn btn-sm bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Make Moderator
                    </button>
                  )}
                </td>
                <td>
                  {user.role === "admin" ? (
                    <span className="text-red-600 font-medium">Admin</span>
                  ) : (
                    <button
                      disabled={loadingUserId === user._id}
                      onClick={() => updateRole(user._id, "admin")}
                      className="btn btn-sm bg-green-600 text-white hover:bg-green-700"
                    >
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
