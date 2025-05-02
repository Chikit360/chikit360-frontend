import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, TrashBinIcon } from '../../icons';
import {  updateOfferPlan } from '../../features/offerPlan/offerPlanApiThunk';
import { AppDispatch, RootState } from '../../features/store';
import Select from 'react-select';
import { useParams } from 'react-router';
import { OfferPlanI, SchemeI } from '../../helpers/offerPlanInterface';
import { toast } from 'react-toastify';
import LoadingOverlay from '../../components/loader/LoadingOverlay';


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

const UpdateOfferPlanDetail: React.FC = () => {
  const { loading, error, message, success } = useSelector((state: RootState) => state.offerPlan)
  const dispatch = useDispatch<AppDispatch>();
  const { offerId } = useParams();
  const plans = useSelector((state: RootState) => state.offerPlan.plans);
  const plan = plans.find((p) => p._id === offerId);

  const [formData, setFormData] = useState<OfferPlanI>({
    _id: '',
    name: 'basic',
    scheme: [] as SchemeI[],
    description: '',
    color: '',
    features: [{ label: '', description: '', isEnabled: true }],
    initialSetUpPrice: 0,
    extraAddOn: [{ title: '', price: 0 }],
    limits: {
      userLimit: 1,
      departmentLimit: 1,
      medicineLimit: 50,
      saleLimitPerDay: 100,
    },
    isVisible: true,
    createdAt: '',
    updatedAt: '',
  });

  useEffect(() => {
    if (plan) {
      setFormData(plan);
    }
  }, [plan, offerId]);

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
  const handleFeatureAdd = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { label: '', description: '', isEnabled: true }],
    });
  };

  const handleFeatureChange = (index: number, field: string, value: string | boolean) => {
    const updatedFeatures = formData.features.map((item, i) =>
      i === index
        ? { ...item, [field]: field === 'isEnabled' ? value : value }
        : item
    );
    setFormData({ ...formData, features: updatedFeatures });
  };

  type ArrayFields = 'features' | 'scheme' | 'extraAddOn'; // adjust based on actual OfferPlanI shape
  const handleRemove = (field: ArrayFields, index: number) => {
    const updated = formData[field].filter((_:any, i:any) => i !== index);
    setFormData({ ...formData, [field]: updated });
  };

  const handleLimitsChange = (field: keyof typeof formData.limits, value: number) => {
    setFormData({
      ...formData,
      limits: {
        ...formData.limits,
        [field]: value,
      },
    });
  };

  const handleColorChange = (selected: any) => {
    setFormData({ ...formData, color: selected?.value || '' });
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
    value: string | boolean
  ) => {
    const updated = [...formData.scheme];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setFormData({ ...formData, scheme: updated });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateOfferPlan({ id: offerId!, data: formData }));
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
        <h2 className="text-2xl font-semibold mb-4">Update Offer Plan</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" placeholder="Plan Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value as any })} className='h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white' />
          <Select
            options={colorOptions}
            value={colorOptions.find((opt) => opt.value === formData.color)}
            onChange={handleColorChange}
            placeholder="Select Color"
            className="text-sm"
          />
          <input type="number" placeholder="Initial Setup Price" value={formData.initialSetUpPrice} onChange={(e) => setFormData({ ...formData, initialSetUpPrice: Number(e.target.value) })} className='h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white' />
        </div>

        <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className='h-[120px] w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white'></textarea>

        <div className="mt-4">
          <div className="flex items-center justify-start gap-1.5 mb-2">
            <label className="font-medium text-lg">Scheme</label>
            <button type="button" onClick={handleAddScheme} className="text-pink-600 hover:text-pink-800">
              <PlusIcon width={20} />
            </button>
          </div>
          {formData.scheme.map((item, index) => (
            <div key={index} className="flex items-center gap-4 mb-2">
              <Select
                value={{
                  label: schemeOptions.find(option => option.value.price === item.price && option.value.validityInDays === item.validityInDays)?.label || "Select Scheme",
                  value: item,
                }}
                options={schemeOptions}
                onChange={(selected) => {
                  if (!selected) return;

                  const updatedScheme = [...formData.scheme];
                  updatedScheme[index] = {
                    ...updatedScheme[index],
                    price: selected.value.price,
                    validityInDays: selected.value.validityInDays,
                  };

                  setFormData(prev => ({
                    ...prev,
                    scheme: updatedScheme,
                  }));
                }}
                placeholder="Select Scheme"
                className="text-sm w-full"
              />

              <input
                type="number"
                placeholder="Discount"
                className="h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                value={item.discount}
                onChange={(e) => handleSchemeChange(index, "discount", e.target.value)}
              />

              <TrashBinIcon
                width={30}
                className="text-red-400 cursor-pointer hover:text-red-600"
                onClick={() => handleRemove("scheme", index)}
              />
            </div>
          ))}

        </div>
        <div className="mt-4">
          <div className="flex items-center justify-start gap-1.5 mb-2">
            <label className="font-medium text-lg">Feature</label>
            <button type="button" onClick={handleFeatureAdd} className="text-pink-600 hover:text-pink-800">
              <PlusIcon width={20} />
            </button>
          </div>

          {formData.features.map((item, index) => (
            <div key={index} className="flex items-center  gap-4 mb-2">
              <input type="text" placeholder="Label" value={item.label} onChange={(e) => handleFeatureChange(index, 'label', e.target.value)} className='h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white' />
              <input type="text" placeholder="Description" value={item.description} onChange={(e) => handleFeatureChange(index, 'description', e.target.value)} className='h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white' />
              <input type="checkbox" placeholder="Enabled" checked={item.isEnabled} onChange={(e) => handleFeatureChange(index, 'isEnabled', e.target.checked)} className='' />
              <TrashBinIcon width={30} className='text-red-400' onClick={() => handleRemove('features', index)} />
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
              <input type="text" placeholder="Title" value={item.title} onChange={(e) => handleExtraAddOnChange(index, 'title', e.target.value)} className='h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white' />
              <input type="number" placeholder="Price" value={item.price} onChange={(e) => handleExtraAddOnChange(index, 'price', e.target.value)} className='h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white' />
              <TrashBinIcon width={30} className='text-red-400' onClick={() => handleRemove('extraAddOn', index)} />
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className="font-medium text-lg mb-2 block">Limits</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="number" placeholder="User Limit" value={formData.limits.userLimit} onChange={(e) => handleLimitsChange('userLimit', Number(e.target.value))} className='h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white' />
            <input type="number" placeholder="Department Limit" value={formData.limits.departmentLimit} onChange={(e) => handleLimitsChange('departmentLimit', Number(e.target.value))} className='h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white' />
            <input type="number" placeholder="Medicine Limit" value={formData.limits.medicineLimit} onChange={(e) => handleLimitsChange('medicineLimit', Number(e.target.value))} className='h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white' />
            <input type="number" placeholder="Sales/Day Limit" value={formData.limits.saleLimitPerDay} onChange={(e) => handleLimitsChange('saleLimitPerDay', Number(e.target.value))} className='h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white' />
          </div>
        </div>

        <div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow">
            Update Plan
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateOfferPlanDetail;
