import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { AppDispatch, RootState } from '../../../features/store';
import { getHospitalById, updateHospitalById } from '../../../features/hospitals/hospitalApi';
import Label from '../../../components/form/Label';


const SERVICE_OFFERED = [
  { value: 'lab_testing', label: 'Lab Testing' },
  { value: 'dental_cleaning', label: 'Dental Cleaning' },
  { value: 'dental_examination', label: 'Dental Examination' },
  { value: 'dental_fillings', label: 'Dental Fillings' },
  { value: 'orthodontics', label: 'Orthodontics' },
  { value: 'teeth_whitening', label: 'Teeth Whitening' },
];


const UpdateHospital = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

  const { selectedHospital, error, message, success, loading } = useSelector(
    (state: RootState) => state.hospitals
  );
  // const { departments, } = useSelector((state: RootState) => state.departments);
  //  const { doctors, loading: doctorLoading,  } = useSelector((state: RootState) => state.doctors);
  


  const [formData, setFormData] = useState({
    name: '',
    // adminEmail: '',
    type: '', // General, Specialty, Super Specialty, etc.
    ownerName: '',
    registrationNumber: '',
    accreditation: [] as string[], // List of accreditation numbers
    yearEstablished: 0,
    licenseNumber: '',

    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      landmark: '',
      coordinates: { lat: 0, lng: 0 }, // Latitude and Longitude
    },

    contact: {
      phone: '',
      whatsapp: '',
      email: '',
      website: '',
    },

    operationalDetails: {
      openDays: [] as string[], // List of days
      openTime: '',
      closeTime: '',
      emergencyAvailable: false,
      is24x7: false,
    },

    // departments: [
      
    // ]  as string[],

    servicesOffered: [] as string[], // List of services offered

    staffCount: {
      doctors: 0,
      nurses: 0,
      technicians: 0,
      otherStaff: 0,
    },

    medicalEquipment: [
      {
        name: '',
        quantity: 0,
        brand: '',
      },
    ],

    bedCapacity: 0,

    media: {
      logo: '',
      photos: [] as string[], // List of image URLs
      videos: [] as string[], // List of video URLs
    },

    bankDetails: {
      accountHolderName: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
    },

    legalDocuments: {
      registrationCertificate: '',
      gstCertificate: '',
      ownerIdProof: '',
      licenses: [] as string[], // List of license document URLs
      insurance: [] as string[], // List of insurance document URLs
    },

    insuranceDetails: [
      {
        provider: '',
        plansOffered: [] as string[], // List of insurance plans offered
      },
    ],

    financials: {
      annualRevenue: 0,
      hospitalFunding: '', // Private, Public
      billPaymentModes: [] as string[], // E.g., Cash, Card, Insurance, etc.
    },

    governmentSchemes: [] as string[], // List of government health schemes
    // doctors: [] as string[],
    branchCode: '',
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});


  useEffect(() => {
    dispatch(getHospitalById(id || ""));
  }, [id]);

  useEffect(() => {
    if (selectedHospital) {
      // @ts-ignore 
      setFormData({ ...selectedHospital });
    }
  }, [selectedHospital]);

  useEffect(() => {
    if (error) toast.error(message);
    if (success && message) toast.success(message);
    return () => {
      // dispatch(clearClinicMessage());
    };
  }, [error, success, message]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Basic Info
    if (!formData.name.trim()) errors.name = 'Clinic name is required';
    // if (!formData.adminEmail.trim()) errors.adminEmail = 'Admin email is required';
    // if (!formData.type.trim()) errors.type = 'Clinic type is required';
    if (!formData.ownerName.trim()) errors.ownerName = 'Owner name is required';
    if (!formData.registrationNumber.trim()) errors.registrationNumber = 'Registration number is required';
    if (formData.yearEstablished <= 0) errors.yearEstablished = 'Valid year of establishment is required';
    if (!formData.licenseNumber.trim()) errors.licenseNumber = 'License number is required';

    // Address
    if (!formData.address.street.trim()) errors.addressStreet = 'Street address is required';
    if (!formData.address.city.trim()) errors.addressCity = 'City is required';
    if (!formData.address.state.trim()) errors.addressState = 'State is required';
    if (!formData.address.zipCode.trim()) errors.addressZipCode = 'Zip code is required';
    if (!formData.address.country.trim()) errors.addressCountry = 'Country is required';

    // Contact
    if (!formData.contact.phone.trim()) errors.contactPhone = 'Phone number is required';
    if (!formData.contact.email.trim()) errors.contactEmail = 'Email is required';

    // Operational Details
    if (formData.operationalDetails.openDays.length === 0) errors.openDays = 'At least one open day must be selected';
    if (!formData.operationalDetails.openTime.trim()) errors.openTime = 'Open time is required';
    if (!formData.operationalDetails.closeTime.trim()) errors.closeTime = 'Close time is required';

   // Departments
  //  if(formData.departments.length===0) errors.departments="At lease one department is required"
    

    
    // Medical Equipment
    formData.medicalEquipment.forEach((item, index) => {
      if (!item.name.trim()) errors[`equipmentName_${index}`] = `Equipment ${index + 1} name is required`;
      if (item.quantity <= 0) errors[`equipmentQuantity_${index}`] = `Valid quantity for equipment ${index + 1} is required`;
    });

  
    // Financials
    if (formData.financials.annualRevenue <= 0) errors.annualRevenue = 'Valid annual revenue is required';
    if (!formData.financials.hospitalFunding.trim()) errors.hospitalFunding = 'Hospital funding type is required';

    // Doctors
    // if (formData.doctors.length === 0) errors.doctors = 'At least one doctor must be selected';

    if (!formData.governmentSchemes || formData.governmentSchemes.length === 0) {
      errors.governmentSchemes = "At least one government scheme must be selected";
    }


  
    return errors;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    console.log(errors)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    // @ts-ignore 
     dispatch(updateHospitalById({ id: id || '', hospitalData: formData }));

  };

  return (
    <>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Update Clinic</h1>
        <form onSubmit={handleSubmit}>

        <div className='flex flex-col md:flex-row gap-2'>
            <div className='bg-white rounded-md shadow p-5 md:p-11 w-full md:w-1/2 '>

              {/* section 1  */}

              {/* Clinic Name */}
              <div className="">
                <Label>Hospital Name</Label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                />
                {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
              </div>
              {/* Specialties */}
                            {/* <div className="">
                              <Label>Departments</Label>
                              <Select
                                isMulti
                                value={[...departments.filter(item=>formData.departments.includes(item._id) ).map(item=>({label:item.name,value:item._id}))]}
                                options={[...departments.map(item => ({ label: item.name, value: item._id }))]}
                                onChange={(selected) => {
                                  const values = selected.map((opt) => opt.value);
                                
                                  setFormData({ ...formData,  departments: values });
                                }}
                              />
                              {formErrors.departments && <p className="text-red-500 text-sm">{formErrors.departments}</p>}
                            </div> */}

              {/* Services Offered */}
              <div className="">
                <Label>Services Offered</Label>
                <Select
                  isMulti
                  value={formData.servicesOffered.map(item=>({label:item,value:item}))}
                  options={SERVICE_OFFERED}
                  onChange={(selected) => {
                    const values = selected.map((opt) => opt.value);
                    setFormData({ ...formData, servicesOffered: values });
                  }}
                />
                {formErrors.servicesOffered && <p className="text-red-500 text-sm">{formErrors.servicesOffered}</p>}
            
              </div>

              {/* Accreditation */}
              <div className="">
                <Label>Accreditation</Label>
                <input
                  type="text"
                  value={formData.accreditation.join(", ")} // Display as a comma-separated string
                  onChange={(e) => setFormData({ ...formData, accreditation: e.target.value.split(", ") })}
                  className="h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                />
                {formErrors.accreditation && <p className="text-red-500 text-sm">{formErrors.accreditation}</p>}

              </div>

              {/* Year Established */}
              <div className="">
                <Label>Year Established</Label>
                <input
                  type="number"
                  value={formData.yearEstablished}
                  onChange={(e) => setFormData({ ...formData, yearEstablished: parseInt(e.target.value) })}
                  className="h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                />                 {formErrors.yearEstablished && <p className="text-red-500 text-sm">{formErrors.yearEstablished}</p>}

              </div>

              {/* License Number */}
              <div className="">
                <Label>License Number</Label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  className="h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                />
                {formErrors.licenseNumber && <p className="text-red-500 text-sm">{formErrors.licenseNumber}</p>}
              </div>

              {/* Registration Number */}
              <div className="">
                <Label>Registration Number</Label>
                <input
                  type="text"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  className="h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                />
                {formErrors.registrationNumber && <p className="text-red-500 text-sm">{formErrors.registrationNumber}</p>}
              </div>

              {/* Owner Name */}
              <div className="">
                <Label>Owner Name</Label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                />
                {formErrors.ownerName && <p className="text-red-500 text-sm">{formErrors.ownerName}</p>}
              </div>

              {/* Operational Details */}
              <div className="">
                <Label>Operational Details</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {/* Open Days */}
                  <Select
                    isMulti
                    value={formData.operationalDetails?.openDays.map(item=>({label:item,value:item}))}
                    options={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => ({ label: day, value: day }))}
                    onChange={(selected) => {
                      const values = selected.map((opt) => opt.value);
                      setFormData({ ...formData, operationalDetails: { ...formData.operationalDetails, openDays: values } });
                    }}
                    placeholder="Select Open Days"
                  />
                  {formErrors.openDays && <p className="text-red-500 text-sm col-span-2">{formErrors.openDays}</p>}

                  
                   {/* Open Time */}
                   <input
                    type="time"
                    value={formData.operationalDetails.openTime}
                    onChange={(e) => setFormData({ ...formData, operationalDetails: { ...formData.operationalDetails, openTime: e.target.value } })}
                    className="h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                  />
                  {formErrors.openTime && <p className="text-red-500 text-sm">{formErrors.openTime}</p>}


                                {/* Close Time */}
                                <input
                    type="time"
                    value={formData.operationalDetails.closeTime}
                    onChange={(e) => setFormData({ ...formData, operationalDetails: { ...formData.operationalDetails, closeTime: e.target.value } })}
                    className="h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                  />
                  {formErrors.closeTime && <p className="text-red-500 text-sm">{formErrors.closeTime}</p>}

                 

                  {/* Emergency Available */}
                  <div>
                    <Label>Emergency Available</Label>
                    <input
                      type="checkbox"
                      checked={formData.operationalDetails.emergencyAvailable}
                      onChange={(e) => setFormData({ ...formData, operationalDetails: { ...formData.operationalDetails, emergencyAvailable: e.target.checked } })}
                      className="h-4 w-4"
                    />
                  </div>

                  {/* 24x7 */}
                  <div>
                    <Label>24x7 Availability</Label>
                    <input
                      type="checkbox"
                      checked={formData.operationalDetails.is24x7}
                      onChange={(e) => setFormData({ ...formData, operationalDetails: { ...formData.operationalDetails, is24x7: e.target.checked } })}
                      className="h-4 w-4"
                    />
                  </div>
                </div>
              </div>

              {/* Medical Equipment */}
              <div className="">
                <Label>Medical Equipment</Label>
                <div className="flex flex-col gap-4">
                  {formData.medicalEquipment.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Name"
                        value={item.name}
                        onChange={(e) => {
                          const updatedEquipment = [...formData.medicalEquipment];
                          updatedEquipment[index].name = e.target.value;
                          setFormData({ ...formData, medicalEquipment: updatedEquipment });
                        }}
                        className="h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                      />
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => {
                          const updatedEquipment = [...formData.medicalEquipment];
                          updatedEquipment[index].quantity = Number(e.target.value);
                          setFormData({ ...formData, medicalEquipment: updatedEquipment });
                        }}
                        className="h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                      />
                      <input
                        type="text"
                        placeholder="Brand"
                        value={item.brand}
                        onChange={(e) => {
                          const updatedEquipment = [...formData.medicalEquipment];
                          updatedEquipment[index].brand = e.target.value;
                          setFormData({ ...formData, medicalEquipment: updatedEquipment });
                        }}
                        className="h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, medicalEquipment: [...formData.medicalEquipment, { name: '', quantity: 0, brand: '' }] })}
                    className="text-blue-500 mt-2"
                  >
                    Add Equipment
                  </button>
                </div>
              </div>

              {/* Bed Capacity */}
              <div className="">
                <Label>Bed Capacity</Label>
                <input
                  type="number"
                  value={formData.bedCapacity}
                  onChange={(e) => setFormData({ ...formData, bedCapacity: parseInt(e.target.value) })}
                  className="h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                />
                {formErrors.bedCapacity && <p className="text-red-500 text-sm">{formErrors.bedCapacity}</p>}
              </div>

            </div>

            {/* Address Group */}
            <div className="bg-white rounded-md shadow  p-5 md:p-11 w-full md:w-1/2">
              <h2 className="text-xl font-semibold mb-2">Address Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              <div>
                  <input
                    placeholder="Street"
                    className="input h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                    value={formData.address.street}
                    onChange={(e) =>
                      setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })
                    }
                  />
                  {formErrors.addressStreet && <p className="text-red-500 text-sm">{formErrors.addressStreet}</p>}
                </div> <div>
                  <input
                    placeholder="City"
                    className="input h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                    value={formData.address.city}
                    onChange={(e) =>
                      setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })
                    }
                  />
                  {formErrors.addressCity && <p className="text-red-500 text-sm">{formErrors.addressCity}</p>}
                </div> <div>
                  <input
                    placeholder="State"
                    className="input h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                    value={formData.address.state}
                    onChange={(e) =>
                      setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })
                    }
                  />
                  {formErrors.addressState && <p className="text-red-500 text-sm">{formErrors.addressState}</p>}
                </div> <div>
                  <input
                    placeholder="Zip Code"
                    className="input h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                    value={formData.address.zipCode}
                    onChange={(e) =>
                      setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })
                    }
                  />
                  {formErrors.addressZipCode && (
                    <p className="text-red-500 text-sm">{formErrors.addressZipCode}</p>
                  )}
                </div> <div>
                  <input
                    placeholder="Country"
                    className="input h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                    value={formData.address.country}
                    onChange={(e) =>
                      setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })
                    }
                  />
                  {formErrors.addressCountry && (
                    <p className="text-red-500 text-sm">{formErrors.addressCountry}</p>
                  )}
                </div><input placeholder="Landmark" className="input h-9 w-full rounded-md border border-gray-300 px-4 py-2.5" value={formData.address.landmark} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, landmark: e.target.value } })} />
              </div>

              {/* Contact Group */}
              <div className="col-span-3 mt-8 bg-transparent rounded-md ">
                <h2 className="text-xl font-semibold mb-2">Contact Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <input
                      placeholder="Phone"
                      className="input h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                      value={formData.contact.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })
                      }
                    />
                    {formErrors.contactPhone && <p className="text-red-500 text-sm">{formErrors.contactPhone}</p>}
                  </div> <input placeholder="WhatsApp" className="input h-9 w-full rounded-md border border-gray-300 px-4 py-2.5" value={formData.contact.whatsapp} onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, whatsapp: e.target.value } })} />
                  <div>
                    <input
                      placeholder="Email"
                      className="input h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                      value={formData.contact.email}
                      onChange={(e) =>
                        setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })
                      }
                    />
                    {formErrors.contactEmail && <p className="text-red-500 text-sm">{formErrors.contactEmail}</p>}
                  </div>
                  
                  <input
                    placeholder="Website"
                    className="input h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                    value={formData.contact.website}
                    onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, website: e.target.value } })}
                  />
                </div>
              </div>

              {/* Financial Details */}
              <div className="col-span-3 mt-8 bg-white rounded-md ">
                <h2 className="text-xl font-semibold mb-2">Financial Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {/* Annual Revenue */}
                  <div>
                    <Label>Annual Revenue</Label>
                    <input
                      type="number"
                      value={formData.financials.annualRevenue}
                      onChange={(e) => setFormData({ ...formData, financials: { ...formData.financials, annualRevenue: parseFloat(e.target.value) } })}
                      className="h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                    />
                      {formErrors.annualRevenue && (
                      <p className="text-red-500 text-sm">{formErrors.annualRevenue}</p>
                    )}
                  </div>

                  {/* Hospital Funding */}
                  <div>
                    <Label>Hospital Funding</Label>
                    <input
                      type="text"
                      value={formData.financials.hospitalFunding}
                      onChange={(e) => setFormData({ ...formData, financials: { ...formData.financials, hospitalFunding: e.target.value } })}
                      className="h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                    />
                       {formErrors.hospitalFunding && (
                      <p className="text-red-500 text-sm">{formErrors.hospitalFunding}</p>
                    )}
                  </div>

                  {/* Bill Payment Modes */}
                  <div>
                    <Label>Bill Payment Modes</Label>
                    <Select
                      isMulti
                      value={formData.financials.billPaymentModes.map(item=>({label:item,value:item}))}
                      options={["Cash", "Card", "Insurance", "Others"].map((mode) => ({ label: mode, value: mode }))}
                      onChange={(selected) => {
                        const values = selected.map((opt) => opt.value);
                        setFormData({ ...formData, financials: { ...formData.financials, billPaymentModes: values } });
                      }}
                      placeholder="Select Payment Modes"
                    />
                  </div>
                </div>
              </div>

              {/* Government Schemes */}
              <div className="col-span-3 mt-8 bg-white rounded-md">
                <h2 className="text-xl font-semibold mb-2">Government Schemes</h2>
                <Select
                  isMulti
                  value={formData.governmentSchemes.map(item=>({label:item,value:item}))}
                  options={["Ayushman Bharat", "PMJAY", "E-Shram"].map((scheme) => ({ label: scheme, value: scheme }))}
                  onChange={(selected) => {
                    const values = selected.map((opt) => opt.value);
                    setFormData({ ...formData, governmentSchemes: values });
                  }}
                  placeholder="Select Government Schemes"
                />
                {formErrors.governmentSchemes && (
                  <p className="text-red-500 text-sm mt-2">{formErrors.governmentSchemes}</p>
                )}
              </div>

              {/* <div className="w-full mt-8 bg-white rounded-md p-5 md:p-11">
                              <h2 className="text-xl font-semibold mb-2">Doctor Details</h2>
                              <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4">
                                <Select
                                  isMulti
                                  value={[...doctors?.filter(item=>formData.doctors.includes(item._id!) ).map(item=>({label:item.personalInfo.username,value:item._id}))]}
                                  options={[...doctors.map(item => ({
                                    label: item.personalInfo.username,
                                    value: item._id,
                                  }))]}
                                  isLoading={doctorLoading}
                                  className="w-full"
                                  onChange={(selectedOptions) => {
                                    setFormData(prev => ({
                                      ...prev,
                                      doctors: selectedOptions.map(option => option.value || ''),
                                    }));
                                  }}
                                />
                              </div>
                            </div> */}
            </div>


          </div>

          <div className='flex flex-col md:flex-row gap-2 justify-between items-center'>






          </div>
            {/* Insurance Details */}
            <div className=" mt-8 bg-white rounded-md shadow p-5 md:p-11">
              <h2 className="text-xl font-semibold mb-2">Insurance Details</h2>
              <div className="flex flex-col gap-4">
                {formData.insuranceDetails.map((insurance, index) => (
                  <div key={index} className="flex justify-between items-center gap-4">
                    <input
                      type="text"
                      placeholder="Provider"
                      value={insurance.provider}
                      onChange={(e) => {
                        const updatedInsurance = [...formData.insuranceDetails];
                        updatedInsurance[index].provider = e.target.value;
                        setFormData({ ...formData, insuranceDetails: updatedInsurance });
                      }}
                      className="h-9 w-1/2 rounded-md border border-gray-300 px-4 py-2.5"
                    />
                    <Select
                      isMulti
                      options={["Plan A", "Plan B", "Plan C"].map((plan) => ({ label: plan, value: plan }))}
                      onChange={(selected) => {
                        const updatedInsurance = [...formData.insuranceDetails];
                        updatedInsurance[index].plansOffered = selected.map((opt) => opt.value);
                        setFormData({ ...formData, insuranceDetails: updatedInsurance });
                      }}
                      className='w-1/2'
                      value={insurance.plansOffered.map((plan) => ({ label: plan, value: plan }))}
                      placeholder="Select Plans"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, insuranceDetails: [...formData.insuranceDetails, { provider: "", plansOffered: [] }] })}
                  className="text-blue-500 mt-2"
                >
                  Add Insurance Provider
                </button>
              </div>
            </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button type="submit" className="bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 p-3 w-full md:w-auto">
              {loading ? 'Updating...' : 'Update Clinic'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateHospital;
