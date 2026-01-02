import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        // 1️⃣ Finalize Stripe session
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get("session_id");
        if (sessionId) {
          const token = localStorage.getItem("token");

          await fetch("/payment/finalize", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ sessionId }),
          });
        }

        // 2️⃣ Refresh user from backend
        const token = localStorage.getItem("token");
        if (token) {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/user/me`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const data = await res.json();
          if (data?.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
          }
        }

        // 3️⃣ Show toast
        const toast = document.createElement("div");
        toast.className =
          "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
        toast.textContent =
          "Payment successful! Welcome to your new plan.";
        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 4000);

        // 4️⃣ Redirect
        setTimeout(() => navigate("/dashboard"), 3000);
      } catch (err) {
        console.error("Payment success flow failed:", err);
      }
    };

    run();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <h1 className="text-white text-3xl font-bold">
        Payment Successful 🎉
      </h1>
    </div>
  );
};

export default PaymentSuccess;
