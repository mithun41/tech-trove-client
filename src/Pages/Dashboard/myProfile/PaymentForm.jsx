import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

export default function PaymentForm({ closeModal, onSuccess, price }) {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  // 🔁 Create payment intent with dynamic price
  useEffect(() => {
    if (price > 0 && user?.email) {
      axiosSecure
        .post("/create-payment-intent", {
          email: user.email,
          amount: price * 100, // 💰 Stripe expects amount in cents
        })
        .then((res) => setClientSecret(res.data.clientSecret))
        .catch((err) => {
          console.error("Payment intent error:", err);
        });
    }
  }, [price, user?.email, axiosSecure]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setProcessing(true);
    setError("");

    const card = elements.getElement(CardElement);
    const paymentResult = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card, billing_details: { email: user.email } },
    });

    if (paymentResult.error) {
      setError(paymentResult.error.message);
    } else if (paymentResult.paymentIntent.status === "succeeded") {
      await axiosSecure.patch("/users/subscribe", { email: user.email });
      onSuccess(); // 🔁 trigger refetch & update UI
      Swal.fire({
        icon: "success",
        title: "Payment Successful",
        text: "Your subscription has been activated!",
        confirmButtonColor: "#22c55e",
      });
      closeModal();
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-3 border border-gray-300 rounded" />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={processing || !clientSecret}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        {processing ? "Processing..." : `Pay $${price}`}
      </button>
    </form>
  );
}
