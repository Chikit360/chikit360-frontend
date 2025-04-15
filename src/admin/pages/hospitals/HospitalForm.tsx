import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { toast } from 'react-toastify';
import Select from 'react-select';
import { AppDispatch, RootState } from '../../../features/store';
import Label from '../../../components/form/Label';
import { createHospital } from '../../../features/hospitals/hospitalApi';





const SERVICE_OFFERED = [
  { value: 'lab_testing', label: 'Lab Testing' },
  { value: 'dental_cleaning', label: 'Dental Cleaning' },
  { value: 'dental_examination', label: 'Dental Examination' },
  { value: 'dental_fillings', label: 'Dental Fillings' },
  { value: 'orthodontics', label: 'Orthodontics' },
  { value: 'teeth_whitening', label: 'Teeth Whitening' },
  // Add more dental services as needed
];





const HospitalForm = () => {
  const dispatch = useDispatch<AppDispatch>();
 

  // const { error, message, success, } = useSelector((state: RootState) => state.clinic);
  // const { departments, } = useSelector((state: RootState) => state.departments);
  // const { doctors, loading: doctorLoading,  } = useSelector((state: RootState) => state.doctors);

  const [formData, setFormData] = useState({
    name: '',
    adminEmail:'',
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

    departments: [

    ] as string[],

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
 

  // useEffect(() => {
  //   if (error) toast.error(message);
  //   if (success && message) toast.success(message);
  //   return () => {
  //     dispatch(clearClinicMessage());
  //   };
  // }, [error, success, message]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Basic Info
    if (!formData.name.trim()) errors.name = 'Clinic name is required';
    if (!formData.adminEmail.trim()) errors.adminEmail = 'Admin email is required';
    // if (!formData.type.trim()) errors.type = 'Clinic type is required';
    if (!formData.ownerName.trim()) errors.ownerName = 'Owner name is required';
    if (!formData.registrationNumber.trim()) errors.registrationNumber = 'Registration number is required';
    if (formData.yearEstablished <= 0) errors.yearEstablished = 'Valid year of establishment is required';
    // if (!formData.licenseNumber.trim()) errors.licenseNumber = 'License number is required';

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
    // if(formData.departments.length===0) errors.departments="At lease one department is required"
    

    // Staff Count
    // if (formData.staffCount.doctors <= 0) errors.staffDoctors = 'At least one doctor is required';

    // Medical Equipment
    // formData.medicalEquipment.forEach((item, index) => {
    //   if (!item.name.trim()) errors[`equipmentName_${index}`] = `Equipment ${index + 1} name is required`;
    //   if (item.quantity <= 0) errors[`equipmentQuantity_${index}`] = `Valid quantity for equipment ${index + 1} is required`;
    // });

    // Media
    // if (!formData.media.logo.trim()) errors.logo = 'Clinic logo is required';
    // if (formData.media.photos.length === 0) errors.photos = 'At least one photo is required';

    // // Bank Details
    // if (!formData.bankDetails.accountHolderName.trim()) errors.accountHolderName = 'Account holder name is required';
    // if (!formData.bankDetails.bankName.trim()) errors.bankName = 'Bank name is required';
    // if (!formData.bankDetails.accountNumber.trim()) errors.accountNumber = 'Account number is required';
    // if (!formData.bankDetails.ifscCode.trim()) errors.ifscCode = 'IFSC code is required';

    // Legal Documents
    // if (!formData.legalDocuments.registrationCertificate.trim()) errors.registrationCertificate = 'Registration certificate is required';

    // Financials
    // if (formData.financials.annualRevenue <= 0) errors.annualRevenue = 'Valid annual revenue is required';
    // if (!formData.financials.hospitalFunding.trim()) errors.hospitalFunding = 'Hospital funding type is required';

    // Doctors
    // if (formData.doctors.length === 0) errors.doctors = 'At least one doctor must be selected';

    // if (!formData.governmentSchemes || formData.governmentSchemes.length === 0) {
    //   errors.governmentSchemes = "At least one government scheme must be selected";
    // }


    // Branch Code
    // if (!formData.branchCode.trim()) errors.branchCode = 'Branch code is required';

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

    console.log("form data: ", formData)
    // @ts-ignore 
    const response = await dispatch(createHospital(formData));
    if (response.payload?.status === 200) {
      
      setFormData({
        name: '',
        adminEmail:'',
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

        departments: [

        ] as string[],

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
    }
  };

  return (
    <>

      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Add Pharmacy</h1>
        <form onSubmit={handleSubmit} >

          <div className='flex flex-col md:flex-row gap-2'>
            <div className='bg-white rounded-md shadow p-5 md:p-11 w-full md:w-1/2 '>

              {/* section 1  */}

              {/* Clinic Name */}
              <div className="">
                <Label required={true} >Pharmacy Name</Label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                />
                {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
              </div>
              <div className="">
                <Label required={true}>Admin Email</Label>
                <input
                  type="text"
                  value={formData.adminEmail}
                  onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                  className="h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                />
                <div className='flex justify-between items-center'>
                {formErrors.adminEmail && <p className="text-red-500 text-sm">{formErrors.adminEmail}</p>}
                <p className="text-orange-500 text-sm">This email is for admin login</p>

                </div>
              </div>

              {/* Specialties */}
              {/* <div className="">
                <Label>Departments</Label>
                <Select
                  isMulti
                  options={[[].map(item => ({ label: item.name, value: item._id }))]}
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
                <Label required={true}>Year Established</Label>
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
                <Label required={true}>Registration Number</Label>
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
                <Label required={true}>Owner Name</Label>
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
                <Label required={true}>Operational Details</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {/* Open Days */}
                  <Select
                    isMulti
                    options={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => ({ label: day, value: day }))}
                    onChange={(selected) => {
                      const values = selected.map((opt) => opt.value);
                      setFormData({ ...formData, operationalDetails: { ...formData.operationalDetails, openDays: values } });
                    }}
                    placeholder="Select Open Days"
                  />
                  {formErrors.openDays && <p className="text-red-500 text-sm col-span-2">{formErrors.openDays}</p>}

                  {/* Open Time */}
                  <div>
                  <Label required={true}>Opening Time</Label>
                  <input
                    type="time"
                    value={formData.operationalDetails.openTime}
                    onChange={(e) => setFormData({ ...formData, operationalDetails: { ...formData.operationalDetails, openTime: e.target.value } })}
                    className="h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                  />
                  {formErrors.openTime && <p className="text-red-500 text-sm">{formErrors.openTime}</p>}
                  </div>

                  {/* Close Time */}
                  <div>
                  <Label required={true}>Closing Time</Label>
                  <input
                    type="time"
                    value={formData.operationalDetails.closeTime}
                    onChange={(e) => setFormData({ ...formData, operationalDetails: { ...formData.operationalDetails, closeTime: e.target.value } })}
                    className="h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                  />
                  {formErrors.closeTime && <p className="text-red-500 text-sm">{formErrors.closeTime}</p>}
                  </div>

                  {/* Emergency Available */}
                  <div className='my-4 flex gap-2 items-center'>
                    <Label>Emergency Available</Label>
                    <input
                      type="checkbox"
                      checked={formData.operationalDetails.emergencyAvailable}
                      onChange={(e) => setFormData({ ...formData, operationalDetails: { ...formData.operationalDetails, emergencyAvailable: e.target.checked } })}
                      className="h-4 w-4"
                    />
                  </div>

                  {/* 24x7 */}
                  <div className='my-4 flex gap-2 items-center'>
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
                      {formErrors[`equipmentName_${index}`] && (
                        <p className="text-red-500 text-sm">{formErrors[`equipmentName_${index}`]}</p>
                      )}
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => {
                          const updatedEquipment = [...formData.medicalEquipment];
                          updatedEquipment[index].quantity = parseInt(e.target.value);
                          setFormData({ ...formData, medicalEquipment: updatedEquipment });
                        }}
                        className="h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                      />
                      {formErrors[`equipmentQuantity_${index}`] && (
                        <p className="text-red-500 text-sm">{formErrors[`equipmentQuantity_${index}`]}</p>
                      )}
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
                    onClick={() =>
                      setFormData({
                        ...formData,
                        medicalEquipment: [...formData.medicalEquipment, { name: '', quantity: 0, brand: '' }],
                      })
                    }
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
                <Label required={true}>Street</Label>
                  <input
                    placeholder="Street"
                    className="input h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                    value={formData.address.street}
                    onChange={(e) =>
                      setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })
                    }
                  />
                  {formErrors.addressStreet && <p className="text-red-500 text-sm">{formErrors.addressStreet}</p>}
                </div>

                <div>
                <Label required={true}>City</Label>
                  <input
                    placeholder="City"
                    className="input h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                    value={formData.address.city}
                    onChange={(e) =>
                      setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })
                    }
                  />
                  {formErrors.addressCity && <p className="text-red-500 text-sm">{formErrors.addressCity}</p>}
                </div>

                <div>
                <Label required={true}>State</Label>
                  <input
                    placeholder="State"
                    className="input h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                    value={formData.address.state}
                    onChange={(e) =>
                      setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })
                    }
                  />
                  {formErrors.addressState && <p className="text-red-500 text-sm">{formErrors.addressState}</p>}
                </div>

                <div>
                <Label required={true}>Zip Code</Label>
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
                </div>

                <div>
                <Label required={true}>Country</Label>
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
                </div>

                <div>
                <Label >Landmark</Label>
                  <input
                    placeholder="Landmark"
                    className="input h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                    value={formData.address.landmark}
                    onChange={(e) =>
                      setFormData({ ...formData, address: { ...formData.address, landmark: e.target.value } })
                    }
                  />
                  {/* optional: landmark error agar chahiye to yahan add kar sakte ho */}
                </div>
              </div>


              {/* Contact Group */}
              <div className="col-span-3 mt-8 bg-transparent rounded-md">
                <h2 className="text-xl font-semibold mb-2">Contact Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                  <div>
                    <Label required={true}>Phone</Label>
                    <input
                      placeholder="Phone"
                      className="input h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                      value={formData.contact.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })
                      }
                    />
                    {formErrors.contactPhone && <p className="text-red-500 text-sm">{formErrors.contactPhone}</p>}
                  </div>

                  <div>
                  <Label >WhatsApp</Label>
                    <input
                      placeholder="WhatsApp"
                      className="input h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                      value={formData.contact.whatsapp}
                      onChange={(e) =>
                        setFormData({ ...formData, contact: { ...formData.contact, whatsapp: e.target.value } })
                      }
                    />
                    {/* WhatsApp optional hai to error yahan nahi lagaya */}
                  </div>

                  <div>
                  <Label required={true}>Contact Email</Label>
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

                  <div>
                    <input
                      placeholder="Website"
                      className="input h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                      value={formData.contact.website}
                      onChange={(e) =>
                        setFormData({ ...formData, contact: { ...formData.contact, website: e.target.value } })
                      }
                    />
                    {/* Website bhi optional hai, toh error check nahi diya */}
                  </div>
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          financials: {
                            ...formData.financials,
                            annualRevenue: parseFloat(e.target.value),
                          },
                        })
                      }
                      className="h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                    />
                    {formErrors.annualRevenue && (
                      <p className="text-red-500 text-sm">{formErrors.annualRevenue}</p>
                    )}
                  </div>

                  {/* Hospital Funding */}
                  <div>
                    <Label>Pharmacy Funding</Label>
                    <input
                      type="text"
                      value={formData.financials.hospitalFunding}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          financials: {
                            ...formData.financials,
                            hospitalFunding: e.target.value,
                          },
                        })
                      }
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
                      options={["Cash", "Card", "Insurance", "Others"].map((mode) => ({
                        label: mode,
                        value: mode,
                      }))}
                      onChange={(selected) => {
                        const values = selected.map((opt) => opt.value);
                        setFormData({
                          ...formData,
                          financials: {
                            ...formData.financials,
                            billPaymentModes: values,
                          },
                        });
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
                  options={["Ayushman Bharat", "PMJAY", "E-Shram"].map((scheme) => ({
                    label: scheme,
                    value: scheme,
                  }))}
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
                    options={doctors.map(item => ({
                      label: item.personalInfo.username,
                      value: item._id,
                    }))}
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






            {/* Insurance Details */}
            <div className="col-span-3 mt-8 bg-white rounded-md shadow p-5 md:p-11">
              <h2 className="text-xl font-semibold mb-2">Insurance Details</h2>
              <div className="flex flex-col gap-4">
                {formData.insuranceDetails.map((insurance, index) => (
                  <div key={index} className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Provider"
                      value={insurance.provider}
                      onChange={(e) => {
                        const updatedInsurance = [...formData.insuranceDetails];
                        updatedInsurance[index].provider = e.target.value;
                        setFormData({ ...formData, insuranceDetails: updatedInsurance });
                      }}
                      className="h-9 w-full rounded-md border border-gray-300 px-4 py-2.5"
                    />
                    <Select
                      isMulti
                      options={["Plan A", "Plan B", "Plan C"].map((plan) => ({ label: plan, value: plan }))}
                      onChange={(selected) => {
                        const updatedInsurance = [...formData.insuranceDetails];
                        updatedInsurance[index].plansOffered = selected.map((opt) => opt.value);
                        setFormData({ ...formData, insuranceDetails: updatedInsurance });
                      }}
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
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <button type="submit" className="bg-blue-500 text-white rounded-md px-6 py-3">
              Submit
            </button>
          </div>
        </form>
      </div>



    </>
  );
};

export default HospitalForm;
