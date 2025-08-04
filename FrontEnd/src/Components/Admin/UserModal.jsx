import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { createUser, updateAdminUser } from '../../redux/Store';
import { FaUserCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

// UserModal: Modal for creating or editing users
const UserModal = ({ isOpen, closeModal, user, refreshUsers }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: user ? { name: user.name, email: user.email, role: user.role } : {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(user?.image || null);

  // handleImageChange: Updates image preview
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // onSubmit: Submits create/update form
  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('role', data.role);
    if (data.password) {
      formData.append('password', data.password);
    }
    if (data.image && data.image[0]) {
      formData.append('image', data.image[0]);
    }
    try {
      if (user) {
        await updateAdminUser(user._id, formData, dispatch);
        toast.success('User updated successfully');
      } else {
        await createUser(formData, dispatch);
        toast.success('User created successfully');
      }
      refreshUsers();
      closeModal();
      reset();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{user ? 'Edit User' : 'Create User'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
              })}
              className="w-full p-2 border rounded-md"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Invalid email format',
                },
              })}
              className="w-full p-2 border rounded-md"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          {!user && (
            <div>
              <label className="block mb-1">Password</label>
              <input
                type="password"
                {...register('password', {
                  required: user ? false : 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                className="w-full p-2 border rounded-md"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
          )}
          <div>
            <label className="block mb-1">Role</label>
            <select
              {...register('role', { required: 'Role is required' })}
              className="w-full p-2 border rounded-md"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
          </div>
          <div>
            <label className="block mb-1">Profile Image (optional)</label>
            <input
              type="file"
              {...register('image')}
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded-md"
            />
            {preview && (
              <img src={preview} alt="Preview" className="mt-2 w-20 h-20 rounded-full object-cover" />
            )}
            {!preview && !user?.image && <FaUserCircle size={80} className="mt-2 mx-auto" />}
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isLoading ? 'Saving...' : user ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;