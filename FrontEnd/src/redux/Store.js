import { configureStore, createSlice } from "@reduxjs/toolkit";
import authReducer from "./Slices/AuthSlice";
import axios from "axios";
// import { Password } from "react-icons/cg";
const API_URL = "http://localhost:4000/api/users";

const INITIAL_STATE = {
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuth: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: INITIAL_STATE,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuth = true;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("isAuth", true);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuth = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isAuth");
    },
  },
});

const userSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    addData: (state, action) => {
      return action.payload;
    },
  },
});

const handleModal = createSlice({
  name: "modal",
  initialState: { index: null, status: false },
  reducers: {
    modalControl: (state, action) => {
      state.index = action.payload.index;
      state.status = action.payload.status;
    },
  },
});




export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    users: userSlice.reducer,
    modal: handleModal.reducer,
  },
});

export const { login, logout } = authSlice.actions;
export const { addData } = userSlice.actions;
export const { modalControl } = handleModal.actions;
export default store;

export const loginUser = async (email, password, dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { token, _id, name, email: userEmail, image, role } = response.data;
    dispatch(
      login({ token, user: { _id, name, email: userEmail, image, role } })
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed...");
  }
};

export const signupUser = async (formData, dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const { token, _id, name, email: userEmail, image, role,number } = response.data;
    dispatch(
      login({ token, user: { _id, name, email: userEmail, image, role,number } })
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Signup failed");
  }
};

export const updateUser = async (userData, dispatch) => {
  try {
    const response = await axios.put(`${API_URL}/profile`, userData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const { _id, name, email: userEmail, image, role,number } = response.data;
    dispatch(
      login({
        token: localStorage.getItem("token"),
        user: { _id, name, email: userEmail, image, role },
      })
    );
    return response.data;
  } catch (error) {
    console.error("updateUser error:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "Update failed");
  }
};


// for getting all authorised users from backend
export const getUsers = async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    dispatch(addData(response.data));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const searchUsers = async (query, dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/search?query=${query}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    dispatch(addData(response.data));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Search failed");
  }
};

export const createUser = async (formData, dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    dispatch(getUsers);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Create user failed");
  }
};

export const updateAdminUser = async (id, formData, dispatch) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    dispatch(getUsers);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Update user failed");
  }
};

export const deleteUser = async (id, dispatch) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    dispatch(getUsers);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Delete user failed");
  }
};
