// UserUpdate.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../features/store';
import { getUserById, updateUser } from '../../features/user/userApiThunk';
import Label from '../../components/form/Label';
import Select from 'react-select';
const roles = [
  'pharmacy_manager',
  'pharmacist',
  'cashier',
  'pharmacy_staff',
  'customer',
];

const UserUpdate = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedUser } = useSelector((state: RootState) => state.users);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    role: '',
  });

  useEffect(() => {
    if (id) dispatch(getUserById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedUser) setFormData(selectedUser);
  }, [selectedUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) dispatch(updateUser({ id, data: formData }));
    navigate(-1);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl mt-10 shadow">
      <h2 className="text-2xl font-bold mb-4">Update User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label required={true}>Email</Label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>
        <div>
          <Label required={true}>Username</Label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>
        <div>
          <Label required={true}>Role</Label>
        <Select name="role" value={ roles.filter(item=>item===formData.role).map(item=>({label:item,value:item}))}  options={[...roles.map(role => (
          { value: role, label: role.charAt(0).toUpperCase() + role.slice(1) }
          ))]} onChange={(selected)=>setFormData({ ...formData, role: selected?.value || 'customer' })} className="w-full border px-3 py-2 rounded"/>
          
        
        </div>
         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update
        </button>
      </form>
    </div>
  );
};

export default UserUpdate;