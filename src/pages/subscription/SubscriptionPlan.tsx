import { useParams } from "react-router-dom";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";


import { axiosInstance } from "../../utils/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../features/store";
import { CheckCircleIcon } from "../../icons";
import { useState } from "react";
import { ExtraAddOn, SchemeI } from "../../helpers/offerPlanInterface";
import SchemeSlider from "../../components/scheme-slider/SchemeSlider";
import { toast } from "react-toastify";

const SubscriptionPlan = () => {
  const { offerId } = useParams();
  const { Razorpay } = useRazorpay();

  // Select all plans from Redux
  const plans = useSelector((state: RootState) => state.offerPlan.plans);
  const plan = plans.find((p) => p._id === offerId);
  const [extraAddOn, setExtraAddOn] = useState<ExtraAddOn[]>([]);
  const [schemeData, setSchemeData] = useState<SchemeI|null>(null)

  const handlePayment = async () => {
    try {
      const result = await axiosInstance.post(`/payment/orders?offerId=${offerId}`, { extraAddOn, schemeData }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log(result)
      const { amount, id: order_id, currency } = result.data.data;
  
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
            subscription_plan_id: offerId,
            schemeData
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
      
    } catch (error:any) {
     
      if(error){
        toast.error(error.response.data.message)
      }
    }
  };

  const handleCheckBox = (e: React.ChangeEvent<HTMLInputElement>, addOn: ExtraAddOn) => {
    if (e.target.checked) {
      setExtraAddOn((prev) => [...prev, addOn]);
    } else {
      setExtraAddOn((prev) => prev.filter((item) => item.title !== addOn.title));
    }
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
        <div className="flex justify-center items-center gap-5">
          <SchemeSlider
            plan={{ scheme: plan.scheme }}
            onChange={(selectedScheme) => {
              setSchemeData(selectedScheme)
             
            }}
          />

          {/* <div className="text-center text-2xl font-semibold text-indigo-700 mb-6">₹{plan.price} / {plan.validityInDays} Days</div> */}

        </div>

        {plan.description && (
          <p className="text-center text-gray-700 mb-6">{plan.description}</p>
        )}

        <div className="flex justify-center items-center my-3 font-medium text-red-400">
          Initial Project set-up price: ₹{plan.initialSetUpPrice}
        </div>

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

        {plan.extraAddOn?.length > 0 && (
          <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
            <h4 className="text-base font-semibold text-gray-800 mb-3">Extra Add Ons</h4>
            <ul className="space-y-3">
              {plan.extraAddOn.map((addOn: ExtraAddOn, i: number) => (
                <li key={i} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheckBox(e, addOn)}
                    checked={extraAddOn.some((item: ExtraAddOn) => item.title === addOn.title)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-700 cursor-pointer select-none">
                    <span className="font-medium text-gray-900">{addOn.title}</span> – ₹{addOn.price}
                  </label>
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
