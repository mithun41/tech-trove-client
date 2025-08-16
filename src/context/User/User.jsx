import { Navigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";
import Loading from "../../components/Loading/Loading";

const User = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, isLoading } = useRole();

  if (loading || isLoading) return <Loading></Loading>;

  if (user && role === "user") return children;

  return <Navigate to="/dashboard" />;
};

export default User;
