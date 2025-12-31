import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCanceled = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Show error toast
    const showToast = () => {
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
      toast.innerHTML = `
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <span>Payment was canceled or failed. Please try again.</span>
      `;
      document.body.appendChild(toast);

      // Remove toast after 5 seconds
      setTimeout(() => {
        toast.remove();
      }, 5000);
    };

    showToast();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-500/20 p-4">
            <svg
              className="w-16 h-16 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2">Payment Failed</h1>
        <p className="text-gray-400 text-lg mb-8">
          Your payment could not be processed. Please try again or contact support if the problem persists.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard/plans')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Return to Dashboard
          </button>
        </div>

        <p className="text-gray-500 text-sm mt-8">
          If you continue to experience issues, please{' '}
          <a href="mailto:support@promptly-ai.com" className="text-blue-500 hover:underline">
            contact our support team
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default PaymentCanceled;
