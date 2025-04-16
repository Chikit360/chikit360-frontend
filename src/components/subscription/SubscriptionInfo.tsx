import React from 'react';
import { format, formatDistanceToNowStrict, isPast, isWithinInterval } from 'date-fns';
import { SubscriptionI } from '../../helpers/subscriptionInterface';

const SubscriptionInfo = ({ subscription }:{subscription:SubscriptionI}) => {
  if (!subscription) return null;

  const {
    plan,
    price,
    startDate,
    endDate,
    isActive,
    isCancelled,
    paymentMethod,
    transactionId,
  } = subscription;

  const formattedStart = format(new Date(startDate), 'PPP');
  const formattedEnd = format(new Date(endDate), 'PPP');
  const timeLeft = formatDistanceToNowStrict(new Date(endDate), { addSuffix: true });

  const isExpiringSoon = isWithinInterval(new Date(endDate), {
    start: new Date(),
    end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // within 7 days
  });

  return (
    <div className="p-6 bg-white rounded-xl  space-y-4 w-full  mx-auto mt-6">
      <h2 className="text-xl font-semibold text-gray-800">Subscription Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <p>
          <strong>Plan:</strong>{' '}
          <span className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
            {plan.charAt(0).toUpperCase() + plan.slice(1)}
          </span>
        </p>
        <p>
          <strong>Price:</strong> ₹{price}
        </p>
        <p>
          <strong>Payment Method:</strong> {paymentMethod}
        </p>
        <p>
          <strong>Transaction ID:</strong> {transactionId}
        </p>
        <p>
          <strong>Start Date:</strong> {formattedStart}
        </p>
        <p>
          <strong>End Date:</strong>{' '}
          <span
            className={`${
              isPast(new Date(endDate))
                ? 'text-red-600'
                : isExpiringSoon
                ? 'text-yellow-600'
                : 'text-green-600'
            }`}
          >
            {formattedEnd} ({timeLeft})
          </span>
        </p>
        <p>
          <strong>Status:</strong>{' '}
          <span
            className={`font-semibold ${
              !isActive || isCancelled ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {isCancelled ? 'Cancelled' : isActive ? 'Active' : 'Inactive'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default SubscriptionInfo;
