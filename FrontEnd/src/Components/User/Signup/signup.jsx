import axios from 'axios';
import React, { useState } from 'react'
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { signupUser } from '../../../redux/Store';
import { useDispatch } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';


const signup = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [preview,setPreview] = useState(null)
  

  const handleImageChange = (e)=>{
      if (e.target.files || e.target.files[0] ) {
        setPreview(URL.createObjectURL(e.target.files[0]));
  }
  }

  const onSubmit = async (data)=>{
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('email', data.email)
    formData.append('password', data.password)
    if(data.image[0]){
      formData.append('image', data.image[0])
    }
    try {
      await signupUser(formData, dispatch)
      toast.success('Registration Successfull')
      navigate('/login')
    } catch (error) {
      toast.error(error.message || 'Signup failed')
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="flex justify-center mb-4">
          <FaUser size={40} />
        </div>
        <h2 className="text-2xl mb-4 text-center">Signup</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
                pattern:{
                  value:/^[A-Za-z\s-]+$/,
                  message:'Valid name must be needed'
                },
                
                validate: {
                  notEmpty: (value)=>value.length>0,
                  noExtraSpaces: (value, formValues) =>
                    formValues.name.trim() ===formValues.name || 'Extra Space in front of the name is not valid'
                }

              })}
              className="w-full p-2 border rounded"
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
              className="w-full p-2 border rounded"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              className="w-full p-2 border rounded"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <div>
            <label>PhoneNumber</label>
            <input
            type='number'
          />
          </div>
          <div>
            <label className="block mb-1">Profile Image </label>
            <input
              type="file"
              {...register('image')}
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
            />
            {preview && (
              <img src={preview} alt="Preview" className="mt-2 w-20 h-20 rounded-full object-cover" />
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <a href="/login" className="text-blue-500">Login</a>
        </p>
      </div>
    </div>
  );
}

export default signup
