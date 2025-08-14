import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = 'http://localhost:4000/api/users'


export const loginUser = createAsyncThunk('auth/login', async({email,password},{rejectWithValue})=>{
    
   try {
    const response = await axios.post(`${API_URL}/login`,{email,password})
    console.log('Login API response:', response.data);
    const {token,...user} = response.data
    if (!token) {
      console.error('No token in login response');
      throw new Error('No token returned from server');
    }
    console.log('Returning to Redux:', { token, user });
    return {token,user}
   } catch (error) {
    return rejectWithValue(error.response?.data?.message||'Login Failed')
   }
})


export const signup = createAsyncThunk('auth/signup', async(formData,{rejectWithValue})=>{
    try {
        const response = await axios.post(`${API_URL}/signup`,formData,{
            headers:{'Content-Type': 'multipart/form-data'},
        })
        return response.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message||'Signup failed')
    }
})

export const updateUser = createAsyncThunk('auth/updateUser', async ({ userData, token }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/profile`, userData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Update failed");
  }
});

const authSlice = createSlice({
    name:'auth',
    initialState:{
        user:null,
        token:null,
        isAuth:false,
        isLoading:false,
        error:null,
    },
    reducers:{
        logout:(state)=>{
            state.user = null;
            state.token = null;
            state.isAuth=false
            state.error = null;
        },
    },
    extraReducers: (builder)=>{
        builder
         .addCase(loginUser.pending, (state) =>{
            state.isLoading = true;
            state.error = null;
         })
         .addCase(loginUser.fulfilled, (state,action)=>{
            state.isLoading = false;
            state.isAuth = true;
            state.token = action.payload.token
            state.user = action.payload.user;
            console.log('Login fulfilled - Token:', action.payload.token, 'User:', action.payload.user);
            
         })
         .addCase(loginUser.rejected, (state,action)=>{
            state.isLoading = false
            state.error = action.payload
         })
         .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuth = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload
        state.token = action.payload.token; 
        state.isAuth = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
    },
})


export const {logout} = authSlice.actions
export default authSlice.reducer