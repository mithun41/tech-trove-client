import { Navigate } from "react-router";
import useRole from "../../hooks/useRole";
import Loading from "../../components/Loading/Loading";

const ModeratorRoute = ({ children }) => {
  const { role, isLoading } = useRole();

  if (isLoading) return <Loading></Loading>;

  if (role === "moderator") return children;

  return <Navigate to="/" />;
};

export default ModeratorRoute;
