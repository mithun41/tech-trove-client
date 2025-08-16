// src/Pages/Dashboard/DashboardRedirect.jsx
import { Navigate } from "react-router";
import useRole from "../../../hooks/useRole";
import Loading from "../../../components/Loading/Loading";

const DashboardRedirect = () => {
  const { role, loading } = useRole(); // Assume useRole returns { role, loading }

  if (loading) return <Loading />;

  if (role === "admin") return <Navigate to="/dashboard/statistics" />;
  if (role === "moderator") return <Navigate to="/dashboard/products-queue" />;
  return <Navigate to="/dashboard/my-profile" />;
};

export default DashboardRedirect;
