import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: "https://tech-trove-server-eta.vercel.app",
});

const useAxiosSecure = () => {
  const { user } = useAuth();

  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        if (user?.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Cleanup interceptor on unmount
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
    };
  }, [user?.accessToken]);

  return axiosSecure;
};

export default useAxiosSecure;
