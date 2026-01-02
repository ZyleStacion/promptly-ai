import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Finalize checkout session (create DB record) when redirected here from Stripe
    const finalizeSession = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get('session_id');
        if (!sessionId) return;

        const token = localStorage.getItem('token');
        const res = await fetch('/payment/finalize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json().catch(() => ({}));
        console.log('Finalize session response:', res.status, data);
      } catch (err) {
        console.error('Error finalizing checkout session:', err);
      }
    };

    finalizeSession();
    const refreshUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

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
    };

    await finalizeSession();
    await refreshUser();


    // Show toast notification
    const showToast = () => {
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
      toast.innerHTML = `
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <span>Payment successful! Welcome to your new plan.</span>
      `;
      document.body.appendChild(toast);

      // Remove toast after 4 seconds
      setTimeout(() => {
        toast.remove();
      }, 4000);
    };

    showToast();

    // Redirect to dashboard after 3 seconds
    const timeout = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-500/20 p-4">
            <svg
              className="w-16 h-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2">Payment Successful!</h1>
        <p className="text-gray-400 text-lg mb-8">
          Thank you for your purchase. Your subscription is now active.
        </p>

        <div className="mb-8">
          <p className="text-gray-400 mb-2">Redirecting you to your dashboard...</p>
          <div className="flex justify-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          Go to Dashboard Now
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
