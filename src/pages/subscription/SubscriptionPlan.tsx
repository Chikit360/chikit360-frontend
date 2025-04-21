import { useParams } from "react-router-dom";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";


import { axiosInstance } from "../../utils/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../features/store";
import { CheckCircleIcon } from "../../icons";

const SubscriptionPlan = () => {
  const { offerId } = useParams();
  const { Razorpay } = useRazorpay();

  // Select all plans from Redux
  const plans = useSelector((state:RootState) => state.offerPlan.plans);
  const plan = plans.find((p) => p._id === offerId);

  const handlePayment = async () => {
    const result = await axiosInstance.post(`/payment/orders?offerId=${offerId}`);
    const { amount, id: order_id, currency } = result.data;

    const options: RazorpayOrderOptions = {
      key: import.meta.env.VITE_RAZOR_PAYMENT_KEY_ID,
      amount,
      currency,
      name: "Your Brand Name",
      description: `${plan?.name} Plan Subscription`,
      order_id,
      handler: async (response) => {
        await axiosInstance.post(`/payment/success`, {
          ...response,
          razorpay_order_id: order_id,
        });
        window.location.reload();
      },
      prefill: {
        name: "John Doe",
        email: "john.doe@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#4F46E5",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  };

  if (!plan) {
    return (
      <div className="text-center mt-10 text-gray-600 font-medium">
        Plan not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 px-6">
      <div className="rounded-2xl shadow-xl p-8 bg-gray-100">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2 capitalize">{plan.name} Plan</h1>
        <p className="text-center text-2xl font-semibold text-indigo-700 mb-6">₹{plan.price} / {plan.validityInDays} Days</p>

        {plan.description && (
          <p className="text-center text-gray-700 mb-6">{plan.description}</p>
        )}

        {plan.features && plan.features.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Features Included:</h3>
            <ul className="space-y-2">
              {plan.features.map((feature: any, index: number) => (
                <li key={index} className="flex items-center text-gray-800 text-sm">
                  <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                  {feature.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-center mt-8">
          <button
            onClick={handlePayment}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold px-8 py-3 rounded-lg transition"
          >
            Subscribe to {plan.name}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlan;
