import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = 'http://localhost:4000/api/users'


export const login = createAsyncThunk('auth/login', async({email,password},{rejectWithValue})=>{
    
   try {
    const response = await axios.post(`${API_URL}/login`,{email,password})
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user',JSON.stringify(response.data) )
    return response.data
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

const authSlice = createSlice({
    name:'auth',
    initialState:{
        user:JSON.parse(localStorage.getItem('user'))|| null,
        token:localStorage.getItem('token') ||null,
        isAuth:false,
        isLoading:false,
        error:null,
    },
    reducers:{
        logout:(state)=>{
            state.user = null;
            state.token = null;
            localStorage.removeItem('user')
            localStorage.removeItem('token')
        },
    },
    extraReducers: (builder)=>{
        builder
         .addCase(login.pending, (state) =>{
            state.loading = true;
            state.error = null;
         })
         .addCase(login.fulfilled, (state,action)=>{
            state.loading = false;
            state.user = action.payload;
            state.token = action.payload.token
         })
         .addCase(login.rejected, (state,action)=>{
            state.loading = false
            state.error = action.payload.message
         })
    },
})


export const {logout} = authSlice.actions
export default authSlice.reducer