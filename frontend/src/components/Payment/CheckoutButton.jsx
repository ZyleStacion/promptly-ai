import { useState } from 'react';
import { checkout } from ''

const CheckoutButton = ({ priceId, userId, planName }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          priceId: priceId,
          userId: userId,
        }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text || '{}');
      } catch (e) {
        console.warn('Non-JSON response from checkout endpoint:', text);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        const msg = data.error || data.message || 'Failed to create checkout session';
        throw new Error(msg);
      }

      console.log('Checkout session URL:', data.url);
      // Open Stripe Checkout in same window
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Subscribe to ${planName}`}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default CheckoutButton;
