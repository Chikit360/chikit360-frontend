import React, { useState } from 'react';
import { format, formatDistanceToNowStrict, isPast, isWithinInterval } from 'date-fns';
import { SubscriptionI } from '../../helpers/subscriptionInterface';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';
import { getUserRole } from '../../features/auth/user.slice';

const SubscriptionInfo = ({ subscription }:{subscription:SubscriptionI}) => {
  if (!subscription) return <>There is not any subscription for this hospital</>;

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
  const [openBox, setOpenBox] = useState(false)
  const formattedStart = format(new Date(startDate), 'PPP');
  const formattedEnd = format(new Date(endDate), 'PPP');
  const timeLeft = formatDistanceToNowStrict(new Date(endDate), { addSuffix: true });
  const {plans}=useSelector((state:RootState) => state.offerPlan)
  const isExpiringSoon = isWithinInterval(new Date(endDate), {
    start: new Date(),
    end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // within 7 days
  });
  const userRole=useSelector(getUserRole);

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
        {
          userRole !== "superAdmin" ?
          <Button className='w-1/3' onClick={() => setOpenBox(true)} >Upgrade Plan</Button>:null
        }
      </div>

      <Modal className="w-xl" isOpen={openBox} onClose={() => setOpenBox(false)}>
              <div className="p-6 space-y-6">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Choose Your Plan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  {plans?.map((plan) => (
                    <div key={plan._id} className={`rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 ${plan.color}`}>
                      <h3 className={`text-xl font-bold mb-1 ${plan.name}`}>{plan.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                      <button
                        className={`px-4 py-2 rounded-md bg-white border ${plan._id} border-current hover:bg-opacity-80 transition`}
                        onClick={() => {
                          setOpenBox(false);
                          window.location.href = `/subscription/${plan._id}`;
                        }}
                      >
                        Explore
                      </button>
                    </div>
                  ))}
                </div>
              </div>
      
            </Modal>
    </div>
  );
};

export default SubscriptionInfo;
