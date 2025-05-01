import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../../features/store';
import { useSelector } from 'react-redux';
import { PencilIcon, TrashBinIcon } from '../../icons';
import Button from '../../components/ui/button/Button';
import SchemeSlider from '../../components/scheme-slider/SchemeSlider';

const OffersPlanList: React.FC = () => {
  const navigate = useNavigate();
  const { plans, loading, error } = useSelector((state: RootState) => state.offerPlan);

  return (
    <div className="p-4">
      <div className='flex justify-between items-center mb-5'>
        <h2 className="text-2xl font-semibold">Offer Plans</h2>
        <Button><Link to="/admin/offers-plan/items/add">Create</Link></Button>
      </div>

      {loading && <p className="text-blue-600">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {plans.length === 0 && !loading && (
        <p className="text-center text-gray-500 mt-10">No plans available.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
          key={plan._id}
          className={`w-full h-full flex flex-col justify-between rounded-2xl p-6 shadow-xl transition-transform duration-300 transform hover:-translate-y-1 bg-white border-t-8 ${plan.color}`}
        >
          <div className=''>
          <h3 className="text-2xl font-bold text-gray-800 mb-2 capitalize">{plan.name}</h3>
          <p className="text-sm text-gray-500 mb-4 min-h-[50px]">{plan.description}</p>

          <SchemeSlider plan={{scheme:plan.scheme}} />
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

          <div className='flex gap-3 justify-end'>

             <button
                onClick={(e) => {
                  e.stopPropagation(); // stop card click
                  navigate(`/admin/offers-plan/items/${plan._id}/edit`);
                }}
                className="flex items-center justify-center bg-gray-200  p-1.5 rounded-full "
              >
                <PencilIcon className="w-4 h-4 mr-1 text-blue-500" />
              </button>
             <button
                onClick={(e) => {
                  e.stopPropagation(); // stop card click
                  // navigate(`/admin/offers-plan/items/${plan._id}/edit`);
                }}
                className="flex items-center justify-center bg-gray-200  p-1.5 rounded-full "
              >
                <TrashBinIcon className="w-4 h-4 mr-1 text-red-500" /> 
              </button>
          </div>
  
        </div>
          // <div
          //   key={plan._id}
          //   className="bg-white rounded-2xl shadow-md border p-5 hover:shadow-lg transition cursor-pointer"
          //   onClick={() => navigate(`/admin/offers-plan/items/${plan._id}/detail`)}
          // >
          //   <h3 className="text-xl font-bold text-blue-700 mb-2">{plan.name}</h3>
          //   <p className="text-gray-700 text-lg">₹{plan.scheme[0]?.price}</p>
          //   <p className="text-gray-500 mb-4">Validity: {plan.scheme[0]?.validityInDays} days</p>

          //   <div className="flex gap-3 mt-4">
          //     <button
          //       onClick={(e) => {
          //         e.stopPropagation(); // stop card click
          //         navigate(`/admin/offers-plan/items/${plan._id}/edit`);
          //       }}
          //       className="flex items-center bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600"
          //     >
          //       <PencilIcon className="w-4 h-4 mr-1" /> Edit
          //     </button>

          //     <button
          //       onClick={(e) => {
          //         e.stopPropagation(); // stop card click
          //         // Call delete logic here (confirm first)
          //         alert('Delete logic here');
          //       }}
          //       className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600"
          //     >
          //       Delete
          //     </button>
          //   </div>
          // </div>
        ))}
      </div>
    </div>
  );
};

export default OffersPlanList;
