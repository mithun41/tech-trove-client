import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PaymentModal({ close, onSuccess, price, couponCode }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-md w-full relative">
        <button className="absolute top-2 right-3 text-xl" onClick={close}>
          ✕
        </button>
        <Elements stripe={stripePromise}>
          <PaymentForm
            onSuccess={onSuccess}
            closeModal={close}
            price={price} // ✅ Pass price here
            couponCode={couponCode} // ✅ (Optional) Pass coupon code if needed
          />
        </Elements>
      </div>
    </div>
  );
}
