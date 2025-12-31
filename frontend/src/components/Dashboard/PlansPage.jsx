import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutButton from '../Payment/CheckoutButton';

const BillingPage = ({ userId }) => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load cached user first
    try {
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(stored && Object.keys(stored).length ? stored : null);
    } catch (e) {
      setUser(null);
    }

    // Then attempt to fetch fresh user from API to ensure subscription fields are current
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const res = await fetch(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.user) {
          setUser(data.user);
          // update localStorage so other pages see latest
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      } catch (e) {
        // silent fail — keep cached user
      }
    })();
  }, []);

  // Determine current subscription plan similar to AccountSettings
  const getCurrentPlan = () => {
    if (!user) return null;
    const subscriptionPlan = (user.subscriptionPlan && String(user.subscriptionPlan).trim()) || null;
    if (subscriptionPlan) return subscriptionPlan;
    if (user.subscriptionStatus && String(user.subscriptionStatus).toLowerCase() !== 'none') return 'Basic';
    return 'Free';
  };

  const currentPlan = getCurrentPlan();
  const isCurrentPlan = (name) => {
    if (!name || !currentPlan) return false;
    return String(currentPlan).toLowerCase() === String(name).toLowerCase();
  };

  const handleUnsubscribe = (planName) => {
    (async () => {
      const ok = window.confirm(`Are you sure you want to cancel your ${planName} subscription?`);
      if (!ok) return;
      try {
        setUnsubLoading(true);
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const res = await fetch(`${API_URL}/payment/cancel-subscription`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ planName }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to cancel subscription');
        }

        const data = await res.json().catch(() => ({}));

        // Update local user state to reflect cancellation so UI updates immediately
        const updated = Object.assign({}, user || {}, {
          subscriptionStatus: 'canceled',
          subscriptionPlan: 'Free',
        });
        setUser(updated);
        try { localStorage.setItem('user', JSON.stringify(updated)); } catch (e) {}

        alert(data.message || 'Subscription canceled');
        
        // Navigate to subscription settings to view the change
        navigate('/dashboard/settings', { state: { activeTab: 'subscription' } });
      } catch (err) {
        console.error('Unsubscribe error:', err);
        alert(err.message || 'Failed to cancel subscription');
      } finally {
        setUnsubLoading(false);
      }
    })();
  };

  const [unsubLoading, setUnsubLoading] = useState(false);

  const plans = [
    {
      name: 'Basic',
      monthlyPrice: 0,
      annualPrice: 0,
      description: 'Perfect for getting started',
      features: [
        '5,000 API calls/month',
        'Basic support',
        '1 chatbot',
        'Standard analytics',
      ],
    },
    {
      name: 'Pro',
      monthlyPrice: 29,
      annualPrice: 290,
      priceIdMonthly: 'price_1Sk0ju3tBDM4Uh8AID3qhu5S',
      priceIdAnnual: 'price_1Sk0s13tBDM4Uh8Ag7oIwytw',
      description: 'For growing teams',
      features: [
        '50,000 API calls/month',
        'Priority support',
        '5 chatbots',
        'Advanced analytics',
        'Custom integrations',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      monthlyPrice: 99,
      annualPrice: 990,
      priceIdMonthly: 'price_1SjxRI3tBDM4Uh8AU9CbUNeI',
      priceIdAnnual: 'price_1Sk0tE3tBDM4Uh8AZFTTWsWW',
      description: 'For large scale operations',
      features: [
        'Unlimited API calls',
        '24/7 dedicated support',
        '20 chatbots',
        'Custom analytics',
        'Custom integrations',
      ],
    },
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-gray-400 mb-8">Choose the perfect plan for your needs</p>

          {/* Billing Toggle */}
          <div className="flex justify-center items-center gap-4">
            <span className={billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-700"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={billingCycle === 'annual' ? 'text-white' : 'text-gray-400'}>
              Annual
              {billingCycle === 'annual' && (
                <span className="ml-2 inline-block bg-green-600 text-white text-xs px-2 py-1 rounded">
                  Save 17%
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-lg overflow-hidden transition-transform hover:scale-105 ${
                plan.popular
                  ? 'md:scale-105 border-2 border-blue-500 bg-gray-800'
                  : 'border border-gray-700 bg-gray-800/50'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                {/* Plan Name */}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-5xl font-bold">
                    ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                  </span>
                  <span className="text-gray-400 ml-2">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>

                {/* CTA Button */}
                {isCurrentPlan(plan.name) ? (
                  <div className="space-y-3">
                    <button
                      disabled
                      className="w-full bg-gray-600 text-gray-400 font-bold py-2 px-4 rounded cursor-not-allowed"
                    >
                      Current Plan
                    </button>
                    {(plan.monthlyPrice > 0 || plan.annualPrice > 0) && (
                      <button
                        onClick={() => handleUnsubscribe(plan.name)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Unsubscribe
                      </button>
                    )}
                  </div>
                ) : plan.monthlyPrice === 0 && plan.annualPrice === 0 ? (
                  <button
                    onClick={() => {
                      /* For free/basic plan, maybe navigate or show message */
                      navigate('/dashboard');
                    }}
                    className="w-full bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Choose Basic
                  </button>
                ) : (
                  <CheckoutButton
                    priceId={
                      billingCycle === 'monthly'
                        ? plan.priceIdMonthly
                        : plan.priceIdAnnual
                    }
                    userId={userId}
                    planName={plan.name}
                  />
                )}

                {/* Features List */}
                <div className="mt-8 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border border-gray-700 rounded-lg p-6">
              <h4 className="font-semibold mb-2">Can I change plans anytime?</h4>
              <p className="text-gray-400">Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.</p>
            </div>
            <div className="border border-gray-700 rounded-lg p-6">
              <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-400">We accept all major credit cards, debit cards, and digital wallets through Stripe.</p>
            </div>
            <div className="border border-gray-700 rounded-lg p-6">
              <h4 className="font-semibold mb-2">Is there a free trial?</h4>
              <p className="text-gray-400">Contact our sales team to discuss trial options for Enterprise plans.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
