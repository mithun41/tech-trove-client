import axios from "axios";

const axiosPublic = axios.create({
  baseURL: `https://tech-trove-server-eta.vercel.app`,
});

const useAxiosPublic = () => axiosPublic;

export default useAxiosPublic;
