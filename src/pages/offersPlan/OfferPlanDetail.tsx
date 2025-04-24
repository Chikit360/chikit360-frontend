import { useParams } from "react-router-dom";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";


import { axiosInstance } from "../../utils/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../features/store";
import { CheckCircleIcon } from "../../icons";
import { useState } from "react";
import { ExtraAddOn } from "../../helpers/offerPlanInterface";
import SchemeSlider from "../../components/scheme-slider/SchemeSlider";

const OfferPlanDetail = () => {
  const { offerId } = useParams();

  // Select all plans from Redux
  const plans = useSelector((state:RootState) => state.offerPlan.plans);
  const plan = plans.find((p) => p._id === offerId);
  


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
        <SchemeSlider plan={{scheme:plan.scheme}} />
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
          
          <label className="text-sm text-gray-700 cursor-pointer select-none">
            <span className="font-medium text-gray-900">{addOn.title}</span> – ₹{addOn.price}
          </label>
        </li>
      ))}
    </ul>
  </div>
)}


        
      </div>
    </div>
  );
};

export default OfferPlanDetail;
