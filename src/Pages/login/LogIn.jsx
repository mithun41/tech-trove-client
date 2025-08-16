import React from "react";
import { useForm } from "react-hook-form";
import Lottie from "lottie-react";
import loginAnimation from "../../../register-animation.json"; // Make sure the path is correct
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import SocialLogin from "../socialLogin/SocialLogin";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const location = useLocation();
  const from = location.state?.from || "/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then((result) => {
        console.log(result.user);
        toast("Successfully Logged in");
        navigate(from);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4 md:px-0">
      <div className="flex flex-col-reverse md:flex-row bg-base-100 shadow-xl rounded-lg overflow-hidden">
        {/* Left: Form */}
        <div className="md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-center text-primary mb-6">
            Login
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email format",
                  },
                })}
                placeholder="Enter your email"
                className="input input-bordered w-full"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters required",
                  },
                })}
                placeholder="Enter your password"
                className="input input-bordered w-full"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className="w-full text-black bg-[#A2AADB]  py-2 rounded hover:bg-[#898AC4] font-semibold"
              >
                Login
              </button>
            </div>

            <Link to="/register" className="text-center text-sm text-gray-500">
              Don’t have an account?{" "}
              <span className="link link-primary">Register</span>
            </Link>
          </form>
          <SocialLogin></SocialLogin>
        </div>

        {/* Right: Lottie Animation */}
        <div className="md:w-1/2 bg-base-200 flex items-center justify-center p-4">
          <Lottie
            animationData={loginAnimation}
            className="w-full max-w-sm"
            loop={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
