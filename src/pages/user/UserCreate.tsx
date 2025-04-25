// UserCreate.tsx (aka User.tsx)
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../features/store';
import { createUser } from '../../features/user/userApiThunk';
import Select from 'react-select';
import Label from '../../components/form/Label';
import LoadingOverlay from '../../components/loader/LoadingOverlay';
import { toast } from 'react-toastify';

const UserCreate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {loading,error}=useSelector((state:RootState)=>state.users)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'pharmacist',
  });

  const roles = [
    'pharmacy_manager',
    'pharmacist',
    'cashier',
    'pharmacy_staff',
    'customer',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
   const response=await dispatch(createUser(formData));
   if(response){
     navigate(-1);

   }
  };

  useEffect(() => {
    if(error){
      toast.error(error?.toString())
    }
  }, [error])
  

  if(loading) return <LoadingOverlay/>
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl mt-10 shadow">
      <h2 className="text-2xl font-bold mb-4">Create User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
        <Label required={true} >Email</Label>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>
        <div>
        <Label required={true} >Password</Label>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>

        <div>
        <Label required={true} >Role</Label>
        <Select name="role" options={[...roles.map(role => (
          { value: role, label: role.charAt(0).toUpperCase() + role.slice(1) }
          ))]} onChange={(selected)=>setFormData({ ...formData, role: selected?.value || 'customer' })} className="w-full px-3 py-2 rounded"/>
        </div>
          
        
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserCreate;