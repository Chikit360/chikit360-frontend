import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { AppDispatch, RootState } from '../../../features/store';
import { getHospitalById } from '../../../features/hospitals/hospitalApi';
import { fetchDashboardAnalytics } from '../../../features/admin/adminApi';
import { allSubscriptionByHospitalId, fetchCurrSubscription } from '../../../features/subscription/subscriptionApiThunk';
import SubscriptionInfo from '../../../components/subscription/SubscriptionInfo';
import LoadingOverlay from '../../../components/loader/LoadingOverlay';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">{title}</h3>
    <div className="text-sm text-gray-700 space-y-1">{children}</div>
  </div>
);

const PharmacyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedHospital, loading } = useSelector((state: RootState) => state.hospitals);
  const { dashboardData } = useSelector((state: RootState) => state.admin);
  const { data: subscriptionData, subscriptions } = useSelector(((state: RootState) => state.subscription))

  useEffect(() => {
    dispatch(getHospitalById(id || ''));
    dispatch(fetchDashboardAnalytics({ selected: "daily", hospitalId: id! }));
    dispatch(fetchCurrSubscription(id!))
    dispatch(allSubscriptionByHospitalId(id!))
  }, [dispatch, id]);

  if (loading || !selectedHospital) {
    return <LoadingOverlay />;
  }

  const hospital = selectedHospital;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-2 capitalize">{hospital.name}</h2>
        <p className="text-sm text-gray-500">Comprehensive Pharmacy Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section title="General Information">
          <p><strong>Owner:</strong> {hospital.ownerName}</p>
          <p><strong>Registration No.:</strong> {hospital.registrationNumber}</p>
          {/* <p><strong>License No.:</strong> {hospital.licenseNumber}</p> */}
          <p><strong>Established:</strong> {hospital.yearEstablished}</p>
          {/* <p><strong>Accreditation:</strong> {hospital.accreditation.join(', ')}</p> */}
        </Section>

        <Section title="Contact">
          <p><strong>Phone:</strong> {hospital.contact.phone}</p>
          <p><strong>WhatsApp:</strong> {hospital.contact.whatsapp}</p>
          <p><strong>Email:</strong> <a href={`mailto:${hospital.contact.email}`} className="text-blue-600 underline">{hospital.contact.email}</a></p>
          <p><strong>Website:</strong> <a href={hospital.contact.website} className="text-blue-600 underline" target="_blank" rel="noreferrer">{hospital.contact.website}</a></p>
        </Section>

        <Section title="Address">
          <p><strong>Street:</strong> {hospital.address.street}</p>
          <p><strong>City:</strong> {hospital.address.city}</p>
          <p><strong>State:</strong> {hospital.address.state}</p>
          <p><strong>Zip Code:</strong> {hospital.address.zipCode}</p>
          <p><strong>Country:</strong> {hospital.address.country}</p>
          <p><strong>Landmark:</strong> {hospital.address.landmark}</p>
          {/* <p><strong>Coordinates:</strong> Lat: {hospital.address.coordinates.lat}, Lng: {hospital.address.coordinates.lng}</p> */}
        </Section>

        <Section title="Operational Details">
          <p><strong>Open Days:</strong> {hospital.operationalDetails.openDays.join(', ')}</p>
          <p><strong>Time:</strong> {hospital.operationalDetails.openTime} - {hospital.operationalDetails.closeTime}</p>
          <p><strong>Emergency:</strong> {hospital.operationalDetails.emergencyAvailable ? 'Yes' : 'No'}</p>
          <p><strong>24x7:</strong> {hospital.operationalDetails.is24x7 ? 'Yes' : 'No'}</p>
        </Section>

        <Section title="Services Offered">
          <p>{hospital.servicesOffered.length > 0 ? hospital.servicesOffered.join(', ') : 'N/A'}</p>
        </Section>

        <Section title="Staff & Bed Info">
          <p><strong>Doctors:</strong> {hospital.staffCount.doctors}</p>
          <p><strong>Nurses:</strong> {hospital.staffCount.nurses}</p>
          <p><strong>Technicians:</strong> {hospital.staffCount.technicians}</p>
          <p><strong>Other Staff:</strong> {hospital.staffCount.otherStaff}</p>
          {/* <p><strong>Bed Capacity:</strong> {hospital.bedCapacity}</p> */}
        </Section>

        {/* <Section title="Financials">
          <p><strong>Payment Modes:</strong> {hospital.financials.billPaymentModes.join(', ')}</p>
          <p><strong>Annual Revenue:</strong> ₹{hospital.financials.annualRevenue} Lakhs</p>
          <p><strong>Funding:</strong> ₹{hospital.financials.hospitalFunding}</p>
        </Section> */}

        {/* <Section title="Government Schemes">
          <p>{hospital.governmentSchemes.length > 0 ? hospital.governmentSchemes.join(', ') : 'N/A'}</p>
        </Section> */}
      </div>
      <DashboardAnalytics data={dashboardData!} />
      <SubscriptionInfo subscription={subscriptionData!} />
      <h1 className="text-2xl font-bold mb-4">Hospital Subscription List</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              
              <th className="px-4 py-2 border">Plan</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Start Date</th>
              <th className="px-4 py-2 border">End Date</th>
              <th className="px-4 py-2 border">Razorpay Order ID</th>
              <th className="px-4 py-2 border">Transaction ID</th>
              <th className="px-4 py-2 border">Active</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions?.map((subscription) => (
              <tr key={subscription._id} className="text-center">
                
                <td className="px-4 py-2 border">{subscription.plan}</td>
                <td className="px-4 py-2 border">₹{subscription.price}</td>
                <td className="px-4 py-2 border">{subscription.startDate}</td>
                <td className="px-4 py-2 border">{subscription.endDate}</td>
                <td className="px-4 py-2 border">{subscription.razorpayOrderId || "-"}</td>
                <td className="px-4 py-2 border">{subscription.transactionId || "-"}</td>
                <td className="px-4 py-2 border">
  <label className="inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={subscription.isActive}
      readOnly
      className="sr-only peer"
    />
    <div
      className={`w-11 h-6 rounded-full peer peer-focus:ring-2 transition-all duration-300 relative ${
        subscription.isActive ? "bg-green-500" : "bg-red-500"
      }`}
    >
      <div
        className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all duration-300 ${
          subscription.isActive ? "translate-x-full" : ""
        }`}
      ></div>
    </div>
  </label>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>


    </div>
  );
};


interface DashboardData {
  totalMedicines: number;
  totalInventory: number;
  totalCustomers: number;
  totalTodaySales: number;
  totalProfitToday: number;
}

interface Props {
  data: DashboardData;
}

const DashboardAnalytics: React.FC<Props> = ({ data }) => {
  const stats = [
    { title: "Total Medicines", value: data?.totalMedicines },
    { title: "Total Inventory", value: data?.totalInventory },
    { title: "Total Customers", value: data?.totalCustomers },
    { title: "Today's Sales", value: data?.totalTodaySales },
    { title: "Today's Profit", value: data?.totalProfitToday },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 m-5">
      <h2 className="text-3xl font-bold text-gray-800">Analytics Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow p-6 text-center border border-gray-100 hover:shadow-md transition"
          >
            <p className="text-sm text-gray-500">{item.title}</p>
            <p className="text-2xl font-semibold text-indigo-600 mt-1">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};


export default PharmacyDetails;
