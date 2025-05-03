import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { faker } from '@faker-js/faker';
import { createMedicine } from '../../features/medicine/medicineApi';
import { useNavigate } from 'react-router';
import Select from 'react-select';
import ConfirmationPopup from '../../components/ui/pop-up/ConfirmationPopUp';
import Label from '../../components/form/Label';
import { DropdownOption } from '../../helpers/interfaces';
import { toast } from 'react-toastify';
import { clearMedicineMessage } from '../../features/medicine/medicine.slice';
import LoadingOverlay from '../../components/loader/LoadingOverlay';
import useRealTimeScannerData from '../../hooks/useRealTimeScannerData';

const UNIT_ENUM = ['pieces', 'boxes', 'bottles', 'packs', 'strips'];

const initialFormData = {
  name: '',
  genericName: '',
  form: '',
  strength: '',
  unit: '',
  prescriptionRequired: false,
};

const CreateMedicineForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { recentCreatedMedicineId } = useSelector((state: RootState) => state.medicine);
  const { user } = useSelector((state: RootState) => state.auth);
  const { dropdowns, loading: DDLoading } = useSelector((state: RootState) => state.dropDown);
  const { error, message, success, loading ,medicines} = useSelector((state: RootState) => state.medicine);

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [openConfirmationBox, setOpenConfirmationBox] = useState(false);
  const [barcode, setBarcode] = useState('');

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = 'Medicine name is required';
    if (formData.unit && !UNIT_ENUM.includes(formData.unit)) {
      errors.unit = 'Invalid unit selected';
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    console.log(barcode)
    if(!barcode) return toast.error("Barcode is required") ;

    const response = await dispatch(createMedicine({ ...formData, barcode }));
    if (response.payload?.status === 200) {
      setOpenConfirmationBox(true);
      setFormData(initialFormData);
    }
  };

  const generateFakeData = () => {
    setFormData({
      name: faker.commerce.productName(),
      genericName: faker.lorem.word(),
      form: dropdowns.form.length ? faker.helpers.arrayElement(dropdowns.form).label : '',
      strength: dropdowns.strength.length ? faker.helpers.arrayElement(dropdowns.strength).label : '',
      unit: faker.helpers.arrayElement(UNIT_ENUM),
      prescriptionRequired: faker.datatype.boolean(),
    });
  };

  useEffect(() => {
    if (error) toast.error(message);
    if (success && message) toast.success(message);
    return () => {
      dispatch(clearMedicineMessage());
    };
  }, [error, success, message]);

  const barcodeData = useRealTimeScannerData(user?._id!);
  useEffect(() => {
    if (barcodeData) {
      setBarcode(barcodeData);
      const selectedMedicine=medicines.find(medicine=>medicine.barcode===barcodeData);
      if(selectedMedicine){

        setFormData(selectedMedicine)
      }
      console.table(medicines)
      console.log(selectedMedicine)
    };
  }, [barcodeData,medicines]);

  if (loading) return <LoadingOverlay />;

  return (
    <>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Add Medicine</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label required={true}>Barcode</Label>
              <input
                disabled
                type="text"
                value={barcode}
                className="h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>

            {Object.keys(initialFormData).map((key) => (
              <div key={key} className="mb-4">
                <Label>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  {key === 'name' && <span className="text-red-400">*</span>}
                </Label>

                {key === 'form' || key === 'strength' ? (
                  <Select
                    name={key}
                    options={dropdowns[key]?.map((item: DropdownOption) => ({
                      label: item.label,
                      value: item.label,
                    }))}
                    isLoading={DDLoading}
                    value={
                      dropdowns[key]?.find((item) => item.label === formData[key as keyof typeof formData])
                        ? {
                            label: formData[key as keyof typeof formData],
                            value: formData[key as keyof typeof formData],
                          }
                        : null
                    }
                    onChange={(selectedOption) =>
                      setFormData({ ...formData, [key]: selectedOption ? selectedOption.value : '' })
                    }
                    placeholder={`Select ${key}`}
                  />
                ) : key === 'unit' ? (
                  <Select
                    options={UNIT_ENUM.map((unit) => ({
                      label: unit.charAt(0).toUpperCase() + unit.slice(1),
                      value: unit,
                    }))}
                    value={
                      formData.unit
                        ? {
                            label: formData.unit.charAt(0).toUpperCase() + formData.unit.slice(1),
                            value: formData.unit,
                          }
                        : null
                    }
                    onChange={(selectedOption) =>
                      setFormData({ ...formData, unit: selectedOption ? selectedOption.value : '' })
                    }
                    placeholder="Select unit"
                  />
                ) : key === 'prescriptionRequired' ? (
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.prescriptionRequired}
                      onChange={(e) =>
                        setFormData({ ...formData, prescriptionRequired: e.target.checked })
                      }
                      className="hidden"
                    />
                    <span className="w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition duration-300">
                      <span
                        className={`${
                          formData.prescriptionRequired ? 'translate-x-6' : 'translate-x-0'
                        } bg-white w-4 h-4 rounded-full shadow-md transform duration-300`}
                      />
                    </span>
                  </label>
                ) : (
                  <input
                    type="text"
                    value={formData[key as keyof typeof formData] as string}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.value })
                    }
                    className="h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                )}

                {formErrors[key] && <div className="text-red-500 text-sm">{formErrors[key]}</div>}
              </div>
            ))}
          </div>

          <div className="flex space-x-4 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              {loading ? 'Submitting...' : 'Create Medicine'}
            </button>
            <button
              type="button"
              onClick={generateFakeData}
              className="bg-gray-500 text-white py-2 px-4 rounded"
            >
              Generate Fake Data
            </button>
          </div>
        </form>
      </div>

      <ConfirmationPopup
        title="Alert"
        message="Do you want to add inventory right now?"
        onConfirm={() => navigate(`/medicine/inventory/${recentCreatedMedicineId}/add-update`)}
        onCancel={() => setOpenConfirmationBox(false)}
        isOpen={openConfirmationBox}
      />
    </>
  );
};

export default CreateMedicineForm;
