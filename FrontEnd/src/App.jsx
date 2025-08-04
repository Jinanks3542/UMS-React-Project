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
  const { user, token } = useSelector((state) => state.auth);
  if (!token || !user) {
    return <Navigate to="/login" />;
  }
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/profile" />;
  }
  return children;
};

const App = () => {
  // const isAuth = localStorage.getItem("isAuth");

  // console.log(isAuth, "kakak");
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
              {" "}
              <Profile />{" "}
            </PrivateRoute>
          }
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute adminOnly>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer />
    </>
  );

  // return (
  //   <Routes>
  //     {/* Public Routes */}
  //     {!isAuth && (
  //       <>
  //         <Route path="/" element={<Login />} />
  //         <Route path="/signup" element={<Signup />} />
  //         {/* Redirect logged-in users trying to access login/register */}
  //         <Route path="/profile" element={<Navigate to="/" />} />
  //         <Route path="/profile" element={<Navigate to="/signup" />} />
  //       </>
  //     )}

  //     {/* Private Routes */}
  //     {isAuth && (
  //       <>
  //         {/* <Route path="/profile" element={<Profile />} /> */}
  //         <Route path="/profile" element={<Profile />} />
  //         {/* Redirect unauthenticated routes */}
  //         <Route path="/" element={<Navigate to="/profile" />} />
  //         <Route path="/signup" element={<Navigate to="/profile" />} />
  //       </>
  //     )}

  //     {/* Catch-all: Optional */}
  //     <Route path="*" element={<Navigate to={isAuth ? "/profile" : "/"} />} />
  //   </Routes>
  // );
};

export default App;
