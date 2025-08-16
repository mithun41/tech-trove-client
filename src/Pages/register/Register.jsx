import { useForm } from "react-hook-form";
import Lottie from "lottie-react";
import animationData from "../../../register-animation.json";
import { Link, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { toast } from "react-toastify";

const Register = () => {
  const { createUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { name, email, password, photoURL } = data;

    createUser(email, password)
      .then(async () => {
        const userProfile = {
          displayName: name,
          photoURL: photoURL,
        };

        await updateUserProfile(userProfile);

        // ✅ Save to database
        const userInfo = {
          name,
          email,
          photoURL,
        };

        try {
          const res = await axiosPublic.post("/users", userInfo);
          console.log("User saved:", res.data);
          toast.success("Registration successful");
          navigate("/");
        } catch (err) {
          console.error("User DB save error:", err);
          toast.error("User save failed!");
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 md:px-0">
      <div className="bg-white shadow-lg rounded-md flex flex-col md:flex-row overflow-hidden">
        {/* Left: Form */}
        <div className="md:w-1/2 p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
            Register
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block mb-1 font-medium">Full Name</label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-blue-500"
              />
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email address",
                  },
                })}
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-blue-500"
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[a-z]).{6,}$/,
                    message: "Minimum 6 chars, include uppercase, lowercase",
                  },
                })}
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-blue-500"
              />
              {errors.password && (
                <p className="text-red-600 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Photo URL */}
            <div>
              <label className="block mb-1 font-medium">Photo URL</label>
              <input
                type="text"
                {...register("photoURL", {
                  required: "Photo URL is required",
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: "Enter a valid URL",
                  },
                })}
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-blue-500"
              />
              {errors.photoURL && (
                <p className="text-red-600 text-sm">
                  {errors.photoURL.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full text-black bg-[#A2AADB]  py-2 rounded hover:bg-[#898AC4] font-semibold"
            >
              Register
            </button>
            <Link to="/login" className="text-center text-sm text-gray-500">
              Don’t have an account?{" "}
              <span className="link link-primary"> Log In</span>
            </Link>
          </form>
        </div>

        {/* Right: Lottie Animation */}
        <div className="md:w-1/2 bg-blue-50 flex items-center justify-center p-4">
          <Lottie
            animationData={animationData}
            loop={true}
            className="w-full max-w-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
