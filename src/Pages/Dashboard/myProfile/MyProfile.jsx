import { useQuery } from "@tanstack/react-query";
import PaymentModal from "./PaymentModal";
import useAuth from "../../../hooks/useAuth";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import Loading from "../../../components/Loading/Loading";
import { motion } from "framer-motion";

export default function MyProfile() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const [subscribed, setSubscribed] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  const SUBSCRIPTION_PRICE = 50;
  const discountedPrice =
    SUBSCRIPTION_PRICE - (SUBSCRIPTION_PRICE * discountPercent) / 100;

  const {
    data: currentUser = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userProfile", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    setSubscribed(!!currentUser?.isSubscribed);
  }, [currentUser]);

  if (isLoading) return <Loading />;

  // Verify coupon code when user clicks "Apply"
  const handleApplyCoupon = async () => {
    setCouponError("");
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code.");
      setDiscountPercent(0);
      return;
    }

    try {
      const res = await axiosPublic.get(
        `/coupons/${couponCode.trim().toUpperCase()}`
      );
      const coupon = res.data;

      if (!coupon) {
        setCouponError("Invalid coupon code.");
        setDiscountPercent(0);
        return;
      }

      // Check expiry
      const now = new Date();
      const expiryDate = new Date(coupon.expiry);
      if (expiryDate < now) {
        setCouponError("Coupon code has expired.");
        setDiscountPercent(0);
        return;
      }

      // Valid coupon
      setDiscountPercent(coupon.discount);
      setCouponError("");
    } catch (error) {
      setCouponError("Failed to verify coupon. Try again later.", error);
      setDiscountPercent(0);
    }
  };

  const handlePaymentSuccess = async () => {
    await refetch();
    setSubscribed(true);
    setOpen(false);
    setCouponCode("");
    setDiscountPercent(0);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#ecf0f3] to-[#dfe9f3] px-4">
      <motion.div
        className="p-8 w-full max-w-md rounded-2xl bg-white shadow-2xl relative border border-gray-200"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, duration: 0.5 }}
      >
        <div className="text-center">
          <motion.img
            src={currentUser.photoURL}
            alt="User"
            className="w-28 h-28 rounded-full mx-auto border-4 border-primary shadow-md"
            whileHover={{ scale: 1.05 }}
          />
          <h2 className="text-2xl font-bold mt-4 text-gray-800">
            {currentUser.name}
          </h2>
          <p className="text-gray-600">{currentUser.email}</p>
        </div>

        {subscribed ? (
          <motion.div
            className="mt-5 bg-green-100 text-green-700 font-semibold text-center px-4 py-2 rounded-lg shadow-sm"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            ✅ Status: Verified Member
          </motion.div>
        ) : (
          <>
            <div className="mt-6">
              <label className="block mb-1 font-semibold text-gray-700">
                Coupon Code (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="input input-bordered flex-grow"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="btn btn-primary"
                  type="button"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <p className="text-red-500 mt-1">{couponError}</p>
              )}
              {discountPercent > 0 && (
                <p className="text-green-600 mt-1 font-semibold">
                  Coupon applied! You get {discountPercent}% off.
                </p>
              )}
            </div>

            <motion.button
              onClick={() => setOpen(true)}
              className="mt-6 w-full py-2 rounded-xl text-white font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
              whileTap={{ scale: 0.97 }}
            >
              Subscribe for ${discountedPrice.toFixed(2)}
            </motion.button>

            {open && (
              <PaymentModal
                close={() => setOpen(false)}
                onSuccess={handlePaymentSuccess}
                price={discountedPrice} // pass discounted price to PaymentModal
                couponCode={discountPercent > 0 ? couponCode : null} // optional, for your backend tracking
              />
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
