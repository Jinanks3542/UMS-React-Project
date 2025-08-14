import React, { useState,useEffect } from 'react'
import { FaUser } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { useForm } from 'react-hook-form';
import {  loginUser } from '../../../redux/Slices/AuthSlice.js';
import { store } from '../../../redux/Store';

const login = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {register, handleSubmit, formState:{errors}} = useForm()
  const [isLoading, setIsLoading] = useState(false);
    
  // const { isAuth, user } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   console.log('isAuth:', isAuth, 'user:', user);
  //   if (isAuth && user) {  
  //     navigate('/profile');
  //   }
  // }, [isAuth, user, navigate]);

    const onSubmit = async (data) =>{
      setIsLoading(true)
      try {
        const response = await dispatch(loginUser({ email: data.email, password: data.password })).unwrap();
        console.log('Login response:', response);
        console.log('Redux state after login:', store.getState().auth);
        toast.success('Login Successfulll')
        console.log('Before navigate');
        navigate('/profile')
        console.log('After navigate');
      } catch (error) {
        toast.error(error.message || 'Login failed')
      }finally{
        setIsLoading(false)
      }
    } 

    

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="flex justify-center mb-4">
          <FaUser size={40} />
        </div>
        <h2 className="text-2xl mb-4 text-center"> User Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              className="w-full p-2 border rounded"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account? <a href="/signup" className="text-blue-500">Signup</a>
        </p>
      </div>
    </div>
  );
}

export default login