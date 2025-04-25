import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, TrashBinIcon } from '../../icons';
import { createOfferPlan } from '../../features/offerPlan/offerPlanApiThunk';
import { AppDispatch, RootState } from '../../features/store';
import Select from 'react-select';
import { FeatureI, SchemeI } from '../../helpers/offerPlanInterface';
import { toast } from 'react-toastify';
import LoadingOverlay from '../../components/loader/LoadingOverlay';
import Label from '../../components/form/Label';

const colorOptions = [
  { value: 'bg-red-400', label: 'Red' },
  { value: 'bg-blue-400', label: 'Blue' },
  { value: 'bg-green-400', label: 'Green' },
  { value: 'bg-purple-400', label: 'Purple' },
  { value: 'bg-yellow-400', label: 'Yellow' },
];
const schemeOptions = [
  { value: { price: 299, validityInDays: 30, }, label: '299 rs/month' },
  { value: { price: 1500, validityInDays: 180, }, label: '1500 rs/6 month' },
  { value: { price: 3200, validityInDays: 365, }, label: '3200 rs/12 month' },

];

const CreateOfferPlan: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, message, success } = useSelector((state: RootState) => state.offerPlan)

  const [formData, setFormData] = useState({
    name: '',
    scheme: [{ price: 0, discount: 0, validityInDays: 0 }] as SchemeI[],
    description: '',
    color: '',
    features: [{ label: '', description: '', isEnabled: true, key: '' }] as FeatureI[],
    initialSetUpPrice: 0,
    extraAddOn: [{ title: '', price: 0 }],
    limits: {
      userLimit: 1,
      departmentLimit: 1,
      medicineLimit: 50,
      saleLimitPerDay: 100,
    },
    isVisible: true,
  });

  const handleAddExtraAddOn = () => {
    setFormData({
      ...formData,
      extraAddOn: [...formData.extraAddOn, { title: '', price: 0 }],
    });
  };

  const handleExtraAddOnChange = (index: number, field: string, value: string | number) => {
    const updatedAddOn = formData.extraAddOn.map((item, i) =>
      i === index ? { ...item, [field]: field === 'price' ? Number(value) : value } : item
    );
    setFormData({ ...formData, extraAddOn: updatedAddOn });
  };

  const handleLimitsChange = (field: string, value: number) => {
    setFormData({
      ...formData,
      limits: {
        ...formData.limits,
        [field]: value,
      },
    });
  };
 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createOfferPlan(formData));
  };

  const handleAddFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { key: '', label: '', isEnabled: false, description: '' }],
    }));
  };
  const handleFeatureChange = (
    index: number,
    field: 'label' | 'description' | 'isEnabled',
    value: string | boolean
  ) => {
    const updated = [...formData.features];
    updated[index] = {
      ...updated[index],
      [field]: value,
      ...(field === 'label' && typeof value === 'string'
        ? { key: value.toLowerCase().replace(/\s+/g, '_') }
        : {}),
    };
    setFormData({ ...formData, features: updated });
  };

  const handleAddScheme = () => {
    setFormData((prev) => ({
      ...prev,
      scheme: [...prev.scheme, { price: 0, discount: 0, validityInDays: 0 }],
    }));
  };
  const handleSchemeChange = (
    index: number,
    field: 'price' | 'discount' | 'validityInDays',
    value: number
  ) => {
    const updated = [...formData.scheme];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setFormData({ ...formData, scheme: updated });
  };

  const handleRemove = (field: string, index: number) => {
    const updated = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updated });
  };

  useEffect(() => {

    if (error) {
      toast.error(message);
      // Optionally, clear the error state here if needed
    }

    if (success && message) {
      toast.success(message);
      // Optionally, reset success state here if needed
    }
  }, [error, success, message]);

  if (loading) return <LoadingOverlay />
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Create Offer Plan</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label required={true}>Name</Label>
            <input type="text" className="h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

          </div>
          <div>
          <Label required={false}>Select Color</Label>
          <Select
            options={colorOptions}
            onChange={(selected) => setFormData({ ...formData, color: selected?.value! })}
            placeholder="Select Color"
            className="text-sm"
          />

          </div>
          <div>
            <Label>Initial Setup Price</Label>
          <input type="number" placeholder="" className="h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white" onChange={(e) => setFormData({ ...formData, initialSetUpPrice: Number(e.target.value) })} />
          </div>
        </div>

        <div>
          <Label>Description</Label>
        <textarea placeholder="" className="h-[220px] rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white w-full" rows={3} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-start gap-1.5 mb-2">
            <label className="font-medium text-lg">Scheme</label>
            <button type="button" onClick={handleAddScheme} className="text-pink-600 hover:text-pink-800">
              <PlusIcon width={20} />
            </button>
          </div>
          {formData.scheme.map((item, index) => (
            <div key={index} className="flex items-center gap-4 mb-2">
              <div className='w-full'>
                <Label>Plan per month</Label>
              <Select
                options={schemeOptions}
                onChange={(selected) => {
                  if (!selected) return;

                  const updatedScheme = [...formData.scheme];
                  updatedScheme[index] = {
                    ...updatedScheme[index],
                    price: selected.value.price,
                    validityInDays: selected.value.validityInDays,
                  };

                  setFormData({
                    ...formData,
                    scheme: updatedScheme,
                  });

                  // Optional if you still want to use handleSchemeChange
                  // handleSchemeChange(index, "price", Number(selected.value.price));
                  // handleSchemeChange(index, "validityInDays", Number(selected.value.validityInDays));
                }}
                placeholder="Select Scheme"
                className="text-sm w-full"
              />
                
              </div>
                <div>
                  <Label>Discount</Label>
              <input
                type="number"
                placeholder="Discount"
                className="h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                value={item.discount}
                onChange={(e) => handleSchemeChange(index, 'discount', Number(e.target.value))}
              />
                </div>

              <TrashBinIcon width={30} className='text-red-400' onClick={() => handleRemove('scheme', index)} />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-start gap-1.5 mb-2">
            <label className="font-medium text-lg">Extra Add Ons</label>
            <button type="button" onClick={handleAddExtraAddOn} className="text-pink-600 hover:text-pink-800">
              <PlusIcon width={20} />
            </button>
          </div>
          {formData.extraAddOn.map((item, index) => (
            <div key={index} className="flex items-center gap-4 mb-2">
              <div className='w-full'>
                <Label>Title</Label>
                <input
                type="text"
                placeholder="Title"
                className="h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                value={item.title}
                onChange={(e) => handleExtraAddOnChange(index, 'title', e.target.value)}
              />
              </div>
              <div className='w-full'>
                <Label>Cost</Label>
              <input
                type="number"
                placeholder="Price"
                className="h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                value={item.price}
                onChange={(e) => handleExtraAddOnChange(index, 'price', e.target.value)}
              />
              </div>
              <TrashBinIcon width={30} className='text-red-400' onClick={() => handleRemove('extraAddOn', index)} />
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-start gap-1.5 mb-2">
            <label className="font-medium text-lg">Features</label>
            <button
              type="button"
              onClick={handleAddFeature}
              className="text-pink-600 hover:text-pink-800"
            >
              <PlusIcon width={20} />
            </button>
          </div>

          {formData.features.map((feature, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-2 items-center">
              <input
                type="text"
                placeholder="Label"
                value={feature.label}
                onChange={(e) => handleFeatureChange(index, 'label', e.target.value)}
                className='h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white'
              />
              <input
                type="text"
                placeholder="Description"
                value={feature.description || ''}
                onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                className='h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white'
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={feature.isEnabled}
                  onChange={(e) => handleFeatureChange(index, 'isEnabled', e.target.checked)}
                />
                <label>Enabled</label>
              </div>
              <TrashBinIcon width={30} className='text-red-400' onClick={() => handleRemove('features', index)} />
            </div>
          ))}
        </div>


        <div className="mt-4">
          <label className="font-medium text-lg mb-2 block">Limits</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="number" placeholder="User Limit" className="h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white" onChange={(e) => handleLimitsChange('userLimit', Number(e.target.value))} />
            <input type="number" placeholder="Department Limit" className="h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white" onChange={(e) => handleLimitsChange('departmentLimit', Number(e.target.value))} />
            <input type="number" placeholder="Medicine Limit" className="h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white" onChange={(e) => handleLimitsChange('medicineLimit', Number(e.target.value))} />
            <input type="number" placeholder="Sales/Day Limit" className="h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white" onChange={(e) => handleLimitsChange('saleLimitPerDay', Number(e.target.value))} />
          </div>
        </div>

        <div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow">
            Create Plan
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOfferPlan;
