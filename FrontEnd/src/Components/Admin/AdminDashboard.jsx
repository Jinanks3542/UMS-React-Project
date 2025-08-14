import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {logout} from '../../redux/Slices/AuthSlice.js';
import {  getUsers, searchUsers } from '../../redux/Store';
import { toast } from 'react-toastify';
import UserTable from './UserTable';
import UserModal from './UserModal';

// AdminDashboard: Displays user management interface for admins
const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuth } = useSelector((state) => state.auth);
  const users = useSelector((state) => state.users);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const tableRef = useRef(null);

  // fetchUsers: Fetches all users on component mount
  useEffect(() => {
    // console.log('Redux auth state:', { user, token, isAuth })
    if (!isAuth || !user || !token) {
      // console.log('Redirecting to admin login due to missing auth data');
      toast.error('Please log in as admin');
      navigate('/admin/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        // console.log('Fetching users with token:', token); 
        await getUsers(dispatch, token);
      } catch (error) {
        // console.error('Fetch users error:', error);
        toast.error(error.message || 'Failed to fetch users');
        if (error.message?.includes('Unauthorized') || error.message?.includes('token failed')) {
          dispatch(logout());
          navigate('/admin/login');
        }
      }
    };

    fetchUsers();
  }, [dispatch, token, isAuth, user, navigate]);

  // handleSearch: Searches users by name or email
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      await searchUsers(searchQuery, dispatch, token);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // handleLogout: Logs out the admin
  const handleLogout = async () => {
    await dispatch(logout());
    if(user?.role==='admin'){
        navigate('/admin/login')
        toast.success('Logged out successfully');
    }else{
      navigate('/login')
    }
    
  };

  // openModal: Opens modal for creating/editing a user
  const openModal = (user = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // closeModal: Closes the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // refreshUsers: Refreshes the user list
  const refreshUsers = async () => {
    try {
      await getUsers(dispatch,token);
    } catch (error) {
      toast.error(error.message || 'Failed to refresh users');
    }
  };

  // const scrollToTable = () => {
  //   tableRef.current?.scrollIntoView({ behavior: 'smooth' });
  // };


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-6">

          <h1 className="text-3xl font-bold">User List</h1>
          <div className="flex space-x-4">
            {/* <p className="text-lg">Welcome, {user?.name}</p> */}
            {/* {user?.role === 'admin' &&(
            <button
              onClick={scrollToTable}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              View Users
            </button>
            )} */}
            <button
              onClick={() => openModal()}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Create User
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full p-2 border rounded-l-md"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </form>
        <div ref={tableRef}>
          <UserTable 
          users={users} 
          openModal={openModal} 
          refreshUsers={refreshUsers} 
          token={token} />
        </div>
        
        {isModalOpen && (
          <UserModal
            isOpen={isModalOpen}
            closeModal={closeModal}
            user={selectedUser}
            refreshUsers={refreshUsers}
            token={token}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;