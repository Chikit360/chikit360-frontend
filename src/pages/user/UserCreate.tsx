// UserCreate.tsx (aka User.tsx)
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../features/store';
import { createUser } from '../../features/user/userApiThunk';
import Select from 'react-select';

const UserCreate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createUser(formData));
    navigate(-1);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl mt-10 shadow">
      <h2 className="text-2xl font-bold mb-4">Create User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full border px-3 py-2 rounded" required />

        <Select name="role" options={[...roles.map(role => (
          { value: role, label: role.charAt(0).toUpperCase() + role.slice(1) }
          ))]} onChange={(selected)=>setFormData({ ...formData, role: selected?.value || 'customer' })} className="w-full border px-3 py-2 rounded"/>
          
        
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserCreate;