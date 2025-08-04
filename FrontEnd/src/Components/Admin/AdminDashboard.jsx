import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, getUsers, searchUsers } from '../../redux/Store';
import { toast } from 'react-toastify';
import UserTable from './UserTable';
import UserModal from './UserModal';

// AdminDashboard: Displays user management interface for admins
const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const users = useSelector((state) => state.users);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const tableRef = useRef(null);

  // fetchUsers: Fetches all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await getUsers(dispatch);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchUsers();
  }, [dispatch]);

  // handleSearch: Searches users by name or email
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      await searchUsers(searchQuery, dispatch);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // handleLogout: Logs out the admin
  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/admin-login');
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
      await getUsers(dispatch);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const scrollToTable = () => {
    tableRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-6">

          <h1 className="text-3xl font-bold">User Management</h1>
          <div className="flex space-x-4">
            <p className="text-lg">Welcome, {user?.name}</p>
            {user?.role === 'admin' &&(
            <button
              onClick={scrollToTable}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              View Users
            </button>
            )}
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
          <UserTable users={users} openModal={openModal} refreshUsers={refreshUsers} />
        </div>
        {isModalOpen && (
          <UserModal
            isOpen={isModalOpen}
            closeModal={closeModal}
            user={selectedUser}
            refreshUsers={refreshUsers}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;