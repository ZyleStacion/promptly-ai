import { useState } from 'react';
import { API_URL } from '../../api/api';

const UnsubscribeButton = ({ planName, onSuccess, onError, className }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUnsubscribe = async () => {
    const ok = window.confirm(`Are you sure you want to cancel your ${planName} subscription?`);
    if (!ok) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/payment/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planName }),
      });

      const text = await res.text();
      let data = {};
      try { data = JSON.parse(text || '{}'); } catch (e) { /* ignore non-json */ }

      if (!res.ok) {
        const msg = data.error || data.message || 'Failed to cancel subscription';
        throw new Error(msg);
      }

      // Default success behavior: update cached user subscription fields
      try {
        const raw = localStorage.getItem('user');
        if (raw) {
          const u = JSON.parse(raw);
          const updated = Object.assign({}, u, { subscriptionStatus: 'canceled', subscriptionPlan: 'Free' });
          localStorage.setItem('user', JSON.stringify(updated));
          // notify other tabs/components
          window.dispatchEvent(new Event('storage'));
        }
      } catch (e) { /* ignore */ }

      if (onSuccess) onSuccess(data);
      else alert(data.message || 'Subscription canceled');
    } catch (err) {
      console.error('Unsubscribe error:', err);
      setError(err.message || 'Failed to cancel subscription');
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleUnsubscribe}
        disabled={loading}
        className={`${className || 'w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Cancelling...' : 'Unsubscribe'}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default UnsubscribeButton;
