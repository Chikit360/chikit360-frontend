import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../../features/store';
import { useSelector } from 'react-redux';
import { EyeCloseIcon, EyeIcon, ListIcon, PencilIcon } from '../../icons';
import Button from '../../components/ui/button/Button';

const OffersPlanList: React.FC = () => {
  const navigate = useNavigate();
  const { plans, loading, error } = useSelector((state: RootState) => state.offerPlan);

  return (
    <div className="p-4">
      <div className='flex justify-between items-center mb-5'>
            <h2 className="text-2xl font-semibold">Offer Plan</h2>
            <Button><Link to={`/admin/offers-plan/items/add`}>Create</Link></Button>
            </div>

      {loading && <p className="text-blue-600">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b text-left">Plan Name</th>
              <th className="px-4 py-2 border-b text-left">Price (₹)</th>
              <th className="px-4 py-2 border-b text-left">Validity (Days)</th>
              <th className="px-4 py-2 border-b text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan._id} className="hover:bg-gray-100">
                <td className="px-4 cursor-pointer py-2 border-b" onClick={()=>navigate(`/admin/offers-plan/items/${plan._id}/detail`)} >{plan.name}</td>
                <td className="px-4 py-2 border-b">₹{plan.scheme[0]?.price}</td>
                <td className="px-4 py-2 border-b">{plan.scheme[0]?.validityInDays}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() =>navigate(`/admin/offers-plan/items/${plan._id}/edit`)}
                    className="bg-blue-500 flex text-white px-4 py-1 rounded hover:bg-blue-600"
                  >
                    <PencilIcon/>
                  </button>
                </td>
              </tr>
            ))}
            {plans.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No plans available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OffersPlanList;
