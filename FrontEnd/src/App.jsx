import React from "react";
import { useSelector } from "react-redux";
import Signup from "./Components/User/Signup/signup";
import Login from "./Components/User/Login/login";
import Profile from "./Components/User/Profile/profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes, Navigate } from "react-router-dom";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import AdminLogin from "./Components/Admin/AdminLogin/Login";

const PrivateRoute = ({ children, adminOnly }) => {
  const { isAuth, user } = useSelector((state) => state.auth);
  if (!isAuth|| !user) {
    return <Navigate to="/login" />;
  }
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/profile" />;
  }
  return children;
};

const App = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/admin/login" element={<AdminLogin adminOnly={true} />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute adminOnly>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer />
    </>
  );

  
};

export default App;
