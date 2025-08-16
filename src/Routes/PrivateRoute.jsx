import React from "react";

import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading/Loading";

const PrivateRoute = ({ children }) => {
  const { loading, user } = useAuth();
  const from = useLocation();

  if (loading) {
    return <Loading></Loading>;
  }
  if (!user) {
    return (
      <Navigate state={{ from: location.pathname }} to="/login"></Navigate>
    );
  }
  return children;
};

export default PrivateRoute;
