import React, { useState } from 'react';
import { FaUserCircle, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { deleteUser } from '../../redux/Store';
import { useDispatch } from 'react-redux';

// UserTable: Displays users in a table with edit/delete options
const UserTable = ({ users, openModal, refreshUsers, token }) => {
const dispatch = useDispatch();
const [currentPage,setCurrentPage] = useState(1)
const itemsInPage = 5

// console.log('Token received in UserTable.......:', token); 

const userList = Array.isArray(users) ? users : [];
const getUser = userList.filter((user)=>user.role!=='admin')
const totalPage = Math.ceil(getUser.length/itemsInPage)
const start = (currentPage-1)*itemsInPage
const paginatedUsers = getUser.slice(start, start+itemsInPage)

const gotoPrevious = ()=>{
  if(currentPage>1)setCurrentPage(currentPage-1)
}

const next = ()=>{
  if(currentPage<totalPage) setCurrentPage(currentPage+1)
}


  // handleDelete: Deletes a user
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // console.log('Token passed to deleteUser.....:', token); 
        await deleteUser(id, dispatch,token);
        toast.success('User deleted successfully');
        refreshUsers();
      } catch (error) {
        // console.error('Handle delete error:', error.message);
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white shadow-md rounded-md">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-4">Image</th>
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            {/* <th className="p-4">Role</th> */}
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-4 text-center">No users found</td>
            </tr>
          ) : (
            paginatedUsers
            .filter((user)=>user.role !=='admin')
            .map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-4">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <FaUserCircle size={40} />
                  )}
                </td>
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                {/* <td className="p-4">{user.role}</td> */}
                <td className="p-4 flex space-x-2">
                  <button
                    onClick={() => openModal(user)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={20} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {totalPage > 1 && (
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={gotoPrevious}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 self-center">
            Page {currentPage} of {totalPage}
          </span>
          <button
            onClick={next}
            disabled={currentPage === totalPage}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserTable;