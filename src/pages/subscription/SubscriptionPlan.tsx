import axios from "axios";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import LoadingOverlay from "../../components/loader/LoadingOverlay";

const plans = {
  basic: {
    name: "Basic",
    price: "Free",
    features: [
      "Up to 5 Users",
      "Basic Analytics",
      "Limited Email Support",
    ],
  },
  standard: {
    name: "Standard",
    price: "$49/month",
    features: [
      "Up to 25 Users",
      "Advanced Reporting",
      "Priority Email Support",
      "Inventory Alerts",
    ],
  },
  premium: {
    name: "Premium",
    price: "$99/month",
    features: [
      "Unlimited Users",
      "Full Analytics",
      "24/7 Phone Support",
      "Advanced Notification Settings",
      "Custom Integrations",
    ],
  },
};


const SubscriptionPlan = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "basic";
  const plan = plans[type];
  const { error, isLoading, Razorpay } = useRazorpay();

  const handlePayment = async() => {

    // creating a new order
    const result = await axios.post(`${ import .meta.env.VITE_API_URL}/payment/orders`);

    if (!result) {
        alert("Server error. Are you online?");
        return;
    }

    // Getting the order details back
    const { amount, id: order_id, currency } = result.data;

    const options: RazorpayOrderOptions = {
      key: import .meta.env.VITE_RAZOR_PAYMENT_KEY_ID, // Enter the Key ID generated from the Dashboard
      amount: amount, // Amount in paise
      currency: currency,
      name: "Test Company",
      description: "Test Transaction",
      order_id: order_id, // Generate order_id on server
      handler: async(response) => {
        console.log(response);
        
        const result = await axios.post(`${ import .meta.env.VITE_API_URL}/payment/success`, response);

        alert(result.data.msg);
       
      },
      prefill: {
        name: "John Doe",
        email: "john.doe@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  };

  if(isLoading){
    return <LoadingOverlay isLoading={true}/>
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        {plan.name} Plan
      </h1>
      <p className="text-center text-xl text-indigo-600 font-semibold">
        {plan.price}
      </p>
      <ul className="space-y-3 mt-6">
        {plan.features.map((feature, index) => (
          <li
            key={index}
            className="flex items-center gap-3 text-gray-700 text-sm"
          >
            <span className="w-2 h-2 bg-indigo-500 rounded-full" />
            {feature}
          </li>
        ))}
      </ul>
      <div className="flex justify-center mt-6">
        <button  onClick={handlePayment} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition">
          Choose {plan.name}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionPlan;
