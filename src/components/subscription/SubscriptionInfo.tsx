import  { useState } from 'react';
import { format, formatDistanceToNowStrict, isPast, isWithinInterval } from 'date-fns';
import { ExtraAddOn, SubscriptionI } from '../../helpers/subscriptionInterface';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';
import { getUserRole } from '../../features/auth/user.slice';

const SubscriptionInfo = ({ subscription }: { subscription: SubscriptionI }) => {
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
    extraAddOn
  } = subscription;
  const [openBox, setOpenBox] = useState(false)
  const formattedStart = format(new Date(startDate), 'PPP');
  const formattedEnd = format(new Date(endDate), 'PPP');
  const timeLeft = formatDistanceToNowStrict(new Date(endDate), { addSuffix: true });
  const { plans } = useSelector((state: RootState) => state.offerPlan)
  const isExpiringSoon = isWithinInterval(new Date(endDate), {
    start: new Date(),
    end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // within 7 days
  });
  const userRole = useSelector(getUserRole);

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
            className={`${isPast(new Date(endDate))
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
            className={`font-semibold ${!isActive || isCancelled ? 'text-red-600' : 'text-green-600'
              }`}
          >
            {isCancelled ? 'Cancelled' : isActive ? 'Active' : 'Inactive'}
          </span>
        </p>
        {extraAddOn?.length > 0 && (
          <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
            <h4 className="text-base font-semibold text-gray-800 mb-3">Extra Add Ons</h4>
            <ul className="space-y-3">
              {extraAddOn.map((addOn: ExtraAddOn, i: number) => (
                <li key={i} className="flex items-center gap-3">

                  <label className="text-sm text-gray-700 cursor-pointer select-none">
                    <span className="font-medium text-gray-900">{addOn.title}</span> – ₹{addOn.price}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
        {
          userRole !== "superAdmin" ?
            <Button className='w-1/3' onClick={() => setOpenBox(true)} >Upgrade Plan</Button> : null
        }
      </div>

      <Modal className="w-full max-w-6xl" isOpen={openBox} onClose={() => setOpenBox(false)}>
        <div className="p-6 h-[90vh] flex flex-col">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4 shrink-0">Choose Your Plan</h2>

          <div className="overflow-y-auto flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans?.map((plan) => (
                <div
                  key={plan._id}
                  className={`w-full h-full flex flex-col justify-between rounded-2xl p-6 shadow-xl transition-transform duration-300 transform hover:-translate-y-1 bg-white border-t-8 ${plan.color}`}
                >
                  <div className=''>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 capitalize">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 min-h-[50px]">{plan.description}</p>

                  <div className="text-lg font-semibold text-gray-700 mb-2">
                    ₹{plan.scheme[0]?.price ?? 0} / {plan.scheme[0]?.validityInDays >= 30 ? `${plan.scheme[0]?.validityInDays / 30} month${plan.scheme[0]?.validityInDays > 30 ? "s" : ""}` : `${plan.scheme[0]?.validityInDays} days`}
                  </div>
                  <div>
                    Initial set-up cost: ₹{plan.initialSetUpPrice}
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-600">Limits:</h4>
                    <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                      <li>Users: {plan.limits?.userLimit}</li>
                      <li>Departments: {plan.limits?.departmentLimit}</li>
                      <li>Medicines: {plan.limits?.medicineLimit}</li>
                      <li>Sales/day: {plan.limits?.saleLimitPerDay}</li>
                    </ul>
                  </div>

                  {plan.features?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-600">Features:</h4>
                      <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                        {plan.features.map((feature, i) => (
                          <li key={i} className={feature.isEnabled ? "text-green-600" : "text-red-500"}>
                            {feature.label} – {feature.isEnabled ? "Enabled" : "Disabled"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  </div>




                  <button
                    className={`w-full mt-4 py-2 rounded-md text-white font-medium bg-gray-800 hover:bg-gray-900 transition`}
                    onClick={() => {
                      setOpenBox(false);
                      window.location.href = `/subscription/${plan._id}`;
                    }}
                  >
                    Explore Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SubscriptionInfo;
