import axios from "axios";
import { setUsers } from "./userSlice";
import {logout} from '../../redux/Slices/AuthSlice.js';

const API_URL = "http://localhost:4000/api/users";

export const getUsers = async (dispatch, token) => {
  try {
    if (!token) {
      throw new Error('No token provided');
    }
    const response = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Get users response:', response.data);
    dispatch({ type: 'users/setUsers', payload: response.data });
    return response.data;
  } catch (error) {
    console.error('Get users error:', error);
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const searchUsers = async (query, dispatch, token) => {
  try {
    const response = await axios.get(`${API_URL}/search?query=${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setUsers(response.data));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Search failed");
  }
};

export const createUser = async (formData, dispatch, token) => {
  if (!token) {
    dispatch(logout());
    throw new Error('No authentication token provided');
  }
  console.log('Token for createUser:', token)
  try {
    const response = await axios.post(`${API_URL}/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('token are here also', token)
    await getUsers(dispatch, token);
    return response.data;

  } catch (error) {
    throw new Error(error.response?.data?.message || "Create user failed");
  }
  
};


export const updateAdminUser = async (id, formData, dispatch, token) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    await getUsers(dispatch, token);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Update user failed");
  }
};

export const deleteUser = async (id, dispatch, token) => {
  try {
    if (!token) {
      console.error('No token provided for delete');
      dispatch(logout());
      window.location.href = '/admin/login';
      throw new Error('No token available, please log in again');
    }
    console.log('Token sent for delete:', token);
    console.log('DELETE request URL:', `${API_URL}/${id}`);
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Delete response:', response.data);
    await getUsers(dispatch, token);
    return response.data;
  } catch (error) {
    console.error('Delete user error:', error.response?.data, error)
    if (error.response?.status === 401 || !token) {
      dispatch(logout());
      window.location.href = '/admin/login';
      throw new Error('Session expired or unauthorized, please log in again');
    }
    throw new Error(error.response?.data?.message || "Delete user failed");
  }
};