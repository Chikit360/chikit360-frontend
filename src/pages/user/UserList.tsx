// UserList.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../features/store';
import { deleteUser, fetchUsers } from '../../features/user/userApiThunk';
import { PencilIcon, TrashBinIcon } from '../../icons';

const UserList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users } = useSelector((state: RootState) => state.users);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded-xl mt-8">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">User List</h2>
        <button
          onClick={() => navigate('/admin/users/items/add')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New User
        </button>
      </div>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{user.username}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2 capitalize">{user.role}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => navigate(`/admin/users/items/${user._id}/edit`)}
                  className="text-indigo-600 hover:underline"
                ><PencilIcon/> </button>
                <button
                  onClick={() => dispatch(deleteUser(user._id))}
                  className="text-red-500 hover:underline"
                ><TrashBinIcon/> </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;