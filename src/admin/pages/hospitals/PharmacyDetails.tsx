import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { AppDispatch, RootState } from '../../../features/store';
import { getHospitalById } from '../../../features/hospitals/hospitalApi';

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

  useEffect(() => {
    dispatch(getHospitalById(id || ''));
  }, [dispatch, id]);

  if (loading || !selectedHospital) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading hospital details...
      </div>
    );
  }

  const hospital = selectedHospital;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">{hospital.name}</h2>
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
    </div>
  );
};

export default PharmacyDetails;
