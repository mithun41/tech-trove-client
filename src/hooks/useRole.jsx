import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useRole = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useAuth(); // auth loading state

  const { data: role, isLoading } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !!user?.email && !authLoading, // ✅ wait for user to load
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role/${user.email}`);
      return res.data.role;
    },
  });

  return { role, isLoading: isLoading || authLoading };
};

export default useRole;
