import { useState } from 'react';
import { API_URL } from '../../api/api';

const UnsubscribeButton = ({ planName, subscriptionStatus, subscriptionEndsAt, onSuccess, onError, className }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDate = (val) => {
    if (!val) return '';
    try {
      // epoch seconds (number) or numeric string
      if (typeof val === 'number' || (/^\d+$/.test(String(val)))) {
        const n = Number(val);
        // if looks like seconds (10 digits) convert to ms
        const ms = n > 1e12 ? n : n * 1000;
        return new Date(ms).toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
      }
      // ISO string or Date
      return new Date(val).toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
    } catch (e) {
      return String(val);
    }
  };

  const handleUnsubscribe = async () => {
    // First ask whether user wants to schedule cancellation or cancel immediately
    const schedule = window.confirm(`Cancel ${planName} at period end? Click OK to schedule, Cancel to choose immediate cancellation.`);
    let immediate = false;
    if (!schedule) {
      const now = window.confirm('Cancel now and terminate access immediately? Click OK to cancel now, Cancel to abort.');
      if (!now) return;
      immediate = true;
    }

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
        body: JSON.stringify({ planName, immediate }),
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
          const updated = Object.assign({}, u, { subscriptionStatus: immediate ? 'canceled' : 'cancel_at_period_end' });
          if (immediate) {
            updated.subscriptionPlan = 'Free';
            updated.subscriptionId = null;
          }
          localStorage.setItem('user', JSON.stringify(updated));
          // notify other tabs/components
          window.dispatchEvent(new Event('storage'));
        }
      } catch (e) { /* ignore */ }

      if (onSuccess) onSuccess(data);
      else alert(data.message || (immediate ? 'Subscription canceled' : 'Subscription scheduled to cancel at period end'));
    } catch (err) {
      console.error('Unsubscribe error:', err);
      setError(err.message || 'Failed to cancel subscription');
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    if (!window.confirm('Resume your subscription and stop cancellation at period end?')) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/payment/resume-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const text = await res.text();
      let data = {};
      try { data = JSON.parse(text || '{}'); } catch (e) { /* ignore */ }
      if (!res.ok) {
        const msg = data.error || data.message || 'Failed to resume subscription';
        throw new Error(msg);
      }

      try {
        const raw = localStorage.getItem('user');
        if (raw) {
          const u = JSON.parse(raw);
          const updated = Object.assign({}, u, { subscriptionStatus: 'active' });
          localStorage.setItem('user', JSON.stringify(updated));
          window.dispatchEvent(new Event('storage'));
        }
      } catch (e) {}

      if (onSuccess) onSuccess(data);
      else alert(data.message || 'Subscription resumed');
    } catch (err) {
      console.error('Resume error:', err);
      setError(err.message || 'Failed to resume subscription');
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {subscriptionStatus === 'cancel_at_period_end' ? (
        <div>
          {subscriptionEndsAt ? (
            <div className="mb-2 text-sm text-yellow-300">
              Ends on {formatDate(subscriptionEndsAt)}.
            </div>
          ) : null}
          <div className="flex gap-2">
          <button
            onClick={handleResume}
            disabled={loading}
            className={`${className || 'flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Resuming...' : 'Resume subscription'}
          </button>
          <button
            onClick={() => { if (window.confirm('Cancel immediately? This will end access now.')) handleUnsubscribe(); }}
            disabled={loading}
            className={`${className || 'flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : 'Cancel now'}
          </button>
        </div>
      </div>
      ) : (
        <button
          onClick={handleUnsubscribe}
          disabled={loading}
          className={`${className || 'w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Processing...' : 'Cancel subscription'}
        </button>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default UnsubscribeButton;
